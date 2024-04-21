<?php


namespace Blockera\Framework\Illuminate\Foundation\ValueAddon\DynamicValue\Fields;


use Blockera\Framework\Illuminate\Foundation\ValueAddon\DynamicValue\Field;


class AuthorName extends Field {

	public function theName(): string {

		return 'author-name';
	}

	public function theValue( array $options = [] ): string {

		return wp_kses_post( get_the_author() );
	}

}
