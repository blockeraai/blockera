<?php

namespace Publisher\Framework\Illuminate\StyleEngine\StyleDefinitions;

class TextShadow extends BaseStyleDefinition {

	/**
	 * @return array
	 */
	public function getProperties(): array {

		return array_map( static function ( array $prop ) {

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
		}, $this->settings );
	}

	protected function getCacheKey( string $suffix = '' ): string {

		return getClassname( __NAMESPACE__, __CLASS__ ) . parent::getCacheKey( $suffix );
	}

}
