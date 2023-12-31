<?php


namespace Publisher\Framework\Illuminate\Foundation\ValueAddon\DynamicValue\Fields;

/**
 * Class UserProfilePicture
 *
 * @since   1.0.0
 * @package Publisher\Framework\Illuminate\Foundation\ValueAddon\DynamicValue\Fields
 */
class UserProfilePicture extends AuthorProfileImage {

	public function theName(): string {

		return 'user-profile-picture';
	}

	public function theValue( array $options = [] ): string {

		return get_avatar_url( get_current_user_id() );
	}

}
