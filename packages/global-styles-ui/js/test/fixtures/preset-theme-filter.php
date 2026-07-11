<?php
/**
 * Theme.json layer: one theme filter preset.
 */
add_filter('blockera_theme_json_data_theme', function ($theme_json) {
	$data = $theme_json;
	if (!isset($data['settings'])) {
		$data['settings'] = [];
	}
	if (!isset($data['settings']['blockera'])) {
		$data['settings']['blockera'] = [];
	}
	if (!isset($data['settings']['blockera']['blockeraFilter'])) {
		$data['settings']['blockera']['blockeraFilter'] = [];
	}
	$data['settings']['blockera']['blockeraFilter']['defaultPresets'] = true;
	$data['settings']['blockera']['blockeraFilter']['presets'][] = [
		'slug' => 'e-2-e-theme-filter',
		'name' => 'E2E Theme Filter',
		'items' => [
			[
				'type' => 'blur',
				'blur' => '2px',
			],
		],
	];
	return $data;
}, 10, PHP_INT_MAX);
