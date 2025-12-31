<?php

namespace Blockera\Bootstrap\Traits;

trait AssetsLoaderTrait {

	/**
	 * Store the context.
	 *
	 * @var string $context the context.
	 */
	protected string $context;

	/**
	 * Store the sub context.
	 *
	 * @var string|null $sub_context the sub context.
	 */
	protected ?string $sub_context = null;

	/**
	 * Set the context.
	 *
	 * @param string $context the context.
	 * 
	 * @return void
	 */
	public function setContext( string $context): void {

		$this->context = $context;
	}

	/**
	 * Set the sub context.
	 *
	 * @param string $sub_context the sub context.
	 *
	 * @return void
	 */
	public function setSubContext( string $sub_context): void {

		$this->sub_context = $sub_context;
	}

	/**
	 * Enqueue the block assets.
	 *
	 * @param string $base_path The base path of the plugin.
	 *
	 * @return void
	 */
	public function enqueueAssets( string $base_path): void {

		static $cache = [];

		$id = $this->getId();
		$cache_key = $this->context . '|' . ($this->sub_context ?? '') . '|' . $id;

		if (isset($cache[$cache_key])) {
			return;
		}

		$subdirectory = '/src/';

		switch ($this->context) {
			case 'blocks-core':
				$subdirectory = '/php/libs/' . $this->sub_context . '/';
				$context_path = $base_path . $this->context . $subdirectory . $id . '/';
				break;

			default:
				$subdirectory = '/src/';
				$context_path = $base_path . $this->context . '-' . $id . '/' . $subdirectory;
		}

		$css_file_path = $context_path . 'style.css';
		$js_file_path  = $context_path . 'script.js';

		switch($this->sub_context) {
			case 'wordpress':
				$handle = 'wp-block-' . $id;
				break;

			default:
				$handle = 'blockera-block-'. $id;
				break;
		}
		
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
	 * Get the block id.
	 *
	 * @return string the block id.
	 */
	public function getId(): string {

		return $this->id;
	}
}
