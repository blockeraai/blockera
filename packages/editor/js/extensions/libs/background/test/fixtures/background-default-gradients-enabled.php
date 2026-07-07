<?php
/**
 * Enables WordPress default gradient presets for background extension E2E tests.
 *
 * Twenty Twenty-Five theme.json sets `defaultGradients` to false, which hides core
 * presets such as `vivid-cyan-blue-to-vivid-purple` from the variable picker.
 *
 * The block editor variable picker loads base global styles over REST, so we must
 * filter `wp_theme_json_data_theme` (core resolver). Blockera's JSON resolver path
 * uses `blockera_theme_json_data_theme` separately.
 */
$blockera_test_enable_default_gradients = static function ( array $data ): array {
	if ( ! isset( $data['settings'] ) ) {
		$data['settings'] = [];
	}
	if ( ! isset( $data['settings']['color'] ) ) {
		$data['settings']['color'] = [];
	}
	$data['settings']['color']['defaultGradients'] = true;
	return $data;
};

add_filter(
	'blockera_theme_json_data_theme',
	static function ( $theme_json ) use ( $blockera_test_enable_default_gradients ) {
		return $blockera_test_enable_default_gradients( $theme_json );
	},
	10,
	PHP_INT_MAX
);

add_filter(
	'wp_theme_json_data_theme',
	static function ( $theme_json ) use ( $blockera_test_enable_default_gradients ) {
		$data = $theme_json->get_data();
		$data = $blockera_test_enable_default_gradients( $data );
		return new WP_Theme_JSON_Data( $data, 'theme' );
	},
	10,
	PHP_INT_MAX
);
