<?php

namespace Blockera\Editor\StyleDefinitions;

class TextOrientation extends BaseStyleDefinition {

	protected function css( array $setting): array {

        $declaration = [];
        $cssProperty = $setting['type'];

        if (empty($cssProperty) || empty($setting[ $cssProperty ]) || 'text-orientation' !== $cssProperty) {

            return $declaration;
		}
		
		switch ($setting[ $cssProperty ]) {
			case 'style-1':
			case 'initial':
			case 'style-2':
				$this->setDeclaration('text-orientation', 'mixed');
			    break;

			case 'style-3':
			case 'style-4':
				$this->setDeclaration('text-orientation', 'upright');
			    break;
		}

		$this->setDeclaration( $cssProperty, blockera_get_value_addon_real_value($setting[ $cssProperty ]) );

		$this->setCss($this->declarations);

        return $this->css;
    }
}
