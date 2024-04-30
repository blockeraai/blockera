<?php

namespace Blockera\Framework\Illuminate\StyleEngine\StyleDefinitions;

/**
 * Class Border definition to generate css rules.
 *
 * @package Border
 */
class Border extends BaseStyleDefinition {

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

		$this->setSelector( $cssProperty );

		switch ( $cssProperty ) {
			case 'border':
				$value = $setting[ $cssProperty ];

				if ( count( $value ) < 3 ) {

					if ( $value['all']['width'] !== '' ) {
						$declaration['border'] = trim(
							sprintf(
								'%s %s %s',
								$value['all']['width'],
								! empty( $value['all']['style'] ) ? $value['all']['style'] : 'solid',
								! empty( $value['all']['color'] ) ? blockera_get_value_addon_real_value( $value['all']['color'] ) : '',
							)
						);
					}
				} else {

					if ( $value['top']['width'] !== '' ) {
						$declaration['border-top'] = trim(
							sprintf(
								'%s %s %s',
								$value['top']['width'],
								! empty( $value['top']['style'] ) ? $value['top']['style'] : 'solid',
								! empty( $value['top']['color'] ) ? blockera_get_value_addon_real_value( $value['top']['color'] ) : '',
							)
						);
					}

					if ( $value['right']['width'] !== '' ) {
						$declaration['border-right'] = trim(
							sprintf(
								'%s %s %s',
								$value['right']['width'],
								! empty( $value['right']['style'] ) ? $value['right']['style'] : 'solid',
								! empty( $value['right']['color'] ) ? blockera_get_value_addon_real_value( $value['right']['color'] ) : '',
							)
						);
					}

					if ( $value['bottom']['width'] !== '' ) {
						$declaration['border-bottom'] = trim(
							sprintf(
								'%s %s %s',
								$value['bottom']['width'],
								! empty( $value['bottom']['style'] ) ? $value['bottom']['style'] : 'solid',
								! empty( $value['bottom']['color'] ) ? blockera_get_value_addon_real_value( $value['bottom']['color'] ) : '',
							)
						);
					}

					if ( $value['left']['width'] !== '' ) {
						$declaration['border-left'] = trim(
							sprintf(
								'%s %s %s',
								$value['left']['width'],
								! empty( $value['left']['style'] ) ? $value['left']['style'] : 'solid',
								! empty( $value['left']['color'] ) ? blockera_get_value_addon_real_value( $value['left']['color'] ) : '',
							)
						);
					}
				}
				break;
			case 'border-radius':
				$value = $setting[ $cssProperty ];

				if ( ! empty( $value['type'] ) && 'all' === $value['type'] ) {

					$declaration['border-radius'] = ! empty( $value['all'] ) ? blockera_get_value_addon_real_value( $value['all'] ) : '';

				} else {

					$declaration['border-top-left-radius']     = ! empty( $value['topLeft'] ) ? blockera_get_value_addon_real_value( $value['topLeft'] ) : '';
					$declaration['border-top-right-radius']    = ! empty( $value['topRight'] ) ? blockera_get_value_addon_real_value( $value['topRight'] ) : '';
					$declaration['border-bottom-right-radius'] = ! empty( $value['bottomRight'] ) ? blockera_get_value_addon_real_value( $value['bottomRight'] ) : '';
					$declaration['border-bottom-left-radius']  = ! empty( $value['bottomLeft'] ) ? blockera_get_value_addon_real_value( $value['bottomLeft'] ) : '';
				}
				break;
		}

		$this->setCss( $declaration );

		return $this->css;
	}

	/**
	 * @inheritdoc
	 *
	 * @return string[]
	 */
	public function getAllowedProperties(): array {

		return [
			'blockeraBorder'       => 'border',
			'blockeraBorderRadius' => 'border-radius',
		];
	}

	/**
	 * Compatibility
	 *
	 * @inheritDoc
	 */
	protected function calculateFallbackFeatureId( string $cssProperty ): string {

		return blockera_camel_case_join( $cssProperty );
	}

}
