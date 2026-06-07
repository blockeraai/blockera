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
				$decoded_svg = '';

				if (! empty($value['svgString']) && is_string($value['svgString'])) {
					$decoded_svg = $value['svgString'];
				} elseif (! empty($value['renderedIcon'])) {
					$decoded_svg = RenderedIconCodec::decode($value['renderedIcon']);
				}

				if ('' !== $decoded_svg) {
					$library        = isset($value['library']) ? (string) $value['library'] : '';
					$icon_slug      = isset($value['icon']) ? (string) $value['icon'] : '';
					$is_custom_icon = '' === $library && '' === $icon_slug;

					if (! $is_custom_icon) {
						$decoded_svg = blockera_normalize_stroke_icon_svg($decoded_svg, $library);
					}

					$encoded_svg = rawurlencode($decoded_svg);
					$icon_url    = 'url("data:image/svg+xml,' . $encoded_svg . '")';

					$this->setDeclaration('--blockera--icon--url', $icon_url);

					if (blockera_svg_has_preserved_colors($decoded_svg)) {
						$this->setDeclaration('--blockera--icon--bg-image', $icon_url);
						$this->setDeclaration('--blockera--icon--mask-image', 'none');
						$this->setDeclaration('--blockera--icon--editor-icon-bg', 'transparent');
					} else {
						// Reset inherited multi-color vars from ancestor list blocks.
						$this->setDeclaration('--blockera--icon--bg-image', 'none');
						$this->setDeclaration('--blockera--icon--mask-image', $icon_url);
						$this->setDeclaration(
							'--blockera--icon--editor-icon-bg',
							'var(--blockera--icon--color, currentColor)'
						);
					}
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
