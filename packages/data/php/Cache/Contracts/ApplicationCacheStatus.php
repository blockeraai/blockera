<?php

namespace Blockera\Data\Cache\Contracts;

interface ApplicationCacheStatus {

	/**
	 * Set the is validated cache.
	 *
	 * @param bool $is_validated true if the is validated, false otherwise.
	 *
	 * @return void
	 */
	public function setIsValidateCache( bool $is_validated): void;

	/**
	 * Get the is validated cache.
	 *
	 * @return bool the is validated cache.
	 */
	public function getIsValidateCache(): bool;
}
