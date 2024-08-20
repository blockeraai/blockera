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
				if ( 'custom' === $setting[ $cssProperty ]['value'] ) {

					$declaration[ $cssProperty ] = sprintf(
						'%1$s%2$s%3$s',
						$setting[ $cssProperty ]['width'],
						! empty( $setting[ $cssProperty ]['width'] ) && ! empty( $setting[ $cssProperty ]['height'] ) ? ' / ' : '',
						$setting[ $cssProperty ]['height']
					);

				} else {

					$declaration[ $cssProperty ] = $setting[ $cssProperty ]['value'];
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

			default:
				$declaration[ $cssProperty ] = blockera_get_value_addon_real_value( $setting[ $cssProperty ] );

				$this->setCss( $declaration );
				break;
		}

		return $this->css;
	}

}
