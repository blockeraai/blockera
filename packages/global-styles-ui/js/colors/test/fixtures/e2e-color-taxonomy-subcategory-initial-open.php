<?php
/**
 * E2E theme.json layer: nested sub-category with two presets (name-based taxonomy).
 */
add_filter('blockera_theme_json_data_theme', function ($theme_json) {
	$data = $theme_json;
	if (!isset($data['settings'])) {
		$data['settings'] = [];
	}
	if (!isset($data['settings']['color'])) {
		$data['settings']['color'] = [];
	}
	$data['settings']['color']['defaultPalette'] = true;
	$data['settings']['color']['palette'][] = [
		'slug'  => 'e-2-e-tax-sub-io-a',
		'name'  => 'E2E Tax Sub IO Root Group/E2E Tax Sub IO Parent Cat/E2E Tax Sub IO Slot/E2E Tax Sub IO A',
		'color' => '#556677',
	];
	$data['settings']['color']['palette'][] = [
		'slug'  => 'e-2-e-tax-sub-io-b',
		'name'  => 'E2E Tax Sub IO Root Group/E2E Tax Sub IO Parent Cat/E2E Tax Sub IO Slot/E2E Tax Sub IO B',
		'color' => '#8899aa',
	];
	return $data;
}, 10, PHP_INT_MAX);
