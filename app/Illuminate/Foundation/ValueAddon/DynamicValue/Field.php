<?php

namespace Blockera\Framework\Illuminate\Foundation\ValueAddon\DynamicValue;

/**
 * Class Field
 *
 * An abstract class to register new field in DynamicValue Module.
 *
 * @since   1.0.0
 * @package Blockera\Framework\Illuminate\Foundation\ValueAddon\DynamicValue\Field
 */
abstract class Field extends BaseField {

	const COMPLEX_FIELD = false;

	/**
	 * @param array $options
	 *
	 * @since  1.0.0
	 * @return string
	 */
	public function theContent( array $options = [] ): string {

		$settings = $this->getSettings();

		ob_start();

		$render = $this->theValue( $options );

		if ( is_array( $render ) ) {

			echo '';

		} else {

			echo $render;
		}

		$value = ob_get_clean();

		if ( ! Utility::isEmpty( $value ) ) {

			return $this->renderEmptyValue( $settings, $value );
		}

		if ( Utility::isEmpty( $value ) && ! Utility::isEmpty( $settings, 'fallback' ) ) {

			return $settings['fallback'];
		}

		return $value;
	}

	/**
	 * @param $settings
	 * @param $value
	 *
	 * @since 1.0.0
	 * @return string
	 */
	private function renderEmptyValue( $settings, $value ): string {

		if ( ! Utility::isEmpty( $settings, 'before' ) ) {

			$value = wp_kses_post( $settings['before'] ) . $value;
		}

		if ( ! Utility::isEmpty( $settings, 'after' ) ) {

			$value .= wp_kses_post( $settings['after'] );
		}

		if ( static::COMPLEX_FIELD ) {

			$value = '<span id="dynamic-field-' . esc_attr( $this->getId() ) . '" class="dynamic-field">' . $value . '</span>';
		}

		return $value;
	}

	protected function getId(): string {

		// FIXME: requirement create unique id from ControlStack or Something like that!
		// return $this->unique_id();

		return '';
	}

	/**
	 * Retrieve the value of dynamic value.
	 *
	 * @param array $options
	 *
	 * @return mixed
	 */
	abstract public function theValue( array $options = [] ): mixed;

}
