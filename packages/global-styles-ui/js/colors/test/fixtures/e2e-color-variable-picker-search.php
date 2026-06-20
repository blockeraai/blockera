<?php
/**
 * E2E theme.json layer: deterministic color presets for variable-picker search tests.
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
		'slug'  => 'e-2-e-search-on-brand',
		'name'  => 'Base / Primary / On Brand',
		'color' => '#aabbcc',
	];
	$data['settings']['color']['palette'][] = [
		'slug'  => 'e-2-e-search-accent',
		'name'  => 'Accent / Secondary Tone',
		'color' => '#112233',
	];
	$data['settings']['color']['palette'][] = [
		'slug'  => 'e-2-e-search-neutral',
		'name'  => 'Neutral Surface',
		'color' => '#445566',
	];
	return $data;
}, 10, PHP_INT_MAX);
