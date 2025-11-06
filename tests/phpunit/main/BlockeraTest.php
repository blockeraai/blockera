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

		$post_id =$this->factory()->post->create([
			'post_title'   => 'Test Design: ' . $designName,
			'post_content' => $post_content,
			'post_status'  => 'publish',
			'post_type'    => 'post',
		]);

		$this->go_to(get_permalink($post_id));

		while(have_posts()) {
			the_post();
			
			$blocks = parse_blocks(get_the_content());
			$content = '';

			foreach ($blocks as $block) {
				$content .= render_block($block);
			}

			$this->assertMatchesSnapshot($content, new HtmlDriver());
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

		$post_id =$this->factory()->post->create([
			'post_title'   => 'Test Design: ' . $designName,
			'post_content' => $post_content,
			'post_status'  => 'publish',
			'post_type'    => 'post',
		]);

		$this->go_to(get_permalink($post_id));
		
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

		require_once BLOCKERA_SB_PATH . 'bootstrap/hooks.php';

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

		$post_id =$this->factory()->post->create([
			'post_title'   => 'Test Design: ' . $designName,
			'post_content' => $post_content,
			'post_status'  => 'publish',
			'post_type'    => 'post',
		]);

		$this->go_to(get_permalink($post_id));

		while(have_posts()) {
			the_post();

			get_the_content();
		}

		$cache_key  = 'wp_styles_for_blocks';
		$cached     = get_transient($cache_key);

		$global_styles = $cached['blocks']['core/paragraph'] ?? '';

		$this->assertMatchesSnapshot($global_styles, new CssDriver());

		wp_delete_post($post_id);
	}

	/**
	 * Provide the design names.
	 *
	 * @return array The design names.
	 */
	public function designNameProvider(): array {

		$designs = glob(dirname(__DIR__, 2) . '/fixtures/*/');

		return array_map(function($design) {
			return [basename($design)];
		}, $designs);
	}
}