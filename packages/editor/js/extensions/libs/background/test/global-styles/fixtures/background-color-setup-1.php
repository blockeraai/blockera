<?php
/**
 * Temporary mu-plugin to modify theme.json for background color tests
 * This filter adds simple background color value for core/paragraph block using add_filter
 * Sets background color via style.color.background (WordPress theme.json schema)
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
	
	// Ensure styles.blocks.core/paragraph.color structure exists
	if (!isset($data['styles']['blocks']['core/paragraph']['color'])) {
		$data['styles']['blocks']['core/paragraph']['color'] = [];
	}
	
	// Add background color configuration based on WordPress valid schema
	// Using style.color.background for simple color values
	$data['styles']['blocks']['core/paragraph']['color']['background'] = '#ffdfdf';
	
	// Update the theme.json data
	return $data;
}, 10, PHP_INT_MAX);
