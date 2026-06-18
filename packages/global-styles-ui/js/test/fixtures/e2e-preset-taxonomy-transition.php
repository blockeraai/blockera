<?php
/**
 * Theme transition preset with slash taxonomy name for E2E smoke tests.
 */
add_filter('blockera_theme_json_data_theme', function ($theme_json) {
	$data = $theme_json;
	if (!isset($data['settings'])) {
		$data['settings'] = [];
	}
	if (!isset($data['settings']['transition'])) {
		$data['settings']['transition'] = [];
	}
	$data['settings']['transition']['defaultPresets'] = true;
	$data['settings']['transition']['presets'][] = [
		'slug'  => 'e-2-e-taxonomy-transition',
		'name'  => 'E2E Group / Tiny',
		'items' => [
			[
				'type'     => 'all',
				'duration' => '200ms',
				'timing'   => 'ease',
				'delay'    => '0ms',
			],
		],
	];
	return $data;
}, 10, PHP_INT_MAX);
