<?php

namespace Publisher\Framework\Illuminate\Foundation\ValueAddon\Variable;

use Publisher\Framework\Illuminate\Foundation\ValueAddon\HasGroupTypes;
use Publisher\Framework\Illuminate\Foundation\ValueAddon\ValueAddonType;

/**
 * Class VariableType.
 *
 * @package Publisher\Framework\Services\Variable\VariableType
 */
class VariableType extends ValueAddonType implements HasGroupTypes {

	/**
	 * @inheritDoc
	 *
	 * @return string
	 */
	public function getConfigKey(): string {

		return $this->valueAddonType() . '-groups';
	}

	/**
	 * @inheritDoc
	 *
	 * @return string[]
	 */
	public function availableGroupTypes(): array {

		return [
			'color',
			'spacing',
			'font-size',
			'width-size',
			'linear-gradient',
			'radial-gradient',
		];
	}

	public function valueAddonType(): string {

		return 'variable';
	}

	/**
	 * @inheritDoc
	 *
	 * @param string $name
	 *
	 * @return string
	 */
	public function getHandler(string $name): string {
		// TODO: Implement getValue() method.

		return '';
	}

}