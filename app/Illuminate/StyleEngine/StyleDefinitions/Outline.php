<?php

namespace Publisher\Framework\Illuminate\StyleEngine\StyleDefinitions;

class Outline extends BaseStyleDefinition {

	/**
	 * @return array
	 */
	public function getProperties(): array {

		$css = [];

		foreach ( $this->settings as $setting ) {

			if ( empty( $setting['isVisible'] ) ) {

				continue;
			}

			$css['outlines'][] = sprintf(
				'%s %s %s',
				$setting['border']['width'],
				$setting['border']['style'],
				! empty( $setting['border']['color'] ) ? pb_get_value_addon_real_value( $setting['border']['color'] ) : '',
			);

			$css['offset'][] = ! empty( $setting['offset'] ) ? pb_get_value_addon_real_value( $setting['offset'] ) : '';
		}

		return $css;
	}

	protected function getCacheKey( string $suffix = '' ): string {

		return getClassname( __NAMESPACE__, __CLASS__ ) . parent::getCacheKey( $suffix );
	}

}
