<?php

namespace Blockera\Features\Contracts;

interface FeatureInterface {

    /**
	 * The register method.
	 *
	 * @return void
	 */
	public function register(): void;

    /**
	 * The boot method.
	 *
	 * @return void
	 */
	public function boot(): void;
    
	/**
	 * The isEnabled method.
	 *
	 * @return bool true on success, false otherwise.
	 */
	public function isEnabled(): bool;
}
