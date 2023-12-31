<?php


namespace Publisher\Framework\Illuminate\Foundation\ValueAddon\DynamicValue\Fields;


use Publisher\Framework\Illuminate\Foundation\ValueAddon\DynamicValue\Field;

class PostGallery extends Field {

	public function theName(): string {

		return 'post-gallery';
	}

	public function theValue( array $options = [] ): array {

		$images = get_attached_media( 'image' );

		$value = [];

		foreach ( $images as $image ) {

			$value[] = [
				'id' => $image->ID,
			];
		}

		return $value;
	}

}
