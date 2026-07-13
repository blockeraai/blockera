<?php
/**
 * Theme filter preset with slash taxonomy name for E2E smoke tests.
 */
add_filter('blockera_theme_json_data_theme', function ($theme_json) {
	$data = $theme_json;
	if (!isset($data['settings'])) {
		$data['settings'] = [];
	}
	if (!isset($data['settings']['blockeraFilter'])) {
		$data['settings']['blockeraFilter'] = [];
	}
	$data['settings']['blockeraFilter']['defaultPresets'] = true;
	$data['settings']['blockeraFilter']['presets'][] = [
		'slug'  => 'e-2-e-taxonomy-filter',
		'name'  => 'E2E Group / Tiny',
		'items' => [
			[
				'type' => 'blur',
				'blur' => '1px',
			],
		],
	];
	return $data;
}, 10, PHP_INT_MAX);
