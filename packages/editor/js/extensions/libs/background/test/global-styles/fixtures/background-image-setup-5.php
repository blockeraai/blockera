<?php
/**
 * Temporary mu-plugin to modify theme.json for background image tests
 * This filter adds simple background image value for core/group block using add_filter
 * Sets background image via style.background.backgroundImage (WordPress theme.json schema)
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
	
	// Add background image configuration based on WordPress valid schema
	// Using style.background.backgroundImage for background image values
	$data['styles']['blocks']['core/group']['background']['backgroundImage'] = [
		'url' => 'https://placehold.co/600x400',
		'id' => 87,
		'source' => 'file',
		'title' => 'about-sofia',
	];
	
	// Update the theme.json data
	return $data;
}, 10, PHP_INT_MAX);
