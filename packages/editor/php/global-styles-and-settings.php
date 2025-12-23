<?php

use Blockera\Editor\Http\Controllers\Theme\JSON;
use Blockera\Editor\Http\Controllers\Theme\JSONResolver;

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
		$cache_key      = 'blockera_styles_for_blocks';

		// Build cache hash from version-based keys (much cheaper than hashing entire tree data).
		if ($can_use_cached) {
			$cache_hash = blockera_get_global_styles_cache_hash();
			$cached     = get_transient($cache_key);

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

			// Preparing wp_global_styles post content to access complete (blockera user data) data.
			$user_data = blockera_get_user_styles_data();
			if (! empty($user_data)) {
				$tree->merge(new JSON($user_data, 'custom'));
			}

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

				if (isset($cached['blocks'][ $cache_node_key ])) {
					$block_css = $cached['blocks'][ $cache_node_key ];
				} else {
					$block_css                           = $tree->get_styles_for_block($metadata);
					$cached['blocks'][ $cache_node_key ] = $block_css;
					$update_cache                        = true;
				}
			} else {
				$block_css = $tree->get_styles_for_block($metadata);
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
			set_transient($cache_key, $cached, DAY_IN_SECONDS);
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
			return $user_data;
		}

		$global_styles_post = JSONResolver::get_user_data_from_wp_global_styles(wp_get_theme());

		// Validate the global styles post content.
		if (empty($global_styles_post['post_content']) || ! str_contains($global_styles_post['post_content'], 'blockera')) {
			return [];
		}

		$user_data = json_decode($global_styles_post['post_content'], true);

		unset($user_data['isGlobalStylesUserThemeJSON']);

		return $user_data;
	}
}
