<?php
/**
 * E2E theme.json layer: base + shade rows for variation UI (flat repeater, no name-based taxonomy).
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
		'slug'  => 'e-2-e-var-base',
		'name'  => 'E2E Var Shade Base',
		'color' => '#884422',
	];
	$data['settings']['color']['palette'][] = [
		'slug'  => 'e-2-e-var-base-shade-500',
		'name'  => 'E2E Var Shade Base 500',
		'color' => '#773311',
	];
	return $data;
}, 10, PHP_INT_MAX);
