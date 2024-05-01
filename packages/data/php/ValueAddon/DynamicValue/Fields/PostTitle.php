<?php


namespace Blockera\Data\ValueAddon\DynamicValue\Fields;


use Blockera\Data\ValueAddon\DynamicValue\Field;


class PostTitle extends Field {

	public function theName(): string {

		return 'post-title';
	}

	public function theValue( array $options = [] ): string {

		return wp_kses_post( get_the_title() );
	}

}
