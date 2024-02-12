<?php

namespace Publisher\Framework\Illuminate\StyleEngine\StyleDefinitions;

/**
 * Border style definition
 *
 * @package Publisher\Framework\Illuminate\StyleEngine\StyleDefinitions\Border
 */
class Border extends BaseStyleDefinition {

	/**
	 * @inheritdoc
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
			case 'border':
				$value = $setting[ $cssProperty ];

				if ( count( $value ) < 3 ) {

					if ( $value['all']['width'] !== '' ) {
						$props['border'] = trim(
							sprintf(
								'%s %s %s',
								$value['all']['width'],
								! empty( $value['all']['style'] ) ? $value['all']['style'] : 'solid',
								! empty( $value['all']['color'] ) ? pb_get_value_addon_real_value( $value['all']['color'] ) : '',
							)
						);
					}

				} else {

					if ( $value['top']['width'] !== '' ) {
						$props['border-top'] = trim(
							sprintf(
								'%s %s %s',
								$value['top']['width'],
								! empty( $value['top']['style'] ) ? $value['top']['style'] : 'solid',
								! empty( $value['top']['color'] ) ? pb_get_value_addon_real_value( $value['top']['color'] ) : '',
							)
						);
					}

					if ( $value['right']['width'] !== '' ) {
						$props['border-right'] = trim(
							sprintf(
								'%s %s %s',
								$value['right']['width'],
								! empty( $value['right']['style'] ) ? $value['right']['style'] : 'solid',
								! empty( $value['right']['color'] ) ? pb_get_value_addon_real_value( $value['right']['color'] ) : '',
							)
						);
					}

					if ( $value['bottom']['width'] !== '' ) {
						$props['border-bottom'] = trim(
							sprintf(
								'%s %s %s',
								$value['bottom']['width'],
								! empty( $value['bottom']['style'] ) ? $value['bottom']['style'] : 'solid',
								! empty( $value['bottom']['color'] ) ? pb_get_value_addon_real_value( $value['bottom']['color'] ) : '',
							)
						);
					}

					if ( $value['left']['width'] !== '' ) {
						$props['border-left'] = trim(
							sprintf(
								'%s %s %s',
								$value['left']['width'],
								! empty( $value['left']['style'] ) ? $value['left']['style'] : 'solid',
								! empty( $value['left']['color'] ) ? pb_get_value_addon_real_value( $value['left']['color'] ) : '',
							)
						);
					}
				}
				break;
			case 'border-radius':
				$value = $setting[ $cssProperty ];

				if ( ! empty( $value['type'] ) && 'all' === $value['type'] ) {

					$props['border-radius'] = ! empty( $value['all'] ) ? pb_get_value_addon_real_value( $value['all'] ) : '';

				} else {

					$props['border-top-left-radius']     = ! empty( $value['topLeft'] ) ? pb_get_value_addon_real_value( $value['topLeft'] ) : '';
					$props['border-top-right-radius']    = ! empty( $value['topRight'] ) ? pb_get_value_addon_real_value( $value['topRight'] ) : '';
					$props['border-bottom-right-radius'] = ! empty( $value['bottomRight'] ) ? pb_get_value_addon_real_value( $value['bottomRight'] ) : '';
					$props['border-bottom-left-radius']  = ! empty( $value['bottomLeft'] ) ? pb_get_value_addon_real_value( $value['bottomLeft'] ) : '';
				}
				break;
		}

		$this->setProperties( array_merge( $this->properties, $props ) );

		return $this->properties;
	}

	/**
	 * @inheritdoc
	 *
	 * @return string[]
	 */
	public function getAllowedProperties(): array {

		return [
			'publisherBorder'       => 'border',
			'publisherBorderRadius' => 'border-radius',
		];
	}

}
