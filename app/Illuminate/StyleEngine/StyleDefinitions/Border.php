<?php

namespace Publisher\Framework\Illuminate\StyleEngine\StyleDefinitions;

class Border extends BaseStyleDefinition {

	public function getProperties(): array {

		if ( empty( $this->settings['type'] ) ) {

			return $this->properties;
		}

		$props = [];

		switch ( $this->settings['type'] ) {
			case 'border':
				$value = $this->settings[ $this->settings['type'] ];

				if ( count( $value ) < 3 ) {

					$props['border'] = implode(
						' ',
						array_filter(
							array_map(
								static function ( string $item ) {

									return $item;
								},
								$value['all'] ?? []
							)
						)
					);

				} else {

					$props['border-top']    = trim(
						sprintf(
							'%s %s %s',
							$value['top']['width'] ?? '',
							$value['top']['style'] ?? '',
							$value['top']['color'] ?? '',
						)
					);
					$props['border-right']  = trim(
						sprintf(
							'%s %s %s',
							$value['right']['width'] ?? '',
							$value['right']['style'] ?? '',
							$value['right']['color'] ?? '',
						)
					);
					$props['border-bottom'] = trim(
						sprintf(
							'%s %s %s',
							$value['bottom']['width'] ?? '',
							$value['bottom']['style'] ?? '',
							$value['bottom']['color'] ?? '',
						)
					);
					$props['border-left']   = trim(
						sprintf(
							'%s %s %s',
							$value['left']['width'] ?? '',
							$value['left']['style'] ?? '',
							$value['left']['color'] ?? '',
						)
					);
				}
				break;
			case 'border-radius':
				$value = $this->settings[ $this->settings['type'] ];

				if ( count( $value ) < 3 ) {

					$props['border-radius'] = $value['all'];

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