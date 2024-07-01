<?php


namespace Blockera\Data\ValueAddon\DynamicValue\Fields;


use Blockera\Data\ValueAddon\DynamicValue\Field;

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
