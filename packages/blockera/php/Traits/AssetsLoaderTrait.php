<?php

namespace Blockera\Setup\Traits;

trait AssetsLoaderTrait {

	/**
	 * Store the context.
	 *
	 * @var string $context the context.
	 */
	protected string $context;

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
	 * Enqueue the block assets.
	 *
	 * @param string $base_path The base path of the plugin.
	 * @param string $base_url The base url of the plugin.
	 * @param string $version The version of the plugin.
	 *
	 * @return void
	 */
	public function enqueueAssets( string $base_path, string $base_url, string $version): void {

		if (file_exists($base_path . $this->context . '-' . $this->getId() . '/src/style.css')) {

			wp_enqueue_style(
				'blockera-' . $this->context . '-' . $this->getId() . '-style',
				$base_url . $this->context . '-' . $this->getId() . '/src/style.css',
				[],
				$version
			);
		}

		if (file_exists($base_path . $this->context . '-' . $this->getId() . '/src/script.js')) {

			wp_enqueue_script(
				'blockera-' . $this->context . '-' . $this->getId() . '-script',
				$base_url . $this->context . '-' . $this->getId() . '/src/script.js',
				[],
				$version,
				[
					'in_footer' => true,
				]
			);
		}
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
