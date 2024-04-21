<?php


namespace Blockera\Framework\Illuminate\Foundation\ValueAddon\DynamicValue\Fields;


use Blockera\Framework\Illuminate\Foundation\ValueAddon\DynamicValue\Field;


class PostExcerpt extends Field {

	public function theName(): string {

		return 'post-excerpt';
	}

	public function theValue( array $options = [] ): string {

		// Allow only a real `post_excerpt` and not the trimmed `post_content` from the `get_the_excerpt` filter
		$post = get_post();

		if ( ! $post || empty( $post->post_excerpt ) ) {

			return '';
		}

		return wp_kses_post( $post->post_excerpt );
	}
}
