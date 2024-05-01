<?php

namespace Blockera\Setup\Providers;

use Blockera\Bootstrap\Application;
use Blockera\WordPress\AssetsLoader;
use Blockera\Bootstrap\ServiceProvider;
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

				return new AssetsLoader( $app, blockera_core_config( 'assets.list' ), blockera_core_config( 'assets.with-deps' ) );
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

		$this->app->make( AssetsLoader::class );
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
