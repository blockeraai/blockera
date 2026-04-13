<?php
/**
 * Temporary mu-plugin to modify theme.json for aspect ratio tests (simple value)
 * This filter adds simple aspect ratio value for core/cover block using add_filter
 * Sets aspect ratio via dimensions.aspectRatio (WordPress theme.json schema for global styles)
 */
add_filter('blockera_theme_json_data_theme', function($theme_json) {
	$data = $theme_json;
	
	// Ensure styles.blocks structure exists
	if (!isset($data['styles']['blocks'])) {
		$data['styles']['blocks'] = [];
	}
	
	// Ensure core/cover block exists
	if (!isset($data['styles']['blocks']['core/cover'])) {
		$data['styles']['blocks']['core/cover'] = [];
	}
	
	// Ensure styles.blocks.core/cover.dimensions structure exists
	if (!isset($data['styles']['blocks']['core/cover']['dimensions'])) {
		$data['styles']['blocks']['core/cover']['dimensions'] = [];
	}
	
	// Add aspect ratio configuration based on WordPress valid schema
	// Using dimensions.aspectRatio for simple aspect ratio values (global styles context)
	$data['styles']['blocks']['core/cover']['dimensions']['aspectRatio'] = '3/2';
	
	// Update the theme.json data
	return $data;
}, 10, PHP_INT_MAX);
