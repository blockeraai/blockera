<?php

use Blockera\Http\Routes;
use Blockera\Setup\Compatibility\JSON;
use Blockera\Setup\Compatibility\JSONData;
use Blockera\Setup\Compatibility\JSONResolver;

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

if ( ! function_exists( 'blockera_should_register_editor_theme_json_filters' ) ) {
	/**
	 * Whether Blockera must replace core wp_theme_json_data_* filters this request.
	 *
	 * Generic wp-admin screens (dashboard, plugins list, etc.) do not need Blockera
	 * theme.json sanitization; skipping filter registration avoids cold JSON merges there.
	 *
	 * @return bool
	 */
	function blockera_should_register_editor_theme_json_filters(): bool {
		$request_uri = isset( $_SERVER['REQUEST_URI'] ) ? wp_unslash( $_SERVER['REQUEST_URI'] ) : '';

		if ( preg_match( '/\/wp-admin\/(post|post-new|site-editor|widgets)\.php/i', $request_uri ) ) {
			return true;
		}

		if ( blockera_is_admin() ) {
			$page = isset( $_GET['page'] ) ? sanitize_key( wp_unslash( $_GET['page'] ) ) : '';
			if ( '' !== $page && str_starts_with( $page, 'blockera' ) ) {
				return true;
			}
		}

		if ( wp_is_json_request() && is_string( $request_uri ) ) {
			if (
				str_contains( $request_uri, '/wp/v2/global-styles' )
				|| str_contains( $request_uri, '/wp/v2/themes/' )
				|| preg_match( '#/(blockera|blockera-pro)/v\d+/#', $request_uri )
			) {
				return true;
			}
		}

		return false;
	}
}

if (! function_exists('blockera_editor_hooks')) {
	/**
     * Registers the block and site editor related hooks.
     *
     * @return void
     */
	function blockera_editor_hooks(): void {
		if ( ! blockera_is_admin_request( false ) && ! wp_is_json_request() ) {
			return;
		}

		if ( ! blockera_should_register_editor_theme_json_filters() ) {
			return;
		}

		add_filter('wp_theme_json_data_user', 'blockera_editor_wp_theme_json_data_user', 9e2);
		add_filter('wp_theme_json_data_theme', 'blockera_editor_wp_theme_json_data_theme', 9e2);
		add_filter('wp_theme_json_data_blocks', 'blockera_editor_wp_theme_json_data_blocks', 9e2);
	}
}

if ( ! function_exists( 'blockera_editor_theme_json_filter_cache_enabled' ) ) {
	/**
	 * Whether request-level theme.json filter caches may be used.
	 *
	 * @return bool
	 */
	function blockera_editor_theme_json_filter_cache_enabled(): bool {
		return ! ( defined( 'BLOCKERA_DEVELOPMENT' ) && BLOCKERA_DEVELOPMENT );
	}
}

if (! function_exists('blockera_editor_wp_theme_json_data_user')) {
	/**
     * Filters the user data for the editor.
     *
     * @param WP_Theme_JSON_Data $data The data to filter.
     * 
     * @return WP_Theme_JSON_Data The filtered data.
     */
	function blockera_editor_wp_theme_json_data_user( WP_Theme_JSON_Data $data) {
		static $cached = null;

		if ( null !== $cached && blockera_editor_theme_json_filter_cache_enabled() ) {
			return $cached;
		}

		$user_data = blockera_get_user_styles_data();

		// Skip if no user data is found.
		if ( empty( $user_data ) ) {
			$cached = $data;
			return $cached;
		}

		// Return JSONData so core uses get_theme_json() (no second sanitize via get_data()).
		$cached = new JSONData( $user_data, 'custom' );

		return $cached;
	}
}

if (! function_exists('blockera_editor_wp_theme_json_data_theme')) {
	/**
     * Filters the theme (theme.json) data for the editor.
     *
     * @param WP_Theme_JSON_Data $data the data to filter.
     * 
     * @return JSONData The filtered data.
     */
	function blockera_editor_wp_theme_json_data_theme( WP_Theme_JSON_Data $data ) {
		static $cached = null;

		if ( null !== $cached && blockera_editor_theme_json_filter_cache_enabled() ) {
			return $cached;
		}

		unset( $data );

		// Return JSONData wrapping the already-sanitized theme tree (no re-sanitize).
		$theme  = JSONResolver::get_theme_data();
		$cached = JSONData::from_json( $theme, 'theme' );

		return $cached;
	}
}

if (! function_exists('blockera_editor_wp_theme_json_data_blocks')) {
	/**
     * Filters the blocks data for the editor.
     *
     * @param WP_Theme_JSON_Data $data the data to filter.
     * 
     * @return JSONData The filtered data.
     */
	function blockera_editor_wp_theme_json_data_blocks( WP_Theme_JSON_Data $data ) {
		static $cached = null;

		if ( null !== $cached && blockera_editor_theme_json_filter_cache_enabled() ) {
			return $cached;
		}

		unset( $data );

		// Wrap Blockera blocks JSON so core does not re-sanitize via get_data() + WP_Theme_JSON.
		$blocks = JSONResolver::get_block_data();
		if ( ! $blocks instanceof JSON ) {
			$blocks = JSON::with_raw_data( $blocks->get_raw_data() );
		}
		$cached = JSONData::from_json( $blocks, 'blocks' );

		return $cached;
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
		return $cache[ $cache_key ];
	}
}
