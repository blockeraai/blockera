<?php

namespace Blockera\Framework\Illuminate\Foundation\ValueAddon\DynamicValue;

/**
 * Class BaseField
 *
 * @since   1.0.0
 * @package Blockera\Framework\Illuminate\Foundation\ValueAddon\DynamicValue\BaseField
 */
abstract class BaseField {

	/**
	 * @var array $settings
	 */
	protected array $settings = [];

	/**
	 * Retrieve current field name.
	 *
	 * @since 1.0.0
	 * @return string
	 */
	abstract public function theName(): string;

	/**
	 * Retrieve current field content.
	 *
	 * @since 1.0.0
	 * @return string
	 */
	abstract public function theContent(): string;

	/**
	 * Retrieve settings panel key name.
	 *
	 * @since 1.0.0
	 * @return string
	 */
	public function theSettingsKey(): string {

		return '';
	}

	/**
	 * @param string $key
	 *
	 * @since 1.0.0
	 * @return mixed
	 */
	public function getSettings( string $key = '' ) {

		if ( ! isset( $this->settings[ $key ] ) ) {
			return $this->settings;
		}

		return $this->settings[ $key ];
	}

	/**
	 * @param array $settings
	 *
	 * @since 1.0.0
	 */
	public function setSettings( array $settings ): void {

		$this->settings = $settings;
	}

}
