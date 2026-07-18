<?php

use Blockera\Http\Routes;
use Blockera\Setup\Compatibility\JSON;

if (! function_exists('blockera_register_wp_global_styles_post_type_args')) {
	/**
     * Registers the global styles post type arguments.
     *
     * @param array $args The arguments for the global styles post type.
     * 
     * @return array The arguments for the global styles post type.
     */
	function blockera_register_wp_global_styles_post_type_args( $args ): array {

		$args['rest_controller_class'] = '\Blockera\Setup\Http\Controllers\Theme\GlobalStylesController';

		return $args;
	}
}

if (! function_exists('blockera_editor_register_routes')) {
	/**
     * Registers the editor routes.
     *
     * @param Routes $routes The routes instance.
     * 
     * @return void
     */
	function blockera_editor_register_routes( Routes $routes ): void {

		// Consolidated the WordPress, Activated Theme (theme.json), and User Global Styles data.
		$routes->get('theme-json', [ Blockera\Setup\Compatibility\JSONController::class, 'response' ]);
	}
}

if (! function_exists('blockera_editor_hooks')) {
	/**
     * Registers the block and site editor related hooks.
     *
     * @return void
     */
	function blockera_editor_hooks(): void {
		// Skip if not an admin request. because we need to below filters only in admin requests.
		if (! blockera_is_admin_request(false)) {
			return;
		}
	
		add_filter('wp_theme_json_data_user', 'blockera_editor_wp_theme_json_data_user', 9e2);
		add_filter('wp_theme_json_data_theme', 'blockera_editor_wp_theme_json_data_theme', 9e2);
		add_filter('wp_theme_json_data_blocks', 'blockera_editor_wp_theme_json_data_blocks', 9e2);
	}
}

if (! function_exists('blockera_editor_wp_theme_json_data_user')) {
	/**
     * Filters the user data for the editor.
     *
     * @param WP_Theme_JSON_Data $data The data to filter.
     * 
     * @return array The filtered data.
     */
	function blockera_editor_wp_theme_json_data_user( WP_Theme_JSON_Data $data) {
		static $cache = array();

		$encoded   = wp_json_encode( $data->get_data() );
		$cache_key = is_string( $encoded ) ? md5( $encoded ) : md5( '' );

		if (
			isset( $cache[ $cache_key ] )
			&& ! ( defined( 'BLOCKERA_DEVELOPMENT' ) && BLOCKERA_DEVELOPMENT )
		) {
			return $cache[ $cache_key ];
		}

		$user_data = blockera_get_user_styles_data();

		// Skip if no user data is found.
		if (empty($user_data)) {
			$cache[ $cache_key ] = $data;
			return $cache[ $cache_key ];
		}

		$cache[ $cache_key ] = new JSON($user_data, 'custom');

		return $cache[ $cache_key ];
	}
}

if (! function_exists('blockera_editor_wp_theme_json_data_theme')) {
	/**
     * Filters the theme (theme.json) data for the editor.
     *
     * @param WP_Theme_JSON_Data $data the data to filter.
     * 
     * @return JSON|WP_Theme_JSON the filtered data.
     */
	function blockera_editor_wp_theme_json_data_theme( WP_Theme_JSON_Data $data ) {
		static $cache = array();

		$encoded   = wp_json_encode( $data->get_data() );
		$cache_key = is_string( $encoded ) ? md5( $encoded ) : md5( '' );

		if (
			isset( $cache[ $cache_key ] )
			&& ! ( defined( 'BLOCKERA_DEVELOPMENT' ) && BLOCKERA_DEVELOPMENT )
		) {
			return $cache[ $cache_key ];
		}

		Blockera\Setup\Compatibility\JSONResolver::clean_cached_data();
		Blockera\Setup\Compatibility\JSONResolver::$default_theme_data = $data;

		// Return JSONData (extends WP_Theme_JSON_Data) so core keeps Blockera's JSON instance
		// instead of re-wrapping get_data() in core WP_Theme_JSON (which strips Blockera presets).
		$theme = Blockera\Setup\Compatibility\JSONResolver::get_theme_data();

		$cache[ $cache_key ] = new Blockera\Setup\Compatibility\JSONData( $theme->get_raw_data(), 'theme' );

		return $cache[ $cache_key ];
	}
}

if (! function_exists('blockera_editor_wp_theme_json_data_blocks')) {
	/**
     * Filters the blocks data for the editor.
     *
     * @param WP_Theme_JSON_Data $data the data to filter.
     * 
     * @return JSON|WP_Theme_JSON the filtered data.
     */
	function blockera_editor_wp_theme_json_data_blocks( WP_Theme_JSON_Data $data ) {
		static $cache = array();

		$encoded   = wp_json_encode( $data->get_data() );
		$cache_key = is_string( $encoded ) ? md5( $encoded ) : md5( '' );

		if (
			isset( $cache[ $cache_key ] )
			&& ! ( defined( 'BLOCKERA_DEVELOPMENT' ) && BLOCKERA_DEVELOPMENT )
		) {
			return $cache[ $cache_key ];
		}

		Blockera\Setup\Compatibility\JSONResolver::clean_cached_data();
		Blockera\Setup\Compatibility\JSONResolver::$default_blocks_data = $data;

		$cache[ $cache_key ] = Blockera\Setup\Compatibility\JSONResolver::get_block_data();

		return $cache[ $cache_key ];
	}
}

if (! function_exists('blockera_get_block_style_variation_metadata_style_keys')) {
	/**
	 * Keys merged into {@see blockera_get_valid_supports()} as scalar style leaves (schema value `null`).
	 * Excluded from CSS generation for variation nodes; kept in sync with the foreach in that function.
	 *
	 * @return list<string>
	 */
	function blockera_get_block_style_variation_metadata_style_keys(): array {
		return array(
			'blockeraVariationType',
			'blockeraIsDefaultVariation',
		);
	}
}

if (! function_exists('blockera_get_block_styles_metadata_keys')) {
	/**
	 * Block-level metadata keys under `styles.blocks.{block}` (not CSS).
	 * Excluded from CSS generation for block root nodes.
	 *
	 * @return list<string>
	 */
	function blockera_get_block_styles_metadata_keys(): array {
		return array(
			'blockeraSizeVariationsOrder',
		);
	}
}

if (! function_exists('blockera_get_valid_supports')) {
	/**
     * Get filtered the valid supports list for theme.json schema.
     *
     * @param array $default_supports The default valid supports list.
     * 
     * @return array the filtered the valid supports.
     */
	function blockera_get_valid_supports( array $default_supports): array {
		static $cache = [];
		
		// Generate cache key from serialized input array.
		// Since $default_supports is typically static, this will cache effectively.
		$cache_key = md5(serialize($default_supports));
		
		if (isset($cache[ $cache_key ])) {
			return $cache[ $cache_key ];
		}

		$with_blockera_supports = $default_supports;

		foreach (blockera_get_supports() as $support) {
		
			$with_blockera_supports[ $support ] = [
				'value' => null,
			];
		}

		$with_blockera_supports['blockeraMetaData'] = [
			'name' => null,
			'label' => null,
			'blocks' => null,
		];

		foreach ( blockera_get_block_style_variation_metadata_style_keys() as $blockera_variation_style_key ) {
			$with_blockera_supports[ $blockera_variation_style_key ] = null;
		}

		foreach ( blockera_get_block_styles_metadata_keys() as $blockera_block_style_key ) {
			$with_blockera_supports[ $blockera_block_style_key ] = null;
		}

		$cache[ $cache_key ] = $with_blockera_supports;
		return $with_blockera_supports;
	}
}
