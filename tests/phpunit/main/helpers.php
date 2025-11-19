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
 * Get the global config.json.
 *
 * @return array|null The global config array or null if not found.
 */
function blockera_test_get_global_config(): ?array {
	$tests_path = dirname(__DIR__, 2);
	$config_file = $tests_path . '/global-config.json';

	if (!file_exists($config_file)) {
		return null;
	}

	$config_content = file_get_contents($config_file);
	if ($config_content === false) {
		return null;
	}

	$config = json_decode($config_content, true);
	
	if (json_last_error() !== JSON_ERROR_NONE) {
		return null;
	}
	
	return is_array($config) ? $config : null;
}

/**
 * Get the config.json for a design.
 *
 * @param string $design_name The design name.
 *
 * @return array|null The config array or null if not found.
 */
function blockera_test_get_config( string $design_name): ?array {
	$fixtures_path = dirname(__DIR__, 2) . '/fixtures/';
	$config_file = $fixtures_path . $design_name . '/config.json';

	if (!file_exists($config_file)) {
		return null;
	}

	$config_content = file_get_contents($config_file);
	if ($config_content === false) {
		return null;
	}

	$config = json_decode($config_content, true);
	
	return is_array($config) ? $config : null;
}

/**
 * Get the post type for a test design.
 * Checks test-specific config first, then global config, then defaults to 'post'.
 *
 * @param string $design_name The design name.
 *
 * @return string The post type to use.
 */
function blockera_test_get_post_type( string $design_name): string {
	// Check test-specific config first
	$config = blockera_test_get_config($design_name);
	if ($config && isset($config['wp-post']) && is_array($config['wp-post']) && isset($config['wp-post']['post_type'])) {
		return $config['wp-post']['post_type'];
	}
	
	// Check global config
	$global_config = blockera_test_get_global_config();
	if ($global_config && isset($global_config['wp-post']) && is_array($global_config['wp-post']) && isset($global_config['wp-post']['post_type'])) {
		return $global_config['wp-post']['post_type'];
	}
	
	// Default to 'post'
	return 'post';
}

/**
 * Apply html-search-replace operations on content.
 *
 * @param string $content The content to process.
 * @param array $search_replace_config Array of search-replace operations.
 *
 * @return string The processed content.
 */
function blockera_test_apply_html_search_replace( string $content, array $search_replace_config): string {
	foreach ($search_replace_config as $operation) {
		if (!isset($operation['search']) || !isset($operation['replace'])) {
			continue;
		}

		$search = $operation['search'];
		$replace = $operation['replace'];

		// If search is an array, apply each pattern
		if (is_array($search)) {
			foreach ($search as $pattern) {
				$content = blockera_test_apply_single_search_replace($content, $pattern, $replace);
			}
		} else {
			// Single search pattern
			$content = blockera_test_apply_single_search_replace($content, $search, $replace);
		}
	}

	return $content;
}

/**
 * Apply a single search-replace operation.
 *
 * @param string $content The content to process.
 * @param string $search The search pattern (can be plain text or regex).
 * @param string $replace The replacement string.
 *
 * @return string The processed content.
 */
function blockera_test_apply_single_search_replace( string $content, string $search, string $replace): string {
	// Check if the pattern contains regex metacharacters (backslash sequences like \d, \w, etc. or quantifiers)
	// This helps distinguish between plain text and regex patterns
	$has_regex_metacharacters = preg_match('/\\\\[dDwWsSnrt0-9]|[\.\*\?\+\{\}\[\]\(\)\^\$\|]/', $search);
	
	if ($has_regex_metacharacters) {
		// Treat as regex pattern
		// Use a delimiter that's less likely to appear in HTML patterns
		// Escape the delimiter if it appears in the pattern
		$delimiter = '#';
		// If the delimiter appears in the pattern, try another one
		if (strpos($search, $delimiter) !== false) {
			$delimiter = '~';
			if (strpos($search, $delimiter) !== false) {
				$delimiter = '/';
				// Escape forward slashes in the pattern
				$search = str_replace('/', '\/', $search);
			}
		}
		
		$content = preg_replace($delimiter . $search . $delimiter, $replace, $content);
	} else {
		// Use str_replace for plain text (faster and safer)
		$content = str_replace($search, $replace, $content);
	}
	
	return $content;
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
