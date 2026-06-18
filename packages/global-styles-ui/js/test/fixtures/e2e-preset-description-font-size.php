<?php
/**
 * E2E theme.json layer: font size preset with meta.description for description-field tests.
 */
add_filter('blockera_theme_json_data_theme', function ($theme_json) {
	$data = $theme_json;
	if (!isset($data['settings'])) {
		$data['settings'] = [];
	}
	if (!isset($data['settings']['typography'])) {
		$data['settings']['typography'] = [];
	}
	$data['settings']['typography']['defaultFontSizes'] = true;
	$data['settings']['typography']['fontSizes'][] = [
		'slug' => 'e-2-e-desc-fs',
		'name' => 'E2E Desc Font Size',
		'size' => '19px',
		'meta' => [
			'description' => 'Initial E2E font size description from theme fixture.',
		],
	];
	return $data;
}, 10, PHP_INT_MAX);
