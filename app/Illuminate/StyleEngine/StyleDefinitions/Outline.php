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

			$css['outlines'][] = "{$setting['border']['width']} {$setting['border']['style']} {$setting['border']['color']}";
			$css['offset'][]   = $setting['offset'];
		}

		return $css;
	}

	protected function getCacheKey( string $suffix = '' ): string {

		return getClassname( __NAMESPACE__, __CLASS__ ) . parent::getCacheKey( $suffix );
	}

}
