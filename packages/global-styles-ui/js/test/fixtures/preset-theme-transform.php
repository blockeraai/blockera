<?php
/**
 * Theme.json layer: one theme transform preset.
 */
add_filter('blockera_theme_json_data_theme', function ($theme_json) {
	$data = $theme_json;
	if (!isset($data['settings'])) {
		$data['settings'] = [];
	}
	if (!isset($data['settings']['blockera'])) {
		$data['settings']['blockera'] = [];
	}
	if (!isset($data['settings']['blockera']['blockeraTransform'])) {
		$data['settings']['blockera']['blockeraTransform'] = [];
	}
	$data['settings']['blockera']['blockeraTransform']['defaultPresets'] = true;
	$data['settings']['blockera']['blockeraTransform']['presets'][] = [
		'slug' => 'e-2-e-theme-transform',
		'name' => 'E2E Theme Transform',
		'items' => [
			[
				'type'   => 'move',
				'move-x' => '5px',
				'move-y' => '0px',
				'move-z' => '0px',
			],
		],
	];
	return $data;
}, 10, PHP_INT_MAX);
