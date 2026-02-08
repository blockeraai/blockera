<?php
/**
 * Temporary mu-plugin to modify theme.json for Group block link inner block simple color tests
 * This filter adds simple color values for link element in core/group block using add_filter
 * Sets link color via styles.elements.link.color.text (normal) and styles.elements.link[':hover'].color.text (hover)
 * 
 * According to WordPress theme.json schema:
 * - styles.elements.link.color.text accepts string (CSS color) for normal state
 * - styles.elements.link[':hover'].color.text accepts string (CSS color) for hover state
 * - These are element-level styles that apply to link elements within the block
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
	
	// Ensure styles.blocks.core/group.elements structure exists
	if (!isset($data['styles']['blocks']['core/group']['elements'])) {
		$data['styles']['blocks']['core/group']['elements'] = [];
	}
	
	// Ensure link element structure exists
	if (!isset($data['styles']['blocks']['core/group']['elements']['link'])) {
		$data['styles']['blocks']['core/group']['elements']['link'] = [];
	}
	
	// Ensure color structure exists within link element
	if (!isset($data['styles']['blocks']['core/group']['elements']['link']['color'])) {
		$data['styles']['blocks']['core/group']['elements']['link']['color'] = [];
	}
	
	// Add normal state text color configuration based on WordPress theme.json schema
	// Using styles.elements.link.color.text for simple color values
	$data['styles']['blocks']['core/group']['elements']['link']['color']['text'] = '#ffbaba';
	
	// Add hover state text color configuration
	// Using styles.elements.link[':hover'].color.text for hover state
	if (!isset($data['styles']['blocks']['core/group']['elements']['link'][':hover'])) {
		$data['styles']['blocks']['core/group']['elements']['link'][':hover'] = [];
	}
	if (!isset($data['styles']['blocks']['core/group']['elements']['link'][':hover']['color'])) {
		$data['styles']['blocks']['core/group']['elements']['link'][':hover']['color'] = [];
	}
	$data['styles']['blocks']['core/group']['elements']['link'][':hover']['color']['text'] = '#ff1d1d';
	
	// Update the theme.json data
	return $data;
}, 10, PHP_INT_MAX);
