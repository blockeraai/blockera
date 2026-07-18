<?php

namespace Blockera\Editor\StyleDefinitions;

class WebkitTextStrokeWidth extends BaseStyleDefinition {

	protected function css( array $setting ): array {
		if ( ! isset( $setting['type'], $setting['-webkit-text-stroke-width'] ) || '-webkit-text-stroke-width' !== $setting['type'] ) {
			return [];
		}

		$strokeData = $setting['-webkit-text-stroke-width'];

		if ( ! isset( $strokeData['width'] ) ) {
			$this->setCss( $this->declarations );

			return $this->css;
		}

		$width = blockera_get_value_addon_real_value( $strokeData['width'] );

		if ( empty( $width ) ) {
			$this->setCss( $this->declarations );

			return $this->css;
		}

		$this->setDeclaration( '-webkit-text-stroke-width', $width );
		$this->setDeclaration( 'text-stroke-width', $width );
		$this->setCss( $this->declarations );

		return $this->css;
	}
}
