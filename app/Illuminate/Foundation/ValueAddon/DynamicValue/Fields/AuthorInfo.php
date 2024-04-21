<?php


namespace Blockera\Framework\Illuminate\Foundation\ValueAddon\DynamicValue\Fields;


use Blockera\Framework\Illuminate\Foundation\ValueAddon\DynamicValue\Field;


class AuthorInfo extends Field {

	public function theName(): string {

		return 'author-info';
	}

	public function theValue( array $options = [] ): string {

		$key = $this->getSettings( $this->theSettingsKey() );

		if ( empty( $key ) ) {

			return '';
		}

		global $post;

		$value = get_the_author_meta( $key, $post->post_author );

		return wp_kses_post( $value );
	}

	public function theSettingsKey(): string {

		return 'key';
	}

}
