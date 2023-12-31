<?php


namespace Publisher\Framework\Illuminate\Foundation\ValueAddon\DynamicValue\Fields;


use Publisher\Framework\Illuminate\Foundation\ValueAddon\DynamicValue\Field;

class AuthorURL extends Field {

	public function theName(): string {

		return 'author-url';
	}

	public function theValue( array $options = [] ): string {

		$value = '';
		global $authordata;

		if ( 'archive' === $this->getSettings( 'url' ) && $authordata ) {

			$value = get_author_posts_url( $authordata->ID, $authordata->user_nicename );

		} else {

			$value = get_the_author_meta( 'url' );
		}

		return $value;
	}

	public function theSettingsKey(): string {

		return 'url';
	}

}
