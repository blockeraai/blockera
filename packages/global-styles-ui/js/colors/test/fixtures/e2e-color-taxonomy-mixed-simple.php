<?php
/**
 * E2E theme.json layer: taxonomy presets plus a plain palette row (no meta) in Theme repeater.
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
	$data['settings']['color']['groups'] = [
		[
			'slug' => 'e-2-e-tax-mix',
			'name' => 'E2E Tax Mixed Group',
		],
	];
	$data['settings']['color']['categories'] = [
		[
			'slug' => 'e-2-e-tax-mix-cat',
			'name' => 'E2E Tax Mixed Category',
		],
	];
	$data['settings']['color']['palette'][] = [
		'slug'  => 'e-2-e-tax-mix-leaf',
		'name'  => 'E2E Tax Mixed Leaf',
		'color' => '#654321',
		'meta'  => [
			'group'    => 'e-2-e-tax-mix',
			'category' => 'e-2-e-tax-mix-cat',
		],
	];
	$data['settings']['color']['palette'][] = [
		'slug'  => 'e-2-e-tax-simple-only',
		'name'  => 'E2E Tax Simple Only',
		'color' => '#fedcba',
	];
	return $data;
}, 10, PHP_INT_MAX);
