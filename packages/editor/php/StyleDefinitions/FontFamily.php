<?php

namespace Blockera\Editor\StyleDefinitions;

class FontFamily extends BaseStyleDefinition {

	protected function css( array $setting): array {

        $declaration = [];
        $cssProperty = $setting['type'];

        if (empty($cssProperty) || empty($setting[ $cssProperty ]) || 'font-family' !== $cssProperty) {

            return $declaration;
		}
		
		$this->setDeclaration($cssProperty, 'var(--wp--preset--font-family--' . $setting[ $cssProperty ] . ')');

		$this->setCss($this->declarations);

        return $this->css;
    }
}
