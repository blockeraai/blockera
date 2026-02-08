<?php
/**
 * Temporary mu-plugin to modify theme.json for shadow tests
 * This filter adds shadow preset reference for core/button block using add_filter
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
	
	// Add shadow configuration - preset reference
	// WordPress default presets include: natural, deep, sharp, outlined, crisp
	// WordPress uses var:preset|shadow|slug format in theme.json
	$data['styles']['blocks']['core/button']['shadow'] = 'var:preset|shadow|natural';
	
	// Update the theme.json data
	return $data;
}, 10, PHP_INT_MAX);
