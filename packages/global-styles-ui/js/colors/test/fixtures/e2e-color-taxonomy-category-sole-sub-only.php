<?php
/**
 * E2E theme.json layer: one taxonomy category whose only preset lives under a sub-category slug —
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
	$data['settings']['color']['groups'] = [
		[
			'slug' => 'e-2-e-tax-sole-flat',
			'name' => 'E2E Tax Sole Flat Group',
		],
	];
	$data['settings']['color']['categories'] = [
		[
			'slug' => 'e-2-e-tax-sole-parent',
			'name' => 'E2E Tax Sole Parent Cat',
		],
		[
			'slug' => 'e-2-e-tax-sole-sub',
			'name' => 'E2E Tax Sole Sub Slot',
		],
	];
	$data['settings']['color']['palette'][] = [
		'slug'  => 'e-2-e-tax-sole-sub-only',
		'name'  => 'E2E Tax Sole Sub Only',
		'color' => '#abcabc',
		'meta'  => [
			'group'        => 'e-2-e-tax-sole-flat',
			'category'     => 'e-2-e-tax-sole-parent',
			'sub-category' => 'e-2-e-tax-sole-sub',
		],
	];
	return $data;
}, 10, PHP_INT_MAX);
