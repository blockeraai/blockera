<?php

namespace Blockera\Editor\StyleDefinitions;

use Blockera\Editor\StyleDefinitions\Contracts\Repeater;

class Transform extends BaseStyleDefinition implements Repeater {

    protected function css( array $setting): array {

		$declaration = [];
		$cssProperty = $setting['type'];

		if ( empty( $cssProperty ) || empty( $setting[ $cssProperty ] ) || 'transform' !== $cssProperty ) {

			return $declaration;
		}

		$filteredTransforms = array_values(array_filter(blockera_get_sorted_repeater($setting[ $cssProperty ]), [ $this, 'isValidSetting' ]));

		if (! empty($filteredTransforms)) {

			$this->setTransform($filteredTransforms[0]);
		}

		if ( 'self-perspective' === $cssProperty && ! empty( $this->declarations['transform'] ) && ! empty( $settings[ $cssProperty ] )) {

			$perspective = blockera_get_value_addon_real_value( $setting[ $cssProperty ] );

			if ( ! empty( $perspective ) ) {
				$this->setDeclaration(
					'transform',
					sprintf(
						'perspective(%s) %s',
						$perspective,
						$this->declarations['transform']
					)
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

		if ( empty( $setting['type'] ) ) {

			return false;
		}

		$repeaterItemType = [ 'move', 'scale', 'rotate', 'skew' ];

		if ( ! in_array( $setting['type'], $repeaterItemType, true ) ) {

			return false;
		}
		
		return ! empty( $setting['isVisible'] );
	}

	/**
	 * Setup transform style properties into stack properties.
	 *
	 * @param array $setting the transform setting.
	 *
	 * @return void
	 */
	protected function setTransform( array $setting ): void {

		$transform = '';

		switch ( $setting['type'] ) {
			case 'move':
				$transform = sprintf(
					'translate3d(%s, %s, %s)',
					blockera_get_value_addon_real_value( $setting['move-x'] ),
					blockera_get_value_addon_real_value( $setting['move-y'] ),
					blockera_get_value_addon_real_value( $setting['move-z'] ),
				);
				break;

			case 'scale':
				$scale = blockera_get_value_addon_real_value( $setting['scale'] );

				$transform = sprintf(
					'scale3d(%s, %s, 50%%)',
					$scale,
					$scale,
				);
				break;

			case 'rotate':
				$transform = sprintf(
					'rotateX(%s) rotateY(%s) rotateZ(%s)',
					blockera_get_value_addon_real_value( $setting['rotate-x'] ),
					blockera_get_value_addon_real_value( $setting['rotate-y'] ),
					blockera_get_value_addon_real_value( $setting['rotate-z'] ),
				);
				break;

			case 'skew':
				$transform = sprintf(
					'skew(%s, %s)',
					blockera_get_value_addon_real_value( $setting['skew-x'] ),
					blockera_get_value_addon_real_value( $setting['skew-y'] ),
				);
				break;
		}

		if ( $transform ) {
			if ( ! empty( $this->declarations['transform'] ) ) {
				$this->setDeclaration(
					'transform',
					sprintf(
						'%s %s',
						$this->declarations['transform'],
						$transform
					)
				);
			} else {
				$this->setDeclaration( 'transform', $transform );
			}
		}
	}
}
