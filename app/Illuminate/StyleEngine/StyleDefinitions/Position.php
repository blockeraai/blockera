<?php

namespace Publisher\Framework\Illuminate\StyleEngine\StyleDefinitions;

class Position extends BaseStyleDefinition {

	public function getProperties(): array {

		if ( empty( $this->settings['type'] ) ) {

			return $this->properties;
		}

		$props = [];

		switch ( $this->settings['type'] ) {

			case 'position':
				[
					'type'     => $position,
					'position' => $value,
				] = $this->settings['position'];

				$props['position'] = $position;

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
				$props['z-index'] = pb_get_value_addon_real_value( $this->settings['z-index'] );
				break;
		}

		$this->setProperties( $props );

		return $this->properties;
	}

}