<?php

namespace Blockera\Editor\StyleDefinitions;

/**
 * Class Border definition to generate css rules.
 *
 * @package Border
 */
class Border extends BaseStyleDefinition {

	/**
	 * Collect all css selectors and declarations.
	 *
	 * @param array $setting the block setting.
	 *
	 * @return array Retrieve array of collection of css selectors and css declarations.
	 */
	protected function css( array $setting ): array {

		$declaration = [];
		$cssProperty = $setting['type'];

		if ( empty( $cssProperty ) || empty( $setting[ $cssProperty ] ) || 'border' !== $cssProperty ) {

			return $declaration;
		}

		$value = $setting[ $cssProperty ];

		if (count($value) < 3) {

			if ('' !== $value['all']['width']) {
				$declaration['border'] = trim(
					sprintf(
						'%s %s %s',
						$value['all']['width'],
						! empty($value['all']['style']) ? $value['all']['style'] : 'solid',
						! empty($value['all']['color']) ? blockera_get_value_addon_real_value($value['all']['color']) : '',
					)
				);
			}
		} else {

			if ('' !== $value['top']['width']) {
				$declaration['border-top'] = trim(
					sprintf(
						'%s %s %s',
						$value['top']['width'],
						! empty($value['top']['style']) ? $value['top']['style'] : 'solid',
						! empty($value['top']['color']) ? blockera_get_value_addon_real_value($value['top']['color']) : '',
					)
				);
			}

			if ('' !== $value['right']['width']) {
				$declaration['border-right'] = trim(
					sprintf(
						'%s %s %s',
						$value['right']['width'],
						! empty($value['right']['style']) ? $value['right']['style'] : 'solid',
						! empty($value['right']['color']) ? blockera_get_value_addon_real_value($value['right']['color']) : '',
					)
				);
			}

			if ('' !== $value['bottom']['width']) {
				$declaration['border-bottom'] = trim(
					sprintf(
						'%s %s %s',
						$value['bottom']['width'],
						! empty($value['bottom']['style']) ? $value['bottom']['style'] : 'solid',
						! empty($value['bottom']['color']) ? blockera_get_value_addon_real_value($value['bottom']['color']) : '',
					)
				);
			}

			if ('' !== $value['left']['width']) {
				$declaration['border-left'] = trim(
					sprintf(
						'%s %s %s',
						$value['left']['width'],
						! empty($value['left']['style']) ? $value['left']['style'] : 'solid',
						! empty($value['left']['color']) ? blockera_get_value_addon_real_value($value['left']['color']) : '',
					)
				);
			}
		}

		$this->setCss( $declaration );

		return $this->css;
	}

}
