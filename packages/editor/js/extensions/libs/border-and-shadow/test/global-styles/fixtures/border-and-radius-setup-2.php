<?php
/**
 * Temporary mu-plugin to modify theme.json for border tests
 * This filter adds custom side border settings for core/button block using add_filter
 * Sets different border widths per side and custom border radius per corner
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
	
	// Add custom side border configuration based on WordPress valid schema
	// Each side has different width: top=1px, right=2px, bottom=3px, left=4px
	$data['styles']['blocks']['core/button']['border'] = [
		'top' => [
			'color' => '#ff4848',
			'width' => '1px',
			'style' => 'solid',
		],
		'right' => [
			'color' => '#ff4848',
			'width' => '2px',
			'style' => 'solid',
		],
		'bottom' => [
			'color' => '#ff4848',
			'width' => '3px',
			'style' => 'solid',
		],
		'left' => [
			'color' => '#ff4848',
			'width' => '4px',
			'style' => 'solid',
		],
		'radius' => [
			'topLeft' => '10px',
			'topRight' => '20px',
			'bottomLeft' => '40px',
			'bottomRight' => '30px',
		],
	];
	
	// Update the theme.json data
	return $data;
}, 10, PHP_INT_MAX);
