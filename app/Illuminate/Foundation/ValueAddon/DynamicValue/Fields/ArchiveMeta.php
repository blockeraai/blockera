<?php


namespace Publisher\Framework\Illuminate\Foundation\ValueAddon\DynamicValue\Fields;


use Publisher\Framework\Illuminate\Foundation\ValueAddon\DynamicValue\Field;


class ArchiveMeta extends Field {

	public function theName(): string {

		return 'archive-meta';
	}

	public function theSettingsKey(): string {

		return 'key';
	}

	public function theValue( array $options = [] ): string {

		$key = $this->getSettings( $this->theSettingsKey() );

		if ( empty( $key ) ) {

			return '';
		}

		$value = '';

		switch ( true ) {

			case is_category() || is_tax() || is_tag():

				$value = get_term_meta( get_queried_object_id(), $key, true );

				break;

			case is_author():

				$value = get_user_meta( get_queried_object_id(), $key, true );

				break;
		}

		return wp_kses_post( $value );
	}

}
