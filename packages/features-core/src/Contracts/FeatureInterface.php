<?php

namespace Blockera\Features\Core\Contracts;

use Blockera\Bootstrap\Application;
use Blockera\Utils\Adapters\DomParser;

interface FeatureInterface {

    /**
	 * The register method.
	 *
	 * @param Application $app the application instance.
	 * @param array       $args the plugin args.
	 * 
	 * @return void
	 */
	public function register( Application $app, array $args = []): void;

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
	 * The isBlockSupported method.
	 *
	 * @return bool true if the block is supported, false otherwise.
	 */
	public function isBlockSupported(): bool;

	/**
	 * The html manipulate method.
	 *
	 * @param DomParser $dom_parser The dom parser to manipulate.
	 * @param array     $data The data to manipulate.
	 * 
	 * @return string The manipulated html.
	 */
	public function htmlManipulate( DomParser $dom_parser, array $data): string;

	/**
	 * Set the block.
	 *
	 * @param array $block the block.
	 *
	 * @return void
	 */
	public function setBlock( array $block): void;

	/**
	 * Get the block.
	 *
	 * @return array the block.
	 */
	public function getBlock(): ?array;
}
