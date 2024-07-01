<?php


namespace Blockera\Data\ValueAddon\DynamicValue\Fields;


use Blockera\Data\ValueAddon\DynamicValue\Field;


class UserInfo extends Field {

	public function theName(): string {

		return 'user-info';
	}

	public function theValue( array $options = [] ): string {

		$type = $this->getSettings( 'type' );
		$user = wp_get_current_user();

		if ( empty( $type ) || 0 === $user->ID ) {

			return '';
		}

		$value = '';

		switch ( $type ) {

			case 'login':
			case 'email':
			case 'url':
			case 'nicename':
				$field = 'user_' . $type;
				$value = $user->$field ?? '';

				break;

			case 'id':
				$value = $user->ID;

				break;

			case 'description':
			case 'first_name':
			case 'last_name':
			case 'display_name':
				$value = $user->$type ?? '';

				break;

			case 'meta':
				$key = $this->getSettings( 'meta_key' );

				if ( ! empty( $key ) ) {

					$value = get_user_meta( $user->ID, $key, true );
				}

				break;
		}

		return wp_kses_post( $value );
	}

	public function theSettingsKey(): string {

		return 'type';
	}
}
