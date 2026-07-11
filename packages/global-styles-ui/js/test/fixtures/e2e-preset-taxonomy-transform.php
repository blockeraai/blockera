<?php
/**
 * Theme transform preset with slash taxonomy name for E2E smoke tests.
 */
add_filter('blockera_theme_json_data_theme', function ($theme_json) {
	$data = $theme_json;
	if (!isset($data['settings'])) {
		$data['settings'] = [];
	}
	if (!isset($data['settings']['blockera']['blockeraTransform'])) {
		$data['settings']['blockera']['blockeraTransform'] = [];
	}
	$data['settings']['blockera']['blockeraTransform']['defaultPresets'] = true;
	$data['settings']['blockera']['blockeraTransform']['presets'][] = [
		'slug'  => 'e-2-e-taxonomy-transform',
		'name'  => 'E2E Group / Tiny',
		'items' => [
			[
				'type'   => 'move',
				'move-x' => '3px',
				'move-y' => '0px',
				'move-z' => '0px',
			],
		],
	];
	return $data;
}, 10, PHP_INT_MAX);
