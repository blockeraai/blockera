<?php


namespace Blockera\Data\ValueAddon\DynamicValue\Fields;


use Blockera\Data\ValueAddon\DynamicValue\Field;


class PostCustomField extends Field {

	public function theName(): string {

		return 'post-custom-field';
	}

	public function theSettingsKey(): string {

		return 'key';
	}

	public function theValue( array $options = [] ): string {

		$key = $this->getSettings( 'key' );

		if ( empty( $key ) ) {

			$key = $this->getSettings( 'custom_key' );
		}

		if ( empty( $key ) ) {

			return '';
		}

		$value = get_post_meta( get_the_ID(), $key, true );

		return wp_kses_post( $value );
	}
}
