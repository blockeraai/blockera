<?php

namespace Blockera\Editor\StyleDefinitions;

/**
 * Class BoxShadow definition to generate css rule.
 *
 * @package BoxShadow
 */
class BoxShadow extends BaseStyleDefinition {

	/**
	 * @inheritdoc
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

		$boxShadows = array_map(
			static function ( array $prop ) {

				if ( ! isset( $prop['isVisible'] ) || ! $prop['isVisible'] ) {

					return null;
				}

				return sprintf(
					'%s %s %s %s %s %s',
					'inner' === $prop['type'] ? 'inset' : '',
					! empty( $prop['x'] ) ? blockera_get_value_addon_real_value( $prop['x'] ) : '',
					! empty( $prop['y'] ) ? blockera_get_value_addon_real_value( $prop['y'] ) : '',
					! empty( $prop['blur'] ) ? blockera_get_value_addon_real_value( $prop['blur'] ) : '',
					! empty( $prop['spread'] ) ? blockera_get_value_addon_real_value( $prop['spread'] ) : '',
					! empty( $prop['color'] ) ? blockera_get_value_addon_real_value( $prop['color'] ) : ''
				);
			},
			blockera_get_sorted_repeater( $setting[ $cssProperty ] )
		);

		$this->setCss( [ $cssProperty => implode( ',', $boxShadows ) ] );

		return $this->css;
	}

}
