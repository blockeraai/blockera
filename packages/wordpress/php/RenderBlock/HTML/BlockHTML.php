<?php

namespace Blockera\WordPress\RenderBlock\HTML;

use Blockera\Bootstrap\Application;
use Blockera\WordPress\RenderBlock\HTML\Contracts\BlockHandler;

/**
 * The default chaining behavior can be implemented inside a base BlockHTML class.
 */
abstract class BlockHTML implements BlockHandler {

	/**
	 * @var Application
	 */
	protected Application $app;

	/**
	 * @param Application $app
	 */
	public function __construct( Application $app ) {

		$this->app = $app;
	}

	/**
	 * @var BlockHandler|null
	 */
	protected $nextHandler = null;

	public function setNext( BlockHandler $handler ): BlockHandler {

		$this->nextHandler = $handler;

		return $handler;
	}

	public function manipulate( array $request ): void {

		if ( ! $this->nextHandler ) {

			return;
		}

		$this->nextHandler->manipulate( $request );
	}

}
