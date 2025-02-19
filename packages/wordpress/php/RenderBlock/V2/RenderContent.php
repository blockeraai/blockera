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
     * Fire WordPress actions or filters Hooks.
     *
     * @return void
     */
    public function applyHooks(): void {

		// Filtering get_posts query.
        add_action('pre_get_posts', [ $this, 'getPosts' ]);

		// Filtering render block content if it name is exact "core/block" and has ref attribute.
        add_filter('render_block', [ $this, 'renderBlock' ], 10, 2);
    }

	/**
     * Filtering get_posts query.
     *
     * @param \WP_Query $query The WordPress query instance.
     *
     * @return void
     */
    public function getPosts( \WP_Query $query) {
		if (! $query->is_main_query() || is_admin() || wp_doing_ajax() || isset($_REQUEST['_wp-find-template'])) {
            return;
		}

        add_filter('the_posts', [ $this, 'thePosts' ]);
    }

	/**
	 * Filtering render block.
	 *
	 * @param string $block_content The block content.
	 * @param array  $block         The block array.
	 *
	 * @return string The block content.
	 */
    public function renderBlock( string $block_content, array $block): string {
		// Skip processing during block editor save.
		if (wp_doing_ajax() || is_admin() || defined('REST_REQUEST') && REST_REQUEST) {
            return $block_content;
		}

		if (isset($block['blockName']) && 'core/block' === $block['blockName']) {

			if (! isset($block['attrs']['ref'])) {
				return $block_content;
			}

			$post = get_post($block['attrs']['ref']);

			if (! $post) {
				return $block_content;
			}

			return $this->cleanup($post);
		}

        return $block_content;
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

        return array_map(
            function ( \WP_Post $post): \WP_Post {

				if (empty($post->post_content)) {
					return $post;
				}

				// Skip global styles post type.
				if ('wp_global_styles' === $post->post_type) {
					return $post;
				}

				// Skip posts while in the front page and current post type is not wp_template or wp_template_part.
				if (is_front_page() && ! in_array($post->post_type, [ 'wp_template', 'wp_template_part' ], true)) {
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
	 *
	 * @return string The post content.
	 */
	protected function cleanup( \WP_Post $post): string {

		// Get cache data.
		$cached_post_content = $this->cache->getCache($post->ID, 'post_content');

		if (! empty($cached_post_content)) {

			// Prepare post content.
			return $this->prepareCleanupContent(
                $cached_post_content,
                [
					'post_id' => $post->ID,
					'type' => 'post_content',
					'origin_content' => $post->post_content,
				]
            );
		}

		// Get the updated blocks after cleanup.
		$data = $this->transpiler->cleanupInlineStyles($post->post_content, $post->ID);

		// Prepare post content.
		return $this->prepareCleanupContent(
            $data,
            [
				'post_id' => $post->ID,
				'type' => 'post_content',
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
