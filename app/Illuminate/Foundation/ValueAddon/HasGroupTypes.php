<?php

namespace Publisher\Framework\Illuminate\Foundation\ValueAddon;

/**
 * Interface HasGroupTypes
 *
 * @package Publisher\Framework\Illuminate\Foundation\ValueAddon\HasGroupTypes
 */
interface HasGroupTypes {

	/**
	 * Retrieve available group types.
	 *
	 * @return string[] the available group types list.
	 */
	public function availableGroupTypes(): array;
}