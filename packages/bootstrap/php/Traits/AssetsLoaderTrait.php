<?php

namespace Blockera\Bootstrap\Traits;

trait AssetsLoaderTrait {

	/**
	 * Store the asset context for backward compatibility.
	 *
	 * @var string|null $asset_context the asset context.
	 */
	protected $asset_context = null;

	/**
	 * Set the asset context (for backward compatibility with interfaces).
	 *
	 * @param string $context the asset context.
	 * 
	 * @return void
	 */
	public function setContext( string $context): void {
		$this->asset_context = $context;
	}

	/**
	 * Enqueue assets for the given context.
	 *
	 * @param string      $base_path The base path of the plugin.
	 * @param string|null $asset_context The asset context (e.g., 'block', 'feature', 'blocks-core'). If null, uses stored context.
	 * @param string|null $library_name The library name (e.g., 'wordpress', 'woocommerce'). Used only for 'blocks-core' context.
	 *
	 * @return void
	 */
	public function enqueueAssets( string $base_path, $asset_context = null, $library_name = null): void {
		static $cache = [];

		// Use provided context or fall back to stored context.
		$context = $asset_context ?? $this->asset_context;

		if (empty($context)) {
			return;
		}

		$id = $this->getId();
		$cache_key = $context . '|' . ($library_name ?? '') . '|' . $id;

		if (isset($cache[$cache_key])) {
			return;
		}

		$subdirectory = '/src/';

		switch ($context) {
			case 'blocks-core':
				if (empty($library_name)) {
					return;
				}
				$subdirectory = '/php/libs/' . $library_name . '/';
				$context_path = $base_path . $context . $subdirectory . $id . '/';
				break;

			default:
				$subdirectory = '/src/';
				$context_path = $base_path . $context . '-' . $id . '/' . $subdirectory;
		}

		$css_file_path = $context_path . 'style.css';
		$js_file_path  = $context_path . 'script.js';

		// Determine handle.
		$handle = 'blockera-block' . '-' . $id;
		
		// Check if the CSS and JS files exist.
		$css_exists = file_exists($css_file_path);
		$js_exists  = file_exists($js_file_path);

		if ($css_exists || $js_exists) {
			$filesystem = blockera_get_filesystem();

			// Adding inline styles to the stylesheet.
			if ($css_exists) {
				wp_register_style($handle, false);
				wp_add_inline_style($handle, $filesystem->get_contents($css_file_path));
				wp_enqueue_style($handle);
			}

			// Adding inline scripts to the script.
			if ($js_exists) {
				wp_register_script($handle, false);
				wp_add_inline_script($handle, $filesystem->get_contents($js_file_path));
				wp_enqueue_script($handle);
			}
		}

		$cache[$cache_key] = true;
	}

	/**
	 * Get the block/feature id.
	 *
	 * @return string the block/feature id.
	 */
	public function getId(): string {
		return $this->id;
	}
}
