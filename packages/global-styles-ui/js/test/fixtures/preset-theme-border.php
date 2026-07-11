<?php
/**
 * Theme.json layer: one theme border box preset.
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
		'slug'   => 'e-2-e-theme-border',
		'name'   => 'E2E Theme Border',
		'border' => [
			'width' => '2px',
			'style' => 'solid',
			'color' => '#112233',
		],
	];
	return $data;
}, 10, PHP_INT_MAX);
