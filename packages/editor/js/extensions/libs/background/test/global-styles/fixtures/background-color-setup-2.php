<?php
/**
 * Temporary mu-plugin to modify theme.json for background color tests
 * This filter adds variable background color value for core/paragraph block using add_filter
 * Sets background color via styles.color.background with CSS variable reference (WordPress theme.json schema)
 * 
 * According to WordPress theme.json schema:
 * - styles.color.background accepts string (CSS color) or CSS variable reference
 * - For preset colors, use: var(--wp--preset--color--{slug})
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
	
	// Check if accent-3 color preset exists in palette
	$has_accent_3 = false;
	foreach ($data['settings']['color']['palette'] as $color) {
		if (isset($color['slug']) && $color['slug'] === 'accent-3') {
			$has_accent_3 = true;
			break;
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
	
	// Ensure styles.blocks structure exists
	if (!isset($data['styles'])) {
		$data['styles'] = [];
	}
	if (!isset($data['styles']['blocks'])) {
		$data['styles']['blocks'] = [];
	}
	if (!isset($data['styles']['blocks']['core/paragraph'])) {
		$data['styles']['blocks']['core/paragraph'] = [];
	}
	
	// Ensure color structure exists within the block styles
	if (!isset($data['styles']['blocks']['core/paragraph']['color'])) {
		$data['styles']['blocks']['core/paragraph']['color'] = [];
	}
	
	// Add background color configuration based on WordPress theme.json schema
	// Using styles.color.background with CSS variable reference for preset colors
	// Schema: styles.color.background accepts string (CSS color) or CSS variable
	$data['styles']['blocks']['core/paragraph']['color']['background'] = 'var(--wp--preset--color--accent-3)';
	
	// Update the theme.json data
	return $data;
}, 10, PHP_INT_MAX);
