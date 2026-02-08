<?php
/**
 * Temporary mu-plugin to modify theme.json for spacing tests (simple value)
 * This filter adds simple spacing values for core/paragraph block using add_filter
 * Sets spacing via spacing.padding and spacing.margin (WordPress theme.json schema for global styles)
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
	
	// Ensure styles.blocks.core/paragraph.spacing structure exists
	if (!isset($data['styles']['blocks']['core/paragraph']['spacing'])) {
		$data['styles']['blocks']['core/paragraph']['spacing'] = [];
	}
	
	// Add spacing configuration based on WordPress valid schema
	// Using spacing.padding and spacing.margin for simple spacing values (global styles context)
	$data['styles']['blocks']['core/paragraph']['spacing']['padding'] = [
		'top' => '20px',
		'right' => '30px',
		'bottom' => '40px',
		'left' => '50px',
	];
	
	$data['styles']['blocks']['core/paragraph']['spacing']['margin'] = [
		'top' => '10px',
		'right' => '15px',
		'bottom' => '20px',
		'left' => '25px',
	];
	
	// Update the theme.json data
	return $data;
}, 10, PHP_INT_MAX);
