<?php
/**
 * Theme.json layer: one theme radial gradient preset.
 */
add_filter('blockera_theme_json_data_theme', function ($theme_json) {
	$data = $theme_json;
	if (!isset($data['settings'])) {
		$data['settings'] = [];
	}
	if (!isset($data['settings']['color'])) {
		$data['settings']['color'] = [];
	}
	$data['settings']['color']['defaultGradients'] = true;
	$data['settings']['color']['gradients'][] = [
		'slug'     => 'e-2-e-theme-rad-grad',
		'name'     => 'E2E Radial Theme',
		'gradient' => 'radial-gradient(circle at 30% 40%, rgb(200, 50, 50) 0%, rgb(20, 20, 120) 100%)',
	];
	return $data;
}, 10, PHP_INT_MAX);
