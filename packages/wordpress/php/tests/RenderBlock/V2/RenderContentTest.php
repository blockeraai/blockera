<?php

namespace Blockera\Tests\Unit\WordPress\RenderBlock\V2;

use Blockera\Setup\Blockera;
use Blockera\Data\Cache\Cache;
use Blockera\Bootstrap\Application;
use Blockera\WordPress\RenderBlock\V1\Render;
use Blockera\Setup\Providers\AppServiceProvider;
use Blockera\WordPress\RenderBlock\V2\Transpiler;
use Blockera\WordPress\RenderBlock\V2\RenderContent;

class RenderContentTest extends \Blockera\Dev\PHPUnit\AppTestCase
{
    protected Application $app;
    protected Transpiler $transpiler;
	protected Cache $cache;
    protected RenderContent $renderContent;
    protected Render $render;

    protected function setUp(): void
    {
        parent::setUp();

		$this->app = Blockera::getInstance();
		$this->app->bootstrap();

        $this->renderContent = $this->app->make(RenderContent::class);

        // Setup WP_Mock
        \WP_Mock::setUp();
    }

    protected function tearDown(): void
    {
        \WP_Mock::tearDown();
        parent::tearDown();
    }

    public function testGetPostsSkipsNonMainQuery(): void
    {
        $query = $this->createMock(\WP_Query::class);
        $query->method('is_main_query')->willReturn(false);
        
        \WP_Mock::userFunction('is_admin')->andReturn(false);
        \WP_Mock::userFunction('wp_doing_ajax')->andReturn(false);
        
        $this->renderContent->getPosts($query, []);
        
        $this->assertFalse(has_filter('the_posts', [$this->renderContent, 'thePosts']));
    }

    public function testGetPostsAddsFilterForMainQuery(): void
    {
        $query = $this->createMock(\WP_Query::class);
        $query->method('is_main_query')->willReturn(true);
        
        \WP_Mock::userFunction('is_admin')->andReturn(false);
        \WP_Mock::userFunction('wp_doing_ajax')->andReturn(false);
        
        $this->renderContent->getPosts($query, ['test-support']);
        
        $this->assertTrue(has_filter('the_posts', [$this->renderContent, 'thePosts']) !== false);
    }

    public function testRenderBlockWithCoreBlock(): void
    {
        $post = new \stdClass();
        $post->ID = 1;
        $post->post_content = '<!-- wp:block {"ref":10} /-->';
        
        $block = [
            'blockName' => 'core/block',
            'attrs' => ['ref' => 10]
        ];

        \WP_Mock::userFunction('wp_doing_ajax')->andReturn(false);
        \WP_Mock::userFunction('is_admin')->andReturn(false);
        \WP_Mock::userFunction('get_post')->with(1)->andReturn($post);

        $result = $this->renderContent->renderBlock($post->post_content, $block, []);
        
        $this->assertEquals($post->post_content, $result);
    }

    public function testRenderBlockWithDynamicBlock(): void
    {
        $block = [
            'blockName' => 'core/heading',
            'attrs' => [
				'blockeraPropsId' => wp_generate_uuid4(),
			],
			'innerBlocks' => [],
			'innerHTML' => '\n<h2 class=\"wp-block-heading\">Test heading<\/h2>\n',
			'innerContent' => ["\n<h2 class=\"wp-block-heading\">Test heading<\/h2>\n"]
        ];

        \WP_Mock::userFunction('wp_doing_ajax')->andReturn(false);
        \WP_Mock::userFunction('is_admin')->andReturn(false);
        \WP_Mock::userFunction('blockera_block_is_dynamic')
            ->with($block)
            ->andReturn(true);

		$supports = blockera_get_available_block_supports();
        $result = $this->renderContent->renderBlock($block['innerHTML'], $block, $supports);

        $this->assertEquals('\n<h2 class="blockera-block blockera-block-test \&quot;wp-block-heading\&quot;">Test heading<\/h2>\n', $result);
    }

    public function testThePostsWithEmptyPosts(): void
    {
        $result = $this->renderContent->thePosts([]);
        $this->assertEquals([], $result);
    }

	/**
	 * @dataProvider validPostsDataProviders
	 */
    public function testThePostsWithValidPosts(array $data): void
    {
        $post = new \stdClass();
        $post->ID = 1;
        $post->post_type = 'post';
        $post->post_content = $data['original_content'];

        \WP_Mock::userFunction('is_front_page')->andReturn(false);

		$supports = blockera_get_available_block_supports();
		$this->renderContent->setSupports($supports);
        $result = $this->renderContent->thePosts([new \WP_Post($post)]);
        
        $this->assertCount(1, $result);

        $this->assertSame(
            preg_replace('/\s+/', '', $data['expected_content']),
            preg_replace('/\s+/', '', $result[0]->post_content)
        );
    }

	public function validPostsDataProviders():array{

		return [
			[
				[
					'original_content' => file_get_contents( dirname(__DIR__, 2). '/Fixtures/RenderContent/V2/posts/paragraph.html'),
					'expected_content' => file_get_contents(dirname(__DIR__, 2). '/Fixtures/RenderContent/V2/posts/paragraph-expected.html'),
				]
			],
			[
				[
					'original_content' => file_get_contents(dirname(__DIR__, 2). '/Fixtures/RenderContent/V2/posts/columns.html'),
					'expected_content' => file_get_contents(dirname(__DIR__, 2). '/Fixtures/RenderContent/V2/posts/columns-expected.html'),
				]
			],
			[
				[
					'original_content' => file_get_contents(dirname(__DIR__, 2). '/Fixtures/RenderContent/V2/posts/duplicate-columns.html'),
					'expected_content' => file_get_contents(dirname(__DIR__, 2). '/Fixtures/RenderContent/V2/posts/duplicate-columns-expected.html'),
				]
			]
		];
	}

    public function testPrepareCleanupContentForBlockContent(): void
    {
        $data = [
            'parsed_blocks' => [['blockName' => 'test-block']],
            'generated_css_styles' => ['test-style']
        ];

        $context = [
            'type' => 'block_content',
            'origin_content' => 'Original content',
            'post_id' => 1
        ];

        \WP_Mock::userFunction('blockera_add_inline_css')
            ->with('test-style')
            ->andReturn(true);

        \WP_Mock::userFunction('render_block')
            ->with(['blockName' => 'test-block'])
            ->andReturn('Rendered block');

        $result = $this->invokeMethod($this->renderContent, 'prepareCleanupContent', [$data, $context]);
        
        $this->assertEquals('', $result);
    }

    public function testPrepareCleanupContentForPostContent(): void
    {
        $data = [
            'serialized_blocks' => 'Serialized content',
            'generated_css_styles' => ['test-style']
        ];

        $context = [
            'type' => 'post_content',
            'origin_content' => 'Original content',
            'post_id' => 1
        ];

        \WP_Mock::userFunction('blockera_add_inline_css')
            ->with('test-style')
            ->andReturn(true);
			
		$result = $this->invokeMethod($this->renderContent, 'prepareCleanupContent', [$data, $context]);
        
        $this->assertEquals('Serialized content', $result);
    }

    public function testPrepareCleanupContentWithEmptyContent(): void
    {
        $data = [];
        $context = [
            'type' => 'post_content',
            'origin_content' => '',
            'post_id' => 1
        ];

		$result = $this->invokeMethod($this->renderContent, 'prepareCleanupContent', [$data, $context]);
        
        $this->assertEquals('', $result);
    }

    public function testPrepareCleanupContentWithInvalidType(): void
    {
        $data = [];
        $context = [
            'type' => 'invalid_type',
            'origin_content' => 'Original content',
            'post_id' => 1
        ];

        $result = $this->invokeMethod($this->renderContent, 'prepareCleanupContent', [$data, $context]);
        
        $this->assertEquals('Original content', $result);
    }
}