<?php


namespace Publisher\Framework\Illuminate\Foundation\ValueAddon\DynamicValue\Fields;

use Publisher\Framework\Illuminate\Foundation\ValueAddon\DynamicValue\Field;


class PostTerms extends Field {

	public function theName(): string {

		return 'post-terms';
	}

	public function theValue( array $options = [] ): string {

		$settings = $this->getSettings();

		if ( 'yes' === $settings['link'] ) {

			$value = get_the_term_list( get_the_ID(), $settings['taxonomy'], '', $settings['separator'] );

		} else {

			$terms = get_the_terms( get_the_ID(), $settings['taxonomy'] );

			if ( is_wp_error( $terms ) || empty( $terms ) ) {

				return '';
			}

			$term_names = [];

			foreach ( $terms as $term ) {

				$term_names[] = '<span>' . $term->name . '</span>';
			}

			$value = implode( $settings['separator'], $term_names );
		}

		return wp_kses_post( $value );
	}
}
