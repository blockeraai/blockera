<?php

namespace Blockera\Editor\StyleDefinitions;

class BackgroundClip extends BaseStyleDefinition {

	protected function css( array $setting ): array {
		if ( ! isset( $setting['type'], $setting['background-clip'] ) || 'background-clip' !== $setting['type'] ) {
			return [];
		}

		$value = $setting['background-clip'];

		$this->declarations['background-clip']         = $value;
		$this->declarations['-webkit-background-clip'] = $value;

		if ( 'text' === $value ) {
			$this->declarations['-webkit-text-fill-color'] = 'transparent';
		}

		$this->setCss( $this->declarations );

		return $this->css;
	}
}
