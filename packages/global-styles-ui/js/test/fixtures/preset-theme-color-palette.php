<?php
/**
 * Theme.json layer: one theme color preset (settings.color.palette.theme).
 */
add_filter('blockera_theme_json_data_theme', function ($theme_json) {
	$data = $theme_json;
	if (!isset($data['settings'])) {
		$data['settings'] = [];
	}
	if (!isset($data['settings']['color'])) {
		$data['settings']['color'] = [];
	}
	$data['settings']['color']['defaultPalette'] = true;
	$data['settings']['color']['palette'][] = [
		'slug'  => 'e-2-e-theme-ruby',
		'name'  => 'E2E Theme Ruby',
		'color' => '#aa1122',
	];
	return $data;
}, 10, PHP_INT_MAX);
