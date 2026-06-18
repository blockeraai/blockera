<?php
/**
 * E2E theme.json layer: taxonomy group + category accordion + interface-size small row.
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
		'slug'  => 'e-2-e-tax-crimson',
		'name'  => 'E2E Tax Brand Group/E2E Tax Text Category/E2E Tax Crimson',
		'color' => '#cc0033',
	];
	$data['settings']['color']['palette'][] = [
		'slug'  => 'e-2-e-tax-small-slot',
		'name'  => 'E2E Tax Brand Group/E2E Tax Text Category/E2E Tax Small Slot',
		'color' => '#99aa88',
		'meta'  => [
			'interface-size' => 'small',
		],
	];
	return $data;
}, 10, PHP_INT_MAX);
