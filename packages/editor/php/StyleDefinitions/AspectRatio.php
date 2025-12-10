<?php

namespace Blockera\Editor\StyleDefinitions;

class AspectRatio extends BaseStyleDefinition {

    protected function css( array $setting): array {
     
		$cssProperty = $setting['type'] ?? '';
		
		if ( 'aspect-ratio' !== $cssProperty || ! isset( $setting[ $cssProperty ] ) ) {
			return [];
		}
		
		$aspectRatioData = $setting[ $cssProperty ];
		
		// Backward compatibility: use null coalescing.
		$value = $aspectRatioData['val'] ?? $aspectRatioData['value'] ?? null;
		
		// Early return if no value.
		if ( null === $value ) {
			return [];
		}

		// Fast path for non-custom values.
		if ( 'custom' !== $value ) {
			$this->declarations[ $cssProperty ] = $value;
			$this->setCss( $this->declarations );
			return $this->css;
		}

		// Custom value path.
		$width  = $aspectRatioData['width'] ?? '';
		$height = $aspectRatioData['height'] ?? '';
		
		$cssValue = implode( ' / ', [ $width, $height ] );
		
		$this->declarations[ $cssProperty ] = $cssValue;

		$this->setCss( $this->declarations );

		return $this->css;
    }
}
