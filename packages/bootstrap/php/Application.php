<?php

namespace Blockera\Bootstrap;

use Illuminate\Container\Container;

/**
 * Class Application to contain all services and entities around of php application.
 *
 * @package Application
 */
abstract class Application extends Container {

	/**
	 * Store service providers stack.
	 *
	 * @var ServiceProvider[] the service providers stack
	 */
	protected array $service_providers = [];

	/**
	 * Store all entities of WordPress core and  core api.
	 *
	 * @var array $entities the entities list.
	 */
	protected array $entities = [];

	/**
	 * Application instantiate.
	 */
	protected function __construct() {

		$this->registerConfiguredProviders();
	}

	/**
	 * Register recieved service provider.
	 *
	 * @param string $serviceProvider the service provider class.
	 * @param string $name            the service provider name.
	 *
	 * @return void
	 */
	public function registerProviders( string $serviceProvider, string $name ): void {

		$provider = new $serviceProvider( $this );

		$this->service_providers[ $name ] = $provider;

		if ( ! $provider instanceof ServiceProvider ) {

			return;
		}

		$provider->register();
	}

	/**
	 * Registration configured service providers.
	 *
	 * @return void
	 */
	public function registerConfiguredProviders() {

		array_map( [ $this, 'registerProviders' ], $this->service_providers, array_keys( $this->service_providers ) );
	}

	/**
	 * Bootstrap application.
	 *
	 * @return void
	 */
	public function bootstrap() {

		array_map(
			static function ( ServiceProvider $service_provider ) {

				$service_provider->boot();
			},
			$this->service_providers
		);
	}

	/**
	 * Get all entities.
	 *
	 * @return array the entities.
	 */
	public function getEntities(): array {

		return $this->entities;
	}

	/**
	 * Get specific entity with key.
	 *
	 * @param string $key the entity key.
	 *
	 * @return array the entity stack.
	 */
	public function getEntity( string $key ): array {

		return $this->entities[ $key ] ?? [];
	}

	/**
	 * Set entities.
	 *
	 * @param array $entities the entities list stack.
	 */
	public function setEntities( array $entities ): void {

		$this->entities = $entities;
	}

}
