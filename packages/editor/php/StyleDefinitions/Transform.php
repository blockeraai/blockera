<?php

namespace Blockera\Editor\StyleDefinitions;

use Blockera\Editor\StyleDefinitions\Contracts\Repeater;

class Transform extends BaseStyleDefinition implements Repeater {

	private const REPEATER_ITEM_TYPES = [
		'move' => true,
		'scale' => true,
		'rotate' => true,
		'skew' => true,
	];

	protected function css( array $setting): array {

		$declaration = [];
		$cssProperty = $setting['type'] ?? '';

		if ( '' === $cssProperty || 'transform' !== $cssProperty || ! isset( $setting[ $cssProperty ] ) || empty( $setting[ $cssProperty ] ) ) {

			return $declaration;
		}

		$sortedTransforms   = blockera_get_sorted_repeater($setting[ $cssProperty ]);
		$filteredTransforms = [];

		foreach ( $sortedTransforms as $item ) {
			if ( $this->isValidSetting( $item ) ) {
				$filteredTransforms[] = $item;
			}
		}

		$count = count( $filteredTransforms );
		if ( 0 !== $count ) {
			for ( $i = 0; $i < $count; ++$i ) {
				$this->setTransform( $filteredTransforms[ $i ] );
			}
		}

		$currentSettings = $this->getCurrentBreakpointSettings();
		$transformValue  = $this->declarations['transform'] ?? '';

		if ( '' !== $transformValue && isset( $currentSettings['blockeraTransformSelfPerspective'] ) ) {

			$perspectiveData = $currentSettings['blockeraTransformSelfPerspective'];
			$perspective     = blockera_get_value_addon_real_value( $perspectiveData['value'] ?? $perspectiveData );

			if ( '' !== $perspective ) {
				$this->setDeclaration(
					'transform',
					'perspective(' . $perspective . ') ' . $transformValue
				);
			}
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

		$type = $setting['type'] ?? '';

		if ( '' === $type ) {

			return false;
		}

		if ( ! isset( self::REPEATER_ITEM_TYPES[ $type ] ) ) {

			return false;
		}
		
		return isset( $setting['isVisible'] ) && $setting['isVisible'];
	}

	/**
	 * Setup transform style properties into stack properties.
	 *
	 * @param array $setting the transform setting.
	 *
	 * @return void
	 */
	protected function setTransform( array $setting ): void {

		$type      = $setting['type'] ?? '';
		$transform = '';

		switch ( $type ) {
			case 'move':
				$transform = 'translate3d('
					. blockera_get_value_addon_real_value( $setting['move-x'] ?? '' ) . ', '
					. blockera_get_value_addon_real_value( $setting['move-y'] ?? '' ) . ', '
					. blockera_get_value_addon_real_value( $setting['move-z'] ?? '' ) . ')';
				break;

			case 'scale':
				$scale     = blockera_get_value_addon_real_value( $setting['scale'] ?? '' );
				$transform = 'scale3d(' . $scale . ', ' . $scale . ', 50%)';
				break;

			case 'rotate':
				$transform = 'rotateX(' . blockera_get_value_addon_real_value( $setting['rotate-x'] ?? '' ) . ') '
					. 'rotateY(' . blockera_get_value_addon_real_value( $setting['rotate-y'] ?? '' ) . ') '
					. 'rotateZ(' . blockera_get_value_addon_real_value( $setting['rotate-z'] ?? '' ) . ')';
				break;

			case 'skew':
				$transform = 'skew('
					. blockera_get_value_addon_real_value( $setting['skew-x'] ?? '' ) . ', '
					. blockera_get_value_addon_real_value( $setting['skew-y'] ?? '' ) . ')';
				break;
		}

		if ( '' !== $transform ) {
			$existingTransform = $this->declarations['transform'] ?? '';
			
			if ( '' !== $existingTransform ) {
				$this->setDeclaration( 'transform', $existingTransform . ' ' . $transform );
			} else {
				$this->setDeclaration( 'transform', $transform );
			}
		}
	}
}
