<?php

namespace Publisher\Framework\Providers;

/**
 * External
 */

use Illuminate\Contracts\Container\BindingResolutionException;

/**
 * Internal
 */

use Publisher\Framework\Exceptions\BaseException;
use Publisher\Framework\Services\PublisherAssets;
use Publisher\Framework\Illuminate\Foundation\Application;
use Publisher\Framework\Illuminate\Support\ServiceProvider;

/**
 * AssetsProvider is registering all assets of publisher app.
 *
 * @since 1.0.0
 */
class AssetsProvider extends ServiceProvider {

	/**
	 * Hold instance of PublisherAssets object
	 *
	 * @var null|PublisherAssets
	 */
	protected $handler = null;

	/**
	 * Register any application services.
	 *
	 * @return void
	 */
	public function register(): void {

		$this->app->singleton(
			PublisherAssets::class,
			function ( Application $app ) {

				return new PublisherAssets( $app );
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

		$this->handler = $this->app->make( PublisherAssets::class );

		// Handle loading assets in wp-env to use in CI.
		if ( defined( 'PB_ENV' ) && 'wp-env' === PB_ENV ) {

			$this->handler->enqueue();
		}
	}

	/**
	 * Retrieve handler object.
	 *
	 * @return PublisherAssets|null
	 */
	public function getHandler(): ?PublisherAssets {

		return $this->handler;
	}

}
