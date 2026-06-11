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
	}

	/**
	 * Add preview_link to template/template-part autosave REST responses.
	 *
	 * @param \WP_REST_Response $response Response object.
	 * @param \WP_REST_Server   $server   REST server instance.
	 * @param \WP_REST_Request  $request  Request object.
	 * @return \WP_REST_Response
	 */
	public function add_template_autosave_preview_link( $response, $server, $request ) {
		if ( ! $response instanceof \WP_REST_Response || 'POST' !== $request->get_method() ) {
			return $response;
		}

		$route = $request->get_route();
		if ( ! is_string( $route ) || ! str_contains( $route, '/autosaves' ) ) {
			return $response;
		}

		// Cheap route guard before touching response data (rest_post_dispatch is global).
		if ( ! str_contains( $route, '/wp/v2/templates/' ) && ! str_contains( $route, '/wp/v2/template-parts/' ) ) {
			return $response;
		}

		$data = $response->get_data();
		if ( ! is_array( $data ) ) {
			return $response;
		}

		$parent_id = 0;
		if ( ! empty( $data['parent'] ) ) {
			$parent_id = (int) $data['parent'];
		} elseif ( ! empty( $data['wp_id'] ) ) {
			// Template autosave responses use wp_id for the revision post ID.
			$parent_id = (int) wp_is_post_autosave( (int) $data['wp_id'] );
		} elseif ( ! empty( $data['id'] ) && is_numeric( $data['id'] ) ) {
			$parent_id = (int) wp_is_post_autosave( (int) $data['id'] );
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

		list( $preview_id, $autosave ) = $preview;

		foreach ( $query_result as $index => $template ) {
			if ( ! isset( $template->wp_id ) || (int) $template->wp_id !== $preview_id ) {
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
	 * Validate preview request and return template ID + autosave post.
	 *
	 * @return array{0: int, 1: \WP_Post}|null
	 */
	private function get_valid_template_preview_context() {
		static $cached_context = null;
		static $resolved       = false;

		if ( $resolved ) {
			return $cached_context;
		}

		$resolved = true;

		// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Verified below.
		if ( empty( $_GET['preview_id'] ) || empty( $_GET['preview_nonce'] ) ) {
			return null;
		}

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
			return null;
		}

		$cached_context = array( $preview_id, $autosave );

		return $cached_context;
	}

	/**
	 * Resolve the frontend URL used to preview a template slug.
	 *
	 * @param \WP_Post $template Template post object.
	 * @return string|null Preview base URL or null when unavailable.
	 */
	private function resolve_preview_base_url( \WP_Post $template ) {
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
