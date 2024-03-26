<?php

namespace Publisher\Framework\Illuminate\StyleEngine\StyleDefinitions;

class Size extends BaseStyleDefinition {

	/**
	 * collect all css properties.
	 *
	 * @param array $setting the background settings.
	 *
	 * @return array
	 */
	protected function collectProps( array $setting ): array {

		$cssProperty = $setting['type'];

		switch ( $cssProperty ) {

			case 'aspect-ratio':
				if ( 'custom' === $setting[ $cssProperty ]['value'] ) {

					$props[ $cssProperty ] = sprintf( '%1$s%2$s%3$s%4$s',
						$setting[ $cssProperty ]['width'],
						! empty( $setting[ $cssProperty ]['width'] ) && ! empty( $setting[ $cssProperty ]['height'] ) ? ' / ' : '',
						$setting[ $cssProperty ]['height'],
						$this->getImportant()
					);

				} else {

					$props[ $cssProperty ] = $setting[ $cssProperty ]['value'] . $this->getImportant();
				}

				break;

			case 'object-position':
				$props[ $cssProperty ] = sprintf( '%1$s %2$s%3$s',
					$setting[ $cssProperty ]['top'],
					$setting[ $cssProperty ]['left'],
					$this->getImportant()
				);
				break;

			default:
				$props[ $cssProperty ] = pb_get_value_addon_real_value( $setting[ $cssProperty ] ) . $this->getImportant();
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
			'publisherWidth'       => 'width',
			'publisherMinWidth'    => 'min-width',
			'publisherMaxWidth'    => 'max-width',
			'publisherHeight'      => 'height',
			'publisherMinHeight'   => 'min-height',
			'publisherMaxHeight'   => 'max-height',
			'publisherOverflow'    => 'overflow',
			'publisherFit'         => 'object-fit',
			'publisherRatio'       => 'aspect-ratio',
			'publisherFitPosition' => 'object-position',
		];
	}

}