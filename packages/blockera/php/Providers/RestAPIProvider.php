<?php

namespace Blockera\Setup\Providers;

use Blockera\Http\Routes;
use Blockera\WordPress\Sender;
use Blockera\Bootstrap\Application;
use Blockera\Bootstrap\ServiceProvider;
use Illuminate\Contracts\Container\BindingResolutionException;

/**
 * A RestAPIProvider class.
 *
 * @package Blockera\Setup\Providers\RestAPIProvider
 */
class RestAPIProvider extends ServiceProvider {

	/**
	 * Register any application services.
	 *
	 * @return void
	 */
	public function register(): void {

		$this->app->singleton(
			Routes::class,
			function ( Application $app ) {

				return new Routes( $app, $this->app->make( Sender::class ) );
			}
		);
	}

	/**
	 * Bootstrap any application services.
	 *
	 * @return void
	 */
	public function boot(): void {

		add_action( 'rest_api_init', [ $this, 'initializeRestAPI' ], 20 );
	}

	/**
	 * Initializing rest api
	 *
	 * @throws BindingResolutionException The BindingResolutionException for not bounded object.
	 * @return array the list of registered routes.
	 */
	public function initializeRestAPI(): array {

		$routes = $this->app->make( Routes::class );
		blockera_load( 'Routes.api', dirname( __DIR__ ), compact( 'routes' ) );

		return $routes::getRoutes();
	}

}
