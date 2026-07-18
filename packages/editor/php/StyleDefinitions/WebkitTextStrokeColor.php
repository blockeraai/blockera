<?php

namespace Blockera\Editor\StyleDefinitions;

class WebkitTextStrokeColor extends BaseStyleDefinition {

	protected function css( array $setting ): array {
		if ( ! isset( $setting['type'], $setting['-webkit-text-stroke-color'] ) || '-webkit-text-stroke-color' !== $setting['type'] ) {
			return [];
		}

		$strokeData = $setting['-webkit-text-stroke-color'];

		if ( ! isset( $strokeData['color'] ) ) {
			$this->setCss( $this->declarations );

			return $this->css;
		}

		$color = blockera_get_value_addon_real_value( $strokeData['color'] );

		if ( empty( $color ) ) {
			$this->setCss( $this->declarations );

			return $this->css;
		}

		$this->setDeclaration( '-webkit-text-stroke-color', $color );
		$this->setDeclaration( 'text-stroke-color', $color );

		if ( isset( $strokeData['width'] ) && ! empty( $strokeData['width'] ) ) {
			$this->setDeclaration( '-webkit-text-stroke-width', $strokeData['width'] );
			$this->setDeclaration( 'text-stroke-width', $strokeData['width'] );
		}

		$this->setCss( $this->declarations );

		return $this->css;
	}
}
