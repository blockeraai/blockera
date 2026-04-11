<?php

use Blockera\Setup\Compatibility\JSON;
use Blockera\Setup\Compatibility\JSONResolver;

if (! function_exists('blockera_get_global_stylesheet')) {
	/**
	 * Returns the stylesheet resulting of merging core, theme, and user data.
	 *
	 * @since 5.9.0
	 * @since 6.1.0 Added 'base-layout-styles' support.
	 * @since 6.6.0 Resolves relative paths in theme.json styles to theme absolute paths.
	 *
	 * @param array $types Optional. Types of styles to load.
	 *                     See {@see 'WP_Theme_JSON::get_stylesheet'} for all valid types.
	 *                     If empty, it'll load the following:
	 *                     - for themes without theme.json: 'variables', 'presets', 'base-layout-styles'.
	 *                     - for themes with theme.json: 'variables', 'presets', 'styles'.
	 *                     Blockera global-styles-ui preset groups (transition, transform, filter, textShadow, border)
	 *                     are included in variables/presets the same way as core presets via {@see \Blockera\Setup\Compatibility\JSON}.
	 * @return string Stylesheet.
	 */
	function blockera_get_global_stylesheet( $types = array() ) {
		/*
		* Ignore cache when the development mode is set to 'theme', so it doesn't interfere with the theme
		* developer's workflow.
		*/
		$can_use_cached = empty( $types ) && ! wp_is_development_mode( 'theme' );

		/*
		* By using the 'theme_json' group, this data is marked to be non-persistent across requests.
		* @see `wp_cache_add_non_persistent_groups()`.
		*
		* The rationale for this is to make sure derived data from theme.json
		* is always fresh from the potential modifications done via hooks
		* that can use dynamic data (modify the stylesheet depending on some option,
		* settings depending on user permissions, etc.).
		* See some of the existing hooks to modify theme.json behavior:
		* @see https://make.wordpress.org/core/2022/10/10/filters-for-theme-json-data/
		*
		* A different alternative considered was to invalidate the cache upon certain
		* events such as options add/update/delete, user meta, etc.
		* It was judged not enough, hence this approach.
		* @see https://github.com/WordPress/gutenberg/pull/45372
		*/
		$cache_group = 'theme_json';
		$cache_key   = 'wp_get_global_stylesheet';
		if ( $can_use_cached ) {
			$cached = wp_cache_get( $cache_key, $cache_group );
			if ( $cached ) {
				return $cached;
			}
		}

		$tree                = JSONResolver::resolve_theme_file_uris( JSONResolver::get_merged_data() );
		$supports_theme_json = wp_theme_has_theme_json();

		if ( empty( $types ) && ! $supports_theme_json ) {
			$types = array( 'variables', 'presets', 'base-layout-styles' );
		} elseif ( empty( $types ) ) {
			$types = array( 'variables', 'styles', 'presets' );
		}

		/*
		* If variables are part of the stylesheet, then add them.
		* This is so themes without a theme.json still work as before 5.9:
		* they can override the default presets.
		* See https://core.trac.wordpress.org/ticket/54782
		*/
		$styles_variables = '';
		if ( in_array( 'variables', $types, true ) ) {
			/*
			* Only use the default, theme, and custom origins. Why?
			* Because styles for `blocks` origin are added at a later phase
			* (i.e. in the render cycle). Here, only the ones in use are rendered.
			* @see wp_add_global_styles_for_blocks
			*/
			$origins          = array( 'default', 'theme', 'custom' );
			$styles_variables = $tree->get_stylesheet( array( 'variables' ), $origins );
			$types            = array_diff( $types, array( 'variables' ) );
		}

		/*
		* For the remaining types (presets, styles), we do consider origins:
		*
		* - themes without theme.json: only the classes for the presets defined by core
		* - themes with theme.json: the presets and styles classes, both from core and the theme
		*/
		$styles_rest = '';
		if ( ! empty( $types ) ) {
			/*
			* Only use the default, theme, and custom origins. Why?
			* Because styles for `blocks` origin are added at a later phase
			* (i.e. in the render cycle). Here, only the ones in use are rendered.
			* @see wp_add_global_styles_for_blocks
			*/
			$origins = array( 'default', 'theme', 'custom' );

			/*
			* If the theme doesn't have theme.json but supports both appearance tools and color palette,
			* the 'theme' origin should be included so color palette presets are also output.
			*/
			if ( ! $supports_theme_json && ( current_theme_supports( 'appearance-tools' ) || current_theme_supports( 'border' ) ) && current_theme_supports( 'editor-color-palette' ) ) {
				$origins = array( 'default', 'theme' );
			} elseif ( ! $supports_theme_json ) {
				$origins = array( 'default' );
			}
			$styles_rest = $tree->get_stylesheet( $types, $origins );
		}

		$stylesheet = $styles_variables . $styles_rest;
		if ( $can_use_cached ) {
			wp_cache_set( $cache_key, $stylesheet, $cache_group );
		}

		return $stylesheet;
	}
}

if (! function_exists('blockera_add_global_styles_for_blocks')) {
	/**
     * Adds global style rules to the inline style for each block.
     *
     * @since 6.1.0
     * @since 6.7.0 Resolve relative paths in block styles.
     *
     * @global WP_Styles $wp_styles
     */
	function blockera_add_global_styles_for_blocks() {
		global $wp_styles, $blockera_mode;

		$can_use_cached = ! $blockera_mode && ( ! defined('BLOCKERA_DEVELOPMENT') || ! BLOCKERA_DEVELOPMENT );
		$update_cache   = false;
		$cached         = null;
		$cache_key      = 'styles_for_blocks';

		$cache_instance = blockera_get_cache();

		// Build cache hash from version-based keys (much cheaper than hashing entire tree data).
		if ($can_use_cached) {
			$cache_hash = blockera_get_global_styles_cache_hash();
			$cached     = $cache_instance->getTransientCache($cache_key);

			// Check if we have a fully valid cache with all data.
			if (
				is_array($cached) &&
				isset($cached['hash'], $cached['tree'], $cached['block_nodes']) &&
				$cached['hash'] === $cache_hash
			) {
				// Restore cached tree and block nodes - skip expensive JSON operations.
				$tree        = $cached['tree'];
				$block_nodes = $cached['block_nodes'];
			} else {
				// Cache miss or hash changed - need to rebuild.
				$cached       = null;
				$update_cache = true;
			}
		}

		// Build tree only if not restored from cache.
		if (! isset($tree)) {
			$tree        = new JSON();
			$merged_data = JSONResolver::get_merged_data();

			if (! method_exists($merged_data, 'get_raw_data') || ! method_exists($tree, 'get_raw_data')) {
				return;
			}

			$tree->merge($merged_data);
			$tree = JSONResolver::resolve_theme_file_uris($tree);

			$block_nodes = $tree->get_styles_block_nodes();

			// Prepare cache structure for storing.
			if ($can_use_cached && $update_cache) {
				$cached = array(
					'hash'        => $cache_hash,
					'tree'        => $tree,
					'block_nodes' => $block_nodes,
					'blocks'      => array(),
				);
			}
		}

		// Cache styles queue lookup for O(1) checks instead of repeated in_array().
		$styles_queue_set = null;
		if (wp_should_load_block_assets_on_demand()) {
			$styles_queue_set = array_fill_keys($wp_styles->queue, true);
		}

		foreach ($block_nodes as $metadata) {
			$block_css = null;

			if ($can_use_cached && null !== $cached) {
				// Use the block name as the key for cached CSS data. Otherwise, use a hash of the metadata.
				$cache_node_key = $metadata['name'] ?? md5(wp_json_encode($metadata));

				if (isset($cached['wp']['blocks'][ $cache_node_key ])) {
					// Get the css styles for blocks from WordPress cached.
					$block_css = $cached['wp']['blocks'][ $cache_node_key ];
				} else {
					// Get the WordPress styles for current block.
					$block_css .= $tree->get_styles_for_block($metadata);
					// Cache the WordPress styles for the block.
					$cached['wp']['blocks'][ $cache_node_key ] = $block_css;
					// Update the cache.
					$update_cache = true;
				}
			} else {
				// Get the WordPress styles for current block.
				$block_css .= $tree->get_styles_for_block($metadata);
			}

			// Fast path: no on-demand loading - add all styles directly.
			if (null === $styles_queue_set) {
				wp_add_inline_style('global-styles', $block_css);
				continue;
			}

			$stylesheet_handle = 'global-styles';

			/*
			 * When `wp_should_load_block_assets_on_demand()` is true, block styles are
			 * enqueued for each block on the page in class WP_Block's render function.
			 * This means there will be a handle in the styles queue for each of those blocks.
			 * Block-specific global styles should be attached to the global-styles handle, but
			 * only for blocks on the page, thus we check if the block's handle is in the queue
			 * before adding the inline style.
			 * This conditional loading only applies to core blocks.
			 * TODO: Explore how this could be expanded to third-party blocks as well.
			 */
			if (isset($metadata['name'])) {
				if (str_starts_with($metadata['name'], 'core/')) {
					$block_handle = 'wp-block-' . substr($metadata['name'], 5);
					if (isset($styles_queue_set[ $block_handle ])) {
						wp_add_inline_style($stylesheet_handle, $block_css);
					}
				} else {
					wp_add_inline_style($stylesheet_handle, $block_css);
				}
			} elseif (! empty($metadata['path'])) {
				// The likes of block element styles from theme.json do not have $metadata['name'] set.
				$block_name = wp_get_block_name_from_theme_json_path($metadata['path']);
				if ($block_name) {
					if (str_starts_with($block_name, 'core/')) {
						$block_handle = 'wp-block-' . substr($block_name, 5);
						if (isset($styles_queue_set[ $block_handle ])) {
							wp_add_inline_style($stylesheet_handle, $block_css);
						}
					} else {
						wp_add_inline_style($stylesheet_handle, $block_css);
					}
				}
			}
		}

		foreach ($block_nodes as $metadata) {
			$block_css = null;

			if ($can_use_cached && null !== $cached) {
				// Use the block name as the key for cached CSS data. Otherwise, use a hash of the metadata.
				$cache_node_key = $metadata['name'] ?? md5(wp_json_encode($metadata));

				if (isset($cached['blockera']['blocks'][ $cache_node_key ])) {
					// Get the Blockera styles for blocks from cache.
					$block_css = $cached['blockera']['blocks'][ $cache_node_key ];
				} else {
					// Get the Blockera styles for current block.
					$block_css .= $tree->get_blockera_styles_for_block($metadata);
					// Cache the Blockera styles for the block.
					$cached['blockera']['blocks'][ $cache_node_key ] = $block_css;
					// Update the cache.
					$update_cache = true;
				}
			} else {
				// Get the Blockera styles for current block.
				$block_css .= $tree->get_blockera_styles_for_block($metadata);
			}

			// Fast path: no on-demand loading - add all styles directly.
			if (null === $styles_queue_set) {
				wp_add_inline_style('global-styles', $block_css);
				continue;
			}

			$stylesheet_handle = 'global-styles';

			/*
			 * When `wp_should_load_block_assets_on_demand()` is true, block styles are
			 * enqueued for each block on the page in class WP_Block's render function.
			 * This means there will be a handle in the styles queue for each of those blocks.
			 * Block-specific global styles should be attached to the global-styles handle, but
			 * only for blocks on the page, thus we check if the block's handle is in the queue
			 * before adding the inline style.
			 * This conditional loading only applies to core blocks.
			 * TODO: Explore how this could be expanded to third-party blocks as well.
			 */
			if (isset($metadata['name'])) {
				if (str_starts_with($metadata['name'], 'core/')) {
					$block_handle = 'wp-block-' . substr($metadata['name'], 5);
					if (isset($styles_queue_set[ $block_handle ])) {
						wp_add_inline_style($stylesheet_handle, $block_css);
					}
				} else {
					wp_add_inline_style($stylesheet_handle, $block_css);
				}
			} elseif (! empty($metadata['path'])) {
				// The likes of block element styles from theme.json do not have $metadata['name'] set.
				$block_name = wp_get_block_name_from_theme_json_path($metadata['path']);
				if ($block_name) {
					if (str_starts_with($block_name, 'core/')) {
						$block_handle = 'wp-block-' . substr($block_name, 5);
						if (isset($styles_queue_set[ $block_handle ])) {
							wp_add_inline_style($stylesheet_handle, $block_css);
						}
					} else {
						wp_add_inline_style($stylesheet_handle, $block_css);
					}
				}
			}
		}

		if ($update_cache && null !== $cached) {
			$cache_instance->setTransientCache($cache_key, $cached, DAY_IN_SECONDS);
		}
	}
}

if (! function_exists('blockera_get_global_styles_cache_hash')) {
	/**
	 * Generates a cache hash based on Blockera version, theme version, and theme.json file modification time.
	 *
	 * This is much cheaper than hashing the entire tree data, as it only requires
	 * reading version strings and a single filemtime() call.
	 *
	 * @return string The cache hash.
	 */
	function blockera_get_global_styles_cache_hash(): string {
		static $hash = null;

		if (null !== $hash) {
			return $hash;
		}

		$wp_theme        = wp_get_theme();
		$theme_version   = $wp_theme->get('Version');
		$theme_json_file = $wp_theme->get_file_path('theme.json');

		// Get theme.json modification time (returns false if file doesn't exist).
		$theme_json_mtime = file_exists($theme_json_file) ? (string) filemtime($theme_json_file) : '0';

		// Include parent theme version and theme.json mtime if applicable.
		$parent_theme = $wp_theme->parent();
		$parent_info  = '';
		if ($parent_theme) {
			$parent_version    = $parent_theme->get('Version');
			$parent_theme_json = $parent_theme->get_file_path('theme.json');
			$parent_json_mtime = file_exists($parent_theme_json) ? (string) filemtime($parent_theme_json) : '0';
			$parent_info       = '|p:' . $parent_version . ':' . $parent_json_mtime;
		}

		// Get the block theme all json files exists inside /styles directory modification time.
		$styles_directory = get_template_directory() . '/styles';
		$styles_files     = glob($styles_directory . '/*.json');
		$styles_mtime     = '0';
		foreach ($styles_files as $file) {
			$styles_mtime = (string) filemtime($file);
		}

		// Include user global styles post modified time for user customizations.
		$user_styles_mtime = blockera_get_user_styles_modified_time();

		// Build hash from: blockera version | theme version | (all) theme.json mtime(s) | parent info | user styles mtime.
		$hash = md5(
			BLOCKERA_SB_VERSION . '|' .
			$theme_version . '|' .
			$theme_json_mtime .
			$styles_mtime .
			$parent_info . '|' .
			$user_styles_mtime
		);

		return $hash;
	}
}

if (! function_exists('blockera_get_user_styles_modified_time')) {
	/**
	 * Gets the modification time of the user global styles post.
	 *
	 * @return string The post modified timestamp or '0' if not found.
	 */
	function blockera_get_user_styles_modified_time(): string {
		static $mtime = null;

		if (null !== $mtime) {
			return $mtime;
		}

		$global_styles_post = JSONResolver::get_user_data_from_wp_global_styles(wp_get_theme());

		if (! empty($global_styles_post['post_modified'])) {
			$mtime = $global_styles_post['post_modified'];
		} else {
			$mtime = '0';
		}

		return $mtime;
	}
}

if (! function_exists('blockera_get_user_styles_data')) {
	/**
	 * Gets the user styles data.
	 *
	 * @return array The user styles data or an empty array if no data is found.
	 */
	function blockera_get_user_styles_data(): array {
		static $user_data = [];

		if (! empty($user_data)) {
			// Register the block style from the user data.
			JSONResolver::register_block_style_variations_from_user_data( $user_data );

			return $user_data;
		}

		$global_styles_post = JSONResolver::get_user_data_from_wp_global_styles(wp_get_theme());

		// Validate the global styles post content.
		if (empty($global_styles_post['post_content']) || ! str_contains($global_styles_post['post_content'], 'blockera')) {
			return [];
		}

		$user_data = json_decode($global_styles_post['post_content'], true);

		unset($user_data['isGlobalStylesUserThemeJSON']);

		// Register the block style from the user data.
		JSONResolver::register_block_style_variations_from_user_data( $user_data );

		return $user_data;
	}
}

if (! function_exists('blockera_editor_inline_script')) {
	/**
	 * Gets the inline script for the editor.
	 *
	 * @return string The inline script.
	 */
	function blockera_editor_inline_script(): string {
		// Get the global styles post id.
		$active_global_styles_id = JSONResolver::get_user_global_styles_post_id();
		// Get the cache instance.
		$cache = blockera_get_cache();
		// Get the blockera meta data for global styles.
		$blockera_meta_data = $cache->getMetaCache( $active_global_styles_id, 'blockeraGlobalStylesMetaData' );
		// Encoded the meta data.
		$data = wp_json_encode( is_array($blockera_meta_data) ? $blockera_meta_data : [] );

		// Return generated inline script.
		return 'blockeraGlobalStylesMetaData = ' . $data . ';';
	}
}

if (! function_exists('blockera_get_global_settings')) {
	/**
	 * Gets the settings resulting of merging core, theme, and user data.
	 *
	 * @since 5.9.0
	 *
	 * @param array $path    Path to the specific setting to retrieve. Optional.
	 *                       If empty, will return all settings.
	 * @param array $context {
	 *     Metadata to know where to retrieve the $path from. Optional.
	 *
	 *     @type string $block_name Which block to retrieve the settings from.
	 *                              If empty, it'll return the settings for the global context.
	 *     @type string $origin     Which origin to take data from.
	 *                              Valid values are 'all' (core, theme, and user) or 'base' (core and theme).
	 *                              If empty or unknown, 'all' is used.
	 * }
	 * @return mixed The settings array or individual setting value to retrieve.
	 */
	function blockera_get_global_settings( $path = array(), $context = array() ) {
		if ( ! empty( $context['block_name'] ) ) {
			$new_path = array( 'blocks', $context['block_name'] );
			foreach ( $path as $subpath ) {
				$new_path[] = $subpath;
			}
			$path = $new_path;
		}

		/*
		* This is the default value when no origin is provided or when it is 'all'.
		*
		* The $origin is used as part of the cache key. Changes here need to account
		* for clearing the cache appropriately.
		*/
		$origin = 'custom';
		if (
			! wp_theme_has_theme_json() ||
			( isset( $context['origin'] ) && 'base' === $context['origin'] )
		) {
			$origin = 'theme';
		}

		/*
		* By using the 'theme_json' group, this data is marked to be non-persistent across requests.
		* See `wp_cache_add_non_persistent_groups` in src/wp-includes/load.php and other places.
		*
		* The rationale for this is to make sure derived data from theme.json
		* is always fresh from the potential modifications done via hooks
		* that can use dynamic data (modify the stylesheet depending on some option,
		* settings depending on user permissions, etc.).
		* See some of the existing hooks to modify theme.json behavior:
		* https://make.wordpress.org/core/2022/10/10/filters-for-theme-json-data/
		*
		* A different alternative considered was to invalidate the cache upon certain
		* events such as options add/update/delete, user meta, etc.
		* It was judged not enough, hence this approach.
		* See https://github.com/WordPress/gutenberg/pull/45372
		*/
		$cache_group = 'theme_json';
		$cache_key   = 'wp_get_global_settings_' . $origin;

		/*
		* Ignore cache when the development mode is set to 'theme', so it doesn't interfere with the theme
		* developer's workflow.
		*/
		$can_use_cached = ! wp_is_development_mode( 'theme' );

		$settings = false;
		if ( $can_use_cached ) {
			$settings = wp_cache_get( $cache_key, $cache_group );
		}

		if ( false === $settings ) {
			$settings = JSONResolver::get_merged_data( $origin )->get_settings();
			if ( $can_use_cached ) {
				wp_cache_set( $cache_key, $settings, $cache_group );
			}
		}

		return _wp_array_get( $settings, $path, $settings );
	}
}
