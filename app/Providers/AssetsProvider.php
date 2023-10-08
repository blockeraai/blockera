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
	 * Register any application services.
	 *
	 * @throws BaseException
	 * @return void
	 */
	public function register(): void {

		try {

			$this->app->singleton( PublisherAssets::class, function ( Application $app ) {

				return new PublisherAssets( $app );
			} );

		} catch ( BaseException $handler ) {

			throw new BaseException( 'Binding ' . PublisherAssets::class . " Failure!\n" . $handler->getMessage() );
		}
	}

	/**
	 * Bootstrap any application services.
	 *
	 * @throws BindingResolutionException
	 * @return void
	 */
	public function boot(): void {

		$assets = $this->app->make( PublisherAssets::class );

		//handle loading assets in wp-env to use in CI
		if ( defined( 'PB_ENV' ) && 'wp-env' === PB_ENV ) {

			$assets->enqueue();
		}
	}

}
