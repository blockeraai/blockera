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
								'url'  => $this->getURL(),
								'path' => $this->getPATH(),
							],
							'debug-mode' => $this->getDebugMode(),
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
	abstract protected function getURL(): string;

	/**
	 * @return string the blockera plugin root PATH.
	 */
	abstract protected function getPATH(): string;

	/**
	 * @return bool the blockera plugin debug mode.
	 */
	abstract protected function getDebugMode(): bool;

	/**
	 * Get package version.
	 *
	 * @param string $path The package path.
	 *
	 * @return string The package version.
	 */
	protected function getPackageVersion( string $path): string {

		$package_json = blockera_get_filesystem()->get_contents($path);
		$package_version = json_decode($package_json, true);

		return str_replace('.', '-', $package_version['version']);
	}
}
