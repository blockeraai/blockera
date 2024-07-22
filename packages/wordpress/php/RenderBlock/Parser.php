<?php

namespace Blockera\WordPress\RenderBlock;

use Blockera\Editor\StyleEngine;
use Blockera\Bootstrap\Application;
use Blockera\Exceptions\BaseException;
use Blockera\WordPress\RenderBlock\HTML\Icon;
use Illuminate\Contracts\Container\BindingResolutionException;

/**
 * Class Parser after parsing block details manipulating html and css on WordPress core blocks.
 *
 * @package Parser
 */
class Parser {

	/**
	 * Hold the Application class instance.
	 *
	 * @var Application $app
	 */
	protected Application $app;

	/**
	 * The Parser class constructor.
	 *
	 * @param Application $app The application container object.
	 */
	public function __construct( Application $app ) {

		$this->app = $app;
	}

	/**
	 * Retrieve combine css of current block.
	 *
	 * @param array $params The params array includes block and block selector.
	 *
	 * @throws BindingResolutionException The BindingResolutionException for not bonded object.
	 *
	 * @return string string of css styles.
	 */
	public function getCss( array $params ): string {

		[
			'block'    => $block,
			'selector' => $fallbackSelector,
		] = $params;

		/**
		 * Describe type of variable.
		 *
		 * @var StyleEngine $styleEngine The style-engine object.
		 */
		$styleEngine = $this->app->make( StyleEngine::class, compact( 'block', 'fallbackSelector' ) );

		return $styleEngine->getStylesheet();
	}

	/**
	 * Handle shared parsers in between all blocks to manipulate html.
	 *
	 * @param array $params The params array includes dom, block, and unique_class_name indexes.
	 *
	 * @throws BindingResolutionException The BindingResolutionException for not bonded object.
	 * @throws BaseException The BaseException when avoid base rules.
	 * @return void
	 */
	public function htmlManipulate( array $params ): void {

		[
			'dom'               => $dom,
			'block'             => $block,
			'unique_class_name' => $uniqueClassname,
		] = $params;

		/**
		 * Describe type of variable.
		 *
		 * @var Render $block The Render instance as $block variable.
		 */
		$render = $this->app->make( Render::class, [ 'blockName' => $block['blockName'] ] );

		$selector     = $render->getSelector( $block );
		$blockElement = $dom->findOne( $selector );

		// add unique classname into block element.
		// phpcs:ignore
		$blockElement->classList->add( $uniqueClassname );

		// Block Instances.
		{
			$iconCustomizer = $this->app->make( Icon::class );
		}

		/**
		 * TODO: Create Chain of HTML Customizers 💡.
		 *
		 * @var Icon $iconCustomizer The Icon customizer html object.
		 */

		{
			$iconCustomizer->manipulate( compact( 'block', 'blockElement' ) );
		}
	}

}
