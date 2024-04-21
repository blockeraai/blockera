<?php


namespace Blockera\Framework\Illuminate\Foundation\ValueAddon\DynamicValue\Fields;


use Blockera\Framework\Illuminate\Foundation\ValueAddon\DynamicValue\Field;


class PostTime extends Field {

	public function theName(): string {

		return 'post-time';
	}

	public function theValue( array $options = [] ): string {

		$time_type = $this->getSettings( 'type' );
		$format    = $this->getSettings( 'format' );

		switch ( $format ) {

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

		$value = 'post_date_gmt' === $time_type ? get_the_time( $date_format ) : get_the_modified_time( $date_format );

		return wp_kses_post( $value );
	}

}
