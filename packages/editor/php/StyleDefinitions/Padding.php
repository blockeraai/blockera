<?php

namespace Blockera\Editor\StyleDefinitions;

class Padding extends BaseStyleDefinition {

	/**
	 * @inheritDoc
	 *
	 * @param array $setting
	 *
	 * @return string[]
	 */
	protected function css( array $setting ): array {

		// Early return if type is not set or empty.
		if ( ! isset( $setting['type'] ) || '' === $setting['type'] ) {
			return [];
		}

		$cssProperty = $setting['type'];

		// Early return if padding data is not available.
		if ( ! isset( $setting[ $cssProperty ]['padding'] ) ) {
			return [];
		}

		$padding = &$setting[ $cssProperty ]['padding'];

		// Early return if padding is not an array.
		if ( ! is_array( $padding ) ) {
			return [];
		}

		// Process padding values directly (top, right, bottom, left).
		$top    = isset( $padding['top'] ) ? blockera_get_value_addon_real_value( $padding['top'] ) : '';
		$right  = isset( $padding['right'] ) ? blockera_get_value_addon_real_value( $padding['right'] ) : '';
		$bottom = isset( $padding['bottom'] ) ? blockera_get_value_addon_real_value( $padding['bottom'] ) : '';
		$left   = isset( $padding['left'] ) ? blockera_get_value_addon_real_value( $padding['left'] ) : '';

		// Check if all four sides are present and non-empty.
		if ( '' !== $top && '' !== $right && '' !== $bottom && '' !== $left ) {
			// All four values present - use shorthand.
			$this->setCss( [ 'padding' => $top . ' ' . $right . ' ' . $bottom . ' ' . $left ] );
		} else {
			// Partial values - use individual properties (only non-empty).
			$declaration = [];

			if ( '' !== $top ) {
				$declaration['padding-top'] = $top;
			}

			if ( '' !== $right ) {
				$declaration['padding-right'] = $right;
			}

			if ( '' !== $bottom ) {
				$declaration['padding-bottom'] = $bottom;
			}

			if ( '' !== $left ) {
				$declaration['padding-left'] = $left;
			}

			if ( [] !== $declaration ) {
				$this->setCss( $declaration );
			}
		}

		return $this->css;
	}
}
