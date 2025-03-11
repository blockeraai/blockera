<?php

namespace Blockera\WordPress\RenderBlock\V2;

use Blockera\Data\Cache\Cache;
use Blockera\Bootstrap\Application;
use Blockera\WordPress\RenderBlock\V1\Render;

/**
 * Class Render filtering WordPress BlockType render process.
 *
 * @package Render
 */
class RenderContent {

	/**
	 * Cache instance.
	 *
	 * @var Cache
	 */
	protected Cache $cache;

    /**
     * Hold application instance.
     *
     * @var Application
     */
    protected Application $app;

    /**
     * Transpiler instance.
     *
     * @var Transpiler
     */
    protected Transpiler $transpiler;

	/**
	 * Store the supports.
	 *
	 * @var array $supports
	 */
	protected array $supports = [];

	/**
	 * Store the block styles dir base path.
	 *
	 * @var string $block_styles_dir_base_path
	 */
	protected string $block_styles_dir_base_path;

	/**
	 * Store the is minify inline css.
	 *
	 * @var bool $is_minify_inline_css
	 */
	protected bool $is_minify_inline_css;

	/**
	 * Store the block global styles map.
	 *
	 * @var array $block_global_styles_map
	 */
	protected array $block_global_styles_map;

    /**
     * Render constructor.
     *
     * @param Application $app the app instance.
	 * @param Transpiler  $transpiler the transpiler instance.
	 * @param Cache       $cache the cache instance.
     */
    public function __construct( Application $app, Transpiler $transpiler, Cache $cache) {
        $this->app        = $app;
		$this->cache      = $cache;
        $this->transpiler = $transpiler;
    }

	/**
	 * Set the block styles dir base path.
	 */
	public function setBlockStylesDirBasePath( string $base_path): void {
		$this->block_styles_dir_base_path = $base_path;
	}

	/**
	 * Set the is minify inline css.
	 *
	 * @param bool $is_minify_inline_css The is minify inline css.
	 *
	 * @return void
	 */
	public function setIsMinifyInlineCss( bool $is_minify_inline_css): void {
		$this->is_minify_inline_css = $is_minify_inline_css;
	}

	/**
	 * Set the block global styles map.
	 *
	 * @param array $block_global_styles_map The block global styles map.
	 *
	 * @return void
	 */
	public function setBlockGlobalStylesMap( array $block_global_styles_map): void {
		$this->block_global_styles_map = $block_global_styles_map;
	}

	/**
     * Filtering get_posts query.
     *
     * @param \WP_Query $query The WordPress query instance.
	 * @param array     $supports The supports.
     *
     * @return void
     */
    public function getPosts( \WP_Query $query, array $supports = []): void {
		if (! $query->is_main_query() || is_admin() || wp_doing_ajax() || isset($_REQUEST['_wp-find-template'])) {
            return;
		}

		$this->supports = $supports;

        add_filter('the_posts', [ $this, 'thePosts' ]);
    }

	/**
	 * Filtering render block.
	 *
	 * @param string $block_content The block content.
	 * @param array  $block         The block array.
	 * @param array  $supports      The supports.
	 *
	 * @return string The block content.
	 */
    public function renderBlock( string $block_content, array $block, array $supports = []): string {
		// Skip processing during block editor save.
		if (wp_doing_ajax() || is_admin() || defined('REST_REQUEST') && REST_REQUEST) {
            return $block_content;
		}
		
		// Check block to is support by Blockera.
        if (blockera_is_supported_block($block)) {
            $this->printBlockGlobalStyles($block);
        }

		if (isset($block['blockName']) && 'core/block' === $block['blockName']) {

			$this->supports = $supports;

			if (! isset($block['attrs']['ref'])) {
				return $block_content;
			}

			$post = get_post($block['attrs']['ref']);

			if (! $post) {
				return $block_content;
			}

			return $this->cleanup($post, 'block_content');

		} elseif (blockera_block_is_dynamic($block) && ! str_contains($block_content, 'blockera-is-transpiled')) {

			$render = $this->app->make(Render::class);
			// Disable cache for dynamic blocks.
			$render->setCacheStatus(false);

			return $render->render($block_content, $block, $supports);
		}

        return $block_content;
    }

	/**
	 * Load block inline styles.
	 *
	 * @param array $block The block.
	 *
	 * @return void
	 */
	private function printBlockGlobalStyles( array $block): void {
		static $loaded_styles = [];

		$block_name = $block['blockName'];

		if (isset($this->block_global_styles_map[ $block_name ])) {
			$block_name = $this->block_global_styles_map[ $block_name ];
		}

		$handle = 'block-' . str_replace([ 'core/', '/' ], [ '', '-' ], $block_name) . '-styles';

		// Skip if already loaded this style.
		if (isset($loaded_styles[ $handle ])) {
			return;
		}

		$file_path = $this->block_styles_dir_base_path . $handle . '/style' . ( $this->is_minify_inline_css ? '.min' : '' ) . '.css';

		if (file_exists($file_path)) {
			// Use file_get_contents which is faster than WP filesystem.
			$file_contents = file_get_contents($file_path);

			if ($file_contents) {
				// Only strip comments if not minified.
				if (! $this->is_minify_inline_css) {
					$file_contents = preg_replace('/\/\*.*?\*\//s', '', $file_contents);
				}

				blockera_add_inline_css($file_contents);

				// Mark this style as loaded.
				$loaded_styles[ $handle ] = true;
			}
		}		
	}

	/**
	 * Filtering posts.
	 *
	 * @param array $posts The posts array.
	 *
	 * @return array The posts array.
	 */
	public function thePosts( array $posts): array {
		if (empty($posts)) {
			return $posts;
		}

		$is_front_page = is_front_page();

        return array_map(
            function ( \WP_Post $post) use ( $is_front_page): \WP_Post {

				if (empty($post->post_content)) {
					return $post;
				}

				// Skip global styles post type.
				if ('wp_global_styles' === $post->post_type) {
					return $post;
				}

				// Skip posts while in the front page and current post type is not wp_template or wp_template_part.
				if ($is_front_page && ! in_array($post->post_type, [ 'wp_template', 'wp_template_part' ], true)) {
					return $post;
				}

				// Cleanup post content.
				$post->post_content = $this->cleanup($post);

				return $post;
			},
            $posts
        );
    }

	/**
	 * Cleanup post content.
	 *
	 * @param \WP_Post $post The post instance.
	 * @param string   $context The context. default is 'post_content'.
	 *
	 * @return string The post content.
	 */
	protected function cleanup( \WP_Post $post, string $context = 'post_content'): string {

		// Get cache data.
		$cache = $this->cache->getCache($post->ID, 'post_content');

		if (! empty($cache) && ( isset($cache['hash']) && md5($post->post_content) === $cache['hash'] )) {

			// Prepare post content.
			return $this->prepareCleanupContent(
                $cache,
                [
					'post_id' => $post->ID,
					'type' => $context,
					'origin_content' => $post->post_content,
				]
            );
		}

		// Get the updated blocks after cleanup.
		$data = $this->transpiler->cleanupInlineStyles($post->post_content, $post->ID, $this->supports);

		// Prepare post content.
		return $this->prepareCleanupContent(
            $data,
            [
				'post_id' => $post->ID,
				'type' => $context,
				'origin_content' => $post->post_content,
			]
        );
	}

	/**
	 * Prepare cleanup content.
	 *
	 * @param array $data The data. includes 'serialized_blocks', 'generated_css_styles', and 'parsed_blocks'.
	 * @param array $context The context data.includes 'post_id', 'type' and 'origin_content'.
	 *
	 * @return string The cleanup content.
	 */
	protected function prepareCleanupContent( array $data, array $context): string {

		// Validate context original content.
		if (empty($context['origin_content'])) {

			// Return empty string if no context original content found.
			return '';
		}

		// Validate context type.
		if (empty($context['type']) || ! in_array($context['type'], [ 'block_content', 'post_content' ], true)) {

			// Return original content if no context type found or invalid.
			return $context['origin_content'];
		}

		// Prepare block content.
		if ('block_content' === $context['type'] && ! empty($data['parsed_blocks'][0])) {
			blockera_add_inline_css(
                implode(PHP_EOL, $data['generated_css_styles'] ?? [ '/******* ' . __('No styles found for block id', 'blockera') . ' #' . $context['blockera_props_id'] ?? 'NULL' . ' *******/' ])
			);

			// Return block content.
			return render_block($data['parsed_blocks'][0]);
		}

		// Prepare post content.
		if ('post_content' === $context['type'] && ! empty($data['serialized_blocks'])) {

			blockera_add_inline_css(
				implode(PHP_EOL, $data['generated_css_styles'] ?? [ '/******* ' . __('No styles found for post id', 'blockera') . ' #' . $context['post_id'] ?? 'NULL' . ' *******/' ])
            );

			// Return serialized blocks text as post content.
			return $data['serialized_blocks'];
		}

		// Return original content if no context type found.
		return $context['origin_content'];
	}
}
