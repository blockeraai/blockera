<?php


namespace Publisher\Framework\Illuminate\Foundation\ValueAddon\DynamicValue\Fields;


use BetterStudio\Tools\DynamicValues\Core\Utility;
use Publisher\Framework\Illuminate\Foundation\ValueAddon\DynamicValue\Field;

class SiteLogo extends Field {

	public function theName(): string {

		return 'site-logo';
	}

	public function theValue( array $options = [] ): array {

		$image_src = [];

		if ( $custom_logo_id = get_theme_mod( 'custom_logo' ) ) {

			$image_src = wp_get_attachment_image_src( $custom_logo_id, 'full' );
		}

		$url = $custom_logo_id ? $image_src[0] : Utility::get_placeholder_image();

		return [
			'id'  => $custom_logo_id,
			'url' => $url,
		];
	}

}