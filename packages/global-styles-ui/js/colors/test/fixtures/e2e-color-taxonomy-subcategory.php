<?php
/**
 * E2E theme.json layer: group + category + nested sub-category accordion rows.
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
		'slug'  => 'e-2-e-tax-parent-direct',
		'name'  => 'E2E Tax Sub Root Group/E2E Tax Parent Category/E2E Tax Parent Direct',
		'color' => '#112233',
	];
	$data['settings']['color']['palette'][] = [
		'slug'  => 'e-2-e-tax-sub-nested',
		'name'  => 'E2E Tax Sub Root Group/E2E Tax Parent Category/E2E Tax Sub Slot/E2E Tax Sub Nested',
		'color' => '#445566',
	];
	return $data;
}, 10, PHP_INT_MAX);
