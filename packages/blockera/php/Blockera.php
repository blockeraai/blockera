<?php
/**
 * Class Blockera to contains all services and entities.
 *
 * @package Blockera
 */

namespace Blockera\Setup;

use Blockera\Bootstrap\Application;
use Blockera\Setup\Contracts\ContainerInterface;
use Blockera\Data\Cache\Contracts\ApplicationCacheStatus;

/**
 * A Blockera class for setup service providers others ...
 *
 * @package Blockera\Setup\Blockera
 */
class Blockera extends Application implements ContainerInterface, ApplicationCacheStatus {

	/**
	 * Holds the registered values.
	 *
	 * @var array $registered_value_addons the registered values.
	 */
	protected array $registered_value_addons = [];

	/**
	 * Holds the is validated cache.
	 *
	 * @var bool $is_validated the is validated cache.
	 */
	protected bool $is_validated = false;

	/**
	 * Blockera constructor.
	 */
	public function __construct() {

		/**
		 * This hook for extendable service providers list from internal or third-party developers.
		 *
		 * @hook  'blockera/service/providers'
		 * @since 1.0.0
		 */
		$this->service_providers = apply_filters( 'blockera/service/providers', blockera_core_config( 'app.providers' ) );

		// Keep parent functionalities.
		parent::__construct();

		$options     = blockera_get_admin_options();
		$breakpoints = $options['general']['breakpoints'] ?? blockera_core_config('breakpoints.list');

		if (! is_plugin_active('blockera-pro/blockera-pro.php') && ! blockera_is_skip_request()) {

			$breakpoints = blockera_update_breakpoints($options, $breakpoints);
		}

		$breakpoints = blockera_sort_breakpoints($breakpoints);
		$breakpoints = array_combine(array_column($breakpoints, 'type'), $breakpoints);

		$this->setEntities(
			array_merge(
				blockera_core_config( 'entities' ),
				[ 'breakpoints' => $breakpoints ]
			)
		);

		$this->setRegisteredValueAddons();
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

			return [];
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
	 * Set the $is_validate_cache property.
	 *
	 * @param bool $is_validated true if the is validate, false otherwise.
	 *
	 * @return void
	 */
	public function setIsValidateCache( bool $is_validated = false): void {

		$this->is_validated = $is_validated;
	}

	/**
	 * Get the is validate cache.
	 *
	 * @return bool true if the is validate, false otherwise.
	 */
	public function getIsValidateCache(): bool {

		return $this->is_validated;
	}

	/**
	 * Serialize the object.
	 *
	 * @return array
	 */
	public function __serialize(): array {
		return [
			'registered_value_addons' => $this->registered_value_addons,
			'is_validated'            => $this->is_validated,
			'service_providers'       => $this->service_providers,
		];
	}

	/**
	 * Unserialize the object.
	 *
	 * @param array $data
	 * @return void
	 */
	public function __unserialize( array $data ): void {
		$this->registered_value_addons = $data['registered_value_addons'];
		$this->is_validated            = $data['is_validated'];
		$this->service_providers       = $data['service_providers'];
	}
}
