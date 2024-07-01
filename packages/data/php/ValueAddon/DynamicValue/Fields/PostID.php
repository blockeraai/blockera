<?php


namespace Blockera\Data\ValueAddon\DynamicValue\Fields;


use Blockera\Data\ValueAddon\DynamicValue\Field;

class PostID extends Field {

	public function theName(): string {

		return 'post-ID';
	}

	public function theValue( array $options = [] ): int|false {

		return get_the_ID();
	}

}
