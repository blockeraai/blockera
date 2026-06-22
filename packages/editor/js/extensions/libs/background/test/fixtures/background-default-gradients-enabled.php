<?php
/**
 * Enables WordPress default gradient presets for background extension E2E tests.
 *
 * Twenty Twenty-Five `theme_blockera.json` sets `defaultGradients` to false, which
 * hides core presets such as `vivid-cyan-blue-to-vivid-purple` from the variable picker.
 */
add_filter('blockera_theme_json_data_theme', function ($theme_json) {
	$data = $theme_json;
	if (!isset($data['settings'])) {
		$data['settings'] = [];
	}
	if (!isset($data['settings']['color'])) {
		$data['settings']['color'] = [];
	}
	$data['settings']['color']['defaultGradients'] = true;
	return $data;
}, 10, PHP_INT_MAX);
