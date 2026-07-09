<?php
/**
 * Temporary mu-plugin to modify theme.json for line height tests (not found variable)
 * Binds core/paragraph to an unknown line-height preset slug.
 */
add_filter('blockera_theme_json_data_theme', function ($theme_json) {
	$data = $theme_json;

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
		'var:preset|line-height|unknown';

	return $data;
}, 10, PHP_INT_MAX);
