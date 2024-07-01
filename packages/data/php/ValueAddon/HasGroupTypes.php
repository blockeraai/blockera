<?php

namespace Blockera\Data\ValueAddon;

/**
 * Interface HasGroupTypes
 *
 * @package Blockera\Data\ValueAddon\HasGroupTypes
 */
interface HasGroupTypes {

	/**
	 * Retrieve available group types.
	 *
	 * @return string[] the available group types list.
	 */
	public function availableGroupTypes(): array;
}
