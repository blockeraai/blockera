<?php

namespace Publisher\Framework\Services\Block;

use Publisher\Framework\Exceptions\BaseException;
use Publisher\Framework\Illuminate\Foundation\Application;
use Publisher\Framework\Illuminate\Support\Adapters\DomParser;
use Illuminate\Contracts\Container\BindingResolutionException;

/**
 * Class Render filtering WordPress BlockType render process.
 *
 * @package Render
 */
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
	 * Store generated stylesheet for rendered blocks.
	 *
	 * @var string $computedCssRules
	 */
	protected string $computedCssRules = '';

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

		add_filter( 'render_block_' . $this->name, [ $this, 'render' ], 10, 2 );

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
	public function render( string $html, array $block, int $postId = -1 ): string {

		//Just running for publisher extensions settings!
		if ( empty( $block['attrs']['publisherPropsId'] ) || is_admin() ) {

			return $html;
		}

		//create dom adapter
		/**
		 * @var DomParser $dom
		 */
//		$dom = $this->app->make( DomParser::class )::str_get_html( $html );

		$attributes = $block['attrs'];

		if ( $attributes['className'] ) {
			// Usage of saved class names for block element.
			$uniqueClassname = pb_get_normalized_selector( $attributes['className'] );

		} else {
			// Fallback way to providing unique css selector for block element.
			$uniqueClassname = pb_get_unique_classname( 'publisher-' . $block['blockName'] );
		}

		$selector = $this->getSelector( $block, $uniqueClassname );

		/**
		 * @var Parser $parser
		 */
		$parser = $this->app->make( Parser::class );

		// TODO: add into cache mechanism.
		//manipulation HTML of block content
//		$parser->htmlManipulate( compact( 'dom', 'block', 'uniqueClassname' ) );
		//retrieve final html of block content
//		$html = preg_replace( [ '/(<[^>]+) style=".*?"/i', '/wp-block-\w+__(\w+|\w+-\w+)-\d+(\w+|%)/i' ], [ '$1', '' ], $dom->html() );

		// Assume miss post id.
		if ( -1 === $postId ) {

			global $post;

			$postId = $post->ID;
		}

		$cacheKey = 'publisher-inline-css-post-' . $postId;

		// Get cache data.
		if ( is_single() ) {

			$cache = get_post_meta( $postId, $cacheKey, true );

		} else {

			$cache = get_transient( $cacheKey );
		}
		
		// Adding inline generated css rules with server side StyleEngine instance.
		if ( ! empty( $cache ) && array_intersect( [ 'css' ], array_keys( $cache ) ) ) {

			// Print css into inline style of document.
			$this->addInlineCss( $cache['css'] );

			return $html;
		}

		$this->computedCssRules = $parser->getCss( compact( 'block', 'selector' ) );

		// Print css into inline style of document.
		$this->addInlineCss();

		// set cache data with merge exists data.
		if ( is_single() ) {

			update_post_meta( $postId, $cacheKey,
				array_merge(
					$cache ? : [],
					[
						'css' => $this->computedCssRules,
						// TODO: implements cache mechanism for html manipulating process.
						//'html' => '',
					]
				)
			);

		} else {

			set_transient( $cacheKey,
				array_merge(
					$cache ? : [],
					[
						'css' => $this->computedCssRules,
						// TODO: implements cache mechanism for html manipulating process.
						//'html' => '',
					]
				)
			);
		}

		return $html;
	}

	/**
	 * Adding computed css rules into inline css handle.
	 *
	 * @param string $css the provided css from outside.
	 *
	 * @return void
	 */
	protected function addInlineCss( string $css = '' ): void {

		$computedCssRules = ! empty( $css ) ? $css : $this->getComputedCssRules();

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
	 * Retrieve block css selector.
	 * in this method, we can customize selector of block element based on block name.
	 *
	 * @param array  $block           the WordPress block details as array.
	 * @param string $uniqueClassname the block unique css classname.
	 *
	 * @return string the block css selector with unique classname.
	 */
	public function getSelector( array $block, string $uniqueClassname = '' ): string {

		$selector = ! empty( $uniqueClassname ) ? ( '.' !== $uniqueClassname[0] ? ".{$uniqueClassname}" : $uniqueClassname ) : '';

		switch ( $block['blockName'] ) {
			case 'core/button':
			case 'core/buttons':
				return ".wp-block-button .wp-block-button__link{$selector}";

			case 'core/site-title':
				return ".wp-block-site-title a{$selector}";

			case 'core/paragraph':
				return "p{$selector}";
		}

		return $selector;
	}

	/**
	 * Retrieve computed css rules of rendering process.
	 *
	 * @return string the generated computed css rules for rendered blocks.
	 */
	public function getComputedCssRules(): string {

		return $this->computedCssRules;
	}

}
