<?php

namespace Blockera\Framework\Illuminate\Foundation;

use Illuminate\Container\Container;
use Blockera\Framework\Illuminate\Support\ServiceProvider;

/**
 * Class Application to contain all services and entities around of php application.
 *
 * @package Application
 */
class Application extends Container implements ContainerInterface{

	/**
	 * Store service providers stack.
	 *
	 * @var ServiceProvider[] the service providers stack
	 */
	protected array $service_providers = [];

	/**
	 * Holds the registered values.
	 *
	 * @var array $registered_value_addons the registered values.
	 */
	protected array $registered_value_addons = [];

	/**
	 * Store all entities of WordPress core and  core api.
	 *
	 * @var array $entities the entities list.
	 */
	protected array $entities = [];

	/**
	 * Application instantiate.
	 */
	public function __construct() {

		if ( is_admin() ) {
			$this->registerConfiguredEntities();
		}

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

		$this->service_providers = blockera_core_config( 'app.providers' );

		array_map( [ $this, 'registerProviders' ], $this->service_providers, array_keys( $this->service_providers ) );
	}

	/**
	 * Bootstrap application.
	 *
	 * @return void
	 */
	public function bootstrap() {

		foreach ( $this->service_providers as $serviceProvider ) {

			if ( ! $serviceProvider instanceof ServiceProvider ) {

				continue;
			}

			$serviceProvider->boot();
		}
	}

	/**
	 * Retrieve registered value addon.
	 *
	 * @param string $key            the value addon name.
	 * @param bool   $includeContext the flag for include context data.
	 *
	 * @return array the registered value addon with recieved key.
	 */
	public function getRegisteredValueAddons( string $key = '', bool $includeContext = true ): array {

		if ( empty( $key ) || empty( $this->registered_value_addons[ $key ] ) ) {

			return $this->registered_value_addons;
		}

		if ( $includeContext ) {

			return $this->registered_value_addons[ $key ] ?? [];
		}

		return array_map(
			static function ( array $valueAddonGroup ): array {

				return array_merge(
					$valueAddonGroup,
					[
						'items' => array_map(
							static function ( $items ): array {

								return $items['properties'] ?? [];
							},
							$valueAddonGroup['items']
						),
					]
				);
			},
			$this->registered_value_addons[ $key ]
		);
	}

	/**
	 * Set registered value addons.
	 *
	 * @param array $value_addons the recieved value addons stack to register.
	 */
	public function setRegisteredValueAddons( array $value_addons = [] ): void {

		$this->registered_value_addons = $value_addons;
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

	/**
	 * Registration configured entities into app container.
	 *
	 * @return void
	 */
	protected function registerConfiguredEntities(): void {

		$this->setEntities(
			array_merge(
				blockera_core_config( 'entities' ),
				[
					'breakpoints' => blockera_core_config( 'breakpoints' ),
				]
			)
		);
	}

}
