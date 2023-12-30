<?php

namespace Publisher\Framework\Illuminate\Foundation\ValueAddon\DynamicValue;

use Publisher\Framework\Illuminate\Foundation\ValueAddon\ValueAddonType;

/**
 * The DynamicValueBase class.
 *
 * @package Publisher\Framework\Illuminate\Foundation\ValueAddon\DynamicValue\DynamicValueType
 */
class DynamicValueType extends ValueAddonType {

	/**
	 * Holds the label of dynamic value.
	 *
	 * @var string $label
	 */
	protected string $label;

	/**
	 * Holds the type of dynamic value.
	 *
	 * @var string $type
	 */
	protected string $type;

	/**
	 * Holds the status of dynamic value.
	 *
	 * @var string $status
	 */
	protected string $status;

	/**
	 * Holds the group of dynamic value.
	 *
	 * @var string $group
	 */
	protected string $group;

	/**
	 * @return string
	 */
	public function getLabel(): string {

		return $this->label;
	}

	/**
	 * Retrieve the type of dynamic value.
	 *
	 * @return string
	 */
	public function getType(): string {

		return $this->type;
	}

	/**
	 * Retrieve the identifier of dynamic value.
	 *
	 * @return string
	 */
	public function getStatus(): string {

		return $this->status;
	}

	/**
	 * Retrieve the group name of dynamic value.
	 *
	 * @return string
	 */
	public function getGroup(): string {

		return $this->group;
	}

	/**
	 * @inheritDoc
	 *
	 * @return string
	 */
	public function getConfigKey(): string {

		return $this->valueAddonType() . '-groups';
	}

	/**
	 * Retrieve array of dynamic value props.
	 *
	 * @return array
	 */
	public function toArray(): array {

		return [
			'type'      => $this->getType(),
			'name'      => $this->getName(),
			'label'     => $this->getLabel(),
			'group'     => $this->getGroup(),
			'status'    => $this->getStatus(),
			'settings'  => $this->getSettings(),
			'reference' => $this->getReference(),
		];
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