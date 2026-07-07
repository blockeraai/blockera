<?php
/**
 * Theme text shadow preset with slash taxonomy name for E2E smoke tests.
 */
add_filter('blockera_theme_json_data_theme', function ($theme_json) {
	$data = $theme_json;
	if (!isset($data['settings'])) {
		$data['settings'] = [];
	}
	if (!isset($data['settings']['textShadow'])) {
		$data['settings']['textShadow'] = [];
	}
	$data['settings']['textShadow']['defaultPresets'] = true;
	$data['settings']['textShadow']['presets'][] = [
		'slug'       => 'e-2-e-taxonomy-text-shadow',
		'name'       => 'E2E Group / Tiny',
		'textShadow' => '1px 1px 2px rgba(0, 0, 0, 0.4)',
	];
	return $data;
}, 10, PHP_INT_MAX);
