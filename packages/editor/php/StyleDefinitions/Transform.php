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

		$declaration      = [];
		$cssProperty      = $setting['type'] ?? '';
		$declaration_only = ! empty( $setting['_blockeraDeclarationOnly'] );
		$preset_mode      = ! empty( $setting['_blockeraGlobalPreset'] );

		if ( '' === $cssProperty || 'transform' !== $cssProperty || ! isset( $setting[ $cssProperty ] ) || empty( $setting[ $cssProperty ] ) ) {

			return $declaration;
		}

		$value             = &$setting[ $cssProperty ];
		$resolved_from_var = null;
		$self              = $this;
		$sortedTransforms  = static::getSortedRepeaterRowsFromValue(
			$value,
			static function ( array $sorted ) use ( $preset_mode, $self ): string {
				$parts = array();
				foreach ( $sorted as $item ) {
					if ( ! is_array( $item ) ) {
						continue;
					}
					if ( $preset_mode ) {
						if ( ! ( $item['isVisible'] ?? true ) ) {
							continue;
						}
					} elseif ( ! $self->isValidSetting( $item ) ) {
						continue;
					}
					$one = self::transformRowToCssValue( $item );
					if ( '' !== $one ) {
						$parts[] = $one;
					}
				}

				return implode( ' ', $parts );
			},
			$resolved_from_var
		);

		if ( null !== $resolved_from_var && '' !== $resolved_from_var ) {
			$this->setDeclaration( 'transform', $resolved_from_var );
		} elseif ( $preset_mode ) {
			foreach ( $sortedTransforms as $item ) {
				if ( ! is_array( $item ) || ! ( $item['isVisible'] ?? true ) ) {
					continue;
				}
				$one = self::transformRowToCssValue( $item );
				if ( '' === $one ) {
					continue;
				}
				$existing = $this->declarations['transform'] ?? '';
				$this->setDeclaration( 'transform', '' !== $existing ? $existing . ' ' . $one : $one );
			}
		} else {
			foreach ( $sortedTransforms as $item ) {
				if ( ! is_array( $item ) ) {
					continue;
				}
				if ( $this->isValidSetting( $item ) ) {
					$this->setTransform( $item );
				}
			}
		}

		if ( ! $preset_mode ) {
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
		}

		if ( ! isset( $this->declarations['transform'] ) || '' === $this->declarations['transform'] ) {
			return [];
		}

		if ( $declaration_only ) {
			return [];
		}

		$this->setCss( $this->declarations );

		return $this->css;
	}

	/**
	 * @param array $row Single transform repeater row.
	 */
	public static function transformRowToCssValue( array $row ): string {
		$type = isset( $row['type'] ) ? (string) $row['type'] : '';
		$one  = '';

		switch ( $type ) {
			case 'move':
				$one = 'translate3d('
					. blockera_get_value_addon_real_value( $row['move-x'] ?? '' ) . ', '
					. blockera_get_value_addon_real_value( $row['move-y'] ?? '' ) . ', '
					. blockera_get_value_addon_real_value( $row['move-z'] ?? '' ) . ')';
				break;
			case 'scale':
				$scale = blockera_get_value_addon_real_value( $row['scale'] ?? '' );
				$one   = 'scale3d(' . $scale . ', ' . $scale . ', 50%)';
				break;
			case 'rotate':
				$one = 'rotateX(' . blockera_get_value_addon_real_value( $row['rotate-x'] ?? '' ) . ') '
					. 'rotateY(' . blockera_get_value_addon_real_value( $row['rotate-y'] ?? '' ) . ') '
					. 'rotateZ(' . blockera_get_value_addon_real_value( $row['rotate-z'] ?? '' ) . ')';
				break;
			case 'skew':
				$one = 'skew('
					. blockera_get_value_addon_real_value( $row['skew-x'] ?? '' ) . ', '
					. blockera_get_value_addon_real_value( $row['skew-y'] ?? '' ) . ')';
				break;
		}

		return $one;
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

		$transform = self::transformRowToCssValue( $setting );

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
