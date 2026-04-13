<?php

namespace Blockera\Editor\StyleDefinitions;

class FontWeight extends BaseStyleDefinition {

	protected function css( array $setting): array {

		if (! isset($setting['type']) || 'font-weight' !== $setting['type']) {
			return [];
		}

		$cssProperty = $setting['type'];

		if (! isset($setting[ $cssProperty ])) {
			return [];
		}

		$fontWeightData = $setting[ $cssProperty ];
		$declarations   = [];

		if (isset($fontWeightData['weight'])) {
			$declarations[ $cssProperty ] = $fontWeightData['weight'];
		}

		if (isset($fontWeightData['style'])) {
			$declarations['font-style'] = $fontWeightData['style'];
		}

		if ([] !== $declarations) {
			$this->setCss($declarations);
		}

		return $this->css;
	}
}
