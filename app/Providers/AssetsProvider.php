<?php

namespace Blockera\Framework\Providers;

use Blockera\Framework\Services\AssetsLoader;
use Blockera\Framework\Illuminate\Foundation\Application;
use Blockera\Framework\Illuminate\Support\ServiceProvider;
use Illuminate\Contracts\Container\BindingResolutionException;

/**
 * Class AssetsProvider providing all assets.
 *
 * @since 1.0.0
 */
class AssetsProvider extends ServiceProvider {

	/**
	 * Hold instance of Assets object
	 *
	 * @var null|AssetsLoader
	 */
	protected $handler = null;

	/**
	 * Register any application services.
	 *
	 * @return void
	 */
	public function register(): void {

		$this->app->singleton(
			AssetsLoader::class,
			function ( Application $app ) {

				return new AssetsLoader( $app );
			}
		);
	}

	/**
	 * Bootstrap any application services.
	 *
	 * @throws BindingResolutionException Binding resolution exception error handle.
	 * @return void
	 */
	public function boot(): void {

		$this->handler = $this->app->make( AssetsLoader::class );

		// Handle loading assets in wp-env to use in CI.
		if ( defined( 'BLOCKERA_ENV' ) && 'wp-env' === BLOCKERA_ENV ) {

			$this->handler->enqueue();
		}
	}

	/**
	 * Retrieve handler object.
	 *
	 * @return AssetsLoader|null
	 */
	public function getHandler(): ?AssetsLoader {

		return $this->handler;
	}

}
