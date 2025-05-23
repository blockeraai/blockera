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
				$this->setDeclaration('writing-mode', 'vertical-lr');
				$this->setDeclaration('text-orientation', 'mixed');
			    break;
				
			case 'style-2':
				$this->setDeclaration('writing-mode', 'vertical-rl');
				$this->setDeclaration('text-orientation', 'mixed');
			    break;
			case 'style-3':
				$this->setDeclaration('writing-mode', 'vertical-lr');
				$this->setDeclaration('text-orientation', 'upright');
			    break;
			case 'style-4':
				$this->setDeclaration('writing-mode', 'vertical-rl');
				$this->setDeclaration('text-orientation', 'upright');
			    break;
			case 'initial':
				$this->setDeclaration('writing-mode', 'horizontal-tb');
				$this->setDeclaration('text-orientation', 'mixed');
			    break;
		}

		$this->setCss($this->declarations);

        return $this->css;
    }
}
