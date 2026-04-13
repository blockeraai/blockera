<?php
/**
 * Temporary mu-plugin to modify theme.json for background gradient tests
 * This filter adds unknown variable linear gradient value for core/paragraph block using add_filter
 * Sets gradient via gradient preset slug with unknown value (WordPress theme.json schema)
 * 
 * Note: We intentionally do NOT add 'unknown' to the gradient presets. This simulates a scenario where
 * a gradient preset was referenced in styles but later deleted from the theme's presets.
 * Blockera should detect this and show the "deleted" indicator in the UI.
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
	
	// Ensure color structure exists
	if (!isset($data['styles']['blocks']['core/paragraph']['color'])) {
		$data['styles']['blocks']['core/paragraph']['color'] = [];
	}
	
	// Add linear gradient configuration based on WordPress valid schema
	// For global styles, gradients are stored under color.gradient
	// Using var:preset|gradient|slug format for preset references
	// This uses an unknown gradient slug that doesn't exist in the presets to test
	// handling of deleted/missing gradient presets
	$data['styles']['blocks']['core/paragraph']['color']['gradient'] = 'var:preset|gradient|unknown';
	
	// Update the theme.json data
	return $data;
}, 10, PHP_INT_MAX);
