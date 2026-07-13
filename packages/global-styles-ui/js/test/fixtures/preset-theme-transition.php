<?php
/**
 * Theme.json layer: one theme transition preset.
 */
add_filter('blockera_theme_json_data_theme', function ($theme_json) {
	$data = $theme_json;
	if (!isset($data['settings'])) {
		$data['settings'] = [];
	}
	if (!isset($data['settings']['blockeraTransition'])) {
		$data['settings']['blockeraTransition'] = [];
	}
	$data['settings']['blockeraTransition']['defaultPresets'] = true;
	$data['settings']['blockeraTransition']['presets'][] = [
		'slug' => 'e-2-e-theme-trans',
		'name' => 'E2E Theme Transition',
		'items' => [
			[
				'type'     => 'all',
				'duration' => '300ms',
				'timing'   => 'ease',
				'delay'    => '0ms',
			],
		],
	];
	return $data;
}, 10, PHP_INT_MAX);
