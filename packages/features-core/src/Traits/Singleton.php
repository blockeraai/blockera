<?php

namespace Blockera\Features\Core\Traits;

/**
 * Trait Singleton for implementing singleton pattern.
 */
trait Singleton {

	/**
	 * The instance of the singleton.
	 *
	 * @var static|null The instance of the singleton.
	 */
	protected static $instance = null;

	/**
	 * Get the instance of the singleton.
	 *
	 * @return self The instance of the singleton.
	 */
	public static function getInstance(): self {
		if (null === self::$instance) {
			self::$instance = new self();
		}

		return self::$instance;
	}
}
