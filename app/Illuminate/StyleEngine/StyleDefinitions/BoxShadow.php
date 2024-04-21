<?php

namespace Publisher\Framework\Illuminate\StyleEngine\StyleDefinitions;

/**
 * Class BoxShadow definition to generate css rule.
 *
 * @package BoxShadow
 */
class BoxShadow extends BaseStyleDefinition {

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

		$boxShadows = array_map( static function ( array $prop ) {

			if ( ! isset( $prop['isVisible'] ) || ! $prop['isVisible'] ) {

				return null;
			}

			return sprintf(
				'%s %s %s %s %s %s',
				$prop['type'] === 'inner' ? 'inset' : '',
				! empty( $prop['x'] ) ? pb_get_value_addon_real_value( $prop['x'] ) : '',
				! empty( $prop['y'] ) ? pb_get_value_addon_real_value( $prop['y'] ) : '',
				! empty( $prop['blur'] ) ? pb_get_value_addon_real_value( $prop['blur'] ) : '',
				! empty( $prop['spread'] ) ? pb_get_value_addon_real_value( $prop['spread'] ) : '',
				! empty( $prop['color'] ) ? pb_get_value_addon_real_value( $prop['color'] ) : ''
			);
		}, pb_get_sorted_repeater( $setting[ $cssProperty ] ) );

		$this->setCss( [ $cssProperty => implode( ',', $boxShadows ) ] );

		return $this->css;
	}

	/**
	 * @inheritDoc
	 *
	 * @return string[]
	 */
	public function getAllowedProperties(): array {

		return [
			'publisherBoxShadow' => 'box-shadow',
		];
	}

	/**
	 * Compatibility
	 *
	 * @inheritDoc
	 */
	protected function calculateFallbackFeatureId( string $cssProperty ): string {

		return 'shadow';
	}

}
