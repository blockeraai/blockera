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

		$declaration = [];
		$cssProperty = $setting['type'];

		if ( empty( $cssProperty ) ) {

			return $declaration;
		}

		$margin = [];

		if ( isset( $setting[ $cssProperty ]['margin'] ) ) {
			$margin = $setting[ $cssProperty ]['margin'];
		}

		if ( empty( $margin ) ) {

			return $declaration;
		}

		if ( is_array( $margin ) ) {

			$margin = array_filter(
				array_map( 'blockera_get_value_addon_real_value', $margin ),
				[ $this, 'filteredItems' ]
			);
		}

		$declaration = array_map(
			static function ( string $item, string $property ): array {
				$value                   = $item;
				$optimizeStyleGeneration = blockera_get_admin_options([ 'earlyAccessLab', 'optimizeStyleGeneration' ]);

				// Add !important only to margin-left and margin-right.
				if ( $optimizeStyleGeneration && ( 'left' === $property || 'right' === $property ) ) {
					$value .= ' !important';
				}

				return [ "margin-{$property}" => $value ];
			},
			$margin,
			array_keys( $margin )
		);

		$this->setCss( blockera_array_flat($declaration) );

		return $this->css;
	}

	private function filteredItems( string $item ): bool {

		return '' !== $item;
	}

}
