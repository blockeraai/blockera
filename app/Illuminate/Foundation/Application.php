<?php

namespace Blockera\Framework\Illuminate\Foundation;

/**
 * External
 */

use Illuminate\Container\Container;

/**
 * Internal
 */

use Blockera\Framework\Illuminate\Support\ServiceProvider;

class Application extends Container {

	/**
	 * @var ServiceProvider[]
	 */
	protected array $serviceProviders = [];

	/**
	 * Holds the registered values.
	 *
	 * @var array $registeredValueAddons the registered values.
	 */
	protected array $registeredValueAddons = [];

	/**
	 * Store all entities of WordPress core and  core api.
	 *
	 * @var array $entities the entities list
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

		$this->serviceProviders = blockera_core_config( 'app.providers' );

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

	/**
	 * Retrieve registered value addon.
	 *
	 * @param string $key            the value addon name.
	 * @param bool   $includeContext the flag for include context data.
	 *
	 * @return array the registered value addon with recieved key.
	 */
	public function getRegisteredValueAddons( string $key = '', bool $includeContext = true ): array {

		if ( empty( $key ) || empty( $this->registeredValueAddons[ $key ] ) ) {

			return $this->registeredValueAddons;
		}

		if ( $includeContext ) {

			return $this->registeredValueAddons[ $key ] ?? [];
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
			}, $this->registeredValueAddons[ $key ]
		);
	}

	/**
	 * @param array $registeredValueAddons
	 */
	public function setRegisteredValueAddons( array $registeredValueAddons ): void {

		$this->registeredValueAddons = $registeredValueAddons;
	}

	/**
	 * @return array
	 */
	public function getEntities(): array {

		return $this->entities;
	}

	/**
	 * @param array $entities
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

		$this->setEntities( blockera_core_config( 'entities' ) );
	}

}
