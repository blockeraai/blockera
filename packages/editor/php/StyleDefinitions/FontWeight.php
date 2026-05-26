<?php

namespace Blockera\Editor\StyleDefinitions;

class FontWeight extends BaseStyleDefinition {

	protected function css( array $setting): array {

        $declaration = [];
        $cssProperty = $setting['type'];

        if (empty($cssProperty) || empty($setting[ $cssProperty ]) || 'font-weight' !== $cssProperty) {

            return $declaration;
		}

		if (! empty($setting[ $cssProperty ]['weight'])) {
			$this->setDeclaration($cssProperty, $setting[ $cssProperty ]['weight']);
		}

		if (! empty($setting[ $cssProperty ]['style'])) {
			$this->setDeclaration('font-style', $setting[ $cssProperty ]['style']);
		}

		$this->setCss($this->declarations);

        return $this->css;
    }
}
