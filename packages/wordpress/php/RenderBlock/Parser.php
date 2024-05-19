<?php

namespace Blockera\WordPress\RenderBlock;

use Blockera\Editor\StyleEngine;
use Blockera\Bootstrap\Application;
use Blockera\Exceptions\BaseException;
use Illuminate\Contracts\Container\BindingResolutionException;

/**
 * Class Parser after parsing block details manipulating html and css on WordPress core blocks.
 *
 * @package Parser
 */
class Parser {

	/**
	 * hold the Application class instance
	 *
	 * @var Application $app
	 */
	protected Application $app;

	/**
	 * @param Application $app
	 */
	public function __construct( Application $app ) {

		$this->app = $app;
	}

	/**
	 * Retrieve combine css of current block.
	 *
	 * @param array $params {
	 *
	 * @throws BindingResolutionException
	 *
	 * @return string string of css styles
	 */
	public function getCss( array $params ): string {

		[
			'block'    => $block,
			'selector' => $fallbackSelector,
		] = $params;

		/**
		 * @var StyleEngine $styleEngine
		 */
		$styleEngine = $this->app->make( StyleEngine::class, compact( 'block', 'fallbackSelector' ) );

		return $styleEngine->getStylesheet();
	}

	/**
	 * handle shared parsers in between all blocks to manipulate html.
	 *
	 * @param array $params {
	 *
	 * @throws BindingResolutionException
	 * @throws BaseException
	 * @return void
	 */
	public function htmlManipulate( array $params ) {

		[
			'dom'             => $dom,
			'block'           => $block,
			'uniqueClassname' => $uniqueClassname,
		] = $params;

		/**
		 * @var Render $block
		 */
		$render = $this->app->make( Render::class, [ 'blockName' => $block['blockName'] ] );

		$selector     = $render->getSelector( $block );
		$blockElement = $dom->findOne( $selector );

		// add unique classname into block element
		$blockElement->classList->add( $uniqueClassname );

	}

}
