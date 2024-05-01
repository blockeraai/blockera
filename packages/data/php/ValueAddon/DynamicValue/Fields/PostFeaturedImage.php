<?php


namespace Blockera\Data\ValueAddon\DynamicValue\Fields;


use Blockera\Data\ValueAddon\DynamicValue\Field;

class PostFeaturedImage extends Field {

	public function theName(): string {

		return 'post-featured-image';
	}

	public function the_group(): string {

		return 'post';
	}

	public function theValue( array $options = [] ): array {

		$attachment_src = [];

		if ( $thumbnail_id = get_post_thumbnail_id() ) {

			$attachment_src = wp_get_attachment_image_src( $thumbnail_id, 'full' );
		}

		return $thumbnail_id ?
			[
				'id'  => $thumbnail_id,
				'url' => $attachment_src[0],
			]
			: $this->getSettings( 'fallback' );
	}

}
