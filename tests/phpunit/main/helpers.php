<?php

/**
 * Get the design frontend output file.
 *
 * @param string $design_name The design name.
 *
 * @return string The design frontend output file.
 */
function blockera_test_get_frontend_output( string $design_name): string {

	$fixtures_path = dirname(__DIR__, 2) . '/fixtures/';
	$fixtures_file = $fixtures_path.$design_name. '/frontend.html';

	if (file_exists($fixtures_file)) {
		return file_get_contents($fixtures_file);
	}

	throw new \Exception('Frontend output file not found: ' . $fixtures_file);
}

/**
 * Get the design input file.
 *
 * @param string $design_name The design name.
 *
 * @return string The design input file.
 */
function blockera_test_get_design_input( string $design_name): string {
	$fixtures_path = dirname(__DIR__, 2) . '/fixtures/';

	$fixtures_file = $fixtures_path . $design_name . '/input.html';

	if (file_exists($fixtures_file)) {
		return file_get_contents($fixtures_file);
	}

	throw new \Exception('Design file not found: ' . $fixtures_file);
}

/**
 * Register the style variations for the design.
 *
 * @param string $design_name The design name.
 * @param array $variations The variations.
 *
 * @return array The variations.
 */
function blockera_test_register_style_variations( string $design_name, array $variations): array {
	$fixtures_path = dirname(__DIR__, 2) . '/fixtures/';
	$pattern = $fixtures_path . $design_name . '/styles/blocks/*.json';

	$blocks_styles = glob($pattern);

	if (empty($blocks_styles)) {
		return $variations;
	}

	foreach ($blocks_styles as $block_style) {

		$block_style = json_decode(file_get_contents($block_style), true);

		$variations[] = [
			'version' => $block_style['version'],
			'title' => $block_style['title'],
			'slug' => $block_style['slug'],
			'blockTypes' => $block_style['blockTypes'],
			'styles' => $block_style['styles'],
		];		
	}

	return $variations;
}

/**
 * Normalize the CSS.
 *
 * @param string $css The CSS.
 *
 * @return string The normalized CSS.
 */
function blockera_test_normalize_css( string $css): string {
	// Remove comments.
	$css = preg_replace('/\/\*.*?\*\//s', '', $css);
	
	// Remove multiple spaces and normalize whitespace.
	$css = preg_replace('/\s+/', ' ', $css);
	
	// Add newlines after opening braces.
	$css = preg_replace('/\{/', "{\n", $css);
	
	// Add newlines after closing braces.
	$css = preg_replace('/\}/', "}\n", $css);
	
	// Add newlines after semicolons (but not inside url() or other functions).
	$css = preg_replace('/;(?![^(]*\))/', ";\n", $css);
	
	// Add semicolon to declarations that don't have one before closing brace.
	$css = preg_replace('/([^\s\{;])\s*\}/', "$1;\n}", $css);
	
	// Split into lines for processing.
	$lines = explode("\n", $css);
	
	// Trim and indent lines.
	$formatted_lines = [];
	$indent_level = 0;
	
	foreach ($lines as $line) {
		$line = trim($line);
		
		if (empty($line)) {
			continue;
		}
		
		// Decrease indent for closing braces.
		if (strpos($line, '}') === 0) {
			$indent_level--;
		}
		
		// Add indentation.
		$formatted_lines[] = str_repeat("\t", max(0, $indent_level)) . $line;
		
		// Increase indent after opening braces.
		if (strpos($line, '{') !== false) {
			$indent_level++;
		}
	}
	
	// Join lines with single newlines.
	$css = implode("\n", $formatted_lines);
	
	// Add blank line between rule sets.
	$css = preg_replace('/\}\n(?!\n)/', "}\n\n", $css);
	
	// Clean up any trailing whitespace.
	$css = trim($css);
	
	return $css;
}
