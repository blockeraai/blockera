<?php
/**
 * Temporary mu-plugin to modify theme.json for background gradient tests
 * This filter adds variable linear gradient value for core/paragraph block using add_filter
 * Sets gradient via gradient preset slug (WordPress theme.json schema)
 * Also adds gradient presets to settings to ensure they're available even if not in theme
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
	if (!isset($data['settings']['color']['gradients'])) {
		$data['settings']['color']['gradients'] = [];
	}
	
	// Add gradient presets to settings if they don't exist
	// This simulates the JSONResolver filter behavior for theme/block/user configs
	$gradient_presets = [
		[
			'name' => 'Vivid cyan blue to vivid purple',
			'slug' => 'vivid-cyan-blue-to-vivid-purple',
			'gradient' => 'linear-gradient(135deg,rgb(6,147,227) 0%,rgb(155,81,224) 100%)',
		],
		[
			'name' => 'Light green cyan to vivid green cyan',
			'slug' => 'light-green-cyan-to-vivid-green-cyan',
			'gradient' => 'linear-gradient(135deg,rgb(122,220,180) 0%,rgb(0,208,130) 100%)',
		],
	];
	
	// Merge presets, avoiding duplicates
	$existing_slugs = array_column($data['settings']['color']['gradients'], 'slug');
	foreach ($gradient_presets as $preset) {
		if (!in_array($preset['slug'], $existing_slugs)) {
			$data['settings']['color']['gradients'][] = $preset;
		}
	}
	
	// Ensure styles.blocks structure exists
	if (!isset($data['styles']['blocks'])) {
		$data['styles']['blocks'] = [];
	}
	
	// Ensure core/paragraph block exists
	if (!isset($data['styles']['blocks']['core/paragraph'])) {
		$data['styles']['blocks']['core/paragraph'] = [];
	}
	
	// Add linear gradient configuration based on WordPress valid schema
	// Using gradient for preset gradient variables (theme gradient slugs)
	$data['styles']['blocks']['core/paragraph']['gradient'] = 'vivid-cyan-blue-to-vivid-purple';
	
	// Update the theme.json data
	return $data;
}, 10, PHP_INT_MAX);
