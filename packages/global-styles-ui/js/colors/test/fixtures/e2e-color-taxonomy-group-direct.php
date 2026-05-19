<?php
/**
 * E2E theme.json layer: color taxonomy — presets under a group only (no categories).
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
			'slug' => 'e-2-e-tax-root',
			'name' => 'E2E Tax Root Group',
		],
	];
	$data['settings']['color']['categories'] = [];
	$data['settings']['color']['palette'][] = [
		'slug'  => 'e-2-e-tax-root-alpha',
		'name'  => 'E2E Tax Root Alpha',
		'color' => '#336699',
		'meta'  => [
			'group' => 'e-2-e-tax-root',
		],
	];
	return $data;
}, 10, PHP_INT_MAX);
