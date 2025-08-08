<?php

namespace Blockera\Blocks\Core;

use Blockera\Features\Core\Contracts\EditableBlockHTML;

interface BlockInterface {

	/**
	 * Render the block.
	 *
	 * @param string            $html The html of the block.
	 * @param EditableBlockHTML $feature The feature to render.
	 * @param array             $args The block data.
	 * 
	 * @return string the rendered html.
	 */
	public function render( string $html, EditableBlockHTML $feature, array $args = []): string;

	/**
	 * Set the context.
	 *
	 * @param string $context the context.
	 * 
	 * @return void
	 */
	public function setContext( string $context): void;

	/**
	 * Get the block id.
	 *
	 * @return string the block id.
	 */
	public function getId(): string;

	/**
	 * Enqueue the block assets.
	 * 
	 * @param string $base_path The base path of the plugin.
	 * @param string $base_url The base url of the plugin.
	 * @param string $version The version of the plugin.
	 *
	 * @return void
	 */
	public function enqueueAssets( string $base_path, string $base_url, string $version): void;
}
