<?php

namespace Blockera\Features\Core\Contracts;

interface EditableBlockHTML {

    /**
     * The html manipulate method.
     *
     * @param string $html The html to manipulate.
     * @param array  $data The data to manipulate.
     *
     * @return string The manipulated html.
     */
    public function htmlManipulate( string $html, array $data): string;

	/**
	 * Set the context.
	 *
	 * @param string $context the context.
	 * 
	 * @return void
	 */
	public function setContext( string $context): void;

	/**
	 * Get the feature id.
	 *
	 * @return string the feature id.
	 */
	public function getId(): string;

	/**
	 * Enqueue the feature assets.
	 * 
	 * @param string      $base_path The base path of the plugin.
	 * @param string|null $asset_context The asset context (e.g., 'block', 'feature', 'blocks-core'). If null, uses stored context.
	 * @param string|null $library_name The library name (e.g., 'WordPress', 'woocommerce'). Used only for 'blocks-core' context.
	 *
	 * @return void
	 */
	public function enqueueAssets( string $base_path, $asset_context = null, $library_name = null): void;
}
