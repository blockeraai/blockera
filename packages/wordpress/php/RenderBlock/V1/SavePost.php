<?php

namespace Blockera\WordPress\RenderBlock\V1;

use Blockera\Bootstrap\Application;
use Blockera\Exceptions\BaseException;
use Illuminate\Contracts\Container\BindingResolutionException;

/**
 * Class SavePost to cache styles for current post published.
 *
 * @package SavePost
 */
class SavePost {

    /**
     * Store instance of Render class
     *
     * @var Render
     */
    protected Render $render;

    /**
     * Store instance of app container.
     *
     * @var Application
     */
    protected Application $app;

	/**
	 * Store the supports.
	 *
	 * @var array $supports
	 */
	protected array $supports;

    /**
     * Constructor of SavePost class.
     *
     * @param Application $app    the instance of Application container.
     * @param Render      $render The instance of Render class to manage dependency injection fany phrase.
     */
    public function __construct( Application $app, Render $render) { 
        $this->app    = $app;
        $this->render = $render;
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

        $parsed_blocks = parse_blocks($post->post_content);

        // Excluding empty post content.
        if (empty($parsed_blocks)) {

            return;
        }

		$this->supports = $supports;

        array_map([ $this, 'parser' ], $parsed_blocks);
    }

    /**
     * Parsing block data to cache css and html manipulated results.
     *
     * @param array $block the block array.
     *
     * @throws BaseException | BindingResolutionException Exception for binding Parser class into app container problems.
     *
     * @return void
     */
    protected function parser( array $block): void {

        // Check block is supported by Blockera?
        if (! blockera_is_supported_block($block)) {

            return;
        }

        $this->render->render($block['innerHTML'], $block, $this->supports);
    }

}
