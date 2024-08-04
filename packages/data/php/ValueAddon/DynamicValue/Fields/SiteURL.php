<?php


namespace Blockera\Data\ValueAddon\DynamicValue\Fields;


use Blockera\Data\ValueAddon\DynamicValue\Field;

class SiteURL extends Field {

	public function theName(): string {

		return 'site-url';
	}

	public function theValue( array $options = [] ): string {

		return home_url();
	}

}
