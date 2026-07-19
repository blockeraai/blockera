<?php

use Blockera\Setup\Compatibility\JSONResolver;

if (! function_exists('blockera_register_block_core_template_part')) {
	/**
	 * Registers the `core/template-part` block on the server.
	 *
	 * @since 5.9.0
	 */
	function blockera_register_block_core_template_part() {
		register_block_type_from_metadata(
			ABSPATH . WPINC . '/blocks/template-part',
			array(
				'render_callback'    => 'blockera_render_block_core_template_part',
				'variation_callback' => 'build_template_part_block_variations',
			)
		);
	}
}

if (! function_exists('blockera_render_block_core_template_part')) {
	/**
	 * Renders the `core/template-part` block on the server.
	 *
	 * @since 5.9.0
	 *
	 * @global WP_Embed $wp_embed WordPress Embed object.
	 *
	 * @param array $attributes The block attributes.
	 *
	 * @return string The render.
	 */
	function blockera_render_block_core_template_part( $attributes ) {
		static $seen_ids      = array();
		static $defined_areas = null;

		$template_part_id = null;
		$content          = null;
		$area             = WP_TEMPLATE_PART_AREA_UNCATEGORIZED;
		$theme            = isset( $attributes['theme'] ) ? $attributes['theme'] : get_stylesheet();

		if ( isset( $attributes['slug'] ) && get_stylesheet() === $theme ) {
			$template_part_id    = $theme . '//' . $attributes['slug'];
			$template_part_query = new WP_Query(
				array(
					'post_type'           => 'wp_template_part',
					'post_status'         => 'publish',
					'post_name__in'       => array( $attributes['slug'] ),
					'tax_query'           => array(
						array(
							'taxonomy' => 'wp_theme',
							'field'    => 'name',
							'terms'    => $theme,
						),
					),
					'posts_per_page'      => 1,
					'no_found_rows'       => true,
					'lazy_load_term_meta' => false, // Do not lazy load term meta, as template parts only have one term.
				)
			);
			$template_part_post  = $template_part_query->have_posts() ? $template_part_query->next_post() : null;
			if ( $template_part_post ) {
				// A published post might already exist if this template part was customized elsewhere
				// or if it's part of a customized template.
				$block_template = _build_block_template_result_from_post( $template_part_post );
				$content        = $block_template->content;
				if ( isset( $block_template->area ) ) {
					$area = $block_template->area;
				}
				/**
				 * Fires when a block template part is loaded from a template post stored in the database.
				 *
				 * @since 5.9.0
				 *
				 * @param string  $template_part_id   The requested template part namespaced to the theme.
				 * @param array   $attributes         The block attributes.
				 * @param WP_Post $template_part_post The template part post object.
				 * @param string  $content            The template part content.
				 */
				do_action( 'render_block_core_template_part_post', $template_part_id, $attributes, $template_part_post, $content );
			} else {
				$template_part_file_path = '';
				// Else, if the template part was provided by the active theme,
				// render the corresponding file content.
				if ( 0 === validate_file( $attributes['slug'] ) ) {
					$block_template = get_block_file_template( $template_part_id, 'wp_template_part' );

					if ( isset( $block_template->content ) ) {
						$content = $block_template->content;
					}
					if ( isset( $block_template->area ) ) {
						$area = $block_template->area;
					}

					// Needed for the `render_block_core_template_part_file` and `render_block_core_template_part_none` actions below.
					$block_template_file = _get_block_template_file( 'wp_template_part', $attributes['slug'] );
					if ( $block_template_file ) {
						$template_part_file_path = $block_template_file['path'];
					}
				}

				if ( '' !== $content && null !== $content ) {
					/**
					 * Fires when a block template part is loaded from a template part in the theme.
					 *
					 * @since 5.9.0
					 *
					 * @param string $template_part_id        The requested template part namespaced to the theme.
					 * @param array  $attributes              The block attributes.
					 * @param string $template_part_file_path Absolute path to the template path.
					 * @param string $content                 The template part content.
					 */
					do_action( 'render_block_core_template_part_file', $template_part_id, $attributes, $template_part_file_path, $content );
				} else {
					/**
					 * Fires when a requested block template part does not exist in the database nor in the theme.
					 *
					 * @since 5.9.0
					 *
					 * @param string $template_part_id        The requested template part namespaced to the theme.
					 * @param array  $attributes              The block attributes.
					 * @param string $template_part_file_path Absolute path to the not found template path.
					 */
					do_action( 'render_block_core_template_part_none', $template_part_id, $attributes, $template_part_file_path );
				}
			}
		}

		// WP_DEBUG_DISPLAY must only be honored when WP_DEBUG. This precedent
		// is set in `wp_debug_mode()`.
		$is_debug = WP_DEBUG && WP_DEBUG_DISPLAY;

		if ( is_null( $content ) ) {
			if ( $is_debug && isset( $attributes['slug'] ) ) {
				return sprintf(
					/* translators: %s: Template part slug. */
					__( 'Template part has been deleted or is unavailable: %s', 'blockera' ),
					$attributes['slug']
				);
			}

			return '';
		}

		if ( isset( $seen_ids[ $template_part_id ] ) ) {
			return $is_debug ?
				// translators: Visible only in the front end, this warning takes the place of a faulty block.
				__( '[block rendering halted]', 'blockera' ) :
				'';
		}

		// Look up area definition.
		$area_definition = null;
		if ( null === $defined_areas ) {
			$defined_areas = get_allowed_block_template_part_areas();
		}
		foreach ( $defined_areas as $defined_area ) {
			if ( $defined_area['area'] === $area ) {
				$area_definition = $defined_area;
				break;
			}
		}

		// If $area is not allowed, set it back to the uncategorized default.
		if ( ! $area_definition ) {
			$area = WP_TEMPLATE_PART_AREA_UNCATEGORIZED;
		}

		// Run through the actions that are typically taken on the_content.
		$content                       = shortcode_unautop( $content );
		$content                       = do_shortcode( $content );
		$seen_ids[ $template_part_id ] = true;
		$content                       = do_blocks( $content );
		unset( $seen_ids[ $template_part_id ] );
		$content = wptexturize( $content );
		$content = convert_smilies( $content );
		$content = wp_filter_content_tags( $content, "template_part_{$area}" );

		// Handle embeds for block template parts.
		global $wp_embed;
		$content = $wp_embed->autoembed( $content );

		if ( empty( $attributes['tagName'] ) || tag_escape( $attributes['tagName'] ) !== $attributes['tagName'] ) {
			$area_tag = 'div';
			if ( $area_definition && isset( $area_definition['area_tag'] ) ) {
				$area_tag = $area_definition['area_tag'];
			}
			$html_tag = $area_tag;
		} else {
			$html_tag = esc_attr( $attributes['tagName'] );
		}
		$wrapper_attributes = get_block_wrapper_attributes();

		return "<$html_tag $wrapper_attributes>" . str_replace( ']]>', ']]&gt;', $content ) . "</$html_tag>";
	}
}

if (! function_exists('blockera_get_block_template_file')) {
	/**
	 * Retrieves the template file from the theme for a given slug.
	 *
	 * @since 5.9.0
	 * @access private
	 *
	 * @param string $template_type Template type. Either 'wp_template' or 'wp_template_part'.
	 * @param string $slug          Template slug.
	 * @return array|null {
	 *     Array with template metadata if $template_type is one of 'wp_template' or 'wp_template_part',
	 *     null otherwise.
	 *
	 *     @type string   $slug      Template slug.
	 *     @type string   $path      Template file path.
	 *     @type string   $theme     Theme slug.
	 *     @type string   $type      Template type.
	 *     @type string   $area      Template area. Only for 'wp_template_part'.
	 *     @type string   $title     Optional. Template title.
	 *     @type string[] $postTypes Optional. List of post types that the template supports. Only for 'wp_template'.
	 * }
	 */
	function blockera_get_block_template_file( $template_type, $slug ) {
		if ( 'wp_template' !== $template_type && 'wp_template_part' !== $template_type ) {
			return null;
		}

		$themes = array(
			get_stylesheet() => get_stylesheet_directory(),
			get_template()   => get_template_directory(),
		);
		foreach ( $themes as $theme_slug => $theme_dir ) {
			$template_base_paths = get_block_theme_folders( $theme_slug );
			$file_path           = $theme_dir . '/' . $template_base_paths[ $template_type ] . '/' . $slug . '.html';
			if ( file_exists( $file_path ) ) {
				$new_template_item = array(
					'slug'  => $slug,
					'path'  => $file_path,
					'theme' => $theme_slug,
					'type'  => $template_type,
				);

				if ( 'wp_template_part' === $template_type ) {
					return _add_block_template_part_area_info( $new_template_item );
				}

				// If it's not a `wp_template_part`, it must be a `wp_template`.
				return _add_block_template_info( $new_template_item );
			}
		}

		return null;
	}
}

if (! function_exists('blockera_add_block_template_part_area_info')) {
	/**
     * Attempts to add the template part's area information to the input template.
     *
     * @since 5.9.0
     * @access private
     *
     * @param array $template_info Template to add information to (requires 'type' and 'slug' fields).
     * @return array Template info.
     */
	function blockera_add_block_template_part_area_info( $template_info ) {
		if ( wp_theme_has_theme_json() ) {
			$theme_data = wp_get_theme_data_template_parts();
		}

		if ( isset( $theme_data[ $template_info['slug'] ]['area'] ) ) {
			$template_info['title'] = $theme_data[ $template_info['slug'] ]['title'];
			$template_info['area']  = _filter_block_template_part_area( $theme_data[ $template_info['slug'] ]['area'] );
		} else {
			$template_info['area'] = WP_TEMPLATE_PART_AREA_UNCATEGORIZED;
		}

		return $template_info;
	}
}

if (! function_exists('blockera_get_theme_data_template_parts')) {
	/**
	 * Returns the metadata for the template parts defined by the theme.
	 *
	 * @since 6.4.0
	 *
	 * @return array Associative array of `$part_name => $part_data` pairs,
	 *               with `$part_data` having "title" and "area" fields.
	 */
	function blockera_get_theme_data_template_parts() {
		$cache_group    = 'theme_json';
		$cache_key      = 'wp_get_theme_data_template_parts';
		$can_use_cached = ! wp_is_development_mode( 'theme' );

		if ( $can_use_cached ) {
			$metadata = wp_cache_get( $cache_key, $cache_group );
			if ( false !== $metadata ) {
				return $metadata;
			}
		}

		$metadata = JSONResolver::get_theme_data( array(), array( 'with_supports' => false ) )->get_template_parts();
		if ( $can_use_cached ) {
			wp_cache_set( $cache_key, $metadata, $cache_group );
		}

		return $metadata;
	}	
}
