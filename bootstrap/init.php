<?php
/**
 * The init file contains Blockera initialization scripts.
 *
 * @package Blockera/bootstrap
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

use Blockera\Setup\Compatibility\JSONResolver;

add_filter( 'wp_theme_json_get_style_nodes', 'blockera_filter_theme_json_get_style_nodes' );

if ( ! function_exists( 'blockera_filter_theme_json_get_style_nodes' ) ) {
	/**
	 * Filter style nodes to drop deleted Blockera block style variations.
	 *
	 * Request-cached: {@see JSON::get_stylesheet()} invokes this once per stylesheet pass.
	 *
	 * @param array<int, array<string, mixed>> $nodes Style nodes from theme.json.
	 * @return array<int, array<string, mixed>>
	 */
	function blockera_filter_theme_json_get_style_nodes( array $nodes ): array {
		static $cached_nodes      = null;
		static $cached_nodes_hash = null;
		static $cached_meta_hash  = null;

		$post_id = JSONResolver::get_user_global_styles_post_id();
		$cache   = blockera_get_cache();
		$meta    = $cache->getMetaCache( $post_id, 'blockeraGlobalStylesMetaData' );
		$blocks  = $meta['blocks'] ?? array();

		if ( empty( $blocks ) ) {
			return $nodes;
		}

		$nodes_hash = md5( wp_json_encode( $nodes ) );
		$meta_hash  = md5( wp_json_encode( $blocks ) );

		if (
			null !== $cached_nodes
			&& $nodes_hash === $cached_nodes_hash
			&& $meta_hash === $cached_meta_hash
		) {
			return $cached_nodes;
		}

		$deleted_by_block = array();
		foreach ( $blocks as $block_name => $block_meta ) {
			if ( empty( $block_meta['variations'] ) || ! is_array( $block_meta['variations'] ) ) {
				continue;
			}
			foreach ( $block_meta['variations'] as $variation ) {
				if ( ! empty( $variation['isDeleted'] ) && ! empty( $variation['name'] ) ) {
					$deleted_by_block[ $block_name ][ $variation['name'] ] = true;
				}
			}
		}

		if ( empty( $deleted_by_block ) ) {
			$cached_nodes      = $nodes;
			$cached_nodes_hash = $nodes_hash;
			$cached_meta_hash  = $meta_hash;
			return $nodes;
		}

		$new_nodes = array();

		foreach ( $nodes as $node ) {
			if ( empty( $node['name'] ) || empty( $node['variations'] ) ) {
				$new_nodes[] = $node;
				continue;
			}

			$deleted_names = $deleted_by_block[ $node['name'] ] ?? null;
			if ( null === $deleted_names ) {
				$new_nodes[] = $node;
				continue;
			}

			$is_deleted_node = false;

			foreach ( $node['variations'] as $node_variation ) {
				$paths = $node_variation['path'] ?? null;
				if ( ! is_array( $paths ) ) {
					continue;
				}
				foreach ( $paths as $path ) {
					if ( ! is_string( $path ) ) {
						continue;
					}
					foreach ( $deleted_names as $deleted_name => $_true ) {
						if ( str_contains( $path, $deleted_name ) ) {
							$is_deleted_node = true;
							break 3;
						}
					}
				}
			}

			if ( ! $is_deleted_node ) {
				$new_nodes[] = $node;
			}
		}

		$cached_nodes      = $new_nodes;
		$cached_nodes_hash = $nodes_hash;
		$cached_meta_hash  = $meta_hash;

		return $new_nodes;
	}
}
