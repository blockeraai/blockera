<?php

namespace Publisher\Framework\Illuminate\StyleEngine\StyleDefinitions;

use Publisher\Framework\Exceptions\BaseException;

class BoxShadow extends BaseStyleDefinition {

	/**
	 * @inheritdoc
	 *
	 * @param array $setting
	 *
	 * @return array
	 */
	protected function collectProps( array $setting ): array {

		$cssProperty = $setting['type'];

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

		$this->setProperties( array_merge( $this->properties, [ $cssProperty => implode( ',', $boxShadows ) ] ) );

		return $this->properties;
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
			'publisherBoxShadow' => 'box-shadow',
		];
	}

}
