<?php
/**
 * Theme.json layer: one theme spacing size preset.
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
		'slug' => 'e-2-e-theme-space',
		'name' => 'E2E Theme Space',
		'size' => '17px',
	];
	return $data;
}, 10, PHP_INT_MAX);
