<?php

namespace Publisher\Framework\Services\Render\Styles\Contracts;

/**
 * The Styler interface declares a method for building the chain of Style generation to use Parser class.
 * It also declares a method for executing a request.
 */
interface Styler {

	/**
	 * @param Styler $styler the instance of current class
	 *
	 * @return Styler self
	 */
	public function setNext(Styler $styler): Styler;

	/**
	 * @param array $request settings requested of current style
	 *
	 * @return array|null
	 */
	public function style(array $request): ?array;
}
