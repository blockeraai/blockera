<?php

use Blockera\Setup\Compatibility\JSON;
use Blockera\Setup\Compatibility\JSONResolver;

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

		$post_id            = WP_Theme_JSON_Resolver::get_user_global_styles_post_id();
		$blockera_meta_data = get_post_meta($post_id, 'blockeraGlobalStylesMetaData', true);

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
				$refs              = array_column($cached_variations, 'refId');

				// Register block style variation if it hasn't already been registered.
				if ( ! array_key_exists( $variation_name, $registered_styles ) ) {
					register_block_style(
                        $block_type,
                        array(
							'name'  => $variation_name,
							'label' => $variation_label,
                        )
					);
				} elseif (in_array($variation_name, $refs, true)) {
					unregister_block_style(
                        $block_type,
                        $variation_name
					);

					$index                    = array_search($variation_name, $refs, true);
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

if (! function_exists('blockera_render_block_style_variation_support_styles')) {
	/**
	 * Renders the block style variation's styles.
	 *
	 * In the case of nested blocks with variations applied, we want the parent
	 * variation's styles to be rendered before their descendants. This solves the
	 * issue of a block type being styled in both the parent and descendant: we want
	 * the descendant style to take priority, and this is done by loading it after,
	 * in the DOM order. This is why the variation stylesheet generation is in a
	 * different filter.
	 *
	 * @since 6.6.0
	 * @access private
	 *
	 * @param array $parsed_block The parsed block.
	 *
	 * @return array The parsed block with block style variation classname added.
	 */
	function blockera_render_block_style_variation_support_styles( $parsed_block ) {
		$classes    = $parsed_block['attrs']['className'] ?? null;
		$variations = wp_get_block_style_variation_name_from_class( $classes );

		if ( ! $variations ) {
			return $parsed_block;
		}

		$tree       = JSONResolver::get_merged_data();
		$theme_json = $tree->get_raw_data();

		// Only the first block style variation with data is supported.
		$variation_data = array();
		foreach ( $variations as $variation ) {
			$variation_data = $theme_json['styles']['blocks'][ $parsed_block['blockName'] ]['variations'][ $variation ] ?? array();

			if ( ! empty( $variation_data ) ) {
				break;
			}
		}

		if ( empty( $variation_data ) ) {
			return $parsed_block;
		}

		/*
		* Recursively resolve any ref values with the appropriate value within the
		* theme_json data.
		*/
		wp_resolve_block_style_variation_ref_values( $variation_data, $theme_json );

		$variation_instance = wp_unique_id( $variation . '--' );
		$class_name         = "is-style-$variation_instance";
		$updated_class_name = $parsed_block['attrs']['className'] . " $class_name";

		/*
		* Even though block style variations are effectively theme.json partials,
		* they can't be processed completely as though they are.
		*
		* Block styles support custom selectors to direct specific types of styles
		* to inner elements. For example, borders on Image block's get applied to
		* the inner `img` element rather than the wrapping `figure`.
		*
		* The following relocates the "root" block style variation styles to
		* under an appropriate blocks property to leverage the preexisting style
		* generation for simple block style variations. This way they get the
		* custom selectors they need.
		*
		* The inner elements and block styles for the variation itself are
		* still included at the top level but scoped by the variation's selector
		* when the stylesheet is generated.
		*/
		$elements_data = $variation_data['elements'] ?? array();
		$blocks_data   = $variation_data['blocks'] ?? array();
		unset( $variation_data['elements'] );
		unset( $variation_data['blocks'] );

		_wp_array_set(
			$blocks_data,
			array( $parsed_block['blockName'], 'variations', $variation_instance ),
			$variation_data
		);

		$config = array(
			'version' => JSON::LATEST_SCHEMA,
			'styles'  => array(
				'elements' => $elements_data,
				'blocks'   => $blocks_data,
			),
		);

		// Turn off filter that excludes block nodes. They are needed here for the variation's inner block types.
		if ( ! is_admin() ) {
			remove_filter( 'wp_theme_json_get_style_nodes', 'wp_filter_out_block_nodes' );
		}

		// Temporarily prevent variation instance from being sanitized while processing theme.json.
		$styles_registry = WP_Block_Styles_Registry::get_instance();
		$styles_registry->register( $parsed_block['blockName'], array( 'name' => $variation_instance ) );

		$variation_theme_json = new JSON( $config, 'blocks' );
		$variation_styles     = $variation_theme_json->get_stylesheet(
			array( 'styles' ),
			array( 'custom' ),
			array(
				'include_block_style_variations' => true,
				'skip_root_layout_styles'        => true,
				'scope'                          => ".$class_name",
			)
		);

		// Clean up temporary block style now instance styles have been processed.
		$styles_registry->unregister( $parsed_block['blockName'], $variation_instance );

		// Restore filter that excludes block nodes.
		if ( ! is_admin() ) {
			add_filter( 'wp_theme_json_get_style_nodes', 'wp_filter_out_block_nodes' );
		}

		if ( empty( $variation_styles ) ) {
			return $parsed_block;
		}

		wp_register_style( 'block-style-variation-styles', false, array( 'wp-block-library', 'global-styles' ) );
		wp_add_inline_style( 'block-style-variation-styles', $variation_styles );

		/*
		* Add variation instance class name to block's className string so it can
		* be enforced in the block markup via render_block filter.
		*/
		_wp_array_set( $parsed_block, array( 'attrs', 'className' ), $updated_class_name );

		return $parsed_block;
	}
}
