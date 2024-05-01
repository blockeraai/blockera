<?php


namespace Blockera\Data\ValueAddon\DynamicValue\Fields;


use Blockera\Data\ValueAddon\DynamicValue\Field;


class Shortcode extends Field {

	public function theName(): string {

		return 'shortcode';
	}

	public function theValue( array $options = [] ): string {

		$settings = $this->getSettings();

		if ( empty( $settings['shortcode'] ) ) {

			return '';
		}

		$shortcode_string = $settings['shortcode'];

		$value = do_shortcode( $shortcode_string );

		/**
		 * Should Escape.
		 *
		 * Used to allow 3rd party to avoid shortcode dynamic from escaping
		 *
		 * @param bool defaults to true
		 *
		 * @since 2.2.1
		 *
		 */
		$should_escape = apply_filters( 'blockera-core/dynamic-value/fields/shortcode/should_escape', true );

		if ( $should_escape ) {

			$value = wp_kses_post( $value );
		}

		return $value;
	}
}
