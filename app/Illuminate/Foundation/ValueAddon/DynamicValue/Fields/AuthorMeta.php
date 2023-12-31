<?php


namespace Publisher\Framework\Illuminate\Foundation\ValueAddon\DynamicValue\Fields;


use Publisher\Framework\Illuminate\Foundation\ValueAddon\DynamicValue\Field;


class AuthorMeta extends Field {

	public function theName(): string {

		return 'author-meta';
	}

	public function theSettingsKey(): string {

		return 'key';
	}

	public function theValue( array $options = [] ): string {

		$key = $this->getSettings( 'key' );

		if ( empty( $key ) ) {

			return '';
		}

		$value = get_the_author_meta( $key );

		return wp_kses_post( $value );
	}
}
