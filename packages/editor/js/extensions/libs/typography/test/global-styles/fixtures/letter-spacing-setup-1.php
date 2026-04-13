<?php
/**
 * Temporary mu-plugin to modify theme.json for letter spacing tests (simple value)
 * This filter adds simple letter spacing value for core/paragraph block using add_filter
 * Sets letter spacing via typography.letterSpacing (WordPress theme.json schema for global styles)
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
	
	// Ensure styles.blocks.core/paragraph.typography structure exists
	if (!isset($data['styles']['blocks']['core/paragraph']['typography'])) {
		$data['styles']['blocks']['core/paragraph']['typography'] = [];
	}
	
	// Add letter spacing configuration based on WordPress valid schema
	// Using typography.letterSpacing for simple letter spacing values (global styles context)
	$data['styles']['blocks']['core/paragraph']['typography']['letterSpacing'] = '2px';
	
	// Update the theme.json data
	return $data;
}, 10, PHP_INT_MAX);
