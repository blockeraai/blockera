<?php

namespace Blockera\Editor;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Site editor template preview (autosave + preview nonce, without publishing).
 *
 * Mirrors core post preview: autosave revisions + preview_id/preview_nonce on the
 * frontend URL, then swap template content from the autosave during render.
 *
 * @package Blockera
 */
class TemplatePreview {

	/**
	 * Query argument for isolated template part preview requests.
	 *
	 * Must match TEMPLATE_PART_PREVIEW_ARG in editor JS constants.
	 */
	public const TEMPLATE_PART_PREVIEW_ARG = 'blockera-template-part-preview';

	/**
	 * Template post types that support autosave preview.
	 */
	private const PREVIEWABLE_TEMPLATE_TYPES = array(
		'wp_template',
		'wp_template_part',
	);

	/**
	 * Template slugs that preview at the site home URL.
	 */
	private const HOME_SLUGS = array(
		'index',
		'home',
		'front-page',
	);

	/**
	 * Constructor - register hooks.
	 */
	public function __construct() {
		// Templates use a dedicated autosave controller; core rest_prepare_autosave
		// does not run for them, so preview_link is injected on the dispatch filter.
		add_filter( 'rest_post_dispatch', array( $this, 'add_template_autosave_preview_link' ), 10, 3 );
		add_filter( 'get_block_templates', array( $this, 'apply_template_autosave_preview' ), 10, 3 );
		// get_block_template() does not pass through get_block_templates; hook it directly.
		add_filter( 'get_block_template', array( $this, 'apply_autosave_preview_to_block_template' ), 10, 3 );
		add_action( 'template_redirect', array( $this, 'maybe_render_template_part_preview' ), 1 );
	}

	/**
	 * Add preview_link to template/template-part save REST responses.
	 *
	 * Handles autosave POSTs and template PUT/PATCH/POST updates. Theme-file templates
	 * without a DB customization use the update path for preview (autosave is rejected).
	 *
	 * @param \WP_REST_Response $response Response object.
	 * @param \WP_REST_Server   $server   REST server instance.
	 * @param \WP_REST_Request  $request  Request object.
	 * @return \WP_REST_Response
	 */
	public function add_template_autosave_preview_link( $response, $server, $request ) {
		if ( ! $response instanceof \WP_REST_Response ) {
			return $response;
		}

		$route = $request->get_route();
		if ( ! is_string( $route ) ) {
			return $response;
		}

		$is_autosave_route = str_contains( $route, '/autosaves' );
		$is_template_route = str_contains( $route, '/wp/v2/templates/' ) || str_contains( $route, '/wp/v2/template-parts/' );

		if ( ! $is_template_route ) {
			return $response;
		}

		$method = $request->get_method();

		if ( $is_autosave_route ) {
			if ( 'POST' !== $method ) {
				return $response;
			}
		} elseif ( ! in_array( $method, array( 'POST', 'PUT', 'PATCH' ), true ) ) {
			return $response;
		} elseif ( preg_match( '#^/wp/v2/(?:templates|template-parts)$#', $route ) ) {
			return $response;
		}

		$data = $response->get_data();
		if ( ! is_array( $data ) ) {
			return $response;
		}

		if ( $is_autosave_route ) {
			$parent_id = $this->resolve_autosave_parent_id_from_response( $data );
		} else {
			$parent_id = ! empty( $data['wp_id'] ) ? (int) $data['wp_id'] : 0;
		}

		if ( $parent_id <= 0 ) {
			return $response;
		}

		$parent = get_post( $parent_id );
		if ( ! $parent || ! in_array( $parent->post_type, self::PREVIEWABLE_TEMPLATE_TYPES, true ) ) {
			return $response;
		}

		if ( ! current_user_can( 'edit_post', $parent_id ) ) {
			return $response;
		}

		$base_url = $this->resolve_preview_base_url( $parent );
		if ( ! $base_url ) {
			return $response;
		}

		$data['preview_link'] = add_query_arg(
			array(
				'preview'       => 'true',
				'preview_id'    => $parent_id,
				'preview_nonce' => wp_create_nonce( 'post_preview_' . $parent_id ),
			),
			$base_url
		);

		$response->set_data( $data );

		return $response;
	}

	/**
	 * Replace published template content with autosave content during preview.
	 *
	 * @param \WP_Block_Template[] $query_result Templates from query.
	 * @param array                $query        Query args.
	 * @param string               $template_type Template type.
	 * @return \WP_Block_Template[]
	 */
	public function apply_template_autosave_preview( $query_result, $query, $template_type ) {
		// Normal frontend requests: skip before template-type checks (filter runs often).
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Validated in get_valid_template_preview_context().
		if ( empty( $_GET['preview_id'] ) || empty( $_GET['preview_nonce'] ) ) {
			return $query_result;
		}

		if ( ! in_array( $template_type, self::PREVIEWABLE_TEMPLATE_TYPES, true ) ) {
			return $query_result;
		}

		$preview = $this->get_valid_template_preview_context();
		if ( ! $preview ) {
			return $query_result;
		}

		list( $preview_id, $autosave, $parent ) = $preview;

		foreach ( $query_result as $index => $template ) {
			if ( ! $this->block_template_matches_preview_parent( $template, $preview_id, $parent ) ) {
				continue;
			}

			$query_result[ $index ]->content  = $autosave->post_content;
			$query_result[ $index ]->title    = $autosave->post_title;
			$query_result[ $index ]->modified = $autosave->post_modified;

			break;
		}

		return $query_result;
	}

	/**
	 * Replace published template content with autosave content during single-template fetch.
	 *
	 * Because get_block_template() bypasses get_block_templates, template part previews must
	 * hook this filter separately.
	 *
	 * @param \WP_Block_Template|null $block_template Template object.
	 * @param string                  $id             Template id (theme//slug).
	 * @param string                  $template_type  Template type.
	 * @return \WP_Block_Template|null
	 */
	public function apply_autosave_preview_to_block_template( $block_template, $id, $template_type ) {
		if ( ! $block_template || ! is_object( $block_template ) ) {
			return $block_template;
		}

		// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Validated in get_valid_template_preview_context().
		if ( empty( $_GET['preview_id'] ) || empty( $_GET['preview_nonce'] ) ) {
			return $block_template;
		}

		if ( ! in_array( $template_type, self::PREVIEWABLE_TEMPLATE_TYPES, true ) ) {
			return $block_template;
		}

		$preview = $this->get_valid_template_preview_context();
		if ( ! $preview ) {
			return $block_template;
		}

		list( $preview_id, $autosave, $parent ) = $preview;

		if ( ! $this->block_template_matches_preview_parent( $block_template, $preview_id, $parent ) ) {
			return $block_template;
		}

		$block_template->content  = $autosave->post_content;
		$block_template->title    = $autosave->post_title;
		$block_template->modified = $autosave->post_modified;

		return $block_template;
	}

	/**
	 * Validate preview request and return template ID + autosave post.
	 *
	 * @return array{0: int, 1: \WP_Post, 2: \WP_Post}|null
	 */
	private function get_valid_template_preview_context() {
		static $cached_context = null;
		static $resolved       = false;

		if ( $resolved ) {
			return $cached_context;
		}

		// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Verified below.
		if ( empty( $_GET['preview_id'] ) || empty( $_GET['preview_nonce'] ) ) {
			return null;
		}

		$resolved = true;

		// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Verified below.
		$preview_id = (int) $_GET['preview_id'];
		if ( $preview_id <= 0 ) {
			return null;
		}

		// phpcs:ignore WordPress.Security.NonceVerification.Recommended
		if ( ! wp_verify_nonce( wp_unslash( $_GET['preview_nonce'] ), 'post_preview_' . $preview_id ) ) {
			return null;
		}

		if ( ! is_user_logged_in() || ! current_user_can( 'edit_post', $preview_id ) ) {
			return null;
		}

		$parent = get_post( $preview_id );
		if ( ! $parent || ! in_array( $parent->post_type, self::PREVIEWABLE_TEMPLATE_TYPES, true ) ) {
			return null;
		}

		$autosave = wp_get_post_autosave( $preview_id );
		if ( ! $autosave instanceof \WP_Post ) {
			// Draft/auto-draft parents are updated in place (no separate autosave revision).
			// Theme-file templates use update_item for preview (customization post holds edits).
			// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Display gate only.
			$is_preview_request = isset( $_GET['preview'] ) && 'true' === wp_unslash( $_GET['preview'] );

			if ( in_array( $parent->post_status, array( 'draft', 'auto-draft' ), true ) || $is_preview_request ) {
				$autosave = $parent;
			} else {
				return null;
			}
		}

		$cached_context = array( $preview_id, $autosave, $parent );

		return $cached_context;
	}

	/**
	 * Resolve the parent template post ID from an autosave REST response body.
	 *
	 * @param array $data REST response data.
	 * @return int Parent post ID or 0 when unknown.
	 */
	private function resolve_autosave_parent_id_from_response( array $data ) {
		if ( ! empty( $data['parent'] ) ) {
			return (int) $data['parent'];
		}

		if ( ! empty( $data['wp_id'] ) ) {
			$candidate = (int) $data['wp_id'];
			$parent_id = (int) wp_is_post_autosave( $candidate );

			if ( $parent_id > 0 ) {
				return $parent_id;
			}

			$maybe_parent = get_post( $candidate );
			if ( $maybe_parent && in_array( $maybe_parent->post_type, self::PREVIEWABLE_TEMPLATE_TYPES, true ) ) {
				return $candidate;
			}
		}

		if ( ! empty( $data['id'] ) && is_numeric( $data['id'] ) ) {
			$candidate = (int) $data['id'];
			$parent_id = (int) wp_is_post_autosave( $candidate );

			if ( $parent_id > 0 ) {
				return $parent_id;
			}
		}

		return 0;
	}

	/**
	 * Whether a block template result corresponds to the preview parent post.
	 *
	 * @param object   $template   Block template object.
	 * @param int      $preview_id Parent template post ID.
	 * @param \WP_Post $parent     Parent template post object.
	 * @return bool
	 */
	private function block_template_matches_preview_parent( $template, $preview_id, $parent ) {
		if ( isset( $template->wp_id ) && (int) $template->wp_id === $preview_id ) {
			return true;
		}

		// File-based templates have wp_id=0; match by theme + slug instead.
		$parent_theme = $this->get_template_part_theme_slug( $parent );

		return isset( $template->theme, $template->slug )
			&& $template->theme === $parent_theme
			&& $template->slug === $parent->post_name;
	}

	/**
	 * Resolve the frontend URL used to preview a template slug.
	 *
	 * @param \WP_Post $template Template post object.
	 * @return string|null Preview base URL or null when unavailable.
	 */
	private function resolve_preview_base_url( \WP_Post $template ) {
		if ( 'wp_template_part' === $template->post_type ) {
			return $this->resolve_template_part_preview_url( $template );
		}

		$slug = $template->post_name;
		$home = home_url( '/' );

		if ( in_array( $slug, self::HOME_SLUGS, true ) ) {
			return $home;
		}

		if ( 'search' === $slug ) {
			$blog_name = get_bloginfo( 'name' );
			$term      = $blog_name ? preg_split( '/\s+/', trim( $blog_name ), 2 )[0] : 'test';

			return add_query_arg( 's', $term, $home );
		}

		if ( '404' === $slug ) {
			return user_trailingslashit( $home ) . 'blockera-template-preview-404/';
		}

		if ( 'page' === $slug || str_starts_with( $slug, 'page-' ) ) {
			$page = $this->get_latest_published_post( 'page', str_starts_with( $slug, 'page-' ) ? substr( $slug, 5 ) : null );
			if ( $page ) {
				return get_permalink( $page );
			}
		}

		if ( 'single' === $slug || str_starts_with( $slug, 'single-' ) ) {
			$post_type = 'single' === $slug ? 'post' : substr( $slug, 7 );
			$post      = $this->get_latest_published_post( $post_type );
			if ( $post ) {
				return get_permalink( $post );
			}
		}

		if ( 'archive' === $slug || str_starts_with( $slug, 'archive-' ) ) {
			$post_type = 'archive' === $slug ? 'post' : substr( $slug, 8 );
			$archive   = get_post_type_archive_link( $post_type );
			if ( $archive ) {
				return $archive;
			}
		}

		/**
		 * Filter the frontend base URL used for a template autosave preview link.
		 *
		 * @param string|null $url      Preview base URL.
		 * @param \WP_Post    $template Template post object.
		 */
		$filtered = apply_filters( 'blockera_template_preview_base_url', $home, $template );

		return is_string( $filtered ) && $filtered ? $filtered : $home;
	}

	/**
	 * Render an isolated template part preview (no theme header/footer).
	 *
	 * @return void
	 */
	public function maybe_render_template_part_preview() {
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Display gate only.
		if ( empty( $_GET[ self::TEMPLATE_PART_PREVIEW_ARG ] ) || '1' !== $_GET[ self::TEMPLATE_PART_PREVIEW_ARG ] ) {
			return;
		}

		// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Sanitized below.
		$theme = isset( $_GET['theme'] ) ? sanitize_text_field( wp_unslash( $_GET['theme'] ) ) : '';
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Sanitized below.
		$slug = isset( $_GET['slug'] ) ? sanitize_title( wp_unslash( $_GET['slug'] ) ) : '';

		if ( ! $theme || ! $slug ) {
			wp_die( esc_html__( 'Invalid template part preview.', 'blockera' ), '', array( 'response' => 400 ) );
		}

		if ( ! is_user_logged_in() ) {
			auth_redirect();
		}

		$preview_context = $this->get_valid_template_preview_context();
		$content         = null;
		$part_post       = null;

		if ( $preview_context ) {
			list( $preview_id, $autosave, $parent ) = $preview_context;

			if ( ! current_user_can( 'edit_post', $preview_id ) ) {
				wp_die( esc_html__( 'Sorry, you are not allowed to preview this template part.', 'blockera' ), '', array( 'response' => 403 ) );
			}

			if ( ! $this->template_part_post_matches_request( $parent, $theme, $slug ) ) {
				wp_die( esc_html__( 'Template part preview mismatch.', 'blockera' ), '', array( 'response' => 400 ) );
			}

			$content   = $autosave->post_content;
			$part_post = $parent;
		} elseif ( ! current_user_can( 'edit_theme_options' ) ) {
			wp_die( esc_html__( 'Sorry, you are not allowed to preview template parts.', 'blockera' ), '', array( 'response' => 403 ) );
		}

		if ( null === $content ) {
			$template = get_block_template( $theme . '//' . $slug, 'wp_template_part' );
			if ( ! $template || ! is_object( $template ) || ! isset( $template->content ) ) {
				wp_die( esc_html__( 'Template part not found.', 'blockera' ), '', array( 'response' => 404 ) );
			}

			$content = $template->content;

			if ( ! empty( $template->wp_id ) ) {
				$maybe_post = get_post( (int) $template->wp_id );
				if ( $maybe_post instanceof \WP_Post ) {
					$part_post = $maybe_post;
				}
			}
		}

		global $wp_query;
		$wp_query->is_404 = false;
		status_header( 200 );
		nocache_headers();

		if ( $part_post instanceof \WP_Post ) {
			global $post;
			$post = $part_post; // phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited
			setup_postdata( $part_post );
		}

		// Render blocks before wp_head() so on-demand block styles and Blockera CSS
		// are registered before styles are printed in the document head.
		$rendered_content = do_blocks( $content );

		?>
		<!DOCTYPE html>
		<html <?php language_attributes(); ?>>
		<head>
			<meta charset="<?php bloginfo( 'charset' ); ?>">
			<meta name="viewport" content="width=device-width, initial-scale=1">
			<?php wp_head(); ?>
			<style id="blockera-template-part-preview-layout">
				body.blockera-template-part-preview {
					margin: 0;
				}
				.blockera-template-part-preview-root {
					display: block;
				}
			</style>
		</head>
		<body <?php body_class( 'blockera-template-part-preview' ); ?>>
			<div class="blockera-template-part-preview-root">
				<?php echo $rendered_content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
			</div>
			<?php wp_footer(); ?>
			<?php wp_reset_postdata(); ?>
		</body>
		</html>
		<?php
		exit;
	}

	/**
	 * Build the frontend URL for previewing a template part in isolation.
	 *
	 * @param \WP_Post $template Template part post object.
	 * @return string|null Preview base URL or null when unavailable.
	 */
	private function resolve_template_part_preview_url( \WP_Post $template ) {
		$theme = $this->get_template_part_theme_slug( $template );
		$slug  = $template->post_name;

		if ( ! $theme || ! $slug ) {
			return null;
		}

		return add_query_arg(
			array(
				self::TEMPLATE_PART_PREVIEW_ARG => '1',
				'theme'                         => $theme,
				'slug'                          => $slug,
			),
			home_url( '/' )
		);
	}

	/**
	 * Resolve the theme slug for a template part post.
	 *
	 * @param \WP_Post $template Template part post object.
	 * @return string Theme slug.
	 */
	private function get_template_part_theme_slug( \WP_Post $template ) {
		static $theme_by_post_id = array();

		$post_id = (int) $template->ID;
		if ( isset( $theme_by_post_id[ $post_id ] ) ) {
			return $theme_by_post_id[ $post_id ];
		}

		$terms = wp_get_object_terms( $post_id, 'wp_theme', array( 'fields' => 'names' ) );
		if ( ! is_wp_error( $terms ) && isset( $terms[0] ) ) {
			$theme_by_post_id[ $post_id ] = (string) $terms[0];
		} else {
			$theme_by_post_id[ $post_id ] = get_stylesheet();
		}

		return $theme_by_post_id[ $post_id ];
	}

	/**
	 * Whether a template part post matches the theme/slug requested in the preview URL.
	 *
	 * @param \WP_Post $template_part Template part post object.
	 * @param string   $theme         Theme slug from the request.
	 * @param string   $slug          Template part slug from the request.
	 * @return bool
	 */
	private function template_part_post_matches_request( \WP_Post $template_part, $theme, $slug ) {
		return $template_part->post_name === $slug
			&& $this->get_template_part_theme_slug( $template_part ) === $theme;
	}

	/**
	 * Fetch a published post for template preview URLs.
	 *
	 * @param string      $post_type Post type slug.
	 * @param string|null $slug      Optional post slug.
	 * @return \WP_Post|null
	 */
	private function get_latest_published_post( $post_type, $slug = null ) {
		$args = array(
			'post_type'              => $post_type,
			'post_status'            => 'publish',
			'posts_per_page'         => 1,
			'no_found_rows'          => true,
			'update_post_meta_cache' => false,
			'update_post_term_cache' => false,
			'orderby'                => 'modified',
			'order'                  => 'DESC',
		);

		if ( $slug ) {
			$args['name']           = $slug;
			$args['posts_per_page'] = 1;
			unset( $args['orderby'], $args['order'] );
		}

		$posts = get_posts( $args );

		return $posts[0] ?? null;
	}
}
