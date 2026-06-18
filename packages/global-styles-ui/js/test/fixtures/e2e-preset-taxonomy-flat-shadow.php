<?php
/**
 * Theme box shadow preset with a flat name (no slash taxonomy) for flat → grouped E2E.
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
		'slug'   => 'e-2-e-flat-shadow',
		'name'   => 'E2E Flat Shadow',
		'shadow' => '1px 2px 3px rgba(0, 0, 0, 0.2)',
	];
	return $data;
}, 10, PHP_INT_MAX);
