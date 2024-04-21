<?php


namespace Blockera\Framework\Illuminate\Foundation\ValueAddon\DynamicValue\Fields;


use Blockera\Framework\Illuminate\Foundation\ValueAddon\DynamicValue\Field;

class CommentsURL extends Field {

	public function theName(): string {

		return 'comments-url';
	}

	public function theValue( array $options = [] ): string {

		return get_comments_link();
	}

}
