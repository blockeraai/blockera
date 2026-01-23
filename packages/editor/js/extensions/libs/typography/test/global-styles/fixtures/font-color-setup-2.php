<?php
/**
 * Temporary mu-plugin to modify theme.json for font color tests (variable value)
 * This filter adds variable font color value for core/paragraph block using add_filter
 * Sets font color via textColor attribute (WordPress theme.json schema)
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
	
	// Add font color configuration based on WordPress valid schema
	// Using color.text attribute for preset color values
	$data['styles']['blocks']['core/paragraph']['color']['text'] = 'var:preset|color|accent-3';
	
	// Update the theme.json data
	return $data;
}, 10, PHP_INT_MAX);
