<?php
/**
 * Temporary mu-plugin to modify theme.json for shadow tests
 * This filter adds shadow settings for core/button block using add_filter
 */
add_filter('blockera_theme_json_data_theme', function($theme_json) {
	$data = $theme_json;
	
	// Ensure styles.blocks structure exists
	if (!isset($data['styles']['blocks'])) {
		$data['styles']['blocks'] = [];
	}
	
	// Ensure core/button block exists
	if (!isset($data['styles']['blocks']['core/button'])) {
		$data['styles']['blocks']['core/button'] = [];
	}
	
	// Add shadow configuration - simple CSS value
	// Format: x y blur spread color
	$data['styles']['blocks']['core/button']['shadow'] = '10px 20px 5px 0px rgba(0, 0, 0, 0.3)';
	
	// Update the theme.json data
	return $data;
}, 10, PHP_INT_MAX);
