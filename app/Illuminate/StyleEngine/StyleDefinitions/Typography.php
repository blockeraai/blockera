<?php

namespace Publisher\Framework\Illuminate\StyleEngine\StyleDefinitions;

class Typography extends BaseStyleDefinition {

	public function getProperties(): array {

		if ( empty( $this->settings['type'] ) ) {

			return $this->properties;
		}

		$cssProperty   = $this->settings['type'];
		$propertyValue = $this->settings[ $cssProperty ];

		switch ( $cssProperty ) {

			case 'text-orientation':

				$this->setProperties(
					[
						'writing-mode' => $propertyValue['writing-mode'] . $this->getImportant(),
						$cssProperty   => $propertyValue['text-orientation'] . $this->getImportant(),
					]
				);

				return $this->properties;

			case '-webkit-text-stroke-color':
				$props = [];
				$color = pb_get_value_addon_real_value( $propertyValue['color'] );

				if ( ! empty( $color ) ) {

					$props['-webkit-text-stroke-color'] = $color;

					if ( ! empty( $propertyValue['width'] ) ) {
						$props['-webkit-text-stroke-width'] = $propertyValue['width'];
					}

					$this->setProperties( $props );
				}

				return $this->properties;

			case 'column-count':
				$props = [];

				if ( ! empty( $propertyValue['columns'] ) ) {
					$props['column-count'] = 'none' === $propertyValue['columns'] ? 'initial' : preg_replace( '/\b-columns\b/i', '', $propertyValue['columns'] );

					if ( $props['column-count'] !== 'initial' ) {
						if ( ! empty( $propertyValue['gap'] ) ) {
							$props['column-gap'] = $propertyValue['gap'];
						}

						if ( ! empty( $propertyValue['divider']['width'] ) ) {

							$color = pb_get_value_addon_real_value( $propertyValue['divider']['color'] );

							if ( $color ) {
								$props['column-rule-color'] = $color;
							}

							$props['column-rule-style'] = $propertyValue['divider']['style'] ?? 'solid';
							$props['column-rule-width'] = $propertyValue['divider']['width'];
						}
					}

					$this->setProperties( $props );
				}

				return $this->properties;

			case 'color':
			case '-webkit-text-stroke-width':
			case 'letter-spacing':
			case 'word-spacing':
			case 'line-height':
			case 'text-indent':
			case 'font-size':
				$propertyValue = $propertyValue ? pb_get_value_addon_real_value( $propertyValue ) : '';
				break;

		}

		if ( $propertyValue ) {
			$this->setProperties(
				[
					$cssProperty => $propertyValue . $this->getImportant(),
				]
			);
		}

		return $this->properties;
	}

}