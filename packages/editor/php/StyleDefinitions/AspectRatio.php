<?php

namespace Blockera\Editor\StyleDefinitions;

class AspectRatio extends BaseStyleDefinition {

	protected function css( array $setting ): array {
		if ( ! isset( $setting['type'], $setting['aspect-ratio'] ) || 'aspect-ratio' !== $setting['type'] ) {
			return [];
		}

		$aspectRatioData = $setting['aspect-ratio'];

		// Backward compatibility: use null coalescing.
		$value = $aspectRatioData['val'] ?? $aspectRatioData['value'] ?? null;

		if ( null === $value ) {
			return [];
		}

		// Fast path for non-custom values.
		if ( 'custom' !== $value ) {
			$this->declarations['aspect-ratio'] = $value;
			$this->setCss( $this->declarations );

			return $this->css;
		}

		// Custom value path.
		$width  = $aspectRatioData['width'] ?? '';
		$height = $aspectRatioData['height'] ?? '';

		$this->declarations['aspect-ratio'] = $width . ' / ' . $height;
		$this->setCss( $this->declarations );

		return $this->css;
	}
}
