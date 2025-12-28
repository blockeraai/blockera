<?php

namespace Blockera\Tests;

use ReflectionClass;
use Blockera\Setup\Blockera;
use Blockera\Dev\PhpUnit\CssDriver;
use Blockera\Dev\PhpUnit\HtmlDriver;
use Blockera\Dev\PHPUnit\AppTestCase;
use Blockera\Editor\Http\Controllers\Theme\JSONResolver;
use Spatie\Snapshots\MatchesSnapshots;

class BlockeraTest extends AppTestCase {

	use MatchesSnapshots {
        assertMatchesSnapshot as protected traitAssertMatchesSnapshot;
    }

	protected string $design;
	protected Blockera $app;
	protected int $post_id = 0;
	protected ?string $post_content = null;
	protected bool $is_global_styles = false;
	protected ?string $currentTestType = null;

	/**
	 * Set the current test type.
	 *
	 * @param string|null $testType The test type to set.
	 * @return void
	 */
	protected function setCurrentTestType(?string $testType): void {
		$this->currentTestType = $testType;
	}


	/**
	 * Get the current test type.
	 *
	 * @return string|null The current test type.
	 */
	protected function getCurrentTestType(): ?string {
		return $this->currentTestType;
	}


	/**
	 * Assert that the actual value matches the stored snapshot for the given test type.
	 *
	 * @param string $testType Type of snapshot test (e.g., 'frontend-html', 'frontend-css', etc.).
	 * @param mixed  $actual   The value being compared to the snapshot.
	 * @param mixed  $driver   Optional driver used for formatting/processing (e.g., HtmlDriver, CssDriver).
	 *
	 * @return void
	 */
	public function assertMatchesSnapshot(string $testType, $actual, $driver = null): void {

		$this->setCurrentTestType($testType);

		$this->traitAssertMatchesSnapshot($actual, $driver);
    }


	/**
	 * Get the snapshot ID string based on the current test type and incrementor.
	 *
	 * @return string The snapshot identifier for the current test.
	 */
	protected function getSnapshotId(): string {

		switch( $this->getCurrentTestType() ){
			case 'frontend-css':
				return 'frontend';
			case 'frontend-html':
				return 'frontend';
			case 'frontend-global-styles':
				return 'frontend-global-styles';
			default:
				return 'frontend';
		}

		// Backward for other types.
		if (1 === $this->snapshotIncrementor) {
			return 'frontend';
		}

		return 'frontend__' . $this->snapshotIncrementor;
	}

	
	/**
	 * Get the path to the snapshot directory for the current design.
	 *
	 *
	 * @return string The absolute path to the snapshot directory.
	 */
	protected function getSnapshotDirectory(): string {

		return dirname((new ReflectionClass($this))->getFileName(), 3).
			DIRECTORY_SEPARATOR.
			'fixtures' . DIRECTORY_SEPARATOR . $this->design . DIRECTORY_SEPARATOR . 'snapshot';
	}

	/**
	 * Create or update a post for testing.
	 *
	 * @param string $designName The design name.
	 * @param string $post_content The post content.
	 * @return int The post ID.
	 */
	protected function createOrUpdateTestPost(string $designName, string $post_content): int {
		return $this->factory()->post->create([
			'post_title'   => 'Test Design: ' . $designName,
			'post_content' => $post_content,
			'post_status'  => 'publish',
			'post_type'    => blockera_test_get_post_type($designName),
			'post_author'  => 1,
		]);
	}

	/**
	 * Create test post, checking for setup.php file first.
	 * If setup.php exists, it will be included and executed.
	 * Otherwise, falls back to createOrUpdateTestPost.
	 *
	 * @param string $designName The design name.
	 * @param string $post_content The post content.
	 * @return int The post ID.
	 */
	protected function createTestPostWithSnapshot(string $designName, string $post_content): int {
		$fixtures_path = dirname(__DIR__, 2) . '/fixtures/';
		$setup_file = $fixtures_path . $designName . '/setup.php';

		// Check if setup.php exists
		if (file_exists($setup_file)) {
			// Make variables available to setup.php
			$post_id = null;
			
			// Include setup.php - it should set $post_id
			include $setup_file;
			
			// If setup.php set $post_id, return it
			if (isset($post_id) && is_int($post_id) && $post_id > 0) {
				$this->post_content = $post_content;
				return $post_id;
			}
		}

		// Fall back to default post creation
		return $this->createOrUpdateTestPost($designName, $post_content);
	}

	/**
	 * Execute WP-CLI commands for a design.
	 *
	 * @param string $designName The design name.
	 * @return void
	 */
	protected function executeWpCliCommands(string $designName): void {
				
		$wp_cli_commands = blockera_test_get_wp_cli_commands($designName);

		if (!empty($wp_cli_commands)) {
			try {
				blockera_test_execute_wp_cli_commands($wp_cli_commands);
			} catch (\Exception $e) {
				$this->fail('WP-CLI command execution failed: ' . $e->getMessage());
			}
		}
	}

    protected function setUp(): void {
        parent::setUp();

		global $blockera_block_supports;

		$this->app = Blockera::getInstance();
		$this->app->setBlockSupports($blockera_block_supports);
		$this->app->bootstrap();

        // Setup WP_Mock
        \WP_Mock::setUp();
    }

	/**
	 * Clean up all global styles generated from previous tests.
	 *
	 * @return void
	 */
	protected function cleanupGlobalStyles(): void {
		// Clear Blockera-specific caches first
		if (class_exists('\Blockera\Editor\Http\Controllers\Theme\JSONResolver')) {
			JSONResolver::clean_cached_data();
		}

		// Clear WordPress theme JSON resolver cache
		if (class_exists('\WP_Theme_JSON_Resolver')) {
			\WP_Theme_JSON_Resolver::clean_cached_data();
		}

		// Clear inline styles from the 'global-styles' handle
		global $wp_styles;
		if (isset($wp_styles) && $wp_styles instanceof \WP_Styles) {
			// Remove inline styles from global-styles handle
			// Inline styles are stored in extra['after'] or extra['before']
			if (isset($wp_styles->registered['global-styles'])) {
				$wp_styles->registered['global-styles']->extra = [];
			}
			// Also check if inline styles are stored directly in wp_styles->add_inline_style data
			if (isset($wp_styles->registered['global-styles-inline-css'])) {
				$wp_styles->registered['global-styles-inline-css']->extra = [];
			}
			// Clear any queued inline styles
			if (isset($wp_styles->queue)) {
				$wp_styles->queue = array_values(array_diff($wp_styles->queue, ['global-styles', 'global-styles-inline-css']));
			}
			// Clear done list to allow re-enqueuing
			if (isset($wp_styles->done)) {
				$wp_styles->done = array_values(array_diff($wp_styles->done, ['global-styles', 'global-styles-inline-css']));
			}
			// Clear enqueued list
			if (isset($wp_styles->enqueued)) {
				$wp_styles->enqueued = array_values(array_diff($wp_styles->enqueued, ['global-styles', 'global-styles-inline-css']));
			}
		}

		// Clear any cached global stylesheet data
		// Use call_user_func to avoid linter issues with WordPress functions
		if (function_exists('wp_cache_delete')) {
			call_user_func('wp_cache_delete', 'wp_get_global_stylesheet', 'theme_json');
			call_user_func('wp_cache_delete', 'wp_get_global_stylesheet_for_rendering', 'theme_json');
		}
	}

	protected function tearDown(): void {
		// Note: Output buffer cleanup is handled by PHPUnit and WP_UnitTestCase
		// We don't need to manually clean buffers here as it can interfere with
		// PHPUnit's own buffer management and cause "risky test" warnings

		// Deactivate mu-plugin if it was activated during the test
		if (!empty($this->design)) {
			blockera_test_deactivate_mu_plugin($this->design);
		}

		// Store post ID before resetting
		$post_id_to_delete = $this->post_id;
		$this->post_id = 0;

		// Reset test state properties
		$this->design = '';
		$this->post_content = null;
		$this->is_global_styles = false;
		$this->currentTestType = null;

		// Reset WordPress query state completely
		global $wp_query, $wp_the_query, $post, $wpdb;
		
		// Reset main query objects
		if (isset($wp_query) && $wp_query instanceof \WP_Query) {
			$wp_query->reset_postdata();
			$wp_query->reset_query();
		}
		if (isset($wp_the_query) && $wp_the_query instanceof \WP_Query && $wp_the_query !== $wp_query) {
			$wp_the_query->reset_postdata();
			$wp_the_query->reset_query();
		}
			
		// Reset query-related globals (these functions handle most cleanup)
		if (function_exists('wp_reset_postdata')) {
			wp_reset_postdata();
		}
		if (function_exists('wp_reset_query')) {
			wp_reset_query();
		}
		
		// Clear WordPress query cache (prevent query result leakage)
		if (isset($wpdb) && is_object($wpdb)) {
			$wpdb->last_query = '';
			$wpdb->last_result = [];
			$wpdb->col_info = null;
			$wpdb->last_error = '';
		}

		// Clear meta and term caches for test post (if it existed)
		// Clean cache before deleting post
		if ($post_id_to_delete > 0) {
			if (function_exists('clean_post_cache')) {
				clean_post_cache($post_id_to_delete);
			}
		}
		// Note: clean_term_cache requires non-empty term IDs array to avoid SQL errors
		// Skip term cache cleanup if no specific terms to clean
		// if (function_exists('clean_term_cache') && !empty($term_ids)) {
		//     clean_term_cache($term_ids, '', false);
		// }
		if (function_exists('clean_user_cache')) {
			clean_user_cache(0);
		}

		// Delete test post after cache cleanup
		if ($post_id_to_delete > 0 && function_exists('wp_delete_post')) {
			wp_delete_post($post_id_to_delete, true);
		}

		JSONResolver::clean_cached_data();

		remove_filter('blockera/json/resolver/get_style_variations', [$this, 'registerDesignStyleVariations']);
		// Remove filters added during test (tests_add_filter adds temporary filters)
		// WP_UnitTestCase should handle this, but we ensure test-specific filters are removed
		global $wp_filter;
		if (isset($wp_filter) && is_array($wp_filter) && isset($wp_filter['blockera/json/resolver/get_style_variations'])) {
			unset($wp_filter['blockera/json/resolver/get_style_variations']);
		}

		// Dequeue all scripts and styles (but keep registered ones for other tests)
		global $wp_styles;
		if (isset($wp_styles) && $wp_styles instanceof \WP_Styles) {
			$wp_styles->done = [];
		}

		// Clean up global styles from previous tests before starting new test
		$this->cleanupGlobalStyles();

		// Cleanup WP_Mock
		\WP_Mock::tearDown();

		// Call parent tearDown last (WP_UnitTestCase does comprehensive cleanup)
		parent::tearDown();
	}

	/**
	 * Test the blocks rendering and styles of a design.
	 * 
	 * This test checks the following:
	 * 1. Blocks rendering
	 * 2. Inline style attributes
	 * 3. Blocks generated styles
	 * 4. Global styles
	 * 
	 * @param string $designName The design name.
	 * 
	 * @dataProvider designNameProvider
	 *
	 * @return void
	 */
	public function test_blocks_rendering_and_styles(string $designName): void {

		$this->design = $designName;

		try {
			// Arrange
			$post_content = blockera_test_get_design_input($designName);
		} catch (\Exception $e) {
			$this->fail($e->getMessage());
		}

		$this->executeWpCliCommands($designName);

		// Activate mu-plugin if mu-plugin.php exists in the test fixture folder
		blockera_test_activate_mu_plugin($designName);

		$this->post_id = $this->createTestPostWithSnapshot($designName, $post_content);
		
		// Register style variations filter before querying
		tests_add_filter('blockera/json/resolver/get_style_variations', [$this, 'registerDesignStyleVariations']);

		// Simulate WordPress request lifecycle: query posts to trigger the_posts filter
		$this->go_to(get_permalink($this->post_id));
		
		// Use the main query populated by go_to(); fallback to a direct query if needed.
		global $wp_query, $post;
		if (!($wp_query instanceof \WP_Query) || !$wp_query->have_posts()) {
			$wp_query = new \WP_Query([
				'p' => $this->post_id,
				'post_type' => get_post_type($this->post_id),
			]);
		}
		
		// Trigger the_posts filter by accessing posts (this is when Blockera processes blocks)
		// Set up the global $post object for the_content filter
		if ($wp_query->have_posts()) {
			$wp_query->the_post();
			// Ensure global $post is set (the_post() should do this, but be explicit)
			$post = $wp_query->post;
		}

		/**
		 * Test 1: Blocks rendering
		 */
		// Use the_content filter to get rendered content (simulates real WordPress flow)
		// if the design has setup.php, use the post content set in setup.php file.
		$raw_content = $this->post_content ?? (string) get_post_field('post_content', $this->post_id);
		if ($raw_content === '') {
			$raw_content = $post_content;
		}
		
		// Apply the_content filter which triggers render_block filter
		// This simulates WordPress's normal content rendering pipeline
		$content = apply_filters('the_content', $raw_content);

		// Apply global html-search-replace first if configured.
		$global_config = blockera_test_get_global_config();
		if ($global_config && isset($global_config['html-search-replace']) && is_array($global_config['html-search-replace'])) {
			$content = blockera_test_apply_html_search_replace($content, $global_config['html-search-replace']);
		}

		// Apply test-specific html-search-replace if configured.
		$config = blockera_test_get_config($designName);
		if ($config && isset($config['html-search-replace']) && is_array($config['html-search-replace'])) {
			$content = blockera_test_apply_html_search_replace($content, $config['html-search-replace']);
		}

		// Add style loader to $content to make it easy to check in browser if needed.
		$content = "<link rel='stylesheet' href='./frontend-global-styles.css'>\n<link rel='stylesheet' href='./frontend.css'>\n\n" . $content;

		// Check with snapshot content
		$this->assertMatchesSnapshot('frontend-html', html_entity_decode($content), new HtmlDriver());

		/**
		 * Test 2: Inline style attributes
		 */

		// Check if inline style checks should be performed
		// Test-specific config overrides global config
		$should_check_inline_styles = true;
		if ($config && isset($config['tags-inline-style-check'])) {
			$should_check_inline_styles = (bool) $config['tags-inline-style-check'];
		} elseif ($global_config && isset($global_config['tags-inline-style-check'])) {
			$should_check_inline_styles = (bool) $global_config['tags-inline-style-check'];
		}

		if ($should_check_inline_styles) {
			$this->checkInlineStyles($content, $designName);
		}

		/**
		 * Test 3: Blocks generated styles
		 */
		ob_start();
		do_action('wp_head');
		$head_output = ob_get_clean();

		// Extract blockera inline styles from wp_head output
		preg_match_all('/<style[^>]*id=["\']blockera-inline-css["\'][^>]*>(.*?)<\/style>/s', $head_output, $matches);
		$inline_css = !empty($matches[1]) ? implode("\n", $matches[1]) : '';

		$this->assertMatchesSnapshot('frontend-css', blockera_test_normalize_css($inline_css), new CssDriver());

		/**
		 * Test 4: Global styles
		 */
		// Extract global styles from wp_head output
		// Global styles are added as inline styles to the 'global-styles' handle via wp_add_inline_style()
		$global_styles = '';
		if (preg_match_all('/<style[^>]*id=["\']global-styles-inline-css["\'][^>]*>(.*?)<\/style>/s', $head_output, $style_matches)) {
			$global_styles = implode("\n", $style_matches[1]);
		}

		// Also check wp_footer output for classic themes with assets on demand
		ob_start();
		do_action('wp_footer');
		$footer_output = ob_get_clean();
		
		// Extract global styles from footer if present (for classic themes)
		if (preg_match_all('/<style[^>]*id=["\']global-styles-inline-css["\'][^>]*>(.*?)<\/style>/s', $footer_output, $footer_style_matches)) {
			$footer_global_styles = implode("\n", $footer_style_matches[1]);
			if (!empty($footer_global_styles)) {
				$global_styles = $global_styles ? $global_styles . "\n" . $footer_global_styles : $footer_global_styles;
			}
		}

		$this->assertMatchesSnapshot('frontend-global-styles', blockera_test_normalize_css($global_styles), new CssDriver());
    }

	/**
	 * Register style variations for the design.
	 *
	 * @param array $variations The style variations.
	 * @return array The registered style variations.
	 */
	public function registerDesignStyleVariations(array $variations): array {
		return blockera_test_register_style_variations($this->design, $variations);
	}

	/**
	 * Recursively render a block and its inner blocks.
	 *
	 * @param array $block The block to render.
	 * 
	 * @return string The rendered block content.
	 */
	private function renderBlock(array $block): string {
		$content = '';

		// Render the current block
		$content .= render_block($block);

		// Recursively render inner blocks if they exist
		if (!empty($block['innerBlocks']) && is_array($block['innerBlocks'])) {
			foreach ($block['innerBlocks'] as $inner_block) {
				$content .= $this->renderBlock($inner_block);
			}
		}

		return $content;
	}

	/**
	 * Check that tags with inline styles follow the rules:
	 * 1. Tags with inline style that have 'blockera-block' should fail
	 * 2. Tags with inline style without this class should check parents recursively
	 * 
	 * Special cases:
	 * - SVG tags and their descendants are skipped
	 * - Tags with inline style exactly "display: none" are skipped
	 *
	 * @param string $content The HTML content to check.
	 * @param string $designName The design name for error messages.
	 * @return void
	 */
	protected function checkInlineStyles(string $content, string $designName): void {
		$dom = new \DOMDocument();
		@$dom->loadHTML('<?xml encoding="UTF-8">' . $content, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
		$xpath = new \DOMXPath($dom);
		
		// Find all elements with inline style attributes
		$elements_with_style = $xpath->query('//*[@style]');
		
		foreach ($elements_with_style as $element) {
			/** @var \DOMElement $element */
			if (!$element instanceof \DOMElement) {
				continue;
			}
			// Skip SVG tags and their descendants (exception)
			$is_svg_or_descendant = false;
			$current = $element;
			while ($current && $current instanceof \DOMElement) {
				if (strtolower($current->tagName) === 'svg') {
					$is_svg_or_descendant = true;
					break;
				}
				$current = $current->parentNode;
			}
			
			if ($is_svg_or_descendant) {
				continue;
			}
			
			// Special case: Skip validation if inline style is exactly "display: none"
			$style = $element->getAttribute('style');
			if (trim($style) === 'display: none') {
				continue;
			}
			
			$class = $element->getAttribute('class');
			$has_blockera_block = strpos($class, 'blockera-block') !== false;
			
			// Condition 1: If tag has inline style and has blockera-block, fail
			if ($has_blockera_block) {
				$tag_name = $element->tagName;
				$this->fail("Tag <{$tag_name}> with 'blockera-block' class has inline style attribute.\nTest: {$designName}");
			}
			
			// Condition 2: If tag has inline style but doesn't have this class, check parents recursively
			if (!$has_blockera_block) {
				$parent = $element->parentNode;
				while ($parent && $parent instanceof \DOMElement) {
					/** @var \DOMElement $parent */
					$parent_class = $parent->getAttribute('class');
					$parent_has_blockera_block = strpos($parent_class, 'blockera-block') !== false;
					
					if ($parent_has_blockera_block) {
						$tag_name = $element->tagName;
						$parent_tag_name = $parent->tagName;
						$this->fail("Tag <{$tag_name}> has inline style attribute and parent <{$parent_tag_name}> has 'blockera-block' class.\nTest: {$designName}");
					}
					
					$parent = $parent->parentNode;
				}
			}
		}
	}

	/**
	 * Provide the design names.
	 *
	 * @return array The design names.
	 */
	public function designNameProvider(): array {

		$fixtures_dir = dirname(__DIR__, 2) . '/fixtures';
		$designs = glob($fixtures_dir . '/*/');

		// Filter designs based on config.json snapshot setting
		$filtered_designs = array_filter($designs, function($design) use ($fixtures_dir) {
			$config_path = $design . 'config.json';

			// If config.json doesn't exist, default to true (run snapshot test)
			if (!file_exists($config_path)) {
				return true;
			}

			// Read config.json
			$config_content = file_get_contents($config_path);
			if ($config_content === false) {
				// If we can't read the config, default to true (run snapshot test)
				return true;
			}

			$config = json_decode($config_content, true);
			
			// If json_decode failed or config is not an array, default to true (run snapshot test)
			if (!is_array($config)) {
				return true;
			}
			
			// If snapshot property is not set or is not explicitly false, run the test
			// Only skip if snapshot is explicitly false
			return !isset($config['snapshot']) || $config['snapshot'] !== false;
		});

		return array_map(function($design) {
			return [basename($design)];
		}, $filtered_designs);
	}
}