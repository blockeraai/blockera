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
	 * @var string $sub_context the sub context.
	 */
	protected string $sub_context;

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
	 * @param string $base_url The base url of the plugin.
	 * @param string $version The version of the plugin.
	 *
	 * @return void
	 */
	public function enqueueAssets( string $base_path, string $base_url, string $version): void {

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
				$context_url  = $base_url . $this->context . $subdirectory . $id . '/';
				break;

			default:
				$subdirectory = '/src/';
				$context_path = $base_path . $this->context . '-' . $id . '/' . $subdirectory;
				$context_url  = $base_url . $this->context . '-' . $id . '/' . $subdirectory;
		}

		$css_file_path = $context_path . 'style.css';
		$js_file_path  = $context_path . 'script.js';
		$style_handle = 'blockera-' . $this->context . '-' . $id . '-style';
		$script_handle = 'blockera-' . $this->context . '-' . $id . '-script';

		if (file_exists($css_file_path)) {
			wp_enqueue_style($style_handle, $context_url . 'style.css', [], $version);
		}

		if (file_exists($js_file_path)) {
			wp_enqueue_script($script_handle, $context_url . 'script.js', [], $version, ['in_footer' => true]);
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
