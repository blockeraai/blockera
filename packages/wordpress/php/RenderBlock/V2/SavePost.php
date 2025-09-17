<?php

namespace Blockera\WordPress\RenderBlock\V2;

use Blockera\Data\Cache\Cache;
use Blockera\Bootstrap\Application;

/**
 * Class SavePost to cache styles for current post published.
 *
 * @package SavePost
 */
class SavePost {

	/**
	 * The cache instance.
	 *
	 * @var Cache
	 */
	protected Cache $cache;

    /**
     * Store instance of app container.
     *
     * @var Application
     */
    protected Application $app;

    /**
     * Constructor of SavePost class.
     *
     * @param Application $app    the instance of Application container.
     * @param Cache       $cache the cache instance.
     */
    public function __construct( Application $app, Cache $cache) {
        $this->app   = $app;
		$this->cache = $cache;
    }

    /**
     * Save post to database action,
     * we will use this to cache post data with generate css and manipulate html.
     *
     * @param int      $postId The current post Identifier.
     * @param \WP_Post $post   The instance of WP_Post class.
     * @param array    $supports The supports.
     * @return void
     */
    public function save( int $postId, \WP_Post $post, array $supports): void {

		$this->saveGlobalStyles($postId, $post);

		// phpcs:disable
		// We should not cache post content for wp_template and wp_template_part post types, because we will create cache for them in the rest api.
		// if (in_array($post->post_type, [ 'wp_template', 'wp_template_part' ], true)) {
		// return;
		// }
		// phpcs:enable

		if (empty($post->post_content)) {
			return;
		}

		$cache = $this->cache->getCache($postId, 'post_content');

		// If cache found, return.
		if (! empty($cache) && ( isset($cache['hash']) && md5($post->post_content) === $cache['hash'] )) {
			return;
		}

        // Get the updated blocks after cleanup.
		$this->app->make(Transpiler::class)->cleanupInlineStyles($post->post_content, $postId, $supports);
    }

	/**
	 * Save global styles meta data to post meta.
	 *
	 * @param integer  $postId The current post Identifier.
	 * @param \WP_Post $post The instance of WP_Post class.
	 * 
	 * @return void
	 */
	protected function saveGlobalStyles( int $postId, \WP_Post $post): void {
		if (get_post_type($postId) !== 'wp_global_styles') {
			return;
		}

		$post_content = $post->post_content;
		$post_content = json_decode($post_content, true);

		if (! isset($post_content['styles']['blockeraMetaData'])) {
			return;
		}

		update_post_meta($postId, 'blockeraGlobalStylesMetaData', $post_content['styles']['blockeraMetaData']);
		
		unset($post_content['styles']['blockeraMetaData']);
		$post_content = json_encode($post_content);

		wp_update_post(
            array(
				'ID' => $postId,
				'post_content' => $post_content,
            )
        );
	}

	/**
	 * Insert wp_template or wp_template_part post type.
	 *
	 * @param \stdClass $prepared_post The instance of stdClass class.
	 * @param array     $supports      The supports.
	 *
	 * @return \stdClass
	 */
    public function insertWPTemplate( \stdClass $prepared_post, array $supports): \stdClass {
		if (empty($prepared_post) || ! property_exists($prepared_post, 'post_content') || empty($prepared_post->post_content)) {
			return $prepared_post;
		}

		$post_id = property_exists($prepared_post, 'ID') ? $prepared_post->ID : 0;

		if (! $post_id) {
			$key = 'post_content' . '_' . md5($prepared_post->post_content);
		}

		$cache = $this->cache->getCache($post_id, isset($key) ? $key : 'post_content');

		// If cache found, return.
		if (! empty($cache) && ( isset($cache['hash']) && md5($prepared_post->post_content) === $cache['hash'] )) {
			return $prepared_post;
		}

        // Get the updated blocks after cleanup.
        $this->app->make(Transpiler::class)->cleanupInlineStyles($prepared_post->post_content, $post_id, $supports);

        return $prepared_post;
    }
}
