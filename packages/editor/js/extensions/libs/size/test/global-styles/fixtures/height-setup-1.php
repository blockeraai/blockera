<?php
/**
 * Temporary mu-plugin to modify theme.json for height tests (simple value)
 * This filter adds simple height value for core/image block using add_filter
 * Sets height via dimensions.height (WordPress theme.json schema for global styles)
 */
add_filter('blockera_theme_json_data_theme', function($theme_json) {
	$data = $theme_json;
	
	// Ensure styles.blocks structure exists
	if (!isset($data['styles']['blocks'])) {
		$data['styles']['blocks'] = [];
	}
	
	// Ensure core/image block exists
	if (!isset($data['styles']['blocks']['core/image'])) {
		$data['styles']['blocks']['core/image'] = [];
	}
	
	// Ensure styles.blocks.core/image.dimensions structure exists
	if (!isset($data['styles']['blocks']['core/image']['dimensions'])) {
		$data['styles']['blocks']['core/image']['dimensions'] = [];
	}
	
	// Add height configuration based on WordPress valid schema
	// Using dimensions.height for simple height values (global styles context)
	$data['styles']['blocks']['core/image']['dimensions']['height'] = '400px';
	
	// Update the theme.json data
	return $data;
}, 10, PHP_INT_MAX);
