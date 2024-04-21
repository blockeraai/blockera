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
	protected function css( array $setting ): array {

		$declaration = [];
		$cssProperty = $setting['type'];

		if ( empty( $cssProperty ) ) {

			return $declaration;
		}

		$propertyValue = $setting[ $cssProperty ];

		$this->setSelector( $cssProperty );

		switch ( $cssProperty ) {

			case 'text-orientation':
				switch ($propertyValue) {
					case 'style-1':
						$declaration['writing-mode'] = 'vertical-lr' . $this->getImportant();
						$declaration['text-orientation'] = 'mixed' . $this->getImportant();
						break;
					case 'style-2':
						$declaration['writing-mode'] = 'vertical-rl' . $this->getImportant();
						$declaration['text-orientation'] = 'mixed' . $this->getImportant();
						break;
					case 'style-3':
						$declaration['writing-mode'] = 'vertical-lr' . $this->getImportant();
						$declaration['text-orientation'] = 'upright' . $this->getImportant();
						break;
					case 'style-4':
						$declaration['writing-mode'] = 'vertical-rl' . $this->getImportant();
						$declaration['text-orientation'] = 'upright' . $this->getImportant();
						break;
					case 'initial':
						$declaration['writing-mode'] =
							'horizontal-tb' . $this->getImportant();
						$declaration['text-orientation'] = 'mixed' . $this->getImportant();
				}
				break;

			case '-webkit-text-stroke-color':
				$color = pb_get_value_addon_real_value( $propertyValue['color'] );

				if ( ! empty( $color ) ) {

					$declaration['-webkit-text-stroke-color'] = $color;

					if ( ! empty( $propertyValue['width'] ) ) {
						$declaration['-webkit-text-stroke-width'] = $propertyValue['width'];
					}
				}
				
				break;

			case 'column-count':

				if ( ! empty( $propertyValue['columns'] ) ) {
					$declaration['column-count'] = 'none' === $propertyValue['columns'] ? 'initial' : preg_replace( '/\b-columns\b/i', '', $propertyValue['columns'] );

					if ( $declaration['column-count'] !== 'initial' ) {
						if ( ! empty( $propertyValue['gap'] ) ) {
							$declaration['column-gap'] = $propertyValue['gap'];
						}

						if ( ! empty( $propertyValue['divider']['width'] ) ) {

							$color = pb_get_value_addon_real_value( $propertyValue['divider']['color'] );

							if ( $color ) {
								$declaration['column-rule-color'] = $color;
							}

							$declaration['column-rule-style'] = $propertyValue['divider']['style'] ?? 'solid';
							$declaration['column-rule-width'] = $propertyValue['divider']['width'];
						}
					}
				}

				break;

			case 'word-break':
			case 'direction':
			case 'text-transform':
			case 'font-style':
			case 'text-decoration':
			case 'color':
			case '-webkit-text-stroke-width':
			case 'letter-spacing':
			case 'word-spacing':
			case 'line-height':
			case 'text-indent':
			case 'font-size':
				$declaration[ $cssProperty ] = $propertyValue ? pb_get_value_addon_real_value( $propertyValue ) : '';
				break;

		}

		$this->setCss( $declaration );

		return $this->css;
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