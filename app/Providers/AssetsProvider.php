<?php

namespace Publisher\Framework\Providers;

use Publisher\Framework\Services\AssetsLoader;
use Publisher\Framework\Illuminate\Foundation\Application;
use Publisher\Framework\Illuminate\Support\ServiceProvider;
use Illuminate\Contracts\Container\BindingResolutionException;

/**
 * Class AssetsProvider providing all assets.
 *
 * @since 1.0.0
 */
class AssetsProvider extends ServiceProvider {

	/**
	 * Hold instance of PublisherAssets object
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
		if ( defined( 'PB_ENV' ) && 'wp-env' === PB_ENV ) {

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
