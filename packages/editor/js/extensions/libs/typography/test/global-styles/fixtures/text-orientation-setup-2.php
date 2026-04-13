<?php
/**
 * Temporary mu-plugin to modify theme.json for text orientation tests (vertical value)
 * This filter adds vertical writing mode value for core/paragraph block using add_filter
 * Sets writing mode via typography.writingMode (WordPress theme.json schema for global styles)
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
	
	// Add text orientation configuration based on WordPress valid schema
	// Using typography.writingMode for writing mode values (global styles context)
	// vertical-rl maps to 'style-1' in Blockera
	$data['styles']['blocks']['core/paragraph']['typography']['writingMode'] = 'vertical-rl';
	
	// Update the theme.json data
	return $data;
}, 10, PHP_INT_MAX);
