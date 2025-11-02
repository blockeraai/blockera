<?php

namespace Blockera\Tests;

use ReflectionClass;
use Blockera\Setup\Blockera;
use Blockera\Bootstrap\Application;
use Blockera\Dev\PhpUnit\CssDriver;
use Blockera\Dev\PHPUnit\AppTestCase;
use Spatie\Snapshots\MatchesSnapshots;

class BlockeraTest extends AppTestCase {

	use MatchesSnapshots;

	protected Application $app;

	protected string $design;

	protected function getSnapshotId(): string {

		if (1 === $this->snapshotIncrementor) {
			return 'frontend';
		}

		return 'frontend' . '__' . $this->snapshotIncrementor;
	}

	protected function getSnapshotDirectory(): string {

		return dirname((new ReflectionClass($this))->getFileName()).
			DIRECTORY_SEPARATOR.
			'snapshots' . DIRECTORY_SEPARATOR . 'designs' . DIRECTORY_SEPARATOR . $this->design;
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
			
			$this->assertMatchesHtmlSnapshot(get_the_content());
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
	 * Provide the design names.
	 *
	 * @return array The design names.
	 */
	public function designNameProvider(): array {

		$designs = glob(dirname(__DIR__, 2) . '/fixtures/designs/*/');

		return array_map(function($design) {
			return [basename($design)];
		}, $designs);
	}
}