<?php

use Blockera\Setup\Compatibility\BlockeraSettingsPaths;
use Blockera\Setup\Compatibility\BlockSupports\BlockeraDuotone;
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

		/*
		 * Do not use core's {@see wp_get_global_stylesheet} cache key: core builds from
		 * {@see WP_Theme_JSON_Resolver}; this function uses {@see JSONResolver} + {@see JSON}
		 * and would otherwise return the wrong stylesheet when the cache was primed by core first.
		 */
		$cache_group = 'theme_json';
		$cache_key   = 'blockera_wp_get_global_stylesheet';
		if ( $can_use_cached ) {
			$cached = wp_cache_get( $cache_key, $cache_group );
			if ( $cached ) {
				return $cached;
			}
		}

		$tree                = JSONResolver::get_resolved_merged_data();
		$supports_theme_json = wp_theme_has_theme_json();

		if ( empty( $types ) && ! $supports_theme_json ) {
			$types = array( 'variables', 'presets', 'base-layout-styles' );
		} elseif ( empty( $types ) ) {
			$types = array( 'variables', 'styles', 'presets' );
		}

		/*
		 * Origins for variables always include theme/custom so classic themes can
		 * override default presets. Remaining types may use a narrower origin set
		 * when the theme has no theme.json — only then must we call get_stylesheet twice.
		 *
		 * @see https://core.trac.wordpress.org/ticket/54782
		 */
		$origins_variables = array( 'default', 'theme', 'custom' );
		$origins_rest      = array( 'default', 'theme', 'custom' );

		if ( ! $supports_theme_json && ( current_theme_supports( 'appearance-tools' ) || current_theme_supports( 'border' ) ) && current_theme_supports( 'editor-color-palette' ) ) {
			$origins_rest = array( 'default', 'theme' );
		} elseif ( ! $supports_theme_json ) {
			$origins_rest = array( 'default' );
		}

		$wants_variables = in_array( 'variables', $types, true );
		$types_rest      = $wants_variables ? array_values( array_diff( $types, array( 'variables' ) ) ) : $types;

		if ( $wants_variables && ! empty( $types_rest ) && $origins_variables === $origins_rest ) {
			// Block themes: one stylesheet pass for variables + styles + presets.
			$stylesheet = $tree->get_stylesheet( array_merge( array( 'variables' ), $types_rest ), $origins_variables );
		} else {
			$styles_variables = '';
			if ( $wants_variables ) {
				$styles_variables = $tree->get_stylesheet( array( 'variables' ), $origins_variables );
			}

			$styles_rest = '';
			if ( ! empty( $types_rest ) ) {
				$styles_rest = $tree->get_stylesheet( $types_rest, $origins_rest );
			}

			$stylesheet = $styles_variables . $styles_rest;
		}
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

			// Accept tree_raw (preferred) or legacy live `tree` object.
			$has_tree = is_array( $cached )
				&& isset( $cached['hash'], $cached['block_nodes'] )
				&& $cached['hash'] === $cache_hash
				&& ( isset( $cached['tree_raw'] ) || isset( $cached['tree'] ) );

			if ( $has_tree ) {
				if ( isset( $cached['tree_raw'] ) && is_array( $cached['tree_raw'] ) ) {
					$tree = JSON::with_raw_data( $cached['tree_raw'] );
				} else {
					$tree = $cached['tree'];
				}
				$block_nodes = $cached['block_nodes'];
			} else {
				// Cache miss or hash changed - need to rebuild.
				$cached       = null;
				$update_cache = true;
			}
		}

		// Build tree only if not restored from cache.
		// Reuse the same resolved merged tree as blockera_get_global_stylesheet() (request cache).
		if (! isset($tree)) {
			$tree = JSONResolver::get_resolved_merged_data();

			if (! method_exists($tree, 'get_raw_data')) {
				return;
			}

			$block_nodes = $tree->get_styles_block_nodes();

			// Prepare cache structure for storing (raw tree — avoid serializing JSON objects).
			if ($can_use_cached && $update_cache) {
				$cached = array(
					'hash'        => $cache_hash,
					'tree_raw'    => $tree->get_raw_data(),
					'block_nodes' => $block_nodes,
					'wp'          => array( 'blocks' => array() ),
					'blockera'    => array( 'blocks' => array() ),
				);
			}
		}

		// Cache styles queue lookup for O(1) checks instead of repeated in_array().
		$styles_queue_set = null;
		if (wp_should_load_block_assets_on_demand()) {
			$styles_queue_set = array_fill_keys($wp_styles->queue, true);
		}

		foreach ( $block_nodes as $metadata ) {
			$cache_node_key = $metadata['name'] ?? md5( wp_json_encode( $metadata ) );

			foreach ( array( 'wp', 'blockera' ) as $source ) {
				$block_css = null;

				if ( $can_use_cached && null !== $cached ) {
					if ( isset( $cached[ $source ]['blocks'][ $cache_node_key ] ) ) {
						$block_css = $cached[ $source ]['blocks'][ $cache_node_key ];
					} else {
						if ( 'wp' === $source ) {
							$block_css = $tree->get_styles_for_block( $metadata );
						} else {
							$block_css = $tree->get_blockera_styles_for_block( $metadata );
						}
						$cached[ $source ]['blocks'][ $cache_node_key ] = $block_css;
						$update_cache                                   = true;
					}
				} elseif ( 'wp' === $source ) {
					$block_css = $tree->get_styles_for_block( $metadata );
				} else {
					$block_css = $tree->get_blockera_styles_for_block( $metadata );
				}

				if ( null === $styles_queue_set ) {
					wp_add_inline_style( 'global-styles', $block_css );
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
				 */
				if ( isset( $metadata['name'] ) ) {
					if ( str_starts_with( $metadata['name'], 'core/' ) ) {
						$block_handle = 'wp-block-' . substr( $metadata['name'], 5 );
						if ( isset( $styles_queue_set[ $block_handle ] ) ) {
							wp_add_inline_style( $stylesheet_handle, $block_css );
						}
					} else {
						wp_add_inline_style( $stylesheet_handle, $block_css );
					}
				} elseif ( ! empty( $metadata['path'] ) ) {
					$block_name = wp_get_block_name_from_theme_json_path( $metadata['path'] );
					if ( $block_name ) {
						if ( str_starts_with( $block_name, 'core/' ) ) {
							$block_handle = 'wp-block-' . substr( $block_name, 5 );
							if ( isset( $styles_queue_set[ $block_handle ] ) ) {
								wp_add_inline_style( $stylesheet_handle, $block_css );
							}
						} else {
							wp_add_inline_style( $stylesheet_handle, $block_css );
						}
					}
				}
			}
		}

		if ($update_cache && null !== $cached) {
			// Drop legacy live object if present before persisting.
			unset( $cached['tree'] );
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

		// Max mtime across theme style partials (top-level + one nested level, e.g. styles/blocks/).
		$styles_directory = get_template_directory() . '/styles';
		$top_level_styles = glob( $styles_directory . '/*.json' );
		$nested_styles    = glob( $styles_directory . '/*/*.json' );
		$styles_files     = array_merge(
			false !== $top_level_styles ? $top_level_styles : array(),
			false !== $nested_styles ? $nested_styles : array()
		);
		$styles_mtime     = 0;
		foreach ( $styles_files as $file ) {
			$mtime = (int) filemtime( $file );
			if ( $mtime > $styles_mtime ) {
				$styles_mtime = $mtime;
			}
		}
		$styles_mtime = (string) $styles_mtime;

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
		static $user_data  = null;
		static $registered = false;

		if ( null !== $user_data ) {
			return $user_data;
		}

		$global_styles_post = JSONResolver::get_user_data_from_wp_global_styles(wp_get_theme());

		// Validate the global styles post content.
		if (empty($global_styles_post['post_content']) || ! str_contains($global_styles_post['post_content'], 'blockera')) {
			$user_data = array();
			return $user_data;
		}

		$user_data = json_decode($global_styles_post['post_content'], true);

		unset($user_data['isGlobalStylesUserThemeJSON']);

		if ( ! $registered ) {
			// Register block styles once per request (cache hits previously re-registered).
			JSONResolver::register_block_style_variations_from_user_data( $user_data );
			$registered = true;
		}

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

		/*
		 * Must not share the cache key with {@see wp_get_global_settings()}: core resolves
		 * {@see WP_Theme_JSON_Resolver} + {@see WP_Theme_JSON} (sanitization strips Blockera preset groups),
		 * while this uses {@see JSONResolver} + {@see JSON}. Same key would cache the wrong tree for whichever runs first.
		 */
		$cache_group = 'theme_json';
		$cache_key   = 'blockera_get_global_settings_' . $origin;

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
			/*
			 * get_merged_settings() returns a request-cached settings array (also warmed when
			 * get_merged_data() runs during global styles enqueue) without rebuilding JSON.
			 */
			$settings = JSONResolver::get_merged_settings( $origin );
			if ( $can_use_cached ) {
				wp_cache_set( $cache_key, $settings, $cache_group );
			}
		}

		return _wp_array_get( $settings, $path, $settings );
	}
}

if ( ! function_exists( 'blockera_get_layout_support_global_flags' ) ) {
	/**
	 * Layout support flags from Blockera merged settings (request-cached).
	 *
	 * Used by {@see blockera_render_layout_support_flag()} so render_block does not
	 * cold-start {@see wp_get_global_settings()} / {@see WP_Theme_JSON_Resolver::get_merged_data()}.
	 *
	 * @return array{use_root_padding_aware_alignments: bool, has_block_gap_support: bool}
	 */
	function blockera_get_layout_support_global_flags(): array {
		static $flags = null;

		if ( null !== $flags ) {
			return $flags;
		}

		$settings = JSONResolver::get_merged_settings();

		$flags = array(
			'use_root_padding_aware_alignments' => (bool) ( $settings['useRootPaddingAwareAlignments'] ?? false ),
			'has_block_gap_support'             => isset( $settings['spacing']['blockGap'] ),
		);

		return $flags;
	}
}

if ( ! function_exists( 'blockera_warm_merged_settings_cache' ) ) {
	/**
	 * Warm JSONResolver + duotone maps before the_posts / render_block.
	 *
	 * Must run on {@see 'wp_loaded'} (before query_posts): handleThePosts can render blocks
	 * and invoke duotone support prior to wp_enqueue_scripts.
	 *
	 * @return void
	 */
	function blockera_warm_merged_settings_cache(): void {
		static $warmed = false;

		if ( $warmed ) {
			return;
		}
		$warmed = true;

		JSONResolver::get_merged_settings();
		BlockeraDuotone::warm_global_styles_caches();
	}
}

if (! function_exists('blockera_get_sorted_global_preset_items')) {
	/**
	 * Sorted `items` arrays from global style presets (theme.json) for CSS variable generation.
	 *
	 * @param array $preset Preset object with optional `items` list.
	 * @return array<int, array<string, mixed>>
	 */
	function blockera_get_sorted_global_preset_items( array $preset ): array {
		$items = $preset['items'] ?? array();
		if ( ! is_array( $items ) || array() === $items ) {
			return array();
		}
		$repeater = array();
		foreach ( $items as $idx => $row ) {
			if ( ! is_array( $row ) ) {
				continue;
			}
			$repeater[ (string) $idx ] = array_merge(
				$row,
				array(
					'order'     => isset( $row['order'] ) ? (int) $row['order'] : (int) $idx,
					'isVisible' => $row['isVisible'] ?? true,
				)
			);
		}

		return blockera_get_sorted_repeater( $repeater );
	}
}

if (! function_exists('blockera_enqueue_global_styles_css_custom_properties')) {
	/**
	 * Enqueues the CSS Custom Properties coming from theme.json (editor).
	 *
	 * Must call {@see wp_register_style()} before {@see wp_add_inline_style()}: inline data is
	 * stored on the registered handle; see WP_Dependencies::add_data() and
	 * wp-includes/script-loader.php wp_enqueue_global_styles_css_custom_properties().
	 */
	function blockera_enqueue_global_styles_css_custom_properties() {
		wp_register_style( 'global-styles-css-custom-properties', false );
		wp_add_inline_style( 'global-styles-css-custom-properties', blockera_get_global_stylesheet( array( 'variables' ) ) );
		wp_enqueue_style( 'global-styles-css-custom-properties' );
	}
}

if ( ! function_exists( 'blockera_merge_settings_into_experimental_features' ) ) {
	/**
	 * Overlays Blockera global-styles-ui settings onto block editor `__experimentalFeatures`.
	 *
	 * Mirrors preset paths managed by `useGlobalSetting` (`typography.blockeraLineHeights`, `blockeraWidthSizes`, etc.)
	 * so variable pickers and canvas CSS vars stay aligned with the Site Editor globalStyles entity.
	 *
	 * @param array $experimental_features Reference to current __experimentalFeatures.
	 * @param array $blockera_settings       Merged settings from {@see blockera_get_global_settings()} or globalStyles entity.
	 */
	function blockera_merge_settings_into_experimental_features(
		array &$experimental_features,
		array $blockera_settings
	): void {
		BlockeraSettingsPaths::merge_into_experimental_features(
			$experimental_features,
			$blockera_settings
		);
	}
}

if ( ! function_exists( 'blockera_merge_block_editor_experimental_features' ) ) {
	/**
	 * Merges Blockera extended global settings into the block editor's __experimentalFeatures.
	 *
	 * Core {@see wp_get_global_settings()} uses {@see WP_Theme_JSON_Resolver} and {@see WP_Theme_JSON},
	 * whose sanitization drops Blockera-only preset groups (`typography.blockeraLineHeights`,
	 * flat `settings.blockera*` keys, `border.blockeraBorder`, etc.).
	 * The editor still needs those for variable pickers and parity with {@see blockera_get_global_stylesheet()}.
	 *
	 * Initial load only: Site Editor live edits are mirrored by
	 * {@see BlockEditorExperimentalFeaturesSync} (same merge rules, globalStyles entity source,
	 * store mirrors on `styles` / `__unstableResolvedAssets`, and direct iframe `<style>` injection
	 * for live preview — Style Book replaces `settings.styles` with core global styles output).
	 *
	 * Runs late so prior filters see a stable base; we only add/overlay data from {@see blockera_get_global_settings()}.
	 *
	 * @param array $editor_settings Block editor settings.
	 * @return array
	 */
	function blockera_merge_block_editor_experimental_features( $editor_settings ) {
		if ( ! isset( $editor_settings['__experimentalFeatures'] ) || ! is_array( $editor_settings['__experimentalFeatures'] ) ) {
			return $editor_settings;
		}

		$bf = blockera_get_global_settings();
		if ( ! is_array( $bf ) ) {
			return $editor_settings;
		}

		blockera_merge_settings_into_experimental_features(
			$editor_settings['__experimentalFeatures'],
			$bf
		);

		return $editor_settings;
	}
}

if ( ! function_exists( 'blockera_append_global_styles_variables_to_resolved_iframe_assets' ) ) {
	/**
	 * Injects preset CSS custom properties into the block editor canvas iframe.
	 *
	 * The iframe HTML is built from {@see _wp_get_iframed_editor_assets()} (enqueue_block_assets +
	 * block library styles only). Styles registered on {@see enqueue_block_editor_assets} — including
	 * {@see blockera_enqueue_global_styles_css_custom_properties()} — load in the admin document only.
	 * Gutenberg's JS {@see useGlobalStylesOutput} also only declares variables for core {@see PRESET_METADATA}
	 * paths, so Blockera-only presets never appear as CSS variables inside the iframe unless
	 * we append the same rules WordPress would generate from theme.json here.
	 *
	 * @param array $editor_settings Block editor settings.
	 * @return array
	 */
	function blockera_append_global_styles_variables_to_resolved_iframe_assets( $editor_settings ) {
		if ( ! isset( $editor_settings['__unstableResolvedAssets'] ) || ! is_array( $editor_settings['__unstableResolvedAssets'] ) ) {
			return $editor_settings;
		}

		$css = blockera_get_global_stylesheet( array( 'variables' ) );
		if ( '' === $css ) {
			return $editor_settings;
		}

		$styles = $editor_settings['__unstableResolvedAssets']['styles'] ?? '';
		if ( false === $styles ) {
			$styles = '';
		}

		$editor_settings['__unstableResolvedAssets']['styles'] = $styles . '<style id="blockera-global-styles-variables-inline-css">' . $css . '</style>';

		return $editor_settings;
	}
}
