<?php

namespace Blockera\Data\ValueAddon\DynamicValue;

/**
 * Class Field
 *
 * An abstract class to register new field in DynamicValue Module.
 *
 * @since   1.0.0
 * @package Blockera\Data\ValueAddon\DynamicValue\Field
 */
abstract class Field extends BaseField {

	const COMPLEX_FIELD = false;

	/**
	 * Retrieve current field content.
	 *
	 * @param array $options the extra option to use prepare content.
	 *
	 * @since  1.0.0
	 * @return string the prepared value.
	 */
	public function theContent( array $options = [] ): string {

		$settings = $this->getSettings();

		ob_start();

		$render = $this->theValue( $options );

		if ( is_array( $render ) ) {

			echo '';

		} else {

			echo esc_html( $render );
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
	 * Rendering empty value with concatenated before and after value for all fields.
	 *
	 * @param array  $settings the settings for rendering process.
	 * @param string $value    the value.
	 *
	 * @since 1.0.0
	 * @return string the concatenated value with before and after settings.
	 */
	private function renderEmptyValue( array $settings, string $value ): string {

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

	/**
	 * Get unique id for current field.
	 *
	 * @return string the unique identifier.
	 */
	protected function getId(): string {

		// FIXME: requirement create unique id from ControlStack or Something like that!
		// return $this->unique_id();

		return '';
	}

	/**
	 * Retrieve the value of dynamic value.
	 *
	 * @param array $options the extra option to use prepare value.
	 *
	 * @return mixed everything's.
	 */
	abstract public function theValue( array $options = [] ): mixed;

}
