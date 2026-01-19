<?php
/**
 * Temporary mu-plugin to modify theme.json for width tests (simple value)
 * This filter adds simple width value for core/column block using add_filter
 * Sets width via dimensions.width (WordPress theme.json schema for global styles)
 */
add_filter('blockera_theme_json_data_theme', function($theme_json) {
	$data = $theme_json;
	
	// Ensure styles.blocks structure exists
	if (!isset($data['styles']['blocks'])) {
		$data['styles']['blocks'] = [];
	}
	
	// Ensure core/column block exists
	if (!isset($data['styles']['blocks']['core/column'])) {
		$data['styles']['blocks']['core/column'] = [];
	}
	
	// Ensure styles.blocks.core/column.dimensions structure exists
	if (!isset($data['styles']['blocks']['core/column']['dimensions'])) {
		$data['styles']['blocks']['core/column']['dimensions'] = [];
	}
	
	// Add width configuration based on WordPress valid schema
	// Using dimensions.width for simple width values (global styles context)
	$data['styles']['blocks']['core/column']['dimensions']['width'] = '50%';
	
	// Update the theme.json data
	return $data;
}, 10, PHP_INT_MAX);
