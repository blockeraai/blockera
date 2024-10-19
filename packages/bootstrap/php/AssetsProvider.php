<?php

namespace Blockera\Bootstrap;

use Blockera\WordPress\AssetsLoader;

abstract class AssetsProvider extends ServiceProvider {

	/**
	 * Register any application services.
	 *
	 * @return void
	 */
	public function register(): void {

		$this->app->bind(
			$this->getId(),
			function ( Application $app, array $args = [] ) {

				return new AssetsLoader(
					$app,
					$args['assets'],
					array_merge(
						[
							'id'         => $this->getId(),
							'root'       => [
								'url'  => blockera_core_config( 'app.root_url' ),
								'path' => blockera_core_config( 'app.root_path' ),
							],
							'debug-mode' => blockera_core_config( 'app.debug' ),
						],
						$args['extra-args']
					)
				);
			}
		);
	}

	/**
	 * Retrieve handler name.
	 *
	 * @return string the WordPress enqueue APIs ("wp_enqueue_script"(s) or "wp_enqueue_style"(s)) handle name.
	 */
	abstract public function getHandler(): string;

	/**
	 * Get all assets of blockera plugin.
	 *
	 * @return array the assets list to load on page.
	 */
	protected function getAssets(): array {

		return [];
	}

	/**
	 * @return string The loader identify.
	 */
	abstract public function getId():string;

	/**
	 * @return string the blockera plugin root URL.
	 */
	protected function getURL(): string {

		return blockera_core_config( 'app.root_url' );
	}

	/**
	 * @return string the blockera plugin root PATH.
	 */
	protected function getPATH(): string {

		return blockera_core_config( 'app.root_path' );
	}
}
