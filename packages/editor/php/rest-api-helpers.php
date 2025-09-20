<?php

use Blockera\Http\Routes;

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
			}
		}
	}
}

/**
 * Registers the global styles post type arguments.
 *
 * @param array $args The arguments for the global styles post type.
 * 
 * @return array The arguments for the global styles post type.
 */
function blockera_register_wp_global_styles_post_type_args( $args ): array {
	
	$args['rest_controller_class']   = '\Blockera\Editor\Http\Controllers\Theme\GlobalStylesController';
    $args['late_route_registration'] = true;
    $args['show_in_rest']            = true;
    $args['rest_base']               = 'global-styles';

    return $args;
}

/**
 * Registers the editor routes.
 *
 * @param Routes $routes The routes instance.
 * 
 * @return void
 */
function blockera_editor_register_routes( Routes $routes ): void {

	// Consolidated the WordPress, Activated Theme (theme.json), and User Global Styles data.
	$routes->get('theme-json', [ Blockera\Editor\Http\Controllers\Theme\JSONController::class, 'response' ]);
}

/**
 * Registers the block and site editor related hooks.
 *
 * @return void
 */
function blockera_editor_hooks(): void {
	
	add_filter('wp_theme_json_data_user', 'blockera_editor_wp_theme_json_data_user', 9e2);
	add_filter('wp_theme_json_data_theme', 'blockera_editor_wp_theme_json_data_theme', 9e2);
	add_filter('wp_theme_json_data_blocks', 'blockera_editor_wp_theme_json_data_blocks', 9e2);
}

/**
 * Filters the user data for the editor.
 *
 * @param WP_Theme_JSON_Data $data The data to filter.
 * 
 * @return array The filtered data.
 */
function blockera_editor_wp_theme_json_data_user( WP_Theme_JSON_Data $data) {

	Blockera\Editor\Http\Controllers\Theme\JSONResolver::clean_cached_data();
	Blockera\Editor\Http\Controllers\Theme\JSONResolver::$default_user_data = $data;

	return Blockera\Editor\Http\Controllers\Theme\JSONResolver::get_user_data();
}

/**
 * Filters the theme (theme.json) data for the editor.
 *
 * @param WP_Theme_JSON_Data $data the data to filter.
 * 
 * @return JSON|WP_Theme_JSON the filtered data.
 */
function blockera_editor_wp_theme_json_data_theme( WP_Theme_JSON_Data $data ) {

	Blockera\Editor\Http\Controllers\Theme\JSONResolver::clean_cached_data();
	Blockera\Editor\Http\Controllers\Theme\JSONResolver::$default_theme_data = $data;

	return Blockera\Editor\Http\Controllers\Theme\JSONResolver::get_theme_data();
}

/**
 * Filters the blocks data for the editor.
 *
 * @param WP_Theme_JSON_Data $data the data to filter.
 * 
 * @return JSON|WP_Theme_JSON the filtered data.
 */
function blockera_editor_wp_theme_json_data_blocks( WP_Theme_JSON_Data $data ) {

	Blockera\Editor\Http\Controllers\Theme\JSONResolver::clean_cached_data();
	Blockera\Editor\Http\Controllers\Theme\JSONResolver::$default_blocks_data = $data;

	return Blockera\Editor\Http\Controllers\Theme\JSONResolver::get_block_data();
}

/**
 * Get filtered the valid supports list for theme.json schema.
 *
 * @param array $default_supports The default valid supports list.
 * 
 * @return array the filtered the valid supports.
 */
function blockera_get_valid_supports( array $default_supports): array {

	$with_blockera_supports = $default_supports;

	foreach (blockera_get_supports() as $support) {
		
		$with_blockera_supports[ $support ] = [
			'value' => null,
		];
	}

	$with_blockera_supports['blockeraMetaData'] = [
		'name' => null,
		'label' => null,
	];

	return $with_blockera_supports;
}
