<?php
/**
 * Theme.json layer: one theme font size preset.
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
		'slug' => 'e-2-e-theme-fs',
		'name' => 'E2E Theme Font Size',
		'size' => '19px',
	];
	return $data;
}, 10, PHP_INT_MAX);
