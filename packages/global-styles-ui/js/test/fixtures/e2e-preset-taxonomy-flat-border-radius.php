<?php
/**
 * Theme border radius preset with a flat name (no slash taxonomy) for flat → grouped E2E.
 */
add_filter('blockera_theme_json_data_theme', function ($theme_json) {
	$data = $theme_json;
	if (!isset($data['settings'])) {
		$data['settings'] = [];
	}
	if (!isset($data['settings']['border'])) {
		$data['settings']['border'] = [];
	}
	$data['settings']['border']['radiusSizes'][] = [
		'slug' => 'e-2-e-flat-radius',
		'name' => 'E2E Flat Radius',
		'size' => '6px',
	];
	return $data;
}, 10, PHP_INT_MAX);
