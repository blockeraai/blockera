<?php
/**
 * Theme.json layer: one theme border radius size preset.
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
		'slug' => 'e-2-e-theme-radius',
		'name' => 'E2E Theme Radius',
		'size' => '11px',
	];
	return $data;
}, 10, PHP_INT_MAX);
