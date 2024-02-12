<?php

namespace Publisher\Framework\Services\Render;

/**
 * External
 */

use Illuminate\Contracts\Container\BindingResolutionException;

/**
 * Internal
 */

use Publisher\Framework\Exceptions\BaseException;
use Publisher\Framework\Illuminate\Foundation\Application;
use Publisher\Framework\Illuminate\Support\Adapters\DomParser;

class Render {

	/**
	 * Hold block name.
	 *
	 * @var string $name
	 */
	protected string $name;

	/**
	 * Hold application instance
	 *
	 * @var Application
	 */
	protected Application $app;

	/**
	 * @param Application $app the app instance
	 */
	public function __construct( Application $app ) {

		$this->app = $app;
	}

	/**
	 * @param string $name
	 */
	public function setName( string $name ): void {

		$this->name = $name;
	}

	/**
	 * Fire WordPress actions or filters Hooks
	 * Like: "render_block_core/{$blockName}"
	 *
	 * @return void
	 */
	public function applyHooks(): void {

		add_filter( 'render_block_' . $this->name, [ $this, 'parser' ], 10, 2 );

//		add_action( 'after_setup_theme', function () {
//
//			add_theme_support( 'disable-layout-styles' );
//		} );


//		add_action( 'wp_enqueue_scripts', function () {
//			wp_dequeue_style( 'global-styles' );
//		}, 100 );

		remove_filter( 'render_block', 'gutenberg_render_layout_support_flag', 10, 2 );

//		remove_filter( 'render_block', 'wp_render_elements_support', 10, 2 );
//		remove_filter( 'render_block', 'wp_render_elements_support_styles', 10, 2 );
//
//		remove_filter( 'render_block', 'wp_render_layout_support_flag', 10, 2 );
	}

	/**
	 * Block parser to customize HTML template!
	 *
	 * @param string $html  WordPress block rendered HTML
	 * @param array  $block WordPress block details
	 *
	 * @throws BindingResolutionException|BaseException
	 * @return string block HTML
	 */
	public function parser( string $html, array $block, int $postId = -1 ): string {

		//Just running for publisher extensions settings!
		if ( empty( $block['attrs']['publisherPropsId'] ) || is_admin() ) {

			return $html;
		}

		//create dom adapter
		/**
		 * @var DomParser $dom
		 */
		$dom = $this->app->make( DomParser::class )::str_get_html( $html );

		//generate unique css classname for block element
		$uniqueClassname = pb_get_unique_classname( $block['blockName'] );

		/**
		 * @var Parser $parser
		 */
		$parser = $this->app->make( Parser::class );

		$selector = $this->getSelector( $block, $uniqueClassname );

		// TODO: add into cache mechanism.
		//manipulation HTML of block content
		$parser->htmlManipulate( compact( 'dom', 'block', 'uniqueClassname' ) );
		//retrieve final html of block content
		$html = preg_replace( [ '/(<[^>]+) style=".*?"/i', '/wp-block-\w+__(\w+|\w+-\w+)-\d+(\w+|%)/i' ], [ '$1', '' ], $dom->html() );

		// Assume miss post id.
		if ( -1 === $postId ) {

			global $post;

			$postId = $post->ID;
		}

		$cacheKey = 'publisher-inline-css-post-' . $postId;

		// Get cache data.
		$cache = get_option( $cacheKey, false );

		// TODO: after implements cache mechanism for manipulating html, please add "html" key into array intersection.
		// TODO: after implements support dynamic selectors for bloc, we allow to use cache mechanism,
		// because now selector of block crated with "uniqid" and when refresh request selectors will changed!
//		if ( ! empty( $cache ) && array_intersect( [ 'css' ], array_keys( $cache ) ) ) {
//
//			// Print css into inline style of document.
//			$this->addInlineCss( $cache['css'] );
//
//			return $html;
//		}

		$css = $parser->getCss( compact( 'block', 'selector' ) );

		// Print css into inline style of document.
		$this->addInlineCss( $css );

		// set cache data with merge exists data.
		update_option( $cacheKey, [
			'css' => $css,
			// TODO: after implements cache mechanism for manipulating html, please add "html" key into array intersection.
			//'html' => '',
		] );

		return $html;
	}

	/**
	 * Adding computed css rules into inline css handle.
	 *
	 * @param string $computedCssRules The computed css rules from StyleEngine output.
	 *
	 * @return void
	 */
	protected function addInlineCss( string $computedCssRules ): void {

		add_filter(
			'publisher-core/services/register-block-editor-assets/add-inline-css-styles',
			/**
			 * @param string $prevStylesheet The previous css stylesheet.
			 */
			function ( string $prevStylesheet ) use ( $computedCssRules ): string {

				return $prevStylesheet . $computedCssRules;
			}
		);
	}

	/**
	 * Retrieve block css selector
	 *
	 * @param array  $block           the WordPress block details as array
	 * @param string $uniqueClassname the block unique css classname
	 *
	 * @return string the block css selector with unique classname
	 */
	public function getSelector( array $block, string $uniqueClassname = '' ): string {

		$selector = ! empty( $uniqueClassname ) ? ".{$uniqueClassname}" : '';

		switch ( $block['blockName'] ) {
			case 'core/button':
				return ".wp-block-button .wp-block-button__link{$selector}";

			case 'core/site-title':
				return ".wp-block-site-title a{$selector}";

			case 'core/paragraph':
				return "p{$selector}";
		}

		return $selector;
	}

}
