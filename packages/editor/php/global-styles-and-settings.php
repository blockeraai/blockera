<?php


/**
 * Adds global style rules to the inline style for each block.
 *
 * @since 6.1.0
 * @since 6.7.0 Resolve relative paths in block styles.
 *
 * @global WP_Styles $wp_styles
 */
function blockera_add_global_styles_for_blocks() {
    global $wp_styles;

	$tree = new \Blockera\Editor\Http\Controllers\Theme\JSON();
	$tree->setSupports(blockera_get_available_block_supports());
	$tree->merge(\Blockera\Editor\Http\Controllers\Theme\JSONResolver::get_user_data());
    $tree        = \Blockera\Editor\Http\Controllers\Theme\JSONResolver::resolve_theme_file_uris($tree);
    $block_nodes = $tree->get_blockera_styles_block_nodes();

    $can_use_cached = ! wp_is_development_mode('theme');
    $update_cache   = false;

    if ($can_use_cached) {
        // Hash the merged WP_Theme_JSON data to bust cache on settings or styles change.
        $cache_hash = md5(wp_json_encode($tree->get_raw_data()));
        $cache_key  = 'wp_styles_for_blocks';
        $cached     = get_transient($cache_key);

        // Reset the cached data if there is no value or if the hash has changed.
        if (! is_array($cached) || $cached['hash'] !== $cache_hash) {
            $cached = array(
                'hash'   => $cache_hash,
                'blocks' => array(),
            );

            // Update the cache if the hash has changed.
            $update_cache = true;
        }
    }

    foreach ($block_nodes as $metadata) {

        if ($can_use_cached) {
            // Use the block name as the key for cached CSS data. Otherwise, use a hash of the metadata.
            $cache_node_key = isset($metadata['name']) ? $metadata['name'] : md5(wp_json_encode($metadata));

            if (isset($cached['blocks'][ $cache_node_key ])) {
                $block_css = $cached['blocks'][ $cache_node_key ];
            } else {
                $block_css                           = $tree->get_styles_for_block($metadata);
                $cached['blocks'][ $cache_node_key ] = $block_css;

                // Update the cache if the cache contents have changed.
                $update_cache = true;
            }
        } else {
            $block_css = $tree->get_styles_for_block($metadata);
        }

        if (! wp_should_load_block_assets_on_demand()) {
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
                $block_name   = str_replace('core/', '', $metadata['name']);
                $block_handle = 'wp-block-' . $block_name;
                if (in_array($block_handle, $wp_styles->queue, true)) {
                    wp_add_inline_style($stylesheet_handle, $block_css);
                }
            } else {
                wp_add_inline_style($stylesheet_handle, $block_css);
            }
        }

        // The likes of block element styles from theme.json do not have  $metadata['name'] set.
        if (! isset($metadata['name']) && ! empty($metadata['path'])) {
            $block_name = wp_get_block_name_from_theme_json_path($metadata['path']);
            if ($block_name) {
                if (str_starts_with($block_name, 'core/')) {
                    $block_name   = str_replace('core/', '', $block_name);
                    $block_handle = 'wp-block-' . $block_name;
                    if (in_array($block_handle, $wp_styles->queue, true)) {
                        wp_add_inline_style($stylesheet_handle, $block_css);
                    }
                } else {
                    wp_add_inline_style($stylesheet_handle, $block_css);
                }
            }
        }
    }

    if ($update_cache) {
        set_transient($cache_key, $cached);
    }
}

