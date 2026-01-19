<?php
/**
 * Temporary mu-plugin to modify theme.json for font size tests (variable value)
 * This filter adds variable font size value for core/paragraph block using add_filter
 * Sets font size via fontSize attribute (WordPress theme.json schema)
 */
add_filter('blockera_theme_json_data_theme', function($theme_json) {
	$data = $theme_json;
	
	// Ensure styles.blocks structure exists
	if (!isset($data['styles']['blocks'])) {
		$data['styles']['blocks'] = [];
	}
	
	// Ensure core/paragraph block exists
	if (!isset($data['styles']['blocks']['core/paragraph'])) {
		$data['styles']['blocks']['core/paragraph'] = [];
	}
	
	// Add font size configuration based on WordPress valid schema
	// Using fontSize attribute for preset font size values
	$data['styles']['blocks']['core/paragraph']['fontSize'] = 'large';
	
	// Update the theme.json data
	return $data;
}, 10, PHP_INT_MAX);
