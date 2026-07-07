<?php
/**
 * Theme spacing preset with slash taxonomy name for E2E smoke tests.
 */
add_filter('blockera_theme_json_data_theme', function ($theme_json) {
	$data = $theme_json;
	if (!isset($data['settings'])) {
		$data['settings'] = [];
	}
	if (!isset($data['settings']['spacing'])) {
		$data['settings']['spacing'] = [];
	}
	$data['settings']['spacing']['defaultSpacingSizes'] = true;
	$data['settings']['spacing']['spacingSizes'][] = [
		'slug' => 'e-2-e-taxonomy-space',
		'name' => 'E2E Group / Tiny',
		'size' => '12px',
	];
	return $data;
}, 10, PHP_INT_MAX);
