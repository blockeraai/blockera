<?php

namespace Blockera\WordPress\RenderBlock;

use Blockera\Bootstrap\Application;
use Blockera\Exceptions\BaseException;
use Blockera\Utils\Adapters\DomParser;
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
	 * Hold application instance.
	 *
	 * @var Application
	 */
	protected Application $app;

	/**
	 * Store generated stylesheet for rendered blocks.
	 *
	 * @var string $computed_css_rules
	 */
	protected string $computed_css_rules = '';

	/**
	 * Render constructor.
	 *
	 * @param Application $app the app instance.
	 */
	public function __construct( Application $app ) {

		$this->app = $app;
	}

	/**
	 * Sets name property.
	 *
	 * @param string $name the block name.
	 */
	public function setName( string $name ): void {

		$this->name = $name;
	}

	/**
	 * Fire WordPress actions or filters Hooks.
	 * Like: "render_block_core/{$blockName}"
	 *
	 * @return void
	 */
	public function applyHooks(): void {

		add_filter( 'render_block_' . $this->name, [ $this, 'render' ], 10, 2 );

		// phpcs:disable
		// remove_filter( 'render_block', 'gutenberg_render_layout_support_flag', 10, 2 );
		// add_action( 'after_setup_theme', [$this, 'after_theme_setup'] );
		// remove_filter( 'render_block', 'wp_render_elements_support', 10, 2 );
		// remove_filter( 'render_block', 'wp_render_elements_support_styles', 10, 2 );
		// remove_filter( 'render_block', 'wp_render_layout_support_flag', 10, 2 );
		// phpcs:enable
	}

	/**
	 * After theme setup executing to customize theme supports.
	 *
	 * @return void
	 */
	public function afterThemeSetup(): void {

		add_theme_support( 'disable-layout-styles' );
	}

	/**
	 * Block parser to customize HTML template!
	 *
	 * @param string $html   WordPress block rendered HTML.
	 * @param array  $block  WordPress block details.
	 * @param int    $postId the current post id. default is "-1".
	 *
	 * @throws BindingResolutionException|BaseException Exception for binding parser service into app container problems.
	 * @return string block HTML.
	 */
	public function render( string $html, array $block, int $postId = -1 ): string {

		// Just running for blockera extensions settings!
		if ( empty( $block['attrs']['blockeraPropsId'] ) || is_admin() || defined( 'REST_REQUEST' ) && REST_REQUEST ) {

			return $html;
		}

		$is_enable_icon_extension = blockera_get_experimental( [ 'editor', 'extensions', 'iconExtension' ] );

		// phpcs:disable
		// create dom adapter.
		/**
		 * @var DomParser $dom
		 */
		if ( $is_enable_icon_extension ) {

			$dom = $this->app->make( DomParser::class )::str_get_html( $html );
		}
		// phpcs:enable

		$attributes = $block['attrs'];

		if ( ! empty( $attributes['className'] ) ) {
			// Usage of saved class names for block element.
			$unique_class_name = blockera_get_normalized_selector( $attributes['className'] );

		} else {
			// Fallback way to providing unique css selector for block element.
			$unique_class_name = blockera_get_unique_classname( 'blockera-' . $block['blockName'] );
		}

		$selector = $this->getSelector( $unique_class_name );

		/**
		 * Get parser object.
		 *
		 * @var Parser $parser the instance of Parser class.
		 */
		$parser = $this->app->make( Parser::class );

		// phpcs:disable
		// TODO: add into cache mechanism.
		//manipulation HTML of block content
		if ( $is_enable_icon_extension ) {

			$parser->htmlManipulate( compact( 'dom', 'block', 'unique_class_name' ) );
			//retrieve final html of block content
			$html = preg_replace( [ '/(<[^>]+) style=".*?"/i', '/wp-block-\w+__(\w+|\w+-\w+)-\d+(\w+|%)/i' ], [ '$1', '' ], $dom->html() );
		}
		// phpcs:enable

		// Assume miss post id.
		if ( -1 === $postId ) {

			global $post;

			$postId = $post->ID;
		}

		$cacheKey = 'blockera-inline-css-post-' . $postId;

		// Get cache data.
		if ( is_single() ) {

			$cache = get_post_meta( $postId, $cacheKey, true );

		} else {

			$cache = get_transient( $cacheKey );
		}

		// Adding inline generated css rules with server side StyleEngine instance.
		// Skip cache mechanism when application debug mode is on.
		if ( ! empty( $cache ) && array_intersect( [ 'css' ], array_keys( $cache ) ) && ! blockera_core_config( 'app.debug' ) ) {

			// Print css into inline style of document.
			$this->addInlineCss( $cache['css'] );

			return $html;
		}

		$this->computed_css_rules = $parser->getCss( compact( 'block', 'selector' ) );

		// Print css into inline style of document.
		$this->addInlineCss();

		// set cache data with merge exists data.
		// Skip cache mechanism when application debug mode is on.
		if ( is_single() && ! blockera_core_config( 'app.debug' ) ) {

			update_post_meta(
				$postId,
				$cacheKey,
				array_merge(
					$cache ? $cache : [],
					[
						'css' => $this->computed_css_rules,
						// TODO: implements cache mechanism for html manipulating process.
						// phpcs:disable
						// 'html' => '',
						// phpcs:enable
					]
				)
			);

		} elseif ( ! blockera_core_config( 'app.debug' ) ) {

			set_transient(
				$cacheKey,
				array_merge(
					$cache ? $cache : [],
					[
						'css' => $this->computed_css_rules,
						// TODO: implements cache mechanism for html manipulating process.
						// phpcs:disable
						// 'html' => '',
						// phpcs:enable
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

		$computed_css_rules = ! empty( $css ) ? $css : $this->getComputedCssRules();

		add_filter(
			'blockera/wordpress/register-block-editor-assets/add-inline-css-styles',
			function () use ( $computed_css_rules ): string {

				return $computed_css_rules;
			}
		);
	}

	/**
	 * Retrieve block css selector.
	 * in this method, we can customize selector of block element based on block name.
	 *
	 * @param string $unique_class_name the block unique css classname.
	 *
	 * @return string the block css selector with unique classname.
	 */
	public function getSelector( string $unique_class_name = '' ): string {

		return ! empty( $unique_class_name ) ? ( '.' !== $unique_class_name[0] ? ".{$unique_class_name}" : $unique_class_name ) : '';
	}

	/**
	 * Retrieve computed css rules of rendering process.
	 *
	 * @return string the generated computed css rules for rendered blocks.
	 */
	public function getComputedCssRules(): string {

		return $this->computed_css_rules;
	}

}
