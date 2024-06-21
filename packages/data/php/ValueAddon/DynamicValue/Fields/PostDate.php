<?php


namespace Blockera\Data\ValueAddon\DynamicValue\Fields;


use Blockera\Data\ValueAddon\DynamicValue\Field;


class PostDate extends Field {

	public function theName(): string {

		return 'post-date';
	}

	public function theValue( array $options = [] ): string {

		$date_type = $this->getSettings( 'type' );
		$format    = $this->getSettings( 'format' );
		$value     = '';

		switch ( $format ) {

			case 'human':
				/* translators: %s: Human readable date/time. */
				$value = sprintf( __( '%s ago', 'blockera' ), human_time_diff( strtotime( get_post()->{$date_type} ) ) );

				break;

			case 'default':
				$date_format = '';

				break;

			case 'custom':
				$date_format = $this->getSettings( 'custom_format' );

				break;

			default:
				$date_format = $format;

				break;
		}

		if ( isset( $date_format ) && empty( $value ) ) {

			$value = $this->theDateValue( $date_format );
		}

		return wp_kses_post( $value );
	}

	/**
	 * @param $format
	 *
	 * @since 1.0.0
	 * @return string
	 */
	private function theDateValue( $format ): string {

		$date_type = $this->getSettings( 'type' );

		return 'post_date_gmt' === $date_type ? get_the_date( $format ) : get_the_modified_date( $format );
	}
}
