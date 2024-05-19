<?php

namespace Blockera\Editor\StyleDefinitions;

/**
 * Class Effects definition to generate css rules.
 *
 * @package Effects
 */
class Effects extends BaseStyleDefinition {

	/**
	 * @inheritDoc
	 *
	 * @param array $setting
	 *
	 * @return array
	 */
	protected function css( array $setting ): array {

		$cssProperty = $setting['type'];

		if ( empty( $cssProperty ) ) {

			return [];
		}

		$this->setSelector( $cssProperty );

		switch ( $cssProperty ) {

			case 'transform':
			case 'self-origin':
			case 'child-origin':
			case 'self-perspective':
			case 'child-perspective':
				$this->setTransforms( $setting, $cssProperty );
				break;

			case 'transition':
				array_map( [ $this, 'setTransition' ], array_filter( $setting['transition'], [ $this, 'isVisibleSetting' ] ) );
				break;

			case 'filter':
				array_map( [ $this, 'setFilter' ], array_filter( $setting['filter'], [ $this, 'isVisibleSetting' ] ) );
				break;

			case 'backdrop-filter':
				array_map( [ $this, 'setBackdropFilter' ], array_filter( $setting[ $cssProperty ], [ $this, 'isVisibleSetting' ] ) );
				break;

			case 'opacity':
				$this->setDeclaration( 'opacity', blockera_get_value_addon_real_value( $setting[ $cssProperty ] ) );
				break;

			case 'mix-blend-mode':
			default:
				$this->setDeclaration( $cssProperty, $setting[ $cssProperty ] );
				break;
		}

		$this->setCss( $this->declarations );

		return $this->css;
	}

	/**
	 * Check is visible setting?
	 *
	 * @param array $setting The setting array to check is visible.
	 *
	 * @return bool true on success, false when otherwise.
	 */
	protected function isVisibleSetting( array $setting ): bool {

		return ! empty( $setting['isVisible'] );
	}

	/**
	 * Check is valid setting for style?
	 *
	 * @param array $setting array of style setting.
	 *
	 * @return bool true on success, false on otherwise.
	 */
	protected function isValidSetting( array $setting ): bool {

		return ! empty( $setting[ $setting['type'] ] );
	}

	/**
	 * Setup transform style properties into stack properties.
	 *
	 * @param array  $settings    The settings for css property.
	 * @param string $cssProperty The valid css property.
	 *
	 * @return void
	 */
	protected function setTransforms( array $settings, string $cssProperty ): void {

		// add all transform items
		if ( 'transform' === $cssProperty && ! empty( $settings[ $cssProperty ] ) ) {

			array_map( [ $this, 'setTransformItem' ], array_filter( blockera_get_sorted_repeater( $settings[ $cssProperty ] ), [ $this, 'isVisibleSetting' ] ) );
		}

		if ( 'self-perspective' === $cssProperty && ! empty( $this->declarations['transform'] ) && ! empty( $settings[ $cssProperty ] ) ) {

			$perspective = blockera_get_value_addon_real_value( $settings[ $cssProperty ] );

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

		if ( 'self-origin' === $cssProperty && ! empty( $settings[ $cssProperty ] ) ) {

			$top  = isset( $settings[ $cssProperty ]['top'] ) ? blockera_get_value_addon_real_value( $settings[ $cssProperty ]['top'] ) : '';
			$left = isset( $settings[ $cssProperty ]['left'] ) ? blockera_get_value_addon_real_value( $settings[ $cssProperty ]['left'] ) : '';

			if ( ! empty( $top ) && ! empty( $left ) ) {

				$this->setDeclaration( 'transform-origin', "{$top} {$left}" );
			}
		}

		if ( 'backface-visibility' === $cssProperty && ! empty( $settings[ $cssProperty ] ) ) {

			$this->setDeclaration( 'backface-visibility', $settings[ $cssProperty ] );
		}

		if ( 'child-perspective' === $cssProperty && ! empty( $settings[ $cssProperty ] ) ) {

			$childPerspective = blockera_get_value_addon_real_value( $settings[ $cssProperty ] );

			if ( ! empty( $childPerspective ) ) {
				$this->setDeclaration(
					'perspective',
					'0px' !== $childPerspective ? $childPerspective : 'none'
				);
			}
		}

		if ( 'child-origin' === $cssProperty && ! empty( $settings[ $cssProperty ] ) ) {

			$top  = $settings[ $cssProperty ]['top'] ?? '';
			$left = $settings[ $cssProperty ]['left'] ?? '';

			if ( ! empty( $top ) && ! empty( $left ) ) {
				$this->setDeclaration( 'perspective-origin', "{$top} {$left}" );
			}
		}
	}


	/**
	 * Setup transform style properties into stack properties.
	 *
	 * @param array $setting the transform setting.
	 *
	 * @return void
	 */
	protected function setTransformItem( array $setting ): void {

		if ( empty( $setting ) ) {

			return;
		}

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


	/**
	 * Setup transition style properties into stack properties.
	 *
	 * @param array $setting the transition setting.
	 *
	 * @return void
	 */
	protected function setTransition( array $setting ): void {

		if ( empty( $setting ) ) {

			return;
		}

		$allTimings = [
			'linear'            => 'linear',
			'ease'              => 'ease',
			'ease-in'           => 'ease-in',
			'ease-out'          => 'ease-out',
			'ease-in-out'       => 'ease-in-out',
			'ease-in-quad'      => 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
			'ease-in-cubic'     => 'cubic-bezier(0.550, 0.055, 0.675, 0.190)',
			'ease-in-quart'     => 'cubic-bezier(0.895, 0.030, 0.685, 0.220)',
			'ease-in-quint'     => 'cubic-bezier(0.755, 0.050, 0.855, 0.060)',
			'ease-in-sine'      => 'cubic-bezier(0.470, 0.000, 0.745, 0.715)',
			'ease-in-expo'      => 'cubic-bezier(0.950, 0.050, 0.795, 0.035)',
			'ease-in-circ'      => 'cubic-bezier(0.600, 0.040, 0.980, 0.335)',
			'ease-in-back'      => 'cubic-bezier(0.600, -0.280, 0.735, 0.045)',
			'ease-out-quad'     => 'cubic-bezier(0.250, 0.460, 0.450, 0.940)',
			'ease-out-cubic'    => 'cubic-bezier(0.215, 0.610, 0.355, 1.000)',
			'ease-out-quart'    => 'cubic-bezier(0.230, 1.000, 0.320, 1.000)',
			'ease-out-quint'    => 'cubic-bezier(0.230, 1.000, 0.320, 1.000)',
			'ease-out-sine'     => 'cubic-bezier(0.390, 0.575, 0.565, 1.000)',
			'ease-out-expo'     => 'cubic-bezier(0.190, 1.000, 0.220, 1.000)',
			'ease-out-circ'     => 'cubic-bezier(0.075, 0.820, 0.165, 1.000)',
			'ease-out-back'     => 'cubic-bezier(0.175, 0.885, 0.320, 1.275)',
			'ease-in-out-quad'  => 'cubic-bezier(0.455, 0.030, 0.515, 0.955)',
			'ease-in-out-cubic' => 'cubic-bezier(0.645, 0.045, 0.355, 1.000)',
			'ease-in-out-quart' => 'cubic-bezier(0.770, 0.000, 0.175, 1.000)',
			'ease-in-out-quint' => 'cubic-bezier(0.860, 0.000, 0.070, 1.000)',
			'ease-in-out-sine'  => 'cubic-bezier(0.445, 0.050, 0.550, 0.950)',
			'ease-in-out-expo'  => 'cubic-bezier(1.000, 0.000, 0.000, 1.000)',
			'ease-in-out-circ'  => 'cubic-bezier(0.785, 0.135, 0.150, 0.860)',
			'ease-in-out-back'  => 'cubic-bezier(0.680, -0.550, 0.265, 1.550)',
		];

		$transition = sprintf(
			'%s %s %s %s',
			$setting['type'],
			blockera_get_value_addon_real_value( $setting['duration'] ),
			$allTimings[ $setting['timing'] ],
			blockera_get_value_addon_real_value( $setting['delay'] )
		);

		if ( $transition ) {
			if ( ! empty( $this->declarations['transition'] ) ) {
				$this->setDeclaration(
					'transition',
					sprintf(
						'%s, %s',
						$this->declarations['transition'],
						$transition
					)
				);
			} else {
				$this->setDeclaration( 'transition', $transition );
			}
		}
	}

	/**
	 * Setup filter style properties into stack properties.
	 *
	 * @param array $setting the filter setting.
	 *
	 * @return void
	 */
	protected function setFilter( array $setting ): void {

		if ( empty( $setting ) ) {

			return;
		}

		if ( 'drop-shadow' === $setting['type'] ) {
			$filter =
				sprintf(
					'drop-shadow(%s %s %s %s)',
					blockera_get_value_addon_real_value( $setting['drop-shadow-x'] ),
					blockera_get_value_addon_real_value( $setting['drop-shadow-y'] ),
					blockera_get_value_addon_real_value( $setting['drop-shadow-blur'] ),
					blockera_get_value_addon_real_value( $setting['drop-shadow-color'] )
				);
		} else {
			$filter =
				sprintf(
					'%s(%s)',
					$setting['type'],
					blockera_get_value_addon_real_value( $setting[ $setting['type'] ] ),
				);
		}

		if ( $filter ) {
			if ( ! empty( $this->declarations['filter'] ) ) {
				$this->setDeclaration(
					'filter',
					sprintf(
						'%s %s',
						$this->declarations['filter'],
						$filter
					)
				);
			} else {
				$this->setDeclaration( 'filter', $filter );
			}
		}
	}

	/**
	 * Setup backdrop-filter style properties into stack properties.
	 *
	 * @param array $setting the backdrop-filter setting.
	 *
	 * @return void
	 */
	protected function setBackdropFilter( array $setting ): void {

		if ( empty( $setting ) ) {

			return;
		}

		if ( 'drop-shadow' === $setting['type'] ) {
			$filter =
				sprintf(
					'drop-shadow(%s %s %s %s)',
					blockera_get_value_addon_real_value( $setting['drop-shadow-x'] ),
					blockera_get_value_addon_real_value( $setting['drop-shadow-y'] ),
					blockera_get_value_addon_real_value( $setting['drop-shadow-blur'] ),
					blockera_get_value_addon_real_value( $setting['drop-shadow-color'] )
				);
		} else {
			$filter =
				sprintf(
					'%s(%s)',
					$setting['type'],
					blockera_get_value_addon_real_value( $setting[ $setting['type'] ] ),
				);
		}

		if ( $filter ) {
			if ( ! empty( $this->declarations['backdrop-filter'] ) ) {
				$this->setDeclaration(
					'backdrop-filter',
					sprintf(
						'%s %s',
						$this->declarations['backdrop-filter'],
						$filter
					)
				);
			} else {
				$this->setDeclaration( 'backdrop-filter', $filter );
			}
		}
	}

	/**
	 * @inheritDoc
	 *
	 * @return string[]
	 */
	public function getAllowedProperties(): array {

		return [
			'blockeraFilter'                    => 'filter',
			'blockeraOpacity'                   => 'opacity',
			'blockeraTransform'                 => 'transform',
			'blockeraTransition'                => 'transition',
			'blockeraBlendMode'                 => 'mix-blend-mode',
			'blockeraBackdropFilter'            => 'backdrop-filter',
			'blockeraTransformSelfOrigin'       => 'self-origin', // transform-origin
			'blockeraTransformChildOrigin'      => 'child-origin', // perspective-origin
			'blockeraBackfaceVisibility'        => 'backface-visibility',
			'blockeraTransformSelfPerspective'  => 'self-perspective', // perspective
			'blockeraTransformChildPerspective' => 'child-perspective', // perspective
		];
	}

}
