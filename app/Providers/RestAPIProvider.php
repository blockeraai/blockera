<?php

namespace Blockera\Framework\Providers;

use Blockera\Framework\Illuminate\Foundation\Application;
use Blockera\Framework\Illuminate\Foundation\Http\Routes;
use Blockera\Framework\Illuminate\Support\ServiceProvider;
use Illuminate\Contracts\Container\BindingResolutionException;
use Blockera\Framework\Http\Controllers\DynamicValuesController;

class RestAPIProvider extends ServiceProvider {

	/**
	 * @throws \Exception
	 */
	public function register(): void {

		parent::register();

		try {

			$this->app->singleton( Routes::class, function ( Application $app ) {

				return new Routes( $app );
			} );

			$this->app->singleton( DynamicValuesController::class );

		} catch ( \Exception $handler ) {

			throw new \Exception( 'Binding Service Failure! \n' . $handler->getMessage() );
		}
	}

	public function boot(): void {

		parent::boot();

		add_action( 'rest_api_init', [ $this, 'initializeRestAPI' ], 20 );
	}

	/**
	 * Initializing rest api
	 *
	 * @throws BindingResolutionException
	 * @return array the list of registered routes.
	 */
	public function initializeRestAPI(): array {

		$routes = $this->app->make( Routes::class );

		blockera_load( 'Routes.api', compact( 'routes' ) );

		return $routes::getRoutes();
	}

}
