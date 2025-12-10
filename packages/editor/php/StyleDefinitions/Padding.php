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

		// Process padding values with optimized access pattern.
		$top    = isset( $padding['top'] ) ? blockera_get_value_addon_real_value( $padding['top'] ) : '';
		$right  = isset( $padding['right'] ) ? blockera_get_value_addon_real_value( $padding['right'] ) : '';
		$bottom = isset( $padding['bottom'] ) ? blockera_get_value_addon_real_value( $padding['bottom'] ) : '';
		$left   = isset( $padding['left'] ) ? blockera_get_value_addon_real_value( $padding['left'] ) : '';

		// Optimized: Check all four values in single condition (short-circuit evaluation).
		// Using !== '' is faster than empty() for strings (direct C-level comparison).
		if ( '' !== $top && '' !== $right && '' !== $bottom && '' !== $left ) {
			// All four values present - use shorthand.
			// Optimized: Use implode() instead of multiple concatenations (faster, less memory allocation).
			// Direct array creation in implode() avoids intermediate variable allocation.
			$this->setCss( [ 'padding' => implode( ' ', [ $top, $right, $bottom, $left ] ) ] );
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

			// Optimized: Direct check - empty() is C-level optimized for arrays.
			if ( ! empty( $declaration ) ) {
				$this->setCss( $declaration );
			}
		}

		return $this->css;
	}
}
