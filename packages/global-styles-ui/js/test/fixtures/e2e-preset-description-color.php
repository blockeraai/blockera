<?php
/**
 * E2E theme.json layer: color presets with meta.description for description-field tests.
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
	$data['settings']['color']['palette'][] = [
		'slug'  => 'e-2-e-desc-ruby',
		'name'  => 'E2E Desc Ruby',
		'color' => '#aa1122',
		'meta'  => [
			'description' => 'Initial E2E color description from theme fixture.',
		],
	];
	$data['settings']['color']['palette'][] = [
		'slug'  => 'e-2-e-desc-small-slot',
		'name'  => 'E2E Desc Small Slot',
		'color' => '#99aa88',
		'meta'  => [
			'description'    => 'E2E color with interface-size meta merge test.',
			'interface-size' => 'small',
		],
	];
	return $data;
}, 10, PHP_INT_MAX);
