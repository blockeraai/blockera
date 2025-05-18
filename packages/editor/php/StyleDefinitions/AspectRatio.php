<?php

namespace Blockera\Editor\StyleDefinitions;

class AspectRatio extends BaseStyleDefinition {

    protected function css( array $setting): array {
     
		$declaration = [];
		$cssProperty = $setting['type'];

		if ( empty( $cssProperty ) || empty( $setting[ $cssProperty ] ) || 'aspect-ratio' !== $cssProperty ) {

			return $declaration;
		}
		
		// Backward compatibility for aspect-ratio value, because aspect-ratio changed from value to val in the new version.
		$value = $setting[ $cssProperty ]['val'] ?? $setting[ $cssProperty ]['value'];

		if ('custom' === $value) {

			$this->setDeclaration(
                $cssProperty,
                sprintf(
                    '%1$s%2$s%3$s',
                    $setting[ $cssProperty ]['width'],
                    ! empty($setting[ $cssProperty ]['width']) && ! empty($setting[ $cssProperty ]['height']) ? ' / ' : '',
                    $setting[ $cssProperty ]['height']
                )
            );

		} else {

			$this->setDeclaration($cssProperty, $value);
		}

		$this->setCss( $this->declarations );

		return $this->css;
    }
}
