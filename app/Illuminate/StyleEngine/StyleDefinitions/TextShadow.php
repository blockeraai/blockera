<?php

namespace Publisher\Framework\Illuminate\StyleEngine\StyleDefinitions;

class TextShadow extends BaseStyleDefinition {

	/**
	 * @inheritdoc
	 *
	 * @param array $setting
	 *
	 * @return array
	 */
	protected function css( array $setting ): array {

		$cssProperty = $setting['type'];

		if ( empty( $cssProperty ) ) {

			return [];
		}

		$this->setSelector( $cssProperty );

		$textShadows = array_map( static function ( array $prop ) {

			if ( ! isset( $prop['isVisible'] ) || ! $prop['isVisible'] ) {
				return null;
			}

			return sprintf(
				'%1$s %2$s %3$s %4$s',
				! empty( $prop['x'] ) ? pb_get_value_addon_real_value( $prop['x'] ) : '',
				! empty( $prop['y'] ) ? pb_get_value_addon_real_value( $prop['y'] ) : '',
				! empty( $prop['blur'] ) ? pb_get_value_addon_real_value( $prop['blur'] ) : '',
				! empty( $prop['color'] ) ? pb_get_value_addon_real_value( $prop['color'] ) : '',
			);
		}, pb_get_sorted_repeater( $setting[ $cssProperty ] ) );

		$this->setCss( [ $cssProperty => implode( ', ', $textShadows ) ] );

		return $this->css;
	}

	protected function getCacheKey( string $suffix = '' ): string {

		return pb_get_classname( __NAMESPACE__, __CLASS__ ) . parent::getCacheKey( $suffix );
	}

	/**
	 * @inheritDoc
	 *
	 * @return string[]
	 */
	public function getAllowedProperties(): array {

		return [
			'publisherTextShadow' => 'text-shadow',
		];
	}
}
