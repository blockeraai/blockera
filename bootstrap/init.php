<?php
/**
 * The init file contains Blockera initialization scripts.
 *
 * @package Blockera/bootstrap
 */

use Blockera\Setup\Compatibility\JSONResolver;

add_filter('wp_theme_json_get_style_nodes', 'blockera_filter_theme_json_get_style_nodes');

if (! function_exists('blockera_filter_theme_json_get_style_nodes')) {
	function blockera_filter_theme_json_get_style_nodes( array $nodes): array {
		$new_nodes = [];

		// Get the global styles post id.
		$post_id = JSONResolver::get_user_global_styles_post_id();
		// Get the cache instance.
		$cache = blockera_get_cache();
		// Get the blockera meta data for global styles.
		$blockera_meta_data = $cache->getMetaCache( $post_id, 'blockeraGlobalStylesMetaData' );

		foreach ($nodes as $node) {
			if (! isset($node['name'])) {
				// push to new stack.
				$new_nodes[] = $node;
				continue;
			}

			if (! isset($node['variations']) || empty($node['variations'])) {
				// push to new stack.
				$new_nodes[] = $node;
				continue;
			}

			if (! isset($blockera_meta_data['blocks'][ $node['name'] ])) {
				// push to new stack.
				$new_nodes[] = $node;
				continue;
			}

			$node_meta = $blockera_meta_data['blocks'][ $node['name'] ];

			$is_deleted_node = false;

			foreach ($node['variations'] as $node_variation) {
				foreach ($node_meta['variations'] ?? [] as $variation) {
					if (isset($variation['isDeleted'], $variation['name']) && $variation['isDeleted']) {
						foreach ($node_variation as $key => $value) {
							// Skip process, just 'path' key allowed.
							if ('path' !== $key) {
								continue;
							}

							// Marked node as a deleted node when found inside path stack.
							foreach ($value as $path) {
								if (str_contains($path, $variation['name'])) {
									$is_deleted_node = true;
								}
							}
						}
					}
				}
			}

			// removing from stack.
			if ($is_deleted_node) {
				continue;
			}

			// push to new stack.
			$new_nodes[] = $node;
		}

		// filtered the style nodes.
		return $new_nodes;
	}	
}
