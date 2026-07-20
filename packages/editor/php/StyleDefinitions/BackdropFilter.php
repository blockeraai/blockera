<?php

namespace Blockera\Editor\StyleDefinitions;

use Blockera\Editor\StyleDefinitions\Contracts\Repeater;

class BackdropFilter extends BaseStyleDefinition implements Repeater {

	protected function css( array $setting ): array {

		$cssProperty = $setting['type'] ?? '';

		if ( 'backdrop-filter' !== $cssProperty || ! isset( $setting[ $cssProperty ] ) ) {
			return [];
		}

		$backdropFilters = blockera_get_sorted_repeater( $setting[ $cssProperty ] );

		if ( ! $backdropFilters ) {
			return [];
		}

		$declarations = &$this->declarations;
		$propKey      = 'backdrop-filter';
		$out          = $declarations[ $propKey ] ?? '';
		$has          = false;

		foreach ( $backdropFilters as $filterSetting ) {
			if ( ! isset( $filterSetting['type'], $filterSetting['isVisible'] ) || ! $filterSetting['isVisible'] ) {
				continue;
			}

			$type = $filterSetting['type'];

			if ( 'drop-shadow' === $type ) {
				$chunk = 'drop-shadow('
					. blockera_get_value_addon_real_value( $filterSetting['drop-shadow-x'] ) . ' '
					. blockera_get_value_addon_real_value( $filterSetting['drop-shadow-y'] ) . ' '
					. blockera_get_value_addon_real_value( $filterSetting['drop-shadow-blur'] ) . ' '
					. blockera_get_value_addon_real_value( $filterSetting['drop-shadow-color'] ) . ')';
			} else {
				$chunk = $type . '(' . blockera_get_value_addon_real_value( $filterSetting[ $type ] ) . ')';
			}

			// Stream concat — avoids filters[] alloc + implode().
			$out = '' === $out ? $chunk : $out . ' ' . $chunk;
			$has = true;
		}

		if ( $has ) {
			$declarations[ $propKey ] = $out;
			$this->setCss( $declarations );
		}

		return $this->css;
	}

	public function isValidSetting( array $setting ): bool {

		return isset( $setting['type'], $setting['isVisible'] ) && $setting['isVisible'];
	}
}
