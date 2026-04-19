<?php
/**
 * Theme.json layer: one theme box shadow preset.
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
		'slug'   => 'e-2-e-theme-shadow',
		'name'   => 'E2E Theme Shadow',
		'shadow' => '3px 4px 6px rgba(0, 0, 0, 0.35)',
	];
	return $data;
}, 10, PHP_INT_MAX);
