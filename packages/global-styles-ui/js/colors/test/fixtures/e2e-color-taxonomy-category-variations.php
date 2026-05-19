<?php
/**
 * E2E theme.json layer: taxonomy category + base preset with one persisted shade (slug *-shade-500).
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
	$data['settings']['color']['groups']         = [
		[
			'slug' => 'e-2-e-tax-var-ramp',
			'name' => 'E2E Tax Var Ramp Group',
		],
	];
	$data['settings']['color']['categories'] = [
		[
			'slug' => 'e-2-e-tax-var-ramp-cat',
			'name' => 'E2E Tax Var Ramp Category',
		],
	];
	$data['settings']['color']['palette'][] = [
		'slug'  => 'e-2-e-tax-cat-var-base',
		'name'  => 'E2E Tax Cat Var Base',
		'color' => '#556677',
		'meta'  => [
			'group'    => 'e-2-e-tax-var-ramp',
			'category' => 'e-2-e-tax-var-ramp-cat',
		],
	];
	$data['settings']['color']['palette'][] = [
		'slug'  => 'e-2-e-tax-cat-var-base-shade-500',
		'name'  => 'E2E Tax Cat Var Shade 500',
		'color' => '#445566',
		'meta'  => [
			'group'    => 'e-2-e-tax-var-ramp',
			'category' => 'e-2-e-tax-var-ramp-cat',
		],
	];
	return $data;
}, 10, PHP_INT_MAX);
