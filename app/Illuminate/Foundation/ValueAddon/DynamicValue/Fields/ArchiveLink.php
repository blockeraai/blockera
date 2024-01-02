<?php


namespace Publisher\Framework\Illuminate\Foundation\ValueAddon\DynamicValue\Fields;

use Publisher\Framework\Illuminate\Foundation\ValueAddon\DynamicValue\Field;
use Publisher\Framework\Illuminate\Foundation\ValueAddon\DynamicValue\Utility;

class ArchiveLink extends Field {

	public function theName(): string {

		return 'archive-url';
	}

	public function theValue( array $options = [] ): string {

		return Utility::getTheArchiveURL();
	}

}