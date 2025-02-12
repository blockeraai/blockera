<?php

namespace Blockera\WordPress\RenderBlock\V2;

use Blockera\Data\Cache\Cache;
use Blockera\Bootstrap\Application;

/**
 * Class Render filtering WordPress BlockType render process.
 *
 * @package Render
 */
class RenderContent {

    /**
     * Hold application instance.
     *
     * @var Application
     */
    protected Application $app;

    /**
     * Render constructor.
     *
     * @param Application $app the app instance.
     */
    public function __construct( Application $app) {
        $this->app = $app;
    }

    /**
     * Fire WordPress actions or filters Hooks.
     *
     * @return void
     */
    public function applyHooks(): void {
        add_action('pre_get_posts', [ $this, 'filterGetPosts' ]);
    }

    /**
     * Filtering get_posts query.
     *
     * @param \WP_Query $query The WordPress query instance.
     *
     * @return void
     */
    public function filterGetPosts( \WP_Query $query) {
		if (! $query->is_main_query() || is_admin() || wp_doing_ajax() || isset($_REQUEST['_wp-find-template'])) {
            return;
		}

        add_filter('the_posts', [ $this, 'filterPostsContent' ]);
    }

	/**
	 * Filtering posts content.
	 *
	 * @param array $posts The posts array.
	 *
	 * @return array The posts array.
	 */
	public function filterPostsContent( array $posts): array {
		if (empty($posts)) {
			return $posts;
		}

		$transpiler = $this->app->make(Transpiler::class);

		foreach ($posts as $post) {
			if (empty($post->post_content)) {
				continue;
			}

			// Skip global styles post type.
			if ('wp_global_styles' === $post->post_type) {
				continue;
			}

			// Skip front page while post type is not wp_template.
			if (is_front_page() && 'wp_template' !== $post->post_type) {
				continue;
			}

			$parsed_blocks = parse_blocks($post->post_content);

			// Skip empty parsed blocks.
			if (empty($parsed_blocks)) {
				continue;
			}

			// Get cache data.
			$cache               = $this->app->make(Cache::class, [ 'product_id' => 'blockera' ]);
			$cached_post_content = $cache->getCache($post->ID, 'post_content');

			if (! empty($cached_post_content)) {
						
				$styles                   = $cached_post_content['generated_css_styles'];
				$serialized_cached_blocks = $cached_post_content['serialized_blocks'];
				$parsed_blocks            = $cached_post_content['parsed_blocks'];

				blockera_add_inline_css(
					implode(PHP_EOL, $styles)
				);

				$post->post_content = $serialized_cached_blocks;

				continue;
			}
					
			$parsed_blocks = parse_blocks($post->post_content);

			// Excluding empty post content.
			if (empty($parsed_blocks)) {

				continue;
			}

			// Get the updated blocks after cleanup.
			$data = $transpiler->cleanupInlineStyles($parsed_blocks, $post->ID);

			$post->post_content = $data['serialized_blocks'];

			blockera_add_inline_css(
				implode(PHP_EOL, $data['generated_css_styles'])
			);
		}

        return $posts;
	}
}
