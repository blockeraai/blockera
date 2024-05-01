<?php


namespace Blockera\Data\ValueAddon\DynamicValue\Fields;


use BetterStudio\Tools\DynamicValues\Core\Utility;
use Blockera\Data\ValueAddon\DynamicValue\Field;


class PageTitle extends Field {

	public function theName(): string {

		return 'page-title';
	}

	public function theValue( array $options = [] ):string {

		if ( is_home() && 'yes' !== $this->getSettings( 'show_home_title' ) ) {

			return '';
		}

		$include_context = 'yes' === $this->getSettings( 'include_context' );

		$title = Utility::get_page_title( $include_context );

		return wp_kses_post( $title );
	}
}