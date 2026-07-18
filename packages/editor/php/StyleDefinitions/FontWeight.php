<?php

namespace Blockera\Editor\StyleDefinitions;

class FontWeight extends BaseStyleDefinition {

	protected function css( array $setting ): array {
		if ( ! isset( $setting['type'], $setting['font-weight'] ) || 'font-weight' !== $setting['type'] ) {
			return [];
		}

		$fontWeightData = $setting['font-weight'];
		$declarations   = [];

		if ( isset( $fontWeightData['weight'] ) ) {
			$declarations['font-weight'] = $fontWeightData['weight'];
		}

		if ( isset( $fontWeightData['style'] ) ) {
			$declarations['font-style'] = $fontWeightData['style'];
		}

		if ( [] !== $declarations ) {
			$this->setCss( $declarations );
		}

		return $this->css;
	}
}
