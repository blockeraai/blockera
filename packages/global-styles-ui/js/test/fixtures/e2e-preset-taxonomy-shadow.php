<?php
/**
 * Theme box shadow preset with slash taxonomy name for E2E smoke tests.
 */
add_filter('blockera_theme_json_data_theme', function ($theme_json) {
	$data = $theme_json;
	if (!isset($data['settings'])) {
		$data['settings'] = [];
	}
	if (!isset($data['settings']['shadow'])) {
		$data['settings']['shadow'] = [];
	}
	$data['settings']['shadow']['defaultPresets'] = true;
	$data['settings']['shadow']['presets'][] = [
		'slug'   => 'e-2-e-taxonomy-shadow',
		'name'   => 'E2E Group / Tiny',
		'shadow' => '2px 3px 4px rgba(0, 0, 0, 0.25)',
	];
	return $data;
}, 10, PHP_INT_MAX);
