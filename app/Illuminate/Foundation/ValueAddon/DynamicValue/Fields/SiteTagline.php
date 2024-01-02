<?php


namespace Publisher\Framework\Illuminate\Foundation\ValueAddon\DynamicValue\Fields;


use Publisher\Framework\Illuminate\Foundation\ValueAddon\DynamicValue\Field;


class SiteTagline extends Field {

	public function theName(): string {

		return 'site-tag-line';
	}

	public function theValue( array $options = [] ): string {

		return wp_kses_post( get_bloginfo( 'description' ) );
	}

}