<?php
/**
 * Temporary mu-plugin to modify theme.json for line height tests (variable value)
 * Registers theme line height presets and binds core/paragraph to the relaxed preset.
 */
add_filter('blockera_theme_json_data_theme', function ($theme_json) {
	$data = $theme_json;

	if (!isset($data['settings'])) {
		$data['settings'] = [];
	}
	if (!isset($data['settings']['typography'])) {
		$data['settings']['typography'] = [];
	}
	if (!isset($data['settings']['typography']['blockeraLineHeights'])) {
		$data['settings']['typography']['blockeraLineHeights'] = [];
	}

	$data['settings']['typography']['blockeraLineHeights'][] = [
		'slug' => 'relaxed',
		'name' => 'Relaxed',
		'size' => '1.6',
	];
	$data['settings']['typography']['blockeraLineHeights'][] = [
		'slug' => 'tight',
		'name' => 'Tight',
		'size' => '1.2',
	];

	if (!isset($data['styles']['blocks'])) {
		$data['styles']['blocks'] = [];
	}
	if (!isset($data['styles']['blocks']['core/paragraph'])) {
		$data['styles']['blocks']['core/paragraph'] = [];
	}
	if (!isset($data['styles']['blocks']['core/paragraph']['typography'])) {
		$data['styles']['blocks']['core/paragraph']['typography'] = [];
	}

	$data['styles']['blocks']['core/paragraph']['typography']['lineHeight'] =
		'var:preset|line-height|relaxed';

	return $data;
}, 10, PHP_INT_MAX);
