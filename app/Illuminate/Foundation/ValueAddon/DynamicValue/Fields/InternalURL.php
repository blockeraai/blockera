<?php


namespace Blockera\Framework\Illuminate\Foundation\ValueAddon\DynamicValue\Fields;


use Blockera\Framework\Illuminate\Foundation\ValueAddon\DynamicValue\Field;

class InternalURL extends Field {

	public function theName(): string {

		return 'internal-url';
	}

	public function theValue( array $options = [] ):string {

		$settings = $this->getSettings();
		$type     = $settings['type'];
		$url      = '';

		switch ( true ) {

			case 'post' === $type && ! empty( $settings['post_id'] ):

				$url = get_permalink( (int) $settings['post_id'] );

				break;

			case 'taxonomy' === $type && ! empty( $settings['taxonomy_id'] ):


				$url = get_term_link( (int) $settings['taxonomy_id'] );

				break;

			case 'attachment' === $type && ! empty( $settings['attachment_id'] ):


				$url = get_attachment_link( (int) $settings['attachment_id'] );

				break;

			case 'author' === $type && ! empty( $settings['author_id'] ):

				$url = get_author_posts_url( (int) $settings['author_id'] );

				break;

		}

		return ! is_wp_error( $url ) ? $url : '';
	}
}