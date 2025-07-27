<?php

namespace Blockera\Features\Core\Contracts;

use Blockera\Utils\Adapters\DomParser;

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

	/**
	 * The html manipulate method.
	 *
	 * @param DomParser $dom_parser The dom parser to manipulate.
	 * @param array     $data The data to manipulate.
	 * 
	 * @return string The manipulated html.
	 */
	public function htmlManipulate( DomParser $dom_parser, array $data): string;
}
