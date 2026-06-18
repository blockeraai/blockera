<?php
/**
 * Theme linear gradient preset with slash taxonomy name for E2E smoke tests.
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
		'slug'     => 'e-2-e-taxonomy-lin-grad',
		'name'     => 'E2E Group / Tiny',
		'gradient' => 'linear-gradient(90deg, #111 0%, #eee 100%)',
	];
	return $data;
}, 10, PHP_INT_MAX);
