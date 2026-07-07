<?php
/**
 * Theme font size preset with slash taxonomy name for E2E smoke tests.
 */
add_filter('blockera_theme_json_data_theme', function ($theme_json) {
	$data = $theme_json;
	if (!isset($data['settings'])) {
		$data['settings'] = [];
	}
	if (!isset($data['settings']['typography'])) {
		$data['settings']['typography'] = [];
	}
	$data['settings']['typography']['defaultFontSizes'] = true;
	$data['settings']['typography']['fontSizes'][] = [
		'slug' => 'e-2-e-taxonomy-fs',
		'name' => 'E2E Group / Tiny',
		'size' => '14px',
	];
	return $data;
}, 10, PHP_INT_MAX);
