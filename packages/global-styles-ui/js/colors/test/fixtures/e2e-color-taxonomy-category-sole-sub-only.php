<?php
/**
 * E2E theme.json layer: one taxonomy category whose only preset lives under a sub-category —
 * UI should flatten to a single row (no category accordion).
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
		'slug'  => 'e-2-e-tax-sole-sub-only',
		'name'  => 'E2E Tax Sole Flat Group/E2E Tax Sole Parent Cat/E2E Tax Sole Sub Slot/E2E Tax Sole Sub Only',
		'color' => '#abcabc',
	];
	return $data;
}, 10, PHP_INT_MAX);
