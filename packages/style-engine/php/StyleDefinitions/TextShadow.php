<?php

namespace Blockera\StyleEngine\StyleDefinitions;

class TextShadow extends BaseStyleDefinition {

	/**
	 * @inheritdoc
	 *
	 * @param array $setting
	 *
	 * @return array
	 */
	protected function css( array $setting ): array {

		$cssProperty = $setting['type'];

		if ( empty( $cssProperty ) ) {

			return [];
		}

		$this->setSelector( $cssProperty );

		$textShadows = array_map(
			static function ( array $prop ) {

				if ( ! isset( $prop['isVisible'] ) || ! $prop['isVisible'] ) {
					return null;
				}

				return sprintf(
					'%1$s %2$s %3$s %4$s',
					! empty( $prop['x'] ) ? blockera_get_value_addon_real_value( $prop['x'] ) : '',
					! empty( $prop['y'] ) ? blockera_get_value_addon_real_value( $prop['y'] ) : '',
					! empty( $prop['blur'] ) ? blockera_get_value_addon_real_value( $prop['blur'] ) : '',
					! empty( $prop['color'] ) ? blockera_get_value_addon_real_value( $prop['color'] ) : '',
				);
			},
			blockera_get_sorted_repeater( $setting[ $cssProperty ] )
		);

		$this->setCss( [ $cssProperty => implode( ', ', $textShadows ) ] );

		return $this->css;
	}

	/**
	 * @inheritDoc
	 *
	 * @return string[]
	 */
	public function getAllowedProperties(): array {

		return [
			'blockeraTextShadow' => 'text-shadow',
		];
	}
}
