<?php

namespace Blockera\Editor\StyleDefinitions;

class Color extends BaseStyleDefinition {

	protected function css( array $setting): array {
		if (! isset($setting['type']) || 'color' !== $setting['type']) {
			return [];
		}

		$cssProperty = $setting['type'];

		if (! isset($setting[ $cssProperty ]) || '' === $setting[ $cssProperty ]) {
			return [];
		}

		$value = $setting[ $cssProperty ];
		$this->setDeclaration($cssProperty, blockera_get_value_addon_real_value($value));
		$this->setCss($this->declarations);

		return $this->css;
	}
}
