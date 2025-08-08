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
	 * @param string $base_path The base path of the plugin.
	 * @param string $base_url The base url of the plugin.
	 * @param string $version The version of the plugin.
	 *
	 * @return void
	 */
	public function enqueueAssets( string $base_path, string $base_url, string $version): void;
}
