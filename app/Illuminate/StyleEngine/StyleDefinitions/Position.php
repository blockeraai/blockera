<?php

namespace Blockera\Framework\Illuminate\StyleEngine\StyleDefinitions;

class Position extends BaseStyleDefinition {

	/**
	 * @inheritDoc
	 *
	 * @param array $setting
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
				] = $setting[$cssProperty];

				$declaration[$cssProperty] = $position;

				$filteredValues = array_filter($value);
				$declaration = array_merge( $declaration,
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
				$declaration[$cssProperty] = blockera_get_value_addon_real_value( $setting['z-index'] );
				break;
		}

		$this->setCss( $declaration );

		return $this->css;
	}

	/**
	 * @inheritDoc
	 *
	 * @return string[]
	 */
	public function getAllowedProperties(): array {

		return [
			'blockeraPosition' => 'position',
			'blockeraZIndex'   => 'z-index',
		];
	}

}