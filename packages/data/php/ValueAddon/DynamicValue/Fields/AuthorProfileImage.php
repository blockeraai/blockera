<?php


namespace Blockera\Data\ValueAddon\DynamicValue\Fields;


use BetterStudio\Tools\DynamicValues\Core\Utility;
use Blockera\Data\ValueAddon\DynamicValue\Field;

class AuthorProfileImage extends Field {

	public function theName(): string {

		return 'author-profile-image';
	}

	public function theValue( array $options = [] ): string {

		Utility::setup_global_author_data();

		$author_id = (int) get_the_author_meta( 'ID' );

		return get_avatar_url( $author_id );
	}

}
