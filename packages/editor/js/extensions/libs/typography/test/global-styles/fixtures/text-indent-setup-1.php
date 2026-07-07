<?php
/**
 * Temporary mu-plugin to modify theme.json for text indent tests (simple value)
 * This filter adds simple text indent value for core/paragraph block using add_filter
 * Sets text indent via typography.textIndent (WordPress theme.json schema for global styles)
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
	
	// Add text indent configuration based on WordPress valid schema
	// Using typography.textIndent for simple text indent values (global styles context)
	$data['styles']['blocks']['core/paragraph']['typography']['textIndent'] = '2px';
	
	// Update the theme.json data
	return $data;
}, 10, PHP_INT_MAX);
