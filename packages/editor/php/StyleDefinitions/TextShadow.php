<?php

namespace Blockera\Editor\StyleDefinitions;

use Blockera\Editor\StyleDefinitions\Contracts\Repeater;

class TextShadow extends BaseStyleDefinition implements Repeater {

    protected function css( array $setting): array {

		if ( ! isset( $setting['type'] ) || 'text-shadow' !== $setting['type'] ) {
			return [];
		}

		$cssProperty = $setting['type'];

		if ( ! isset( $setting[ $cssProperty ] ) || '' === $setting[ $cssProperty ] ) {
			return [];
		}

		$sortedTextShadows = blockera_get_sorted_repeater($setting[ $cssProperty ]);

		if ( ! is_array( $sortedTextShadows ) ) {
			return [];
		}

		$count               = count( $sortedTextShadows );
		$filteredTextShadows = [];

		for ( $i = 0; $i < $count; $i++ ) {
			if ( isset( $sortedTextShadows[ $i ]['isVisible'] ) && '' !== $sortedTextShadows[ $i ]['isVisible'] ) {
				$filteredTextShadows[] = $sortedTextShadows[ $i ];
			}
		}

		if ( 0 === count( $filteredTextShadows ) ) {
			return [];
		}

		$filteredCount = count( $filteredTextShadows );
		for ( $i = 0; $i < $filteredCount; $i++ ) {
			$this->setTextShadow( $filteredTextShadows[ $i ] );
		}

		$this->setCss( $this->declarations );

		return $this->css;
	}

	/**
	 * Check if the setting is valid.
	 *
	 * @param array $setting The setting.
	 *
	 * @return bool true if the setting is valid, false otherwise.
	 */
	public function isValidSetting( array $setting): bool {
		
		return isset( $setting['isVisible'] ) && '' !== $setting['isVisible'];
	}

	/**
	 * Setup transform style properties into stack properties.
	 *
	 * @param array $setting the transform setting.
	 *
	 * @return void
	 */
	protected function setTextShadow( array $setting ): void {
		
		$previousValue = $this->declarations['text-shadow'] ?? '';
		$hasPrevious   = '' !== $previousValue;

		$x     = isset( $setting['x'] ) && '' !== $setting['x'] ? blockera_get_value_addon_real_value( $setting['x'] ) : '';
		$y     = isset( $setting['y'] ) && '' !== $setting['y'] ? blockera_get_value_addon_real_value( $setting['y'] ) : '';
		$blur  = isset( $setting['blur'] ) && '' !== $setting['blur'] ? blockera_get_value_addon_real_value( $setting['blur'] ) : '';
		$color = isset( $setting['color'] ) && '' !== $setting['color'] ? blockera_get_value_addon_real_value( $setting['color'] ) : '';

		$textShadowValue = ( $hasPrevious ? $previousValue . ', ' : '' ) . $x . ' ' . $y . ' ' . $blur . ' ' . $color;

		$this->setDeclaration( 'text-shadow', $textShadowValue );
	}
}
