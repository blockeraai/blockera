<?php


namespace Blockera\Data\ValueAddon\DynamicValue\Fields;


use Blockera\Data\ValueAddon\DynamicValue\Field;


class CurrentDateTime extends Field {

	public function theName(): string {

		return 'current-date-time';
	}

	public function theValue( array $options = [] ): string {

		$settings = $this->getSettings();

		if ( 'custom' === $settings['date_format'] ) {

			$format = $settings['custom_format'];

		} else {

			$format = $this->autoDateFormat( $settings );
		}

		$value = date_i18n( $format );

		return wp_kses_post( $value );
	}

	/**
	 * @param array $settings
	 *
	 * @since 1.0.0
	 * @return string
	 */
	private function autoDateFormat( array $settings ): string {

		$date_format = $settings['date_format'];
		$time_format = $settings['time_format'];
		$format      = '';

		if ( 'default' === $date_format ) {

			$date_format = get_option( 'date_format' );
		}

		if ( 'default' === $time_format ) {

			$time_format = get_option( 'time_format' );
		}

		if ( $date_format ) {

			$format   = $date_format;
			$has_date = true;

		} else {

			$has_date = false;
		}

		if ( $time_format ) {

			if ( $has_date ) {

				$format .= ' ';
			}

			$format .= $time_format;
		}

		return $format;
	}
}
