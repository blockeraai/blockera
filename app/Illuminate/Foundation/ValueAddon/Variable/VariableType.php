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
	 * Holds name value.
	 *
	 * @var string $name the variable name.
	 */
	protected string $name;

	/**
	 * Holds identifier value.
	 *
	 * @var string $id the variable identifier.
	 */
	protected string $id;

	/**
	 * Holds variable value.
	 *
	 * @var string $value the variable value.
	 */
	protected string $value;

	/**
	 * Holds the available core type of variable.
	 *
	 * @var string $type
	 */
	protected string $type;

	/**
	 * Holds the group of variable.
	 *
	 * @var string $group
	 */
	protected string $group;

	/**
	 * Holds the css var name of variable.
	 *
	 * @var string $var
	 */
	protected string $var;

	/**
	 * Holds the label of variable.
	 *
	 * @var string $label
	 */
	protected string $label;

	/**
	 * Holds the fluid of variable.
	 *
	 * @var array $fluid
	 */
	protected array $fluid = [];

	/**
	 * @inheritDoc
	 *
	 * @return string
	 */
	public function getConfigKey(): string {

		return $this->valueAddonType() . '-groups';
	}

	public function toArray(): array {

		return [
			'id'        => $this->id,
			'var'       => $this->var,
			'name'      => $this->name,
			'type'      => $this->type,
			'value'     => $this->value,
			'group'     => $this->group,
			'label'     => $this->label,
			'fluid'     => $this->fluid,
			'reference' => $this->reference,
		];
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

}