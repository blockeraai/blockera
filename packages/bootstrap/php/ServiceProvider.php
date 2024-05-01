<?php

namespace Blockera\Bootstrap;

use Illuminate\Container\Container;

/**
 * Service providers are the central place of all blockera application bootstrapping.
 * Your own application, as well as all of blockera's core services, are bootstrapped via service providers.
 */
class ServiceProvider {

	/**
	 * Store application container.
	 *
	 * @var Container $app the instance of application container.
	 */
	protected Container $app;

	/**
	 * ServiceProvider constructor.
	 *
	 * @param Container $app the instance of application container.
	 */
	function __construct( Container $app ) {

		$this->app = $app;
	}

	/**
	 * Register any application services.
	 *
	 * @return void
	 */
	public function register(): void {


	}

	/**
	 * Bootstrap any application services.
	 *
	 * @return void
	 */
	public function boot(): void{

	}

}
