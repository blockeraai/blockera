<?php
/**
 * E2E theme.json layer: category with two presets (name-based taxonomy; accordion default is closed).
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
		'slug'  => 'e-2-e-tax-init-open-a',
		'name'  => 'E2E Tax Init Open Group/E2E Tax Init Open Cat/E2E Tax Init Open A',
		'color' => '#aa1100',
	];
	$data['settings']['color']['palette'][] = [
		'slug'  => 'e-2-e-tax-init-open-b',
		'name'  => 'E2E Tax Init Open Group/E2E Tax Init Open Cat/E2E Tax Init Open B',
		'color' => '#00aa11',
	];
	return $data;
}, 10, PHP_INT_MAX);
