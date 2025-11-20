<?php

namespace Blockera\Tests;

use ReflectionClass;
use Blockera\Setup\Blockera;
use Blockera\Bootstrap\Application;
use Blockera\Dev\PhpUnit\CssDriver;
use Blockera\Dev\PhpUnit\HtmlDriver;
use Blockera\Dev\PHPUnit\AppTestCase;
use Spatie\Snapshots\MatchesSnapshots;

class BlockeraTest extends AppTestCase {

	use MatchesSnapshots;

	protected string $design;
	protected Application $app;
	protected bool $is_global_styles = false;

	protected function getSnapshotId(): string {

		$id = $this->is_global_styles ? 'frontend-global-styles' : 'frontend';

		if (1 === $this->snapshotIncrementor) {
			return $id;
		}

		return $id . '__' . $this->snapshotIncrementor;
	}

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

		$this->app = Blockera::getInstance();
		$this->app->bootstrap();

        // Setup WP_Mock
        \WP_Mock::setUp();
    }

	/**
	 * Test the frontend output of a design.
	 *
	 * @param string $designName The design name.
	 * 
	 * @dataProvider designNameProvider
	 *
	 * @return void
	 */
	public function test_frontend_template(string $designName): void {

		$this->design = $designName;

		try {
			// Arrange
			$post_content = blockera_test_get_design_input($designName);
		} catch (\Exception $e) {
			$this->fail($e->getMessage());
		}

		$this->executeWpCliCommands($designName);

		$post_id = $this->createTestPostWithSnapshot($designName, $post_content);
		$this->go_to(get_permalink($post_id));

		while(have_posts()) {
			the_post();
			
			$blocks = parse_blocks(get_the_content());
			$content = '';

			foreach ($blocks as $block) {
				$content .= render_block($block);
			}

			// Apply global html-search-replace first if configured
			$global_config = blockera_test_get_global_config();
			if ($global_config && isset($global_config['html-search-replace']) && is_array($global_config['html-search-replace'])) {
				$content = blockera_test_apply_html_search_replace($content, $global_config['html-search-replace']);
			}

			// Apply test-specific html-search-replace if configured
			$config = blockera_test_get_config($designName);
			if ($config && isset($config['html-search-replace']) && is_array($config['html-search-replace'])) {
				$content = blockera_test_apply_html_search_replace($content, $config['html-search-replace']);
			}

			// Check with snapshot content
			$this->assertMatchesSnapshot($content, new HtmlDriver());

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
		}

		wp_delete_post($post_id);
    }

	/**
	 * Test the frontend styles of a design.
	 *
	 * @param string $designName The design name.
	 * 
	 * @dataProvider designNameProvider
	 *
	 * @return void
	 */
	public function test_frontend_styles(string $designName): void {
		
		$this->design = $designName;

		try {
			// Arrange
			$post_content = blockera_test_get_design_input($designName);
		} catch (\Exception $e) {
			$this->fail($e->getMessage());
		}

		$this->executeWpCliCommands($designName);

		$post_id = $this->createTestPostWithSnapshot($designName, $post_content);
		$this->go_to(get_permalink($post_id));

		while(have_posts()) {
			the_post();
			
			$blocks = parse_blocks(get_the_content());
			$content = '';

			foreach ($blocks as $block) {
				if(!empty($block['innerContent'])){
					continue;
				}

				$content .= render_block($block);
			}
		}
		
		$inline_css = apply_filters('blockera/front-page/print-inline-css-styles', '');

		$this->assertMatchesSnapshot($inline_css, new CssDriver());

		wp_delete_post($post_id);
	}

	/**
	 * Test the frontend global styles of a design.
	 *
	 * @param string $designName The design name.
	 * 
	 * @dataProvider designNameProvider
	 *
	 * @return void
	 */
	public function test_frontend_global_styles(string $designName): void {
		
		$this->design = $designName;
		$this->is_global_styles = true;

		tests_add_filter('blockera/json/resolver/get_style_variations', function (array $variations): array {
			return blockera_test_register_style_variations($this->design, $variations);
		});

		do_action('wp_enqueue_scripts');

		try {
			// Arrange
			$post_content = blockera_test_get_design_input($designName);
		} catch (\Exception $e) {
			$this->fail($e->getMessage());
		}

		$this->executeWpCliCommands($designName);

		$post_id = $this->createTestPostWithSnapshot($designName, $post_content);
		$this->go_to(get_permalink($post_id));

		$blocks = [];

		while(have_posts()) {
			the_post();
			
			$blocks = array_column(parse_blocks(get_the_content()), 'blockName');
		}

		$global_styles = '';

		foreach (array_filter(array_unique($blocks)) as $block) {
			$cache_key  = 'wp_styles_for_blocks';
			$cached     = get_transient($cache_key);

			$global_styles .= $cached['blocks'][$block] ?? '';
		}

		$this->assertMatchesSnapshot(blockera_test_normalize_css($global_styles), new CssDriver());

		wp_delete_post($post_id);
	}

	/**
	 * Check that tags with inline styles follow the rules:
	 * 1. Tags with inline style that have 'blockera-block' or 'be-transpiled' should fail
	 * 2. Tags with inline style without these classes should check parents recursively
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
			
			$class = $element->getAttribute('class');
			$has_blockera_block = strpos($class, 'blockera-block') !== false;
			$has_be_transpiled = strpos($class, 'be-transpiled') !== false;
			
			// Condition 1: If tag has inline style and has blockera-block or be-transpiled, fail
			if ($has_blockera_block || $has_be_transpiled) {
				$tag_name = $element->tagName;
				$classes = $has_blockera_block && $has_be_transpiled 
					? 'blockera-block and be-transpiled' 
					: ($has_blockera_block ? 'blockera-block' : 'be-transpiled');
				$this->fail("Tag <{$tag_name}> with '{$classes}' class has inline style attribute.\nTest: {$designName}");
			}
			
			// Condition 2: If tag has inline style but doesn't have these classes, check parents recursively
			if (!$has_blockera_block && !$has_be_transpiled) {
				$parent = $element->parentNode;
				while ($parent && $parent instanceof \DOMElement) {
					$parent_class = $parent->getAttribute('class');
					$parent_has_blockera_block = strpos($parent_class, 'blockera-block') !== false;
					$parent_has_be_transpiled = strpos($parent_class, 'be-transpiled') !== false;
					
					if ($parent_has_blockera_block || $parent_has_be_transpiled) {
						$tag_name = $element->tagName;
						$parent_tag_name = $parent->tagName;
						$parent_classes = $parent_has_blockera_block && $parent_has_be_transpiled 
							? 'blockera-block and be-transpiled' 
							: ($parent_has_blockera_block ? 'blockera-block' : 'be-transpiled');
						$this->fail("Tag <{$tag_name}> has inline style attribute and parent <{$parent_tag_name}> has '{$parent_classes}' class.\nTest: {$designName}");
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