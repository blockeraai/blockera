<?php

namespace Blockera\Editor\StyleDefinitions\Contracts;

interface StandardDefinition {

	/**
	 * Get the css property.
	 *
	 * @return string The css property.
	 */
	public function getCssProperty(): string;
}
