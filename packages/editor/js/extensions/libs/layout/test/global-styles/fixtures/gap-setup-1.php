<?php
/**
 * Temporary mu-plugin to modify theme.json for gap tests (simple value)
 * This filter adds simple gap value for core/group block using add_filter
 * Sets gap via spacing.blockGap (WordPress theme.json schema for global styles)
 */
add_filter('blockera_theme_json_data_theme', function($theme_json) {
	$data = $theme_json;
	
	// Ensure styles.blocks structure exists
	if (!isset($data['styles']['blocks'])) {
		$data['styles']['blocks'] = [];
	}
	
	// Ensure core/group block exists
	if (!isset($data['styles']['blocks']['core/group'])) {
		$data['styles']['blocks']['core/group'] = [];
	}
	
	// Ensure styles.blocks.core/group.spacing structure exists
	if (!isset($data['styles']['blocks']['core/group']['spacing'])) {
		$data['styles']['blocks']['core/group']['spacing'] = [];
	}
	
	// Add gap configuration based on WordPress valid schema
	// Using spacing.blockGap for simple gap values (global styles context)
	$data['styles']['blocks']['core/group']['spacing']['blockGap'] = '30px';
	
	// Update the theme.json data
	return $data;
}, 10, PHP_INT_MAX);
