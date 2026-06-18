<?php
/**
 * E2E theme.json layer: category with one direct preset and a sub-category containing exactly one preset —
 * nested sub-category accordion should be omitted (single row inline under parent category accordion).
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
		'slug'  => 'e-2-e-tax-direct-flat',
		'name'  => 'E2E Tax Sub Flat Group/E2E Tax Parent Flat Cat/E2E Tax Direct Flat',
		'color' => '#111122',
	];
	$data['settings']['color']['palette'][] = [
		'slug'  => 'e-2-e-tax-sub-single-flat',
		'name'  => 'E2E Tax Sub Flat Group/E2E Tax Parent Flat Cat/E2E Tax Sub Flat Slot/E2E Tax Sub Single Flat',
		'color' => '#334455',
	];
	return $data;
}, 10, PHP_INT_MAX);
