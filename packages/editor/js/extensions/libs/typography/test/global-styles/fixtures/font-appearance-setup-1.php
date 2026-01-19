<?php
/**
 * Temporary mu-plugin to modify theme.json for font appearance tests (weight and style)
 * This filter adds font weight and font style values for core/paragraph block using add_filter
 * Sets font appearance via typography.fontWeight and typography.fontStyle (WordPress theme.json schema for global styles)
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
	
	// Add font appearance configuration based on WordPress valid schema
	// Using typography.fontWeight and typography.fontStyle for font appearance values (global styles context)
	$data['styles']['blocks']['core/paragraph']['typography']['fontWeight'] = '600';
	$data['styles']['blocks']['core/paragraph']['typography']['fontStyle'] = 'italic';
	
	// Update the theme.json data
	return $data;
}, 10, PHP_INT_MAX);
