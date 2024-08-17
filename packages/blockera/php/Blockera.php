<?php
/**
 * Class Blockera to contains all services and entities.
 *
 * @package Blockera
 */

namespace Blockera\Setup;

use Blockera\Bootstrap\Application;
use Blockera\Setup\Contracts\ContainerInterface;

/**
 * A Blockera class for setup service providers others ...
 *
 * @package Blockera\Setup\Blockera
 */
class Blockera extends Application implements ContainerInterface {

	/**
	 * Holds the registered values.
	 *
	 * @var array $registered_value_addons the registered values.
	 */
	protected array $registered_value_addons = [];

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

		$this->setEntities(
			array_merge(
				blockera_core_config( 'entities' ),
				[
					'breakpoints' => blockera_core_config( 'breakpoints.list' ),
				]
			)
		);

		$this->setRegisteredValueAddons();

		$this->initializeFreemius();
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
	 * Initialize Freemius
	 */
	public function initializeFreemius(): void {

		global $blockera_fs;

		if ( ! isset( $blockera_fs ) ) {

			// Include Freemius SDK.
			require_once blockera_core_config( 'app.packages_path' ) . 'freemius-sdk/php/start.php';

			$blockera_fs = fs_dynamic_init(
				array(
					'id'             => '16292',
					'slug'           => 'blockera',
					'type'           => 'plugin',
					'public_key'     => 'pk_206b63a4865444875ff845aa3e8e9',
					'is_premium'     => false,
					'has_addons'     => false,
					'has_paid_plans' => false,
					'menu'           => array(
						'slug'    => 'blockera-settings',
						'account' => false,
						'contact' => false,
						'support' => false,
					),
				)
			);
		}
	}
}
