<?php


namespace Blockera\Data\ValueAddon\DynamicValue\Fields;

use Blockera\Data\ValueAddon\DynamicValue\Field;
use Blockera\Data\ValueAddon\DynamicValue\Utility;

class ArchiveLink extends Field {

	public function theName(): string {

		return 'archive-url';
	}

	public function theValue( array $options = [] ): string {

		return Utility::getTheArchiveURL();
	}

}
