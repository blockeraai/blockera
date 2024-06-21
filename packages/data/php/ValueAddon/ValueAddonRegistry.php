<?php

namespace Blockera\Data\ValueAddon;

use Blockera\Bootstrap\Application;
use Illuminate\Contracts\Container\BindingResolutionException;

/**
 * Class ValueAddonRegistry
 *
 * @package Blockera\Data\ValueAddon\DynamicValue\ValueAddonRegistry
 */
class ValueAddonRegistry {

	/**
	 * Holds the failure registration items.
	 *
	 * @var array $failure_registry
	 */
	protected array $failure_registry = [];

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
	 * The ValueAddonRegistry constructor.
	 *
	 * @param Application     $app      the application service container.
	 * @param callable|string $abstract the abstract ValueAddonType instance.
	 *
	 * @throws BindingResolutionException The BindingResolutionException for not bounded object.
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
	 * Get registered stack.
	 *
	 * @return array
	 */
	public function getRegistered(): array {

		return $this->registered;
	}

	/**
	 * Get instance.
	 *
	 * @throws BindingResolutionException The BindingResolutionException for not bounded object.
	 */
	protected function getInstance(): ValueAddonType|null {

		if ( ! $this->application->has( $this->abstract ) ) {

			return null;
		}

		return $this->application->make( $this->abstract );
	}

	/**
	 * Registration new groups for value addon type.
	 *
	 * @throws BindingResolutionException The BindingResolutionException for not bounded object.
	 * @return void
	 */
	protected function register(): void {

		$instance = $this->getInstance();

		if ( ! $instance ) {

			return;
		}

		$configKey = sprintf( 'valueAddon.%s', $instance->getConfigKey() );

		$groups = blockera_core_config( $configKey );

		$groupsHook = sprintf(
			'blockera/%1$s/groups/registry',
			$instance->valueAddonType()
		);

		/**
		 * Filterable groups of current value addon type.
		 *
		 * @hook 'blockera/variable/groups/registry'
		 */
		$filtered_groups = apply_filters( $groupsHook, $groups );

		foreach ( $filtered_groups as $group => $item ) {

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
				'blockera/%1$s/groups/%2$s/items/registry',
				$instance->valueAddonType(),
				$group
			);

			$this->registered[ $group ] = array_merge(
				$item,
				[
					/**
					 * Filterable items of group registered.
					 *
					 * @hook `blockera/{$valueAddonType}/groups/{$valueAddonGroup}/items/registry`
					 */
					'items' => $this->registerItems( $group, apply_filters( $hookName, $item['items'] ?? [] ) ),
				]
			);
		}
	}

	/**
	 * Registration new value type items on current registration group.
	 *
	 * @param string $group             the group identifier.
	 * @param array  $value_addon_types the value type items array.
	 *
	 * @throws BindingResolutionException The BindingResolutionException for not bounded object.
	 *
	 * @return array the registered valid items on current group.
	 */
	protected function registerItems( string $group, array $value_addon_types = [] ): array {

		$registered = [];
		$instance   = $this->getInstance();

		if ( ! $instance ) {

			return $registered;
		}

		foreach ( $value_addon_types as $value_addon_type ) {

			if ( empty( $value_addon_type['name'] ) ) {

				$this->failure_registry[] = $value_addon_type;

				continue;
			}

			$name = $value_addon_type['name'];

			if ( array_key_exists( $name, $registered ) ) {

				continue;
			}

			try {

				$registered[ $name ] = [
					'instance'   => $instance,
					'properties' => $value_addon_type,
				];

			} catch ( \Exception $exception ) {

				$this->failure_registry[ $name ] = $value_addon_type;
			}
		}

		return $registered;
	}

}
