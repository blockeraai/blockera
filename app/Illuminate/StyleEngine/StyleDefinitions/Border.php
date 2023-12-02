<?php

namespace Publisher\Framework\Illuminate\StyleEngine\StyleDefinitions;

/**
 * Border style definition
 *
 * @package Publisher\Framework\Illuminate\StyleEngine\StyleDefinitions\Border
 */
class Border extends BaseStyleDefinition {

	/**
	 * Retrieve css props.
	 *
	 * @inheritDoc
	 *
	 * @return array the css properties as array
	 */
	public function getProperties(): array {

		if ( empty( $this->settings['type'] ) ) {

			return $this->properties;
		}

		$props = [];

		switch ( $this->settings['type'] ) {
			case 'border':
				$value = $this->settings[ $this->settings['type'] ];

				if ( count( $value ) < 3 ) {

					if ( $value['all']['width'] !== '' ) {
						$props['border'] = trim(
							sprintf(
								'%s %s %s',
								$value['all']['width'],
								$value['all']['style'] !== '' ? $value['all']['style'] : 'solid',
								$value['all']['color'] ?? '',
							)
						);
					}

				} else {

					if ( $value['top']['width'] !== '' ) {
						$props['border-top'] = trim(
							sprintf(
								'%s %s %s',
								$value['top']['width'],
								$value['top']['style'] !== '' ? $value['top']['style'] : 'solid',
								$value['top']['color'] ?? '',
							)
						);
					}

					if ( $value['right']['width'] !== '' ) {
						$props['border-right'] = trim(
							sprintf(
								'%s %s %s',
								$value['right']['width'],
								$value['right']['style'] !== '' ? $value['right']['style'] : 'solid',
								$value['right']['color'] ?? '',
							)
						);
					}

					if ( $value['bottom']['width'] !== '' ) {
						$props['border-bottom'] = trim(
							sprintf(
								'%s %s %s',
								$value['bottom']['width'],
								$value['bottom']['style'] !== '' ? $value['bottom']['style'] : 'solid',
								$value['bottom']['color'] ?? '',
							)
						);
					}

					if ( $value['left']['width'] !== '' ) {
						$props['border-left'] = trim(
							sprintf(
								'%s %s %s',
								$value['left']['width'],
								$value['left']['style'] !== '' ? $value['left']['style'] : 'solid',
								$value['left']['color'] ?? '',
							)
						);
					}
				}
				break;
			case 'border-radius':
				$value = $this->settings[ $this->settings['type'] ];

				if ( ! empty( $value['type'] ) && 'all' === $value['type'] ) {

					$props['border-radius'] = $value['all'] ?? '';

				} else {

					$props['border-top-left-radius']     = $value['topLeft'] ?? '';
					$props['border-top-right-radius']    = $value['topRight'] ?? '';
					$props['border-bottom-right-radius'] = $value['bottomRight'] ?? '';
					$props['border-bottom-left-radius']  = $value['bottomLeft'] ?? '';
				}
				break;
		}

		$this->setProperties( $props );

		return $this->properties;
	}

}
