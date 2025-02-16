<?php

namespace Blockera\Data\Cache\Contracts;

interface CacheVersion {

	/**
	 * Validate the cache data based on the product version.
	 *
	 * @param string $product_version The product version.
	 *
	 * @return bool true on success, false on failure!
	 */
	public function validate( string $product_version): bool;

	/**
	 * Store the cache data.
	 *
	 * @param string $product_version The product version.
	 *
	 * @return bool true on success, false on failure!
	 */
	public function store( string $product_version): bool;
}
