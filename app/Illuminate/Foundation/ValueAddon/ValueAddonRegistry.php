<?php

namespace Blockera\Framework\Illuminate\Foundation\ValueAddon;

use Blockera\Framework\Illuminate\Foundation\Application;
use Illuminate\Contracts\Container\BindingResolutionException;
use Symfony\Component\VarDumper\VarDumper;

/**
 * Class ValueAddonRegistry
 *
 * @package Blockera\Framework\Illuminate\Foundation\ValueAddon\DynamicValue\ValueAddonRegistry
 */
class ValueAddonRegistry {

	/**
	 * Holds the failure registration items.
	 *
	 * @var array $failedRegistryStack
	 */
	protected array $failureRegistry = [];

	/**
	 * Holds registered value type groups stack.
	 *
	 * @var array $registered
	 */
	protected array $registered = [];

	/**
	 * Holds instance of application container class.
	 *
	 * @var Application $application
	 */
	protected Application $application;

	/**
	 * Holds the abstract ValueAddonType instance.
	 *
	 * @var callable|string $abstract
	 */
	protected $abstract;

	/**
	 * @param Application $app the application service container.
	 *
	 * @throws BindingResolutionException
	 */
	public function __construct( Application $app, $abstract ) {

		$this->application = $app;
		$this->abstract    = $abstract;

		if ( ! $this->abstract ) {

			return;
		}

		$this->register();
	}

	/**
	 * @return array
	 */
	public function getRegistered(): array {

		return $this->registered;
	}

	/**
	 * @throws BindingResolutionException
	 */
	protected function getInstance(): ValueAddonType {

		return $this->application->make( $this->abstract );
	}

	/**
	 * Registration new groups for value addon type.
	 *
	 * @throws BindingResolutionException
	 * @return void
	 */
	protected function register(): void {

		$instance = $this->getInstance();

		$configKey = sprintf( 'valueAddon.%s', $instance->getConfigKey() );

		$groups = blockera_core_config( $configKey );

		$groupsHook = sprintf(
			'blockera-core/%1$s/groups/registry',
			$instance->valueAddonType()
		);

		/**
		 * Filterable groups of current value addon type.
		 *
		 * @hook 'blockera-core/variable/groups/registry'
		 */
		$filteredGroups = apply_filters( $groupsHook, $groups );

		foreach ( $filteredGroups as $group => $item ) {

			if ( in_array( $group, $this->getRegistered(), true ) ) {

				continue;
			}

			if ( empty( $item['type'] ) ) {

				$this->registered[ $group ] = array_merge(
					$item,
					[
						'items' => $this->registerItems( $group, $item['items'] ),
					]
				);

				continue;
			}

			if ( ! $instance instanceof HasGroupTypes ) {

				continue;
			}

			if ( ! in_array( $item['type'], $instance->availableGroupTypes(), true ) ) {

				continue;
			}

			$hookName = sprintf(
				'blockera-core/%1$s/groups/%2$s/items/registry',
				$instance->valueAddonType(),
				$group
			);

			$this->registered[ $group ] = array_merge(
				$item,
				[
					/**
					 * Filterable items of group registered.
					 *
					 * @hook `blockera-core/{$valueAddonType}/groups/{$valueAddonGroup}/items/registry`
					 */
					'items' => $this->registerItems( $group, apply_filters( $hookName, $item['items'] ?? [] ) ),
				]
			);
		}
	}

	/**
	 * Registration new value type items on current registration group.
	 *
	 * @param string $group           the group identifier.
	 * @param array  $valueAddonTypes the value type items array.
	 *
	 * @throws BindingResolutionException
	 *
	 * @return array the registered valid items on current group.
	 */
	protected function registerItems( string $group, array $valueAddonTypes = [] ): array {

		$registered = [];
		$instance   = $this->getInstance();

		foreach ( $valueAddonTypes as $valueAddonType ) {

			if ( empty( $valueAddonType['name'] ) ) {

				$this->failureRegistry[] = $valueAddonType;

				continue;
			}

			$name = $valueAddonType['name'];

			if ( array_key_exists( $name, $registered ) ) {

				continue;
			}

			try {

				$registered[ $name ] = [
					'instance'   => $instance,
					'properties' => $valueAddonType,
				];

			} catch ( \Exception $exception ) {

				$this->failureRegistry[ $name ] = $valueAddonType;
			}
		}

		return $registered;
	}

}
