<?php


namespace Blockera\Data\ValueAddon\DynamicValue\Fields;


use Blockera\Data\ValueAddon\DynamicValue\Field;


class FeaturedImageData extends Field {

	public function theName(): string {

		return 'featured_image_data';
	}

	private function theAttachment() {

		$id = get_post_thumbnail_id();

		if ( ! $id ) {

			return false;
		}

		return get_post( $id );
	}

	public function theValue( array $options = [] ): string {

		$settings   = $this->getSettings();
		$attachment = $this->theAttachment();

		if ( ! $attachment ) {

			return '';
		}

		$value = '';

		switch ( $settings['attachment_data'] ) {

			case 'alt':
				$value = get_post_meta( $attachment->ID, '_wp_attachment_image_alt', true );

				break;

			case 'caption':
				$value = $attachment->post_excerpt;

				break;

			case 'description':
				$value = $attachment->post_content;

				break;

			case 'href':
				$value = get_permalink( $attachment->ID );

				break;

			case 'src':
				$value = $attachment->guid;

				break;

			case 'title':
				$value = $attachment->post_title;

				break;
		}

		return wp_kses_post( $value );
	}
}
