<?php
/**
 * Theme border preset with slash taxonomy name for E2E smoke tests.
 */
add_filter('blockera_theme_json_data_theme', function ($theme_json) {
	$data = $theme_json;
	if (!isset($data['settings'])) {
		$data['settings'] = [];
	}
	if (!isset($data['settings']['blockeraBorder'])) {
		$data['settings']['blockeraBorder'] = [];
	}
	$data['settings']['blockeraBorder']['presets'][] = [
		'slug'   => 'e-2-e-taxonomy-border',
		'name'   => 'E2E Group / Tiny',
		'border' => [
			'width' => '1px',
			'style' => 'solid',
			'color' => '#334455',
		],
	];
	return $data;
}, 10, PHP_INT_MAX);
