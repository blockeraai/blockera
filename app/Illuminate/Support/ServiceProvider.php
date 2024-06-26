<?php

namespace Publisher\Framework\Illuminate\Support;

use Illuminate\Container\Container;

/**
 * Service providers are the central place of all publisher application bootstrapping.
 * Your own application, as well as all of publisher's core services, are bootstrapped via service providers.
 */
class ServiceProvider {

	protected Container $app;

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
