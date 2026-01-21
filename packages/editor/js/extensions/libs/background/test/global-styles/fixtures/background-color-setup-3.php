<?php
/**
 * Temporary mu-plugin to modify theme.json for background color tests
 * This filter adds unknown variable background color value for core/paragraph block using add_filter
 * Sets background color via backgroundColor with unknown preset color slug (WordPress theme.json schema)
 * This tests the handling of deleted/unknown color presets
 * 
 * Note: We intentionally do NOT add 'unknown' to the palette. This simulates a scenario where
 * a color preset was referenced in styles but later deleted from the theme's palette.
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
	
	// Add background color configuration based on WordPress valid schema
	// For global styles, background colors are stored under color.background
	// Using var:preset|color|slug format for preset references
	// This uses an unknown color slug that doesn't exist in the palette to test
	// handling of deleted/missing color presets
	$data['styles']['blocks']['core/paragraph']['color']['background'] = 'var:preset|color|unknown';
	
	// Update the theme.json data
	return $data;
}, 10, PHP_INT_MAX);
