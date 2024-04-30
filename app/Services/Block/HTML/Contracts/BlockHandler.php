<?php

namespace Blockera\Framework\Services\Block\HTML\Contracts;

/**
 * The Styler interface declares a method for building the chain of Customize HTML with BlockHandler to use Parser class.
 * It also declares a method for executing a request.
 */
interface BlockHandler {

	/**
	 * Setup next block handler
	 *
	 * @param BlockHandler $handler the instance of current class
	 *
	 * @return BlockHandler self
	 */
	public function setNext( BlockHandler $handler ): BlockHandler;

	/**
	 * Manipulation block html
	 *
	 * @param array $request settings requested of current block to customize HTML
	 *
	 * @return void
	 */
	public function manipulate( array $request ): void;

}
