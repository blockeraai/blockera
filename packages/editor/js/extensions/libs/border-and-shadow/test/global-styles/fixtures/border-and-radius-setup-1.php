<?php
/**
 * Temporary mu-plugin to modify theme.json for border tests
 * This filter adds border settings for core/button block using add_filter
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
	
	// Add border configuration based on WordPress valid schema
	$data['styles']['blocks']['core/button']['border'] = [
		'color' => '#ff4848',
		'width' => '1px',
		'style' => 'solid',
		'radius' => '10px',
	];
	
	// Update the theme.json data
	return $data;
}, 10, PHP_INT_MAX);
