<?php


namespace Blockera\Framework\Illuminate\Foundation\ValueAddon\DynamicValue\Fields;


use Blockera\Framework\Illuminate\Foundation\ValueAddon\DynamicValue\Field;

class SiteURL extends Field {

	public function theName(): string {

		return 'site-url';
	}

	public function theValue( array $options = [] ): string {

		return home_url();
	}

}
