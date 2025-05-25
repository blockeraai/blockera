<?php

namespace Blockera\Editor\StyleDefinitions;

/**
 * Class Size definition to generate size css rule.
 *
 * @package Size
 */
class Size extends BaseStyleDefinition {

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

		switch ( $cssProperty ) {

			case 'aspect-ratio':
				// Backward compatibility for aspect-ratio value, because aspect-ratio changed from value to val in the new version.
				$value = $setting[ $cssProperty ]['val'] ?? $setting[ $cssProperty ]['value'];

				if ( 'custom' === $value ) {

					$declaration[ $cssProperty ] = sprintf(
						'%1$s%2$s%3$s',
						$setting[ $cssProperty ]['width'],
						! empty( $setting[ $cssProperty ]['width'] ) && ! empty( $setting[ $cssProperty ]['height'] ) ? ' / ' : '',
						$setting[ $cssProperty ]['height']
					);

				} else {

					$declaration[ $cssProperty ] = $value;
				}

				$this->setCss( $declaration );

				break;

			case 'object-position':
				$declaration[ $cssProperty ] = sprintf(
					'%1$s %2$s',
					$setting[ $cssProperty ]['top'],
					$setting[ $cssProperty ]['left']
				);

				$this->setCss( $declaration );
				break;

			case 'width':
				$width_config = $this->getStyleEngineConfig('blockeraWidth');

				$declaration[ $width_config['width'] ] = blockera_get_value_addon_real_value( $setting[ $cssProperty ] );

				$this->setCss( $declaration );

				break;

			case 'max-width':
				$optimizeStyleGeneration = blockera_get_admin_options([ 'earlyAccessLab', 'optimizeStyleGeneration' ]);

				$declaration[ $cssProperty ] = blockera_get_value_addon_real_value( $setting[ $cssProperty ] ) . ( $optimizeStyleGeneration ? ' !important' : '' );

				$this->setCss( $declaration );
				break;

			default:
				$declaration[ $cssProperty ] = blockera_get_value_addon_real_value( $setting[ $cssProperty ] );

				$this->setCss( $declaration );
				break;
		}

		return $this->css;
	}

}
