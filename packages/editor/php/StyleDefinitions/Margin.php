<?php

namespace Blockera\Editor\StyleDefinitions;

class Margin extends BaseStyleDefinition {

	/**
	 * @inheritDoc
	 *
	 * @param array $setting
	 *
	 * @return string[]
	 */
	protected function css( array $setting ): array {

		if ( ! isset( $setting['type'] ) || '' === $setting['type'] ) {
			return [];
		}

		$cssProperty = $setting['type'];

		if ( ! isset( $setting[ $cssProperty ]['margin'] ) ) {
			return [];
		}

		$margin = $setting[ $cssProperty ]['margin'];

		if ( ! is_array( $margin ) || 0 === count( $margin ) ) {
			return [];
		}

		$declaration = [];
		$marginKeys  = array_keys( $margin );
		$marginCount = count( $marginKeys );

		for ( $i = 0; $i < $marginCount; ++$i ) {
			$key  = $marginKeys[ $i ];
			$item = blockera_get_value_addon_real_value( $margin[ $key ] );

			if ( '' === $item ) {
				continue;
			}

			// Add !important only to margin-left and margin-right.
			if ( 'left' === $key || 'right' === $key ) {
				$item .= ' !important';
			}

			$declaration[] = [ "margin-{$key}" => $item ];
		}

		if ( 0 === count( $declaration ) ) {
			return [];
		}

		$this->setCss( blockera_array_flat( $declaration ) );

		return $this->css;
	}

}
