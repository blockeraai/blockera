<?php


namespace Publisher\Framework\Illuminate\Foundation\ValueAddon\DynamicValue\Fields;

use Publisher\Framework\Illuminate\Foundation\ValueAddon\DynamicValue\Field;

/**
 * Class ArchiveDescription
 *
 * @since   1.0.0
 * @package Publisher\Framework\Illuminate\Foundation\ValueAddon\DynamicValue\Fields
 */
class ArchiveDescription extends Field {

	public function theName(): string {

		return 'archive-description';
	}

	public function theValue( array $options = [] ): string {

		return wp_kses_post( get_the_archive_description() );
	}

}
