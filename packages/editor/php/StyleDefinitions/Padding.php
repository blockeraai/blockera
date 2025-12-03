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

		$declaration = [];
		$cssProperty = $setting['type'];

		if ( empty( $cssProperty ) ) {

			return $declaration;
		}

		$padding = [];

		if ( isset( $setting[ $cssProperty ]['padding'] ) ) {
			$padding = $setting[ $cssProperty ]['padding'];
		}

		if ( empty( $padding ) ) {

			return $declaration;
		}

		if ( is_array( $padding ) ) {

			$padding = array_filter(
				array_map( 'blockera_get_value_addon_real_value', $padding ),
				[ $this, 'filteredItems' ]
			);
		}

		$declaration = array_map(
			static function ( string $item, string $property ): array {
				return [ "padding-{$property}" => $item ];
			},
			$padding,
			array_keys( $padding )
		);

		$this->setCss( blockera_array_flat($declaration) );

		return $this->css;
	}

	private function filteredItems( string $item ): bool {

		return '' !== $item;
	}
}
