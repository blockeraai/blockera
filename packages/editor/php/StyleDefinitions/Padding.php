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

		if ( ! isset( $setting['type'] ) || '' === $setting['type'] ) {
			return [];
		}

		$cssProperty = $setting['type'];

		// Combined miss / non-array guard (same as separate isset + is_array early returns).
		if ( ! isset( $setting[ $cssProperty ]['padding'] ) || ! is_array( $setting[ $cssProperty ]['padding'] ) ) {
			return [];
		}

		// Read-only payload: avoid by-ref so PHP can keep copy-on-write.
		$padding = $setting[ $cssProperty ]['padding'];

		$top    = isset( $padding['top'] ) ? blockera_get_value_addon_real_value( $padding['top'] ) : '';
		$right  = isset( $padding['right'] ) ? blockera_get_value_addon_real_value( $padding['right'] ) : '';
		$bottom = isset( $padding['bottom'] ) ? blockera_get_value_addon_real_value( $padding['bottom'] ) : '';
		$left   = isset( $padding['left'] ) ? blockera_get_value_addon_real_value( $padding['left'] ) : '';

		// All four sides: shorthand via concat (avoids implode() temporary array).
		if ( '' !== $top && '' !== $right && '' !== $bottom && '' !== $left ) {
			$this->setCss(
				[
					'padding' => $top . ' ' . $right . ' ' . $bottom . ' ' . $left,
				]
			);

			return $this->css;
		}

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

		// Truthy array check avoids empty() call; only setCss when something was produced.
		if ( $declaration ) {
			$this->setCss( $declaration );
		}

		return $this->css;
	}
}
