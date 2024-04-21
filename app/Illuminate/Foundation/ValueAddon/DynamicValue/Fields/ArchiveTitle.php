<?php


namespace Blockera\Framework\Illuminate\Foundation\ValueAddon\DynamicValue\Fields;


use Blockera\Framework\Illuminate\Foundation\ValueAddon\DynamicValue\Field;
use Blockera\Framework\Illuminate\Foundation\ValueAddon\DynamicValue\Utility;


class ArchiveTitle extends Field {

	public function theName(): string {

		return 'archive-title';
	}

	public function theValue( array $options = [] ): string {

		//TODO: make sure double check there is 'include_context' key in settings array. Here I assume there is!
		$include_context = 'yes' === $this->getSettings( 'include_context' );

		$title = Utility::getPageTitle( $include_context );

		return wp_kses_post( $title );
	}

}
