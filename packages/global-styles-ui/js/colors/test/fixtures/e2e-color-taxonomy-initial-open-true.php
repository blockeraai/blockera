<?php
/**
 * E2E theme.json layer: category declares initial-open true — accordion starts expanded (preset rows visible without expanding).
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
			'slug' => 'e-2-e-tax-init-open',
			'name' => 'E2E Tax Init Open Group',
		],
	];
	$data['settings']['color']['categories'] = [
		[
			'slug'          => 'e-2-e-tax-init-open-cat',
			'name'          => 'E2E Tax Init Open Cat',
			'initial-open'  => true,
		],
	];
	$data['settings']['color']['palette'][] = [
		'slug'  => 'e-2-e-tax-init-open-a',
		'name'  => 'E2E Tax Init Open A',
		'color' => '#aa1100',
		'meta'  => [
			'group'    => 'e-2-e-tax-init-open',
			'category' => 'e-2-e-tax-init-open-cat',
		],
	];
	$data['settings']['color']['palette'][] = [
		'slug'  => 'e-2-e-tax-init-open-b',
		'name'  => 'E2E Tax Init Open B',
		'color' => '#00aa11',
		'meta'  => [
			'group'    => 'e-2-e-tax-init-open',
			'category' => 'e-2-e-tax-init-open-cat',
		],
	];
	return $data;
}, 10, PHP_INT_MAX);
