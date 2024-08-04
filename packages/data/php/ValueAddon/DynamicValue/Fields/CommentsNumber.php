<?php


namespace Blockera\Data\ValueAddon\DynamicValue\Fields;


use Blockera\Data\ValueAddon\DynamicValue\Field;


class CommentsNumber extends Field {

	public function theName(): string {

		return 'comments-number';
	}

	public function theValue( array $options = [] ): string {

		$settings        = $this->getSettings();
		$comments_number = get_comments_number();
		$count           = 0;

		switch ( true ) {

			case ! $comments_number:
				$count = $settings['format_no_comments'];

				break;

			case 1 === $comments_number:
				$count = $settings['format_one_comments'];

				break;

			case 1 < $comments_number:
				$count = strtr(
					$settings['format_many_comments'],
					[
						'{number}' => number_format_i18n( $comments_number ),
					]
				);

				break;
		}

		if ( 'comments_link' === $this->getSettings( 'link_to' ) ) {

			$count = sprintf( '<a href="%s">%s</a>', get_comments_link(), $count );
		}

		return wp_kses_post( $count );
	}

}
