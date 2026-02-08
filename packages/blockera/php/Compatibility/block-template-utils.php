<?php

use Blockera\Setup\Compatibility\JSONResolver;

if (! function_exists('blockera_get_block_templates')) {
	/**
	 * Get the block templates.
	 *
	 * @param array  $templates The templates.
	 * @param array  $query The query.
	 * @param string $template_type The template type.
	 * 
	 * @return array Return a non-null value to bypass the WordPress queries.
	 */
	function blockera_get_block_templates( $templates, $query, $template_type): array {
		$post_type     = isset( $query['post_type'] ) ? $query['post_type'] : '';
		$wp_query_args = array(
			'post_status'         => array( 'auto-draft', 'draft', 'publish' ),
			'post_type'           => $template_type,
			'posts_per_page'      => -1,
			'no_found_rows'       => true,
			'lazy_load_term_meta' => false,
			'tax_query'           => array(
				array(
					'taxonomy' => 'wp_theme',
					'field'    => 'name',
					'terms'    => get_stylesheet(),
				),
			),
		);

		if ( 'wp_template_part' === $template_type && isset( $query['area'] ) ) {
			$wp_query_args['tax_query'][]           = array(
				'taxonomy' => 'wp_template_part_area',
				'field'    => 'name',
				'terms'    => $query['area'],
			);
			$wp_query_args['tax_query']['relation'] = 'AND';
		}

		if ( ! empty( $query['slug__in'] ) ) {
			$wp_query_args['post_name__in']  = $query['slug__in'];
			$wp_query_args['posts_per_page'] = count( array_unique( $query['slug__in'] ) );
		}

		// This is only needed for the regular templates/template parts post type listing and editor.
		if ( isset( $query['wp_id'] ) ) {
			$wp_query_args['p'] = $query['wp_id'];
		} else {
			$wp_query_args['post_status'] = 'publish';
		}

		$template_query = new WP_Query( $wp_query_args );
		$query_result   = array();
		foreach ( $template_query->posts as $post ) {
			$template = _build_block_template_result_from_post( $post );

			if ( is_wp_error( $template ) ) {
				continue;
			}

			if ( $post_type && ! $template->is_custom ) {
				continue;
			}

			if (
				$post_type &&
				isset( $template->post_types ) &&
				! in_array( $post_type, $template->post_types, true )
			) {
				continue;
			}

			$query_result[] = $template;
		}

		if ( ! isset( $query['wp_id'] ) ) {
			/*
			* If the query has found some user templates, those have priority
			* over the theme-provided ones, so we skip querying and building them.
			*/
			$query['slug__not_in'] = wp_list_pluck( $query_result, 'slug' );

			/*
			* We need to unset the post_type query param because some templates
			* would be excluded otherwise, like `page.html` when looking for
			* `page` templates. We need all templates so we can exclude duplicates
			* from plugin-registered templates.
			* See: https://github.com/WordPress/gutenberg/issues/65584
			*/
			$template_files_query = $query;
			unset( $template_files_query['post_type'] );
			$template_files = blockera_get_block_templates_files( $template_type, $template_files_query );
			foreach ( $template_files as $template_file ) {
				// If the query doesn't specify a post type, or it does and the template matches the post type, add it.
				if (
					! isset( $query['post_type'] ) ||
					(
						isset( $template_file['postTypes'] ) &&
						in_array( $query['post_type'], $template_file['postTypes'], true )
					)
				) {
					$query_result[] = _build_block_template_result_from_file( $template_file, $template_type );
				} elseif ( ! isset( $template_file['postTypes'] ) ) {
					// The custom templates with no associated post types are available for all post types as long
					// as they are not default templates.
					$candidate              = _build_block_template_result_from_file( $template_file, $template_type );
					$default_template_types = get_default_block_template_types();
					if ( ! isset( $default_template_types[ $candidate->slug ] ) ) {
						$query_result[] = $candidate;
					}
				}
			}

			if ( 'wp_template' === $template_type ) {
				// Add templates registered in the template registry. Filtering out the ones which have a theme file.
				$registered_templates          = WP_Block_Templates_Registry::get_instance()->get_by_query( $query );
				$matching_registered_templates = array_filter(
					$registered_templates,
					function ( $registered_template ) use ( $template_files ) {
						foreach ( $template_files as $template_file ) {
							if ( $template_file['slug'] === $registered_template->slug ) {
								return false;
							}
						}
						return true;
					}
				);

				$matching_registered_templates = array_map(
					function ( $template ) {
						$template->content = apply_block_hooks_to_content(
							$template->content,
							$template,
							'insert_hooked_blocks_and_set_ignored_hooked_blocks_metadata'
						);
						return $template;
					},
					$matching_registered_templates
				);

				$query_result = array_merge( $query_result, $matching_registered_templates );
			}	
		}

		return $query_result;
	}
}

if (! function_exists('blockera_get_block_templates_files')) {
	/**
	 * Retrieves the template files from the theme.
	 *
	 * @since 5.9.0
	 * @since 6.3.0 Added the `$query` parameter.
	 * @access private
	 *
	 * @param string $template_type Template type. Either 'wp_template' or 'wp_template_part'.
	 * @param array  $query {
	 *     Arguments to retrieve templates. Optional, empty by default.
	 *
	 *     @type string[] $slug__in     List of slugs to include.
	 *     @type string[] $slug__not_in List of slugs to skip.
	 *     @type string   $area         A 'wp_template_part_area' taxonomy value to filter by (for 'wp_template_part' template type only).
	 *     @type string   $post_type    Post type to get the templates for.
	 * }
	 *
	 * @return array|null Template files on success, null if `$template_type` is not matched.
	 */
	function blockera_get_block_templates_files( $template_type, $query = array() ) {
		if ( 'wp_template' !== $template_type && 'wp_template_part' !== $template_type ) {
			return null;
		}

		$default_template_types = array();
		if ( 'wp_template' === $template_type ) {
			$default_template_types = get_default_block_template_types();
		}

		// Prepare metadata from $query.
		$slugs_to_include = isset( $query['slug__in'] ) ? $query['slug__in'] : array();
		$slugs_to_skip    = isset( $query['slug__not_in'] ) ? $query['slug__not_in'] : array();
		$area             = isset( $query['area'] ) ? $query['area'] : null;
		$post_type        = isset( $query['post_type'] ) ? $query['post_type'] : '';

		$stylesheet = get_stylesheet();
		$template   = get_template();
		$themes     = array(
			$stylesheet => get_stylesheet_directory(),
		);
		// Add the parent theme if it's not the same as the current theme.
		if ( $stylesheet !== $template ) {
			$themes[ $template ] = get_template_directory();
		}
		$template_files = array();
		foreach ( $themes as $theme_slug => $theme_dir ) {
			$template_base_paths  = get_block_theme_folders( $theme_slug );
			$theme_template_files = _get_block_templates_paths( $theme_dir . '/' . $template_base_paths[ $template_type ] );
			foreach ( $theme_template_files as $template_file ) {
				$template_base_path = $template_base_paths[ $template_type ];
				$template_slug      = substr(
					$template_file,
					// Starting position of slug.
					strpos( $template_file, $template_base_path . DIRECTORY_SEPARATOR ) + 1 + strlen( $template_base_path ),
					// Subtract ending '.html'.
					-5
				);

				// Skip this item if its slug doesn't match any of the slugs to include.
				if ( ! empty( $slugs_to_include ) && ! in_array( $template_slug, $slugs_to_include, true ) ) {
					continue;
				}

				// Skip this item if its slug matches any of the slugs to skip.
				if ( ! empty( $slugs_to_skip ) && in_array( $template_slug, $slugs_to_skip, true ) ) {
					continue;
				}

				/*
				* The child theme items (stylesheet) are processed before the parent theme's (template).
				* If a child theme defines a template, prevent the parent template from being added to the list as well.
				*/
				if ( isset( $template_files[ $template_slug ] ) ) {
					continue;
				}

				$new_template_item = array(
					'slug'  => $template_slug,
					'path'  => $template_file,
					'theme' => $theme_slug,
					'type'  => $template_type,
				);

				if ( 'wp_template_part' === $template_type ) {
					$candidate = _add_block_template_part_area_info( $new_template_item );
					if ( ! isset( $area ) || $area === $candidate['area'] ) {
						$template_files[ $template_slug ] = $candidate;
					}
				}

				if ( 'wp_template' === $template_type ) {
					$candidate = blockera_add_block_template_info( $new_template_item );
					$is_custom = ! isset( $default_template_types[ $candidate['slug'] ] );

					if (
						! $post_type ||
						( $post_type && isset( $candidate['postTypes'] ) && in_array( $post_type, $candidate['postTypes'], true ) )
					) {
						$template_files[ $template_slug ] = $candidate;
					}

					// The custom templates with no associated post types are available for all post types.
					if ( $post_type && ! isset( $candidate['postTypes'] ) && $is_custom ) {
						$template_files[ $template_slug ] = $candidate;
					}
				}
			}
		}

		return array_values( $template_files );
	}
}


if (! function_exists('blockera_add_block_template_info')) {
	/**
	 * Attempts to add custom template information to the template item.
	 *
	 * @since 5.9.0
	 * @access private
	 *
	 * @param array $template_item Template to add information to (requires 'slug' field).
	 * @return array Template item.
	 */
	function blockera_add_block_template_info( $template_item ) {
		if ( ! wp_theme_has_theme_json() ) {
			return $template_item;
		}

		$theme_data = blockera_get_theme_data_custom_templates();
		if ( isset( $theme_data[ $template_item['slug'] ] ) ) {
			$template_item['title']     = $theme_data[ $template_item['slug'] ]['title'];
			$template_item['postTypes'] = $theme_data[ $template_item['slug'] ]['postTypes'];
		}

		return $template_item;
	}
}

if (! function_exists('blockera_get_theme_data_custom_templates')) {
	/**
	 * Returns the metadata for the custom templates defined by the theme via theme.json.
	 *
	 * @since 6.4.0
	 *
	 * @return array Associative array of `$template_name => $template_data` pairs,
	 *               with `$template_data` having "title" and "postTypes" fields.
	 */
	function blockera_get_theme_data_custom_templates() {
		return JSONResolver::get_theme_data( array(), array( 'with_supports' => false ) )->get_custom_templates();
	}
}
