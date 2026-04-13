<?php

namespace Blockera\Editor\StyleDefinitions;

/**
 * Class BoxShadow definition to generate css rule.
 *
 * @package BoxShadow
 */
class BoxShadow extends BaseStyleDefinition {

	/**
	 * Check is valid setting for style?
	 *
	 * @param array $setting array of style setting.
	 *
	 * @return bool true on success, false on otherwise.
	 */
	public function isValidSetting( array $setting ): bool {

		if ( ! isset( $setting['type'] ) || '' === $setting['type'] ) {
			return false;
		}

		$type = $setting['type'];

		if ( 'inner' !== $type && 'outer' !== $type ) {
			return false;
		}

		return isset( $setting['isVisible'] ) && $setting['isVisible'];
	}

	/**
	 * @inheritdoc
	 *
	 * @param array $setting
	 *
	 * @return array
	 */
	protected function css( array $setting ): array {

		if ( ! isset( $setting['type'] ) || '' === $setting['type'] ) {
			return [];
		}

		$cssProperty = $setting['type'];

		if ( 'box-shadow' !== $cssProperty || ! isset( $setting[ $cssProperty ] ) || '' === $setting[ $cssProperty ] ) {
			return [];
		}

		$boxShadowData = $setting[ $cssProperty ];
		$sortedShadows = blockera_get_sorted_repeater( $boxShadowData );

		$filteredBoxShadows = [];
		$count              = count( $sortedShadows );

		for ( $i = 0; $i < $count; ++$i ) {
			$item = $sortedShadows[ $i ];

			if ( isset( $item['type'] ) && '' !== $item['type'] ) {

				$type = $item['type'];

				if ( ( 'inner' === $type || 'outer' === $type ) && isset( $item['isVisible'] ) && $item['isVisible'] ) {
					$filteredBoxShadows[] = $item;
				}
			}
		}

		if ( 0 === count( $filteredBoxShadows ) ) {
			return [];
		}

		$boxShadowValues = [];
		$shadowCount     = count( $filteredBoxShadows );

		for ( $i = 0; $i < $shadowCount; ++$i ) {
			$boxShadowValues[] = $this->getBoxShadow( $filteredBoxShadows[ $i ] );
		}

		$this->setDeclaration( $cssProperty, implode( ', ', $boxShadowValues ) );
		$this->setCss( $this->declarations );

		return $this->css;
	}

	/**
	 * Get calculated box shadow.
	 *
	 * @param array $setting The setting.
	 *
	 * @return string the box shadow css property value.
	 */
	protected function getBoxShadow( array $setting ): string {

		$type  = isset( $setting['type'] ) ? $setting['type'] : '';
		$inset = ( 'inner' === $type ) ? 'inset' : '';

		$x      = ( isset( $setting['x'] ) && '' !== $setting['x'] ) ? blockera_get_value_addon_real_value( $setting['x'] ) : '';
		$y      = ( isset( $setting['y'] ) && '' !== $setting['y'] ) ? blockera_get_value_addon_real_value( $setting['y'] ) : '';
		$blur   = ( isset( $setting['blur'] ) && '' !== $setting['blur'] ) ? blockera_get_value_addon_real_value( $setting['blur'] ) : '';
		$spread = ( isset( $setting['spread'] ) && '' !== $setting['spread'] ) ? blockera_get_value_addon_real_value( $setting['spread'] ) : '';
		$color  = ( isset( $setting['color'] ) && '' !== $setting['color'] ) ? blockera_get_value_addon_real_value( $setting['color'] ) : '';

		return sprintf( '%s %s %s %s %s %s', $inset, $x, $y, $blur, $spread, $color );
	}
}
