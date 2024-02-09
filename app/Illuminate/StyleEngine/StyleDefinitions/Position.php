<?php

namespace Publisher\Framework\Illuminate\StyleEngine\StyleDefinitions;

class Position extends BaseStyleDefinition {

	/**
	 * @inheritDoc
	 *
	 * @param array $setting
	 *
	 * @return array
	 */
	protected function collectProps( array $setting ): array {

		if ( empty( $setting['type'] ) ) {

			return $this->properties;
		}

		$props       = [];
		$cssProperty = $setting['type'];

		switch ( $cssProperty ) {

			case 'position':
				[
					'type'     => $position,
					'position' => $value,
				] = $setting[$cssProperty];

				$props[$cssProperty] = $position;

				$props = array_merge( $props,
					array_merge(
						...array_map(
							static function ( string $item, string $property ): array {

								return [ $property => pb_get_value_addon_real_value( $item ) ];
							},
							$value,
							array_keys( $value )
						)
					)
				);

				break;
			case 'z-index':
				$props[$cssProperty] = pb_get_value_addon_real_value( $setting['z-index'] );
				break;
		}

		$this->setProperties( $props );

		return $this->properties;
	}

	/**
	 * @inheritDoc
	 *
	 * @return string[]
	 */
	public function getAllowedProperties(): array {

		return [
			'publisherPosition' => 'position',
			'publisherZIndex'   => 'z-index',
		];
	}

}