<?php

namespace Publisher\Framework\Illuminate\Foundation\ValueAddon;

use Publisher\Framework\Illuminate\Foundation\Application;

/**
 * Class ValueAddonType
 *
 * @package Publisher\Framework\Illuminate\Foundation\ValueAddon\ValueAddonType
 */
abstract class ValueAddonType {

	/**
	 * Holds the name of value addon.
	 *
	 * @var string $name
	 */
	protected string $name;

	/**
	 * Holds the reference of dynamic value.
	 *
	 * @var array $reference
	 */
	protected array $reference;

	/**
	 * Holds settings array of dynamic value.
	 *
	 * @var array $settings
	 */
	protected array $settings = [];

	/**
	 * Holds the instance of Application Container class.
	 *
	 * @var Application $app
	 */
	protected Application $app;

	/**
	 * @param Application $application the app container.
	 *
	 * @throws \Exception
	 */
	public function __construct( Application $application ) {

		$this->app = $application;
	}

	/**
	 * Retrieve the identifier of value addon.
	 *
	 * @return string
	 */
	public function getName(): string {

		return $this->name;
	}

	/**
	 * Retrieve the reference of dynamic value.
	 *
	 * @return array
	 */
	public function getReference(): array {

		return $this->reference;
	}

	/**
	 * @return array
	 */
	public function getSettings(): array {

		return $this->settings;
	}


	/**
	 * Setup value addon properties.
	 *
	 * @param array $args the arguments to use when set properties.
	 *
	 * @return $this the self class.
	 */
	public function setProps( array $args = [] ): self {

		/**
		 * Filters the arguments for registering a value addon type.
		 *
		 * @param array $args Array of arguments for registering a value addon type.
		 *
		 * @since 1.0.0
		 *
		 */
		$args = apply_filters( 'publisher-core/' . $this->getValueType() . '/register/args', $args );

		foreach ( $args as $propertyName => $propertyValue ) {

			$method = sprintf( 'set%s', ucfirst( $propertyName ) );

			if ( is_callable( [ $this, $method ] ) ) {

				call_user_func( [ $this, $method ], $propertyValue, $propertyName );
			}
		}

		return $this;
	}

	/**
	 * Calling magic methods.
	 *
	 * @param string $method the magic method name.
	 * @param array  $params the magic method params.
	 *
	 * @return void
	 */
	public function __call( string $method, array $params = [] ): void {

		if ( ! method_exists( $this, $method ) ) {

			if ( empty( $params ) ) {

				return;
			}

			$this->{$params[1]} = $params[0];

			return;
		}

		call_user_func( [ $this, $method ], $params[0] );
	}

	/**
	 * Retrieve value addon config key.
	 *
	 * @return string the value addon config key.
	 */
	abstract public function getConfigKey(): string;

	/**
	 * Retrieve value addon type.
	 *
	 * @return string the value addon type.
	 */
	abstract public function valueAddonType(): string;

	/**
	 * Retrieve properties as array.
	 *
	 * @return array
	 */
	abstract public function toArray(): array;

}