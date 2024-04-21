<?php

namespace Publisher\Framework\Services\Block;

use Publisher\Framework\Illuminate\Foundation\Application;
use Illuminate\Contracts\Container\BindingResolutionException;

class SavePost {

	/**
	 * Store instance of Render class
	 *
	 * @var Render
	 */
	protected Render $render;

	/**
	 * Store instance of WP_Post
	 *
	 * @var \WP_Post
	 */
	protected \WP_Post $post;

	/**
	 * Store instance of app container.
	 *
	 * @var Application
	 */
	protected Application $app;

	/**
	 * Constructor of SavePost class.
	 *
	 * @param Render $render The instance of Render class to manage dependency injection fany phrase.
	 */
	public function __construct( Application $app, Render $render ) {

		$this->app    = $app;
		$this->render = $render;

		add_action( 'save_post', [ $this, 'save' ], 9e8, 3 );
	}

	/**
	 * Save post to database action,
	 * we will use this to cache post data with generate css and manipulate html.
	 *
	 * @param int      $postId The current post Identifier.
	 * @param \WP_Post $post   The instance of WP_Post class.
	 * @param bool     $update The flag of is update post or not.
	 *
	 * @return void
	 */
	public function save( int $postId, \WP_Post $post, bool $update ): void {

		$this->post   = $post;
		$parsedBlocks = parse_blocks( $post->post_content );

		// Excluding empty post content.
		if ( empty( $parsedBlocks ) ) {

			return;
		}

		array_map( [ $this, 'parser' ], parse_blocks( $post->post_content ) );

		//TODO: clear redundant cache data.
	}

	/**
	 * Parsing block data to cache css and html manipulated results.
	 *
	 * @param array $block
	 *
	 * @throws BindingResolutionException
	 *
	 * @return void
	 */
	protected function parser( array $block ): void {

		if ( ! isset( $block['blockName'], $block['attrs']['publisherPropsId'] ) ) {

			return;
		}

		$attributes = $block['attrs'];

		if ( $attributes['className'] ) {
			// Usage of saved class names for block element.
			$selector = pb_get_normalized_selector( $attributes['className'] );

		} else {
			// Fallback way to providing unique css selector for block element.
			$selector = $this->render->getSelector( $block, pb_get_unique_classname( $block['blockName'] ) );
		}

		/**
		 * @var Parser $parser
		 */
		$parser = $this->app->make( Parser::class );

		$postCacheKey = 'publisher-inline-css-post-' . $this->post->ID;

		// Get cache data.
		$cache = get_post_meta( $this->post->ID, $postCacheKey, true );

		// TODO: after implements cache mechanism for manipulating html, please add "html" key into array intersection.
		if ( ! $cache || ! array_intersect( [ 'css' ], array_keys( $cache ) ) ) {

			return;
		}

		$css = $parser->getCss( compact( 'block', 'selector' ) );

		// set cache data with merge exists data.
		update_post_meta( $this->post->ID, $postCacheKey,
			array_merge(
				$cache,
				[
					'css' => $css,
					// TODO: implements cache mechanism for html manipulating process.
					//'html' => '',
				]
			)
		);
	}

}