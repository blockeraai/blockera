<?php
/**
 * Temporary mu-plugin to modify theme.json for background gradient tests
 * This filter adds simple radial gradient value for core/paragraph block using add_filter
 * Sets gradient via style.color.gradient (WordPress theme.json schema)
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
	
	// Add radial gradient configuration based on WordPress valid schema
	// Using style.color.gradient for simple gradient values
	$data['styles']['blocks']['core/paragraph']['color']['gradient'] = 'radial-gradient(rgb(194,169,144) 27%,rgb(254,95,95) 92%)';
	
	// Update the theme.json data
	return $data;
}, 10, PHP_INT_MAX);
