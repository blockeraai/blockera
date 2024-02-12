<?php

namespace Publisher\Framework\Illuminate\StyleEngine\StyleDefinitions;

class Typography extends BaseStyleDefinition {

	protected array $options = [
		'is-important' => true,
	];

	/**
	 * @inheritDoc
	 *
	 * @param array $setting
	 *
	 * @return array
	 */
	protected function collectProps( array $setting ): array {

		if ( empty( $setting['type'] ) ) {

			return $this->properties;
		}

		$props         = [];
		$cssProperty   = $setting['type'];
		$propertyValue = $setting[ $cssProperty ];

		switch ( $cssProperty ) {

			case 'text-orientation':
				//FIXME: text-orientation bad saved!
//				$props['writing-mode'] = $propertyValue['writing-mode'] . $this->getImportant();
//				$props[ $cssProperty ] = $propertyValue['text-orientation'] . $this->getImportant();
				break;

			case '-webkit-text-stroke-color':
				$color = pb_get_value_addon_real_value( $propertyValue['color'] );

				if ( ! empty( $color ) ) {

					$props['-webkit-text-stroke-color'] = $color;

					if ( ! empty( $propertyValue['width'] ) ) {
						$props['-webkit-text-stroke-width'] = $propertyValue['width'];
					}
				}
				
				break;

			case 'column-count':

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
				}

				break;

			case 'color':
			case '-webkit-text-stroke-width':
			case 'letter-spacing':
			case 'word-spacing':
			case 'line-height':
			case 'text-indent':
			case 'font-size':
				$props[ $cssProperty ] = $propertyValue ? pb_get_value_addon_real_value( $propertyValue ) : '';
				break;

		}

		$this->setProperties( array_merge( $this->properties, $props ) );

		return $this->properties;
	}

	/**
	 * @inheritDoc
	 *
	 * @return string[]
	 */
	public function getAllowedProperties(): array {

		return [
			'publisherFontColor'       => 'color',
			'publisherFontSize'        => 'font-size',
			'publisherDirection'       => 'direction',
			'publisherTextAlign'       => 'text-align',
			'publisherFontStyle'       => 'font-style',
			'publisherWordBreak'       => 'word-break',
			'publisherTextIndent'      => 'text-indent',
			'publisherLineHeight'      => 'line-height',
			'publisherWordSpacing'     => 'word-spacing',
			'publisherTextColumns'     => 'column-count',
			'publisherTextTransform'   => 'text-transform',
			'publisherLetterSpacing'   => 'letter-spacing',
			'publisherTextDecoration'  => 'text-decoration',
			'publisherTextOrientation' => 'text-orientation',
			'publisherTextStroke'      => '-webkit-text-stroke-color',
		];
	}

}