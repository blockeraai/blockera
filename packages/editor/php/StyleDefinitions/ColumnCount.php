<?php

namespace Blockera\Editor\StyleDefinitions;

class ColumnCount extends BaseStyleDefinition {

	protected function css( array $setting ): array {
		if ( ! isset( $setting['type'] ) ) {
			return [];
		}

		$cssProperty = $setting['type'];

		if ( '' === $cssProperty || 'column-count' !== $cssProperty || ! isset( $setting[ $cssProperty ] ) ) {
			return [];
		}

		$cssPropData = $setting[ $cssProperty ];

		if ( ! isset( $cssPropData['columns'] ) || '' === $cssPropData['columns'] ) {
			$this->setCss( $this->declarations );

			return $this->css;
		}

		$columns          = $cssPropData['columns'];
		$columnCountValue = ( 'none' === $columns ) ? 'initial' : str_replace( '-columns', '', $columns );

		$this->declarations['column-count'] = $columnCountValue;

		if ( 'initial' !== $columnCountValue ) {
			if ( isset( $cssPropData['gap'] ) && '' !== $cssPropData['gap'] ) {
				$this->declarations['column-gap'] = $cssPropData['gap'];
			}

			if ( isset( $cssPropData['divider']['width'] ) && '' !== $cssPropData['divider']['width'] ) {
				$divider = $cssPropData['divider'];

				if ( isset( $divider['color'] ) ) {
					$color = blockera_get_value_addon_real_value( $divider['color'] );
					if ( '' !== $color && false !== $color && null !== $color ) {
						$this->declarations['column-rule-color'] = $color;
					}
				}

				$this->declarations['column-rule-style'] = $divider['style'] ?? 'solid';
				$this->declarations['column-rule-width'] = $divider['width'];
			}
		}

		$this->setCss( $this->declarations );

		return $this->css;
	}
}
