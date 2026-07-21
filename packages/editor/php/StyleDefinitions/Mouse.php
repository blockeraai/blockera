<?php

namespace Blockera\Editor\StyleDefinitions;

class Mouse extends BaseStyleDefinition {

	protected function css( array $setting): array {

		if (! isset($setting['type'])) {
			return [];
		}

		$cssProperty = $setting['type'];

		if ('' === $cssProperty) {
			return [];
		}

		if (! isset($setting[ $cssProperty ])) {
			return [];
		}

		$this->setDeclaration($cssProperty, $setting[ $cssProperty ]);
		$this->setCss($this->declarations);

		return $this->css;
	}
}
