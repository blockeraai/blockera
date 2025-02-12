<?php

namespace Blockera\WordPress\RenderBlock\V2;

use Blockera\Bootstrap\Application;

/**
 * Class SavePost to cache styles for current post published.
 *
 * @package SavePost
 */
class SavePost {

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
     */
    public function __construct( Application $app) {
        $this->app    = $app;

        add_action('save_post', [ $this, 'save' ], 9e8, 2);

        add_filter('rest_pre_insert_wp_template', [ $this, 'insertWPTemplate' ], 10, 2);
    }

    /**
     * Save post to database action,
     * we will use this to cache post data with generate css and manipulate html.
     *
     * @param int      $postId The current post Identifier.
     * @param \WP_Post $post   The instance of WP_Post class.
     *
     * @return void
     */
    public function save( int $postId, \WP_Post $post): void {
		// We should not cache post content for wp_template post type.
		if ('wp_template' === $post->post_type) {
			return;
		}

        $parsed_blocks = parse_blocks($post->post_content);

        // Excluding empty post content.
        if (empty($parsed_blocks)) {

            return;
        }

        // Get the updated blocks after cleanup.
		$this->app->make(Transpiler::class)->cleanupInlineStyles($parsed_blocks, $postId);
    }

	/**
	 * Insert wp_template post type.
	 *
	 * @param \stdClass        $prepared_post The instance of stdClass class.
	 * @param \WP_REST_Request $request The instance of WP_REST_Request class.
	 *
	 * @return void
	 */
    public function insertWPTemplate( \stdClass $prepared_post, \WP_REST_Request $request) {
        $parsed_blocks = parse_blocks($prepared_post->post_content);

        // Excluding empty post content.
        if (empty($parsed_blocks)) {

            return;
        }

        // Get the updated blocks after cleanup.
        $this->app->make(Transpiler::class)->cleanupInlineStyles($parsed_blocks, property_exists($prepared_post, 'ID') ? $prepared_post->ID : 0);

        return $prepared_post;
    }
}
