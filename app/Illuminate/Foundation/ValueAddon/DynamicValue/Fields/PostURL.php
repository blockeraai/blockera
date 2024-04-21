<?php


namespace Blockera\Framework\Illuminate\Foundation\ValueAddon\DynamicValue\Fields;


use Blockera\Framework\Illuminate\Foundation\ValueAddon\DynamicValue\Field;

class PostURL extends Field {

	public function theName(): string {

		return 'post-url';
	}

	public function theValue( array $options = [] ): string {

		$permalink = get_permalink();

		return $permalink ? : '';
	}

}
