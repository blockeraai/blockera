<?php


namespace Blockera\Framework\Illuminate\Foundation\ValueAddon\DynamicValue\Fields;

use Blockera\Framework\Illuminate\Foundation\ValueAddon\DynamicValue\Field;


class SiteTitle extends Field {

	public function theName(): string {

		return 'site-title';
	}

	public function theValue( array $options = [] ): string {

		return wp_kses_post( get_bloginfo() );
	}
}
