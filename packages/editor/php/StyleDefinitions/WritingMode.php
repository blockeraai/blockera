<?php

namespace Blockera\Editor\StyleDefinitions;

class WritingMode extends BaseStyleDefinition {

	protected function css( array $setting): array {

        $declaration = [];
        $cssProperty = $setting['type'];

        if (empty($cssProperty) || empty($setting[ $cssProperty ]) || 'writing-mode' !== $cssProperty) {

            return $declaration;
		}
		
		switch ($setting[ $cssProperty ]) {
			case 'style-1':
			case 'style-3':
				$this->setDeclaration('writing-mode', 'vertical-lr');
			    break;

			case 'style-2':
			case 'style-4':
				$this->setDeclaration('writing-mode', 'vertical-rl');
			    break;

			case 'initial':
				$this->setDeclaration('writing-mode', 'horizontal-tb');
		}

		$this->setCss($this->declarations);

        return $this->css;
    }
}
