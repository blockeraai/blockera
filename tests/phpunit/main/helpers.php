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
 * Get WP-CLI commands from wp-cli.json files.
 * Merges global wp-cli.json (from phpunit folder) with test-specific wp-cli.json.
 * Global commands run first, then test-specific commands.
 *
 * @param string $design_name The design name.
 *
 * @return array Array of WP-CLI commands (empty array if none found).
 */
function blockera_test_get_wp_cli_commands( string $design_name): array {
	$fixtures_path = dirname(__DIR__, 2) . '/fixtures/';
	$tests_path = dirname(__DIR__, 2);
	$commands = [];
	
	// Load global wp-cli.json first (from phpunit folder)
	$global_wp_cli_file = $tests_path . '/phpunit/wp-cli.json';
	if (file_exists($global_wp_cli_file)) {
		$wp_cli_content = file_get_contents($global_wp_cli_file);
		if ($wp_cli_content !== false) {
			$wp_cli_commands = json_decode($wp_cli_content, true);
			if (is_array($wp_cli_commands)) {
				$commands = array_merge($commands, $wp_cli_commands);
			}
		}
	}
	
	// Load test-specific wp-cli.json (from fixture folder)
	$test_wp_cli_file = $fixtures_path . $design_name . '/wp-cli.json';
	if (file_exists($test_wp_cli_file)) {
		$wp_cli_content = file_get_contents($test_wp_cli_file);
		if ($wp_cli_content !== false) {
			$wp_cli_commands = json_decode($wp_cli_content, true);
			if (is_array($wp_cli_commands)) {
				$commands = array_merge($commands, $wp_cli_commands);
			}
		}
	}
	
	return $commands;
}

/**
 * Parse and execute a wp-cli command using WordPress functions.
 *
 * @param string $command The wp-cli command (without 'wp' prefix).
 * @param bool $ignore_errors Whether to ignore errors (for || true behavior).
 *
 * @return void
 * @throws \Exception If a command fails and errors are not ignored.
 */
function blockera_test_execute_wp_cli_command( string $command, bool $ignore_errors = false): void {
	$command = trim($command);
	
	if (empty($command)) {
		return;
	}
	
	// Handle term create commands: "term create category {name} || true"
	if (preg_match('/^term\s+create\s+category\s+([^\s\|]+)/', $command, $matches)) {
		$term_name = trim($matches[1]);
		$term = get_term_by('name', $term_name, 'category');

		error_log(print_r($term, true));
		
		if (!$term) {
			$result = wp_insert_term($term_name, 'category');
			if (is_wp_error($result) && !$ignore_errors) {
				throw new \Exception('Failed to create category: ' . $result->get_error_message());
			}
		}
		return;
	}
	
	// Handle post create commands: "post create --post_title=\"...\" --post_status=publish --porcelain --post_category=\"...\""
	if (preg_match('/^post\s+create\s+(.+)$/', $command, $matches)) {
		$args_string = $matches[1];
		$post_args = [];
		
		// Parse --post_title="..."
		if (preg_match('/--post_title=["\']([^"\']+)["\']/', $args_string, $title_matches)) {
			$post_args['post_title'] = $title_matches[1];
		} elseif (preg_match('/--post_title=([^\s]+)/', $args_string, $title_matches)) {
			$post_args['post_title'] = $title_matches[1];
		}

		// Parse --post_type="..."
		if (preg_match('/--post_type=["\']([^"\']+)["\']/', $args_string, $type_matches)) {
			$post_args['post_type'] = $type_matches[1];
		} elseif (preg_match('/--post_type=([^\s]+)/', $args_string, $type_matches)) {
			$post_args['post_type'] = $type_matches[1];
		}

		// Parse --post_status=...
		if (preg_match('/--post_status=([^\s]+)/', $args_string, $status_matches)) {
			$post_args['post_status'] = $status_matches[1];
		} else {
			$post_args['post_status'] = 'publish';
		}
		
		// Parse --post_category="term-1,term-2"
		$category_names = [];
		if (preg_match('/--post_category=["\']([^"\']+)["\']/', $args_string, $cat_matches)) {
			$category_names = array_map('trim', explode(',', $cat_matches[1]));
		} elseif (preg_match('/--post_category=([^\s]+)/', $args_string, $cat_matches)) {
			$category_names = array_map('trim', explode(',', $cat_matches[1]));
		}
		
		// Create the post
		$post_id = wp_insert_post($post_args);
		
		if (is_wp_error($post_id) && !$ignore_errors) {
			throw new \Exception('Failed to create post: ' . $post_id->get_error_message());
		}
		
		// Set categories if provided
		if (!empty($category_names) && $post_id && !is_wp_error($post_id)) {
			$category_ids = [];
			foreach ($category_names as $cat_name) {
				$term = get_term_by('name', $cat_name, 'category');
				if ($term) {
					$category_ids[] = $term->term_id;
				}
			}
			if (!empty($category_ids)) {
				wp_set_object_terms($post_id, $category_ids, 'category');
			}
		}
		
		return;
	}
	
	// Handle post term set commands: "post term set {id} category {terms}"
	if (preg_match('/^post\s+term\s+set\s+(\d+)\s+category\s+(.+)$/', $command, $matches)) {
		$post_id = (int) $matches[1];
		$term_names = array_map('trim', explode(' ', trim($matches[2])));
		$term_ids = [];
		
		foreach ($term_names as $term_name) {
			$term = get_term_by('name', $term_name, 'category');
			if ($term) {
				$term_ids[] = $term->term_id;
			}
		}
		
		if (!empty($term_ids)) {
			$result = wp_set_object_terms($post_id, $term_ids, 'category');
			if (is_wp_error($result) && !$ignore_errors) {
				throw new \Exception('Failed to set post terms: ' . $result->get_error_message());
			}
		}
		
		return;
	}
	
	// Handle bash commands with wp post create: "bash -c 'POST_ID=$(wp post create ...) && wp post term set $POST_ID ...'"
	if (preg_match('/^bash\s+-c\s+["\'](.+)["\']$/', $command, $matches)) {
		$bash_content = $matches[1];
		
		// Extract wp post create command
		if (preg_match('/\$\(wp\s+post\s+create\s+([^\)]+)\)/', $bash_content, $create_matches)) {
			$create_command = 'post create ' . $create_matches[1];
			blockera_test_execute_wp_cli_command($create_command, $ignore_errors);
			
			// Get the created post ID (find by title if --porcelain was used)
			$post_id = null;
			if (preg_match('/--post_title=["\']([^"\']+)["\']/', $create_matches[1], $title_matches)) {
				$post = get_page_by_title($title_matches[1], OBJECT, 'post');
				if ($post) {
					$post_id = $post->ID;
				}
			}
			
			// Extract and execute wp post term set command
			if ($post_id && preg_match('/wp\s+post\s+term\s+set\s+\$POST_ID\s+category\s+([^\'&]+)/', $bash_content, $term_matches)) {
				$term_set_command = 'post term set ' . $post_id . ' category ' . trim($term_matches[1]);
				blockera_test_execute_wp_cli_command($term_set_command, $ignore_errors);
			}
		}
		
		return;
	}
	
	// If command is not recognized and errors are not ignored, throw exception
	if (!$ignore_errors) {
		throw new \Exception('Unsupported wp-cli command: ' . $command);
	}
}

/**
 * Execute WP-CLI commands from config using WordPress functions.
 *
 * @param array $commands Array of WP-CLI commands (without 'wp' prefix).
 *
 * @return void
 * @throws \Exception If a command fails.
 */
function blockera_test_execute_wp_cli_commands( array $commands): void {
	if (empty($commands)) {
		return;
	}

	foreach ($commands as $command) {
		if (!is_string($command) || empty(trim($command))) {
			continue;
		}

		$command = trim($command);
		$ignore_errors = strpos($command, '|| true') !== false;
		
		// Remove shell operators for processing
		if ($ignore_errors) {
			$command = preg_replace('/\s*\|\|\s*true\s*/', '', $command);
			$command = trim($command);
		}

		try {
			blockera_test_execute_wp_cli_command($command, $ignore_errors);
		} catch (\Exception $e) {
			if (!$ignore_errors) {
				throw $e;
			}
			// Otherwise, ignore the error (expected for commands with || true)
		}
	}
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
