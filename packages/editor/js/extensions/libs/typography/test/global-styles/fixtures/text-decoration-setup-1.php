<?php
/**
 * Temporary mu-plugin to modify theme.json for text decoration tests (simple value)
 * This filter adds simple text decoration value for core/paragraph block using add_filter
 * Sets text decoration via typography.textDecoration (WordPress theme.json schema for global styles)
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
	
	// Add text decoration configuration based on WordPress valid schema
	// Using typography.textDecoration for simple text decoration values (global styles context)
	$data['styles']['blocks']['core/paragraph']['typography']['textDecoration'] = 'underline';
	
	// Update the theme.json data
	return $data;
}, 10, PHP_INT_MAX);
