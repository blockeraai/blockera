<?php


namespace Blockera\Data\ValueAddon\DynamicValue\Fields;

use Blockera\Data\ValueAddon\DynamicValue\Field;

/**
 * Class ArchiveDescription
 *
 * @since   1.0.0
 * @package Blockera\Data\ValueAddon\DynamicValue\Fields
 */
class ArchiveDescription extends Field {

	public function theName(): string {

		return 'archive-description';
	}

	public function theValue( array $options = [] ): string {

		return wp_kses_post( get_the_archive_description() );
	}

}
