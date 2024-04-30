<?php

namespace Blockera\Framework\Illuminate\Foundation\ValueAddon\DynamicValue;

use Blockera\Framework\Illuminate\Foundation\ValueAddon\ValueAddonType;

/**
 * The DynamicValueBase class.
 *
 * @package Blockera\Framework\Illuminate\Foundation\ValueAddon\DynamicValue\DynamicValueType
 */
class DynamicValueType extends ValueAddonType {

	/**
	 * @inheritDoc
	 *
	 * @return string
	 */
	public function getConfigKey(): string {

		return $this->valueAddonType() . '-groups';
	}

	/**
	 * Retrieve callback rendering value.
	 *
	 * @param string $name
	 *
	 * @return BaseField|null
	 */
	public function getHandler( string $name ): ?BaseField {

		$fields = blockera_load( 'fields', [], __DIR__ );

		if ( ! class_exists( $fields[ $name ] ) ) {

			return null;
		}

		return new $fields[ $name ]();
	}

	/**
	 * @inheritDoc
	 *
	 * @return string
	 */
	public function valueAddonType(): string {

		return 'dynamic-value';
	}

}
