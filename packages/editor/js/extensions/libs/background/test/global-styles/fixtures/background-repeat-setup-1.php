<?php
/**
 * Temporary mu-plugin to modify theme.json for background repeat tests (no-repeat value)
 * This filter adds background repeat value for core/group block using add_filter
 * Sets background repeat via background.backgroundRepeat (WordPress theme.json schema for global styles)
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
	
	// Ensure styles.blocks.core/group.background structure exists
	if (!isset($data['styles']['blocks']['core/group']['background'])) {
		$data['styles']['blocks']['core/group']['background'] = [];
	}
	
	// Add background image and repeat configuration based on WordPress valid schema
	// Using background.backgroundImage and background.backgroundRepeat for global styles context
	$data['styles']['blocks']['core/group']['background']['backgroundImage'] = [
		'url' => 'https://placehold.co/600x400',
		'id' => 87,
		'source' => 'file',
		'title' => 'background image',
	];
	$data['styles']['blocks']['core/group']['background']['backgroundRepeat'] = 'no-repeat';
	
	// Update the theme.json data
	return $data;
}, 10, PHP_INT_MAX);
