<?php

use Blockera\Setup\Compatibility\JSON;
use Blockera\Setup\Compatibility\JSONResolver;

if ( ! function_exists( 'blockera_block_style_variation_theme_json_store' ) ) {
	/**
	 * Request-level merged theme.json raw data for block style variation CSS.
	 *
	 * @param array|null $set When set, primes the store without calling JSONResolver merge.
	 * @return array Merged theme.json raw data.
	 */
	function blockera_block_style_variation_theme_json_store( ?array $set = null ): array {
		static $theme_json = null;

		if ( null !== $set ) {
			$theme_json = $set;
			return $theme_json;
		}

		if ( null === $theme_json ) {
			$theme_json = JSONResolver::get_merged_raw_data();
		}

		return $theme_json;
	}
}

if ( ! function_exists( 'blockera_get_block_style_variation_merged_theme_json' ) ) {
	/**
	 * @return array Merged theme.json raw data for variation lookups.
	 */
	function blockera_get_block_style_variation_merged_theme_json(): array {
		return blockera_block_style_variation_theme_json_store();
	}
}

if ( ! function_exists( 'blockera_prime_block_style_variation_merged_theme_json' ) ) {
	/**
	 * @param array $raw Merged theme.json raw data (e.g. from styles_for_blocks transient).
	 * @return void
	 */
	function blockera_prime_block_style_variation_merged_theme_json( array $raw ): void {
		blockera_block_style_variation_theme_json_store( $raw );
	}
}

if ( ! function_exists( 'blockera_warm_block_style_variation_theme_json_cache' ) ) {
	/**
	 * Warm merged theme.json for render_block_data variation styles before the first matching block.
	 *
	 * @param string|null $hash           Optional cache hash.
	 * @param mixed       $cache_instance Optional cache instance.
	 * @return void
	 */
	function blockera_warm_block_style_variation_theme_json_cache( ?string $hash = null, $cache_instance = null ): void {
		global $blockera_mode;

		$can_use_transients = ! $blockera_mode
			&& ( ! defined( 'BLOCKERA_DEVELOPMENT' ) || ! BLOCKERA_DEVELOPMENT )
			&& ! wp_is_development_mode( 'theme' );

		if ( $can_use_transients && null !== $hash && null !== $cache_instance ) {
			$styles_for_blocks = $cache_instance->getTransientCache( 'styles_for_blocks' );
			if (
				is_array( $styles_for_blocks )
				&& isset( $styles_for_blocks['hash'], $styles_for_blocks['tree_raw'] )
				&& $styles_for_blocks['hash'] === $hash
				&& is_array( $styles_for_blocks['tree_raw'] )
			) {
				blockera_prime_block_style_variation_merged_theme_json( $styles_for_blocks['tree_raw'] );
				return;
			}
		}

		blockera_get_block_style_variation_merged_theme_json();
	}
}

if (! function_exists('blockera_register_block_style_variations_from_theme_json_partials')) {
	/**
     * Registers block style variations read in from theme.json partials.
     *
     * @access private
     *
     * @param array $variations Shared block style variations.
     */
	function blockera_register_block_style_variations_from_theme_json_partials( $variations ): void {

		if ( empty( $variations ) ) {
			return;
		}

		// Get the global styles post id.
		$post_id = JSONResolver::get_user_global_styles_post_id();
		// Get the cache instance.
		$cache = blockera_get_cache();
		// Get the blockera meta data for global styles.
		$blockera_meta_data = $cache->getMetaCache( $post_id, 'blockeraGlobalStylesMetaData' );

		$registry = WP_Block_Styles_Registry::get_instance();

		foreach ( $variations as $variation ) {
			if ( empty( $variation['blockTypes'] ) || empty( $variation['styles'] ) ) {
				continue;
			}

			$variation_name  = $variation['slug'] ?? _wp_to_kebab_case( $variation['title'] );
			$variation_label = $variation['title'] ?? $variation_name;

			foreach ( $variation['blockTypes'] as $block_type ) {
				$registered_styles = $registry->get_registered_styles_for_block( $block_type );

				$cached_variations = $blockera_meta_data['blocks'][ $block_type ]['variations'] ?? [];
				$deleted_items     = array_column($cached_variations, 'isDeleted');

				// Register block style variation if it hasn't already been registered.
				if ( ! array_key_exists( $variation_name, $registered_styles ) ) {
					register_block_style(
                        $block_type,
                        array(
							'name'  => $variation_name,
							'label' => $variation_label,
                        )
					);
				} elseif (in_array($variation_name, $deleted_items, true)) {
					unregister_block_style(
                        $block_type,
                        $variation_name
					);

					$index                    = array_search($variation_name, $deleted_items, true);
					$cached_variations_values = array_values($cached_variations);
					$cached_variations_keys   = array_keys($cached_variations);
					$ref_value                = $cached_variations_values[ $index ];
					$ref_key                  = $cached_variations_keys[ $index ];

					register_block_style(
                        $block_type,
                        array(
							'name'  => $ref_key,
							'label' => $ref_value['label'],
                        )
					);
				} elseif (! empty($cached_variations)) {
					foreach ($cached_variations as $value) {
						register_block_style(
							$block_type,
							array(
								'name'  => $value['name'],
								'label' => $value['label'],
							)
						);
					}
				}
			}
		}
	}
}

if ( ! function_exists( 'blockera_get_block_size_variation_name_from_class' ) ) {
	/**
	 * Size variation slug tokens (`is-size-{slug}`), mirroring Blockera editor / JS.
	 *
	 * @param string $class_string Block className attribute.
	 * @return array|null Numeric list of slug strings, or null.
	 */
	function blockera_get_block_size_variation_name_from_class( $class_string ) {
		if ( ! is_string( $class_string ) ) {
			return null;
		}

		preg_match_all( '/\bis-size-(\S+)\b/', $class_string, $matches );

		return ! empty( $matches[1] ) ? $matches[1] : null;
	}
}

if ( ! function_exists( 'blockera_collect_block_variation_render_jobs' ) ) {
	/**
	 * Build ordered render jobs for theme.json-backed variation CSS (`is-style-*` then `is-size-*`).
	 *
	 * @param string|null $classes Block className.
	 * @return array<int, array{ slug_candidates: string[], class_prefix: string, style_handle: string }>
	 */
	function blockera_collect_block_variation_render_jobs( $classes ) {
		$class_string = is_string( $classes ) ? $classes : '';
		$jobs         = array();

		$slug_filter = static function ( $slug ) {
			return ! preg_match( '/--\d+$/', $slug );
		};

		$style_raw = blockera_get_block_style_variation_name_from_class( $class_string );
		if ( ! empty( $style_raw ) ) {
			$style_slugs = array_values( array_filter( $style_raw, $slug_filter ) );
			if ( ! empty( $style_slugs ) ) {
				$already_instanced = false;
				foreach ( $style_slugs as $slug ) {
					if ( preg_match( '/\bis-style-' . preg_quote( $slug, '/' ) . '--\d+\b/', $class_string ) ) {
						$already_instanced = true;
						break;
					}
				}
				if ( ! $already_instanced ) {
					$jobs[] = array(
						'slug_candidates' => $style_slugs,
						'class_prefix'    => 'is-style-',
						'style_handle'    => 'block-style-variation-styles',
					);
				}
			}
		}

		$size_raw = blockera_get_block_size_variation_name_from_class( $class_string );
		if ( ! empty( $size_raw ) ) {
			$size_slugs = array_values( array_filter( $size_raw, $slug_filter ) );
			if ( ! empty( $size_slugs ) ) {
				$already_instanced = false;
				foreach ( $size_slugs as $slug ) {
					if ( preg_match( '/\bis-size-' . preg_quote( $slug, '/' ) . '--\d+\b/', $class_string ) ) {
						$already_instanced = true;
						break;
					}
				}
				if ( ! $already_instanced ) {
					$jobs[] = array(
						'slug_candidates' => $size_slugs,
						'class_prefix'    => 'is-size-',
						'style_handle'    => 'block-size-variation-styles',
					);
				}
			}
		}

		return $jobs;
	}
}

if ( ! function_exists( 'blockera_render_one_block_theme_variation_support_styles' ) ) {
	/**
	 * Emits scoped CSS for one theme variation surface (style or size) and appends instance className.
	 *
	 * @param array    $parsed_block    Parsed block.
	 * @param string[] $variations      Candidate slugs (theme.json keys).
	 * @param string   $class_prefix    `is-style-` or `is-size-`.
	 * @param string   $style_handle    Inline style handle.
	 * @return array Parsed block (possibly modified).
	 */
	function blockera_render_one_block_theme_variation_support_styles( $parsed_block, array $variations, $class_prefix, $style_handle ) {
		if ( empty( $variations ) || empty( $parsed_block['blockName'] ) ) {
			return $parsed_block;
		}

		static $styles_hash = null;

		if ( null === $styles_hash && function_exists( 'blockera_get_global_styles_cache_hash' ) ) {
			$styles_hash = blockera_get_global_styles_cache_hash();
		}

		$theme_json = blockera_get_block_style_variation_merged_theme_json();

		$variation_data = array();
		$variation      = '';

		foreach ( $variations as $candidate ) {
			$candidate_data = $theme_json['styles']['blocks'][ $parsed_block['blockName'] ]['variations'][ $candidate ] ?? array();
			if ( ! empty( $candidate_data ) ) {
				$variation_data = $candidate_data;
				$variation      = $candidate;
				break;
			}
		}

		if ( empty( $variation_data ) ) {
			return $parsed_block;
		}

		wp_resolve_block_style_variation_ref_values( $variation_data, $theme_json );

		$cache_sig                                       = md5( $parsed_block['blockName'] . '|' . $variation . '|' . $class_prefix . '|' . ( $styles_hash ?? '' ) );
		$placeholder_instance                            = 'bvars' . substr( md5( 'blockera_var_ph|' . $cache_sig ), 0, 24 );
		$can_style_cache                                 = function_exists( 'blockera_get_global_styles_cache_hash' ) && ! wp_is_development_mode( 'theme' );
		$cache_wp_key                                    = 'bss_' . $cache_sig;
		$variation_styles_tpl                            = '';
		static $blockera_variation_support_style_runtime = array();

		if ( $can_style_cache ) {
			$cached_tpl = blockera_get_cache()->getTransientCache( $cache_wp_key );
			if ( is_string( $cached_tpl ) && '' !== $cached_tpl ) {
				$variation_styles_tpl = $cached_tpl;
			} elseif ( isset( $blockera_variation_support_style_runtime[ $cache_wp_key ] ) ) {
				$variation_styles_tpl = $blockera_variation_support_style_runtime[ $cache_wp_key ];
			}
		}

		if ( '' === $variation_styles_tpl ) {
			$scope_instance = $placeholder_instance;

			$elements_data = $variation_data['elements'] ?? array();
			$blocks_data   = $variation_data['blocks'] ?? array();
			unset( $variation_data['elements'], $variation_data['blocks'] );

			_wp_array_set(
				$blocks_data,
				array( $parsed_block['blockName'], 'variations', $scope_instance ),
				$variation_data
			);

			$config = array(
				'version' => JSON::LATEST_SCHEMA,
				'styles'  => array(
					'elements' => $elements_data,
					'blocks'   => $blocks_data,
				),
			);

			if ( ! is_admin() ) {
				remove_filter( 'wp_theme_json_get_style_nodes', 'wp_filter_out_block_nodes' );
			}

			$styles_registry = WP_Block_Styles_Registry::get_instance();
			$styles_registry->register( $parsed_block['blockName'], array( 'name' => $scope_instance ) );

			$class_name_scope     = $class_prefix . $scope_instance;
			$variation_theme_json = new JSON( $config, 'blocks', $class_prefix );
			$built_styles         = $variation_theme_json->get_stylesheet(
				array( 'styles' ),
				array( 'custom' ),
				array(
					'include_block_style_variations' => true,
					'skip_root_layout_styles'        => false,
					'scope'                          => '.' . $class_name_scope,
				)
			);
			JSON::set_style_variation_prefix( 'is-style-' );

			$styles_registry->unregister( $parsed_block['blockName'], $scope_instance );

			if ( ! is_admin() ) {
				add_filter( 'wp_theme_json_get_style_nodes', 'wp_filter_out_block_nodes' );
			}

			$variation_styles_tpl = is_string( $built_styles ) ? $built_styles : '';

			if ( '' !== $variation_styles_tpl && $can_style_cache ) {
				blockera_get_cache()->setTransientCache( $cache_wp_key, $variation_styles_tpl, DAY_IN_SECONDS );
				$blockera_variation_support_style_runtime[ $cache_wp_key ] = $variation_styles_tpl;
			}
		}

		if ( '' === $variation_styles_tpl ) {
			return $parsed_block;
		}

		$variation_instance = wp_unique_id( $variation . '--' );
		$class_name         = $class_prefix . $variation_instance;

		$placeholder_class_full = '.' . $class_prefix . $placeholder_instance;
		$real_scope_full        = '.' . $class_name;
		$variation_styles       = str_replace( $placeholder_class_full, $real_scope_full, $variation_styles_tpl );

		$current_class_name = isset( $parsed_block['attrs']['className'] ) ? (string) $parsed_block['attrs']['className'] : '';
		$updated_class_name = trim( $current_class_name . ' ' . $class_name );

		static $registered_variation_handles = array();
		if ( ! isset( $registered_variation_handles[ $style_handle ] ) ) {
			wp_register_style( $style_handle, false, array( 'wp-block-library', 'global-styles' ) );
			$registered_variation_handles[ $style_handle ] = true;
		}
		wp_add_inline_style( $style_handle, $variation_styles );

		_wp_array_set( $parsed_block, array( 'attrs', 'className' ), $updated_class_name );

		return $parsed_block;
	}
}

if (! function_exists('blockera_render_block_style_variation_support_styles')) {
	/**
	 * Renders theme.json-backed variation CSS for blocks carrying `is-style-*` or `is-size-*` classes.
	 *
	 * In the case of nested blocks with variations applied, we want the parent
	 * variation's styles to be rendered before their descendants. This solves the
	 * issue of a block type being styled in both the parent and descendant: we want
	 * the descendant style to take priority, and this is done by loading it after,
	 * in the DOM order. This is why the variation stylesheet generation is in a
	 * different filter.
	 *
	 * Style surface output is attached to `block-style-variation-styles`; size surface
	 * to `block-size-variation-styles` (Blockera `is-size-{slug}`). Scoped stylesheet
	 * text is reused via {@see blockera_get_cache()} transients (plus a request-static
	 * fallback) keyed by block name, slug, prefix, and {@see blockera_get_global_styles_cache_hash()};
	 * theme development mode disables that cache.
	 *
	 * @since 6.6.0
	 * @access private
	 *
	 * @param array $parsed_block The parsed block.
	 *
	 * @return array The parsed block with variation instance classes added when generated.
	 */
	function blockera_render_block_style_variation_support_styles( $parsed_block ) {
		$classes = $parsed_block['attrs']['className'] ?? '';

		if (
			'' === $classes
			|| ( ! str_contains( $classes, 'is-style-' ) && ! str_contains( $classes, 'is-size-' ) )
		) {
			return $parsed_block;
		}

		foreach ( blockera_collect_block_variation_render_jobs( $classes ) as $job ) {
			$parsed_block = blockera_render_one_block_theme_variation_support_styles(
				$parsed_block,
				$job['slug_candidates'],
				$job['class_prefix'],
				$job['style_handle']
			);
		}

		return $parsed_block;
	}
}

if ( ! function_exists( 'blockera_render_block_style_variation_class_name' ) ) {
	/**
	 * Applies variation instance classes from {@see render_block_data} onto the rendered block wrapper.
	 *
	 * Core only handles `is-style-*--{id}` ({@see wp_render_block_style_variation_class_name}). Blockera also
	 * emits scoped CSS for size variations via `is-size-*--{id}`; those must be added here.
	 *
	 * @param string $block_content Full block markup.
	 * @param array  $block         Parsed block (after `render_block_data`), includes `attrs.className`.
	 * @return string Filtered markup.
	 */
	function blockera_render_block_style_variation_class_name( $block_content, $block ) {
		if ( ! $block_content || empty( $block['attrs']['className'] ) ) {
			return $block_content;
		}

		$class_string = $block['attrs']['className'];

		// Hot path: most blocks never carry instance classes — avoid preg_match_all entirely.
		$has_style = false !== strpos( $class_string, 'is-style-' );
		$has_size  = false !== strpos( $class_string, 'is-size-' );
		if ( ! $has_style && ! $has_size ) {
			return $block_content;
		}

		// Only scan prefixes that exist; skip merge/unique when a single side has one token.
		$style_matches = array();
		$size_matches  = array();
		if ( $has_style ) {
			preg_match_all( '/\bis-style-\S+?--\d+\b/', $class_string, $m );
			$style_matches = $m[0];
		}
		if ( $has_size ) {
			preg_match_all( '/\bis-size-\S+?--\d+\b/', $class_string, $m );
			$size_matches = $m[0];
		}

		if ( $style_matches ) {
			if ( $size_matches ) {
				$to_apply = array_values( array_unique( array_merge( $style_matches, $size_matches ) ) );
			} elseif ( isset( $style_matches[1] ) ) {
				$to_apply = array_values( array_unique( $style_matches ) );
			} else {
				$to_apply = $style_matches;
			}
		} elseif ( $size_matches ) {
			if ( isset( $size_matches[1] ) ) {
				$to_apply = array_values( array_unique( $size_matches ) );
			} else {
				$to_apply = $size_matches;
			}
		} else {
			return $block_content;
		}

		// First real tag only (skip comments/doctype via (?!!)).
		$updated = preg_replace_callback(
			'/<(?!!)([\w:-]+)(\s([^>]*?))?(\/\s*)?>/',
			static function ( $m ) use ( $to_apply ) {
				$tag       = $m[1];
				$attrs_str = isset( $m[3] ) ? $m[3] : '';
				$slash     = isset( $m[4] ) ? trim( $m[4] ) : '';

				if ( preg_match( '/\bclass\s*=\s*"([^"]*)"/', $attrs_str, $cm ) ) {
					$pieces = preg_split( '/\s+/', trim( $cm[1] ), -1, PREG_SPLIT_NO_EMPTY );
					foreach ( $to_apply as $class_token ) {
						if ( ! in_array( $class_token, $pieces, true ) ) {
							$pieces[] = $class_token;
						}
					}
					$new_attrs = preg_replace(
						'/\bclass\s*=\s*"[^"]*"/',
						'class="' . esc_attr( implode( ' ', $pieces ) ) . '"',
						$attrs_str,
						1
					);
				} elseif ( preg_match( "/\bclass\s*=\s*'([^']*)'/", $attrs_str, $cm ) ) {
					$pieces = preg_split( '/\s+/', trim( $cm[1] ), -1, PREG_SPLIT_NO_EMPTY );
					foreach ( $to_apply as $class_token ) {
						if ( ! in_array( $class_token, $pieces, true ) ) {
							$pieces[] = $class_token;
						}
					}
					$new_attrs = preg_replace(
						"/\bclass\s*=\s*'[^']*'/",
						'class="' . esc_attr( implode( ' ', $pieces ) ) . '"',
						$attrs_str,
						1
					);
				} else {
					$class_attr = 'class="' . esc_attr( implode( ' ', $to_apply ) ) . '"';
					$trimmed    = trim( $attrs_str );
					$new_attrs  = '' === $trimmed ? $class_attr : $class_attr . ' ' . $trimmed;
				}

				$new_attrs = trim( $new_attrs );
				$open      = '<' . $tag;
				if ( '' !== $new_attrs ) {
					$open .= ' ' . $new_attrs;
				}
				if ( '' !== $slash ) {
					$open .= ' ' . $slash;
				}
				$open .= '>';

				return $open;
			},
			$block_content,
			1
		);

		return is_string( $updated ) ? $updated : $block_content;
	}
}

if ( ! function_exists( 'blockera_enqueue_block_size_variation_styles' ) ) {
	/**
	 * Enqueues styles for block size variations.
	 *
	 * Mirrors {@see wp_enqueue_block_style_variation_styles}: enqueue early so
	 * {@see WP_Dependencies::queued_before_register} promotes the handle when
	 * {@see wp_register_style} runs during render.
	 */
	function blockera_enqueue_block_size_variation_styles(): void {
		wp_enqueue_style( 'block-size-variation-styles' );
	}
}

if (! function_exists('blockera_get_block_style_variation_name_from_class')) {
	/**
	 * Determines the block style variation names within a CSS class string.
	 *
	 * @since 6.6.0
	 *
	 * @param string $class_string CSS class string to look for a variation in.
	 *
	 * @return array|null The block style variation name if found.
	 */
	function blockera_get_block_style_variation_name_from_class( $class_string ) {
		if ( ! is_string( $class_string ) ) {
			return null;
		}

		// WordPress exclude all style variations if has includes "default" string inside name. 
		$wp_regex_pattern = '/\bis-style-(?!default)(\S+)\b/';
		// Exclude other instances of default style variation to support duplicate option for default style variation.
		$blockera_regex_pattern = '/\bis-style-default-(\S+)\b/';

		preg_match_all( $wp_regex_pattern, $class_string, $matches );
		preg_match_all( $blockera_regex_pattern, $class_string, $_matches );

		// Override wp_get_block_style_variation_name_from_class() output value.
		if (isset($_matches[1]) && ! empty($_matches[1])) {
			$result = [];
			foreach ($_matches[1] as $item) {
				$result[] = 'default-' . $item;
			}
			return $result;
		}

		return $matches[1] ?? null;
	}
}

if ( ! function_exists( 'blockera_apply_render_block_data_to_wp_block_subtree' ) ) {
	/**
	 * Applies {@see 'render_block_data'} to a block and all descendants, depth-first.
	 *
	 * WordPress only runs that filter in {@see render_block()} and in the parent {@see WP_Block::render()}
	 * loop over inners. Some core blocks (e.g. `core/navigation`, `core/navigation-link`, `core/navigation-submenu`)
	 * call `$inner->render()` directly without the usual pass. Nested blocks (e.g. `core/page-list` inside a
	 * submenu) then miss style variations unless this path runs. Blocks that re-enter {@see WP_Block::render()}
	 * and run the same filter again on a child are expected to be safe for Block style variation processing
	 * (see idempotency in {@see blockera_render_block_style_variation_support_styles}; instance classes are
	 * applied to markup in {@see blockera_render_block_style_variation_class_name}).
	 *
	 * @param \WP_Block      $block        Block node.
	 * @param \WP_Block|null $parent_block Parent, for filters that use the third argument.
	 */
	function blockera_apply_render_block_data_to_wp_block_subtree( WP_Block $block, $parent_block = null ) {
		$source         = $block->parsed_block;
		$filtered_block = apply_filters( 'render_block_data', $source, $source, $parent_block );

		$block->parsed_block = $filtered_block;
		$block->refresh_parsed_block_dependents();

		if ( empty( $block->inner_blocks ) ) {
			return;
		}

		foreach ( $block->inner_blocks as $child ) {
			if ( $child instanceof WP_Block ) {
				blockera_apply_render_block_data_to_wp_block_subtree( $child, $block );
			}
		}
	}
}

if ( ! function_exists( 'blockera_apply_render_block_data_to_inner_block_list' ) ) {
	/**
	 * Runs {@see blockera_apply_render_block_data_to_wp_block_subtree()} for each top-level block in a list.
	 *
	 * Use from any integration that loads or replaces a {@see \WP_Block_List} and then renders with
	 * {@see WP_Block::render()} without going through {@see render_block()}. That matches WordPress core’s
	 * `block_core_navigation_render_inner_blocks` pattern; this helper is the generic Blockera hook point for
	 * the same (plugins can call it from their own `apply_filters` for custom inner block lists).
	 *
	 * @param \Traversable|array $inner_blocks Iterable of {@see \WP_Block} instances.
	 * @param \WP_Block|null     $parent_block Optional parent of this list.
	 * @return \Traversable|array
	 */
	function blockera_apply_render_block_data_to_inner_block_list( $inner_blocks, $parent_block = null ) {
		foreach ( $inner_blocks as $block ) {
			if ( $block instanceof WP_Block ) {
				blockera_apply_render_block_data_to_wp_block_subtree( $block, $parent_block );
			}
		}

		return $inner_blocks;
	}
}

if ( ! function_exists( 'blockera_apply_render_block_data_to_parsed_block_subtree' ) ) {
	/**
	 * Applies {@see 'render_block_data'} to every node in a parsed block *array* tree.
	 *
	 * Use when code builds {@see \WP_Block} from a parsed array and calls `->render()` without
	 * {@see render_block()} (e.g. custom loop blocks). The optional `$parent_block` is passed to filters;
	 * for deep trees without a real parent instance, `null` is common.
	 *
	 * @param array          $parsed_block Unmodified parsed block (will be replaced by filter output).
	 * @param \WP_Block|null $parent_block  Parent for filters.
	 * @return array
	 */
	function blockera_apply_render_block_data_to_parsed_block_subtree( array $parsed_block, $parent_block = null ) {
		$source       = $parsed_block;
		$parsed_block = apply_filters( 'render_block_data', $parsed_block, $source, $parent_block );

		if ( ! empty( $parsed_block['innerBlocks'] ) && is_array( $parsed_block['innerBlocks'] ) ) {
			foreach ( $parsed_block['innerBlocks'] as $i => $inner ) {
				if ( is_array( $inner ) && ! empty( $inner['blockName'] ) ) {
					$parsed_block['innerBlocks'][ $i ] = blockera_apply_render_block_data_to_parsed_block_subtree( $inner, $parent_block );
				}
			}
		}

		return $parsed_block;
	}
}

if ( ! function_exists( 'blockera_navigation_inner_blocks_apply_render_block_data' ) ) {
	/**
	 * Ensures block style variation (and other) render_block_data filters run for Navigation inner blocks.
	 *
	 * When a Navigation block loads inner blocks from a linked `wp_navigation` post or from the core
	 * fallback, those blocks are rendered via {@see WP_Block::render()} without the parent loop that
	 * runs {@see 'render_block_data'} first. Nested items (e.g. `core/page-list` under
	 * `core/navigation-submenu` / `core/navigation-link`) also need the subtree pass because those
	 * submenus render inners with manual `->render()` calls. Delegates to
	 * {@see blockera_apply_render_block_data_to_inner_block_list()}.
	 *
	 * @param \WP_Block_List $inner_blocks Inner blocks returned for the Navigation block.
	 *
	 * @return \WP_Block_List
	 */
	function blockera_navigation_inner_blocks_apply_render_block_data( $inner_blocks ) {
		return blockera_apply_render_block_data_to_inner_block_list( $inner_blocks, null );
	}
}
