<?php
/**
 * E2E theme.json layer: source + target color presets for variable-as-value linking.
 *
 * Target starts as a plain hex; the test binds it to the source variable and asserts
 * palette storage / generated CSS keep a live `var(--wp--preset--color--…)` without
 * a Blockera `,slug` composite suffix.
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
		'slug'  => 'e-2-e-var-link-source',
		'name'  => 'E2E Var Link Source',
		'color' => '#1D86EF',
	];
	$data['settings']['color']['palette'][] = [
		'slug'  => 'e-2-e-var-link-target',
		'name'  => 'E2E Var Link Target',
		'color' => '#FFFFFF',
	];
	return $data;
}, 10, PHP_INT_MAX);
