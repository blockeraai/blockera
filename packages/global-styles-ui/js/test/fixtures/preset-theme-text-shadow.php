<?php
/**
 * Theme.json layer: one theme text shadow preset.
 */
add_filter('blockera_theme_json_data_theme', function ($theme_json) {
	$data = $theme_json;
	if (!isset($data['settings'])) {
		$data['settings'] = [];
	}
	if (!isset($data['settings']['blockeraTextShadow'])) {
		$data['settings']['blockeraTextShadow'] = [];
	}
	$data['settings']['blockeraTextShadow']['defaultPresets'] = true;
	$data['settings']['blockeraTextShadow']['presets'][] = [
		'slug'   => 'e-2-e-theme-tshadow',
		'name'   => 'E2E Theme Text Shadow',
		'shadow' => '1px 2px 3px rgba(0, 0, 0, 0.45)',
	];
	return $data;
}, 10, PHP_INT_MAX);
