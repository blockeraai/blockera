<?php
/**
 * Theme.json layer: one theme linear gradient preset.
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
		'slug'     => 'e-2-e-theme-lin-grad',
		'name'     => 'E2E Linear Theme',
		'gradient' => 'linear-gradient(135deg, rgb(170, 17, 34) 0%, rgb(0, 80, 200) 100%)',
	];
	return $data;
}, 10, PHP_INT_MAX);
