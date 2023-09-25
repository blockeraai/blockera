<?php

namespace Publisher\Framework\Illuminate\Foundation;

/**
 * External
 */

use Illuminate\Container\Container;

/**
 * Internal
 */

use Publisher\Framework\Illuminate\Support\ServiceProvider;

class Application extends Container {

	/**
	 * @var ServiceProvider[]
	 */
	protected array $serviceProviders = [];

	/**
	 * Application instantiate.
	 */
	public function __construct() {

		$this->registerConfiguredProviders();
	}

	public function registerProviders(): void {

		foreach ( $this->serviceProviders as $key => $serviceProvider ) {

			$provider = new $serviceProvider( $this );

			$this->serviceProviders[ $key ] = $provider;

			if ( ! $provider instanceof ServiceProvider ) {

				continue;
			}

			$provider->register();
		}
	}

	public function registerConfiguredProviders() {

		$this->serviceProviders = pb_core_config( 'app.providers' );

		$this->registerProviders();
	}

	public function bootstrap() {

		foreach ( $this->serviceProviders as $serviceProvider ) {

			if ( ! $serviceProvider instanceof ServiceProvider ) {

				continue;
			}

			$serviceProvider->boot();
		}
	}

}
