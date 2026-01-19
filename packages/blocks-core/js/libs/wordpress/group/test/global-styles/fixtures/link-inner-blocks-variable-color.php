<?php
/**
 * Temporary mu-plugin to modify theme.json for Group block link inner block variable color tests
 * This filter adds variable color values for link element in core/group block using add_filter
 * Sets link color via styles.elements.link.color.text (normal) and styles.elements.link[':hover'].color.text (hover)
 * with CSS variable references (var:preset|color|{slug} format)
 * 
 * According to WordPress theme.json schema:
 * - styles.elements.link.color.text accepts string (CSS color) or CSS variable reference for normal state
 * - styles.elements.link[':hover'].color.text accepts string (CSS color) or CSS variable reference for hover state
 * - For preset colors, use: var:preset|color|{slug} format
 * - The color preset must exist in settings.color.palette
 */
add_filter('blockera_theme_json_data_theme', function($theme_json) {
	$data = $theme_json;
	
	// Ensure settings structure exists
	if (!isset($data['settings'])) {
		$data['settings'] = [];
	}
	if (!isset($data['settings']['color'])) {
		$data['settings']['color'] = [];
	}
	if (!isset($data['settings']['color']['palette'])) {
		$data['settings']['color']['palette'] = [];
	}
	
	// Check if accent-3 and accent-4 color presets exist in palette
	$has_accent_3 = false;
	$has_accent_4 = false;
	foreach ($data['settings']['color']['palette'] as $color) {
		if (isset($color['slug'])) {
			if ($color['slug'] === 'accent-3') {
				$has_accent_3 = true;
			}
			if ($color['slug'] === 'accent-4') {
				$has_accent_4 = true;
			}
		}
	}
	
	// Add accent-3 to palette if it doesn't exist (for compatibility with themes that don't have it)
	// Note: accent-3 already exists in Twenty Twenty-Five theme, but we ensure it for other themes
	if (!$has_accent_3) {
		$data['settings']['color']['palette'][] = [
			'slug' => 'accent-3',
			'color' => '#503AA8',
			'name' => 'Accent 3',
		];
	}
	
	// Add accent-4 to palette if it doesn't exist
	if (!$has_accent_4) {
		$data['settings']['color']['palette'][] = [
			'slug' => 'accent-4',
			'color' => '#686868',
			'name' => 'Accent 4',
		];
	}
	
	// Ensure styles.blocks structure exists
	if (!isset($data['styles'])) {
		$data['styles'] = [];
	}
	if (!isset($data['styles']['blocks'])) {
		$data['styles']['blocks'] = [];
	}
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
	// Using styles.elements.link.color.text with CSS variable reference for preset colors
	// Format: var:preset|color|{slug}
	$data['styles']['blocks']['core/group']['elements']['link']['color']['text'] = 'var:preset|color|accent-3';
	
	// Add hover state text color configuration
	// Using styles.elements.link[':hover'].color.text with CSS variable reference
	if (!isset($data['styles']['blocks']['core/group']['elements']['link'][':hover'])) {
		$data['styles']['blocks']['core/group']['elements']['link'][':hover'] = [];
	}
	if (!isset($data['styles']['blocks']['core/group']['elements']['link'][':hover']['color'])) {
		$data['styles']['blocks']['core/group']['elements']['link'][':hover']['color'] = [];
	}
	$data['styles']['blocks']['core/group']['elements']['link'][':hover']['color']['text'] = 'var:preset|color|accent-4';
	
	// Update the theme.json data
	return $data;
}, 10, PHP_INT_MAX);
