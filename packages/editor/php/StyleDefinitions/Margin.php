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

		$cssProperty = $setting['type'] ?? '';

		if ( '' === $cssProperty ) {
			return [];
		}

		if ( ! isset( $setting[ $cssProperty ]['margin'] ) || ! is_array( $setting[ $cssProperty ]['margin'] ) ) {
			return [];
		}

		$margin = $setting[ $cssProperty ]['margin'];

		if ( ! $margin ) {
			return [];
		}

		// Build flat map directly — avoids nested single-key arrays + blockera_array_flat().
		$declaration = [];

		foreach ( $margin as $key => $raw ) {
			$item = blockera_get_value_addon_real_value( $raw );

			if ( '' === $item ) {
				continue;
			}

			// Add !important only to margin-left and margin-right.
			if ( 'left' === $key || 'right' === $key ) {
				$item .= ' !important';
			}

			$declaration[ 'margin-' . $key ] = $item;
		}

		if ( ! $declaration ) {
			return [];
		}

		$this->setCss( $declaration );

		return $this->css;
	}
}
