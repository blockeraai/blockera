<?php

namespace Blockera\Editor\StyleDefinitions;

/**
 * Class Position to generate css for supported position properties in css.
 *
 * @package Position
 */
class Position extends BaseStyleDefinition {

	/**
	 * Collect all css selectors and declarations.
	 *
	 * @param array $setting the block setting.
	 *
	 * @return array
	 */
	protected function css( array $setting ): array {

		$declaration = [];
		$cssProperty = $setting['type'];

		if ( empty( $cssProperty ) ) {

			return $declaration;
		}

		$this->setSelector( $cssProperty );

		switch ( $cssProperty ) {

			case 'position':
				[
					'type'     => $position,
					'position' => $value,
				] = $setting[ $cssProperty ];

				$declaration[ $cssProperty ] = $position;

				$filteredValues = array_filter( $value );
				$declaration    = array_merge(
					$declaration,
					array_merge(
						...array_map(
							static function ( string $item, string $property ): array {

								return [ $property => blockera_get_value_addon_real_value( $item ) ];
							},
							$filteredValues,
							array_keys( $filteredValues )
						)
					)
				);

				break;
			case 'z-index':
				$declaration[ $cssProperty ] = blockera_get_value_addon_real_value( $setting['z-index'] );
				break;
		}

		$this->setCss( $declaration );

		return $this->css;
	}

	/**
	 * Get allowed reserved properties.
	 *
	 * @return array
	 */
	public function getAllowedProperties(): array {

		return [
			'blockeraPosition' => 'position',
			'blockeraZIndex'   => 'z-index',
		];
	}

}
