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
	 * @param string      $base_path The base path of the plugin.
	 * @param string|null $asset_context The asset context (e.g., 'block', 'feature', 'blocks-core'). If null, uses stored context.
	 * @param string|null $library_name The library name (e.g., 'WordPress', 'woocommerce'). Used only for 'blocks-core' context.
	 *
	 * @return void
	 */
	public function enqueueAssets( string $base_path, $asset_context = null, $library_name = null): void;
}
