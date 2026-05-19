<?php
/**
 * E2E theme.json layer: nested sub-category with two presets and initial-open true on the sub-category declaration —
 * after expanding the parent category, both nested rows are visible without expanding the sub accordion.
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
			'slug' => 'e-2-e-tax-sub-io-root',
			'name' => 'E2E Tax Sub IO Root Group',
		],
	];
	$data['settings']['color']['categories'] = [
		[
			'slug' => 'e-2-e-tax-sub-io-parent',
			'name' => 'E2E Tax Sub IO Parent Cat',
		],
		[
			'slug'         => 'e-2-e-tax-sub-io-slot',
			'name'         => 'E2E Tax Sub IO Slot',
			'initial-open' => true,
		],
	];
	$data['settings']['color']['palette'][] = [
		'slug'  => 'e-2-e-tax-sub-io-a',
		'name'  => 'E2E Tax Sub IO A',
		'color' => '#556677',
		'meta'  => [
			'group'        => 'e-2-e-tax-sub-io-root',
			'category'     => 'e-2-e-tax-sub-io-parent',
			'sub-category' => 'e-2-e-tax-sub-io-slot',
		],
	];
	$data['settings']['color']['palette'][] = [
		'slug'  => 'e-2-e-tax-sub-io-b',
		'name'  => 'E2E Tax Sub IO B',
		'color' => '#8899aa',
		'meta'  => [
			'group'        => 'e-2-e-tax-sub-io-root',
			'category'     => 'e-2-e-tax-sub-io-parent',
			'sub-category' => 'e-2-e-tax-sub-io-slot',
		],
	];
	return $data;
}, 10, PHP_INT_MAX);
