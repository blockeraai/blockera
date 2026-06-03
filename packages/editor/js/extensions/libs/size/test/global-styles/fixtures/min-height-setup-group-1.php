<?php
/**
 * Temporary mu-plugin to modify theme.json for min height tests (group block)
 * Sets min height via dimensions.minHeight (WordPress theme.json schema for global styles)
 */
add_filter('blockera_theme_json_data_theme', function($theme_json) {
	$data = $theme_json;

	if (!isset($data['styles']['blocks'])) {
		$data['styles']['blocks'] = [];
	}

	if (!isset($data['styles']['blocks']['core/group'])) {
		$data['styles']['blocks']['core/group'] = [];
	}

	if (!isset($data['styles']['blocks']['core/group']['dimensions'])) {
		$data['styles']['blocks']['core/group']['dimensions'] = [];
	}

	$data['styles']['blocks']['core/group']['dimensions']['minHeight'] = '300px';

	return $data;
}, 10, PHP_INT_MAX);
