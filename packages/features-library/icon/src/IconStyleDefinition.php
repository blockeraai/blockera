<?php

namespace Blockera\Feature\Icon;

use Blockera\Editor\StyleDefinitions\BaseStyleDefinition;

class IconStyleDefinition extends BaseStyleDefinition {

    protected function css( array $setting): array {
		
        $declaration = [];
        $cssProperty = $setting['type'];

		$allowedCssProperties = [
			'--blockera--icon--url',
			'--blockera--icon--gap',
			'--blockera--icon--size',
			'--blockera--icon--color',
			'--blockera--icon--rotate',
			'--blockera--icon--flip-vertical',
			'--blockera--icon--flip-horizontal',
		];

        if (empty($cssProperty) || empty($setting[ $cssProperty ]) || ! in_array($cssProperty, $allowedCssProperties, true)) {
            return $declaration;
        }

        $value = $setting[ $cssProperty ];

		switch ($cssProperty) {
			case '--blockera--icon--url':				
				$svg = $value['renderedIcon'];

				if (! empty($svg)) {
					$decoded_svg = base64_decode($svg);
					$encoded_svg = rawurlencode($decoded_svg);
					$this->setDeclaration('--blockera--icon--url', 'url("data:image/svg+xml,' . $encoded_svg . '")');
				}
				break;

			case '--blockera--icon--rotate':
				$this->setDeclaration($cssProperty, $value . 'deg');
				break;

			case '--blockera--icon--flip-horizontal':
				$this->setDeclaration($cssProperty, '-1');
				break;

			case '--blockera--icon--flip-vertical':
				$this->setDeclaration($cssProperty, '-1');
				break;
				
			default:
				$this->setDeclaration($cssProperty, $value);
				break;
		}

		$this->setCss($this->declarations);

        return $this->css;
    }
}
