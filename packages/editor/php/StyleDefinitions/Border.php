<?php

namespace Blockera\Editor\StyleDefinitions;

/**
 * Class Border definition to generate css rules.
 *
 * @package Border
 */
class Border extends BaseStyleDefinition {

	/**
	 * Collect all css selectors and declarations.
	 *
	 * @param array $setting the block setting.
	 *
	 * @return array Retrieve array of collection of css selectors and css declarations.
	 */
	protected function css( array $setting ): array {

		// Early return optimization: check type first (most common failure case).
		$cssProperty = $setting['type'] ?? null;
		if ( 'border' !== $cssProperty || ! isset( $setting[ $cssProperty ] ) ) {
			return [];
		}

		$value = $setting[ $cssProperty ];

		if ( ! isset($value['type']) ) {
			return [];
		}

		$declaration = [];

		if ( 'all' === $value['type'] ) {
			// Cache array access to avoid repeated lookups.
			$all   = &$value['all'];
			$width = isset( $all['width'] ) ? $all['width'] : '';

			// Early return if no width.
			if ( '' === $width ) {
				$this->setCss( $declaration );
				return $this->css;
			}

			$style = isset( $all['style'] ) && '' !== $all['style'] ? $all['style'] : 'solid';

			$color = isset( $all['color'] ) && '' !== $all['color'] 
				? blockera_get_value_addon_real_value( $all['color'] ) 
				: '';

			$declaration['border'] = implode( ' ', [ $width, $style, $color ] );
		} else {
			// Process individual sides only if they have $width set.
			$sides    = [ 'top', 'right', 'bottom', 'left' ];
			$prefixes = [ 'border-top', 'border-right', 'border-bottom', 'border-left' ];

			for ( $i = 0, $len = 4; $i < $len; ++$i ) {
				$side = $sides[ $i ];
				if ( ! isset( $value[ $side ]['width'] ) ) {
					continue;
				}

				$sideData = &$value[ $side ];
				$width    = $sideData['width'];

				// Skip empty width.
				if ( '' === $width ) {
					continue;
				}

				$style = isset( $sideData['style'] ) && '' !== $sideData['style'] ? $sideData['style'] : 'solid';
				
				$color = isset( $sideData['color'] ) && '' !== $sideData['color'] 
					? blockera_get_value_addon_real_value( $sideData['color'] ) 
					: '';

				$declaration[ $prefixes[ $i ] ] = implode( ' ', [ $width, $style, $color ] );
			}
		}

		$this->setCss( $declaration );

		return $this->css;
	}

}
