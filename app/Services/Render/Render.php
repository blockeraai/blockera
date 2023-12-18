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
	 * @param Application $app  the app instance
	 * @param string      $name the block name
	 */
	public function __construct( Application $app, string $name ) {

		$this->app  = $app;
		$this->name = $name;

		//fire-up WordPress hooks
		$this->applyHooks();
	}

	/**
	 * Fire WordPress actions or filters Hooks
	 * Like: "render_block_core/{$blockName}"
	 *
	 * @return void
	 */
	protected function applyHooks(): void {

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
	public function parser( string $html, array $block ): string {

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
		$uniqueClassname = getUniqueClassname( $block['blockName'] );

		/**
		 * @var Parser $parser
		 */
		$parser = $this->app->make( Parser::class );

		//apply css styles
		$parser->getCss( compact( 'block', 'uniqueClassname' ) );

		//manipulation HTML of block content
		$parser->customizeHTML( compact( 'dom', 'block', 'uniqueClassname' ) );

		//retrieve final html of block content
		return preg_replace( [ '/(<[^>]+) style=".*?"/i', '/wp-block-\w+__(\w+|\w+-\w+)-\d+(\w+|%)/i' ], [ '$1', '' ], $dom->html() );
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
