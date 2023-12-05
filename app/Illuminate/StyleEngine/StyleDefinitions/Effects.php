<?php

namespace Publisher\Framework\Illuminate\StyleEngine\StyleDefinitions;

use Publisher\Framework\Exceptions\BaseException;

/**
 * The Effect style definition
 *
 * @package Publisher\Framework\Illuminate\StyleEngine\StyleDefinitions\Effects
 */
class Effects extends BaseStyleDefinition {

	/**
	 * Retrieve css properties.
	 *
	 * @return array
	 */
	public function getProperties(): array {

		if ( ! empty( $this->settings['type'] ) ) {

			switch ( $this->settings['type'] ) {
				case 'transform':
					$this->setTransforms();
					break;
				case 'transition':
					array_map( [ $this, 'setTransition' ], array_filter( $this->settings['transition'], [ $this, 'isVisibleSetting' ] ) );
					break;
				case 'filter':
					array_map( [ $this, 'setFilter' ], array_filter( $this->settings['filter'], [ $this, 'isVisibleSetting' ] ) );
					break;
				case 'backdropfilter':
					array_map(
						[ $this, 'setBackdropFilter' ],
						array_filter(
							$this->settings['backdropfilter'],
							[
								$this,
								'isVisibleSetting',
							]
						)
					);
					break;
			}

			return $this->properties;
		}

		array_map( [ $this, 'collectProps' ], $this->settings );

		return $this->properties;
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
	 * Collect all css props.
	 *
	 * @param array $setting the background settings.
	 *
	 * @return void
	 */
	protected function collectProps( array $setting ): void {

		// Image Background.
		switch ( $setting['type'] ) {
			case 'blendmode':
				$this->setProperties(
					[
						'mix-blend-mode' => $setting[ $setting['type'] ],
					]
				);
				break;

			case 'opacity':
				$this->setProperties(
					[
						'opacity' => pb_get_value_addon_real_value( $setting[ $setting['type'] ] ),
					]
				);
				break;

			default:
				$this->setProperties(
					[
						$setting['type'] => $setting[ $setting['type'] ],
					]
				);
				break;
		}
	}

	/**
	 * Retrieve cache key.
	 *
	 * @param string $suffix the cache key suffix.
	 *
	 * @return string
	 */
	protected function getCacheKey( string $suffix = '' ): string {

		return getClassname( __NAMESPACE__, __CLASS__ ) . parent::getCacheKey( $suffix );
	}

	/**
	 * Setup transform style properties into stack properties.
	 *
	 * @param array $setting the transform setting.
	 *
	 * @return void
	 */
	protected function setTransforms(): void {

		// add all transform items
		if ( ! empty( $this->settings['transform'] ) ) {
			array_map( [ $this, 'setTransformItem' ], array_filter( $this->settings['transform'], [ $this, 'isVisibleSetting' ] ) );
		}

		if ( ! empty( $this->properties['transform'] ) && ! empty( $this->settings['attributes']['publisherTransformSelfPerspective'] ) ) {

			$perspective = pb_get_value_addon_real_value( $this->settings['attributes']['publisherTransformSelfPerspective'] );

			if ( ! empty( $perspective ) ) {
				$this->setProperty(
					'transform',
					sprintf(
						'perspective(%s) %s',
						$perspective,
						$this->properties['transform']
					)
				);
			}

		}

		if ( ! empty( $this->settings['attributes']['publisherTransformSelfOrigin'] ) ) {

			$top  = isset( $this->settings['attributes']['publisherTransformSelfOrigin']['top'] ) ? pb_get_value_addon_real_value( $this->settings['attributes']['publisherTransformSelfOrigin']['top'] ) : '';
			$left = isset( $this->settings['attributes']['publisherTransformSelfOrigin']['left'] ) ? pb_get_value_addon_real_value( $this->settings['attributes']['publisherTransformSelfOrigin']['left'] ) : '';

			if ( ! empty( $top ) && ! empty( $left ) ) {
				$this->setProperty( 'transform-origin', "{$top} {$left}" );
			}
		}

		if ( ! empty( $this->settings['attributes']['publisherBackfaceVisibility'] ) ) {

			$this->setProperty( 'backface-visibility', $this->settings['attributes']['publisherBackfaceVisibility'] );
		}

		if ( ! empty( $this->settings['attributes']['publisherTransformChildPerspective'] ) ) {

			$childPerspective = pb_get_value_addon_real_value( $this->settings['attributes']['publisherTransformChildPerspective'] );

			if ( ! empty( $childPerspective ) ) {
				$this->setProperty(
					'perspective',
					'0px' !== $childPerspective ? $childPerspective : 'none'
				);
			}
		}

		if ( ! empty( $this->settings['attributes']['publisherTransformChildOrigin'] ) ) {

			$top  = $this->settings['attributes']['publisherTransformChildOrigin']['top'] ?? '';
			$left = $this->settings['attributes']['publisherTransformChildOrigin']['left'] ?? '';

			if ( ! empty( $top ) && ! empty( $left ) ) {
				$this->setProperty( 'perspective-origin', "{$top} {$left}" );
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
					pb_get_value_addon_real_value( $setting['move-x'] ),
					pb_get_value_addon_real_value( $setting['move-y'] ),
					pb_get_value_addon_real_value( $setting['move-z'] ),
				);
				break;

			case 'scale':
				$scale = pb_get_value_addon_real_value( $setting['scale'] );

				$transform = sprintf(
					'scale3d(%s, %s, 50%%)',
					$scale,
					$scale,
				);
				break;

			case 'rotate':
				$transform = sprintf(
					'rotateX(%s) rotateY(%s) rotateZ(%s)',
					pb_get_value_addon_real_value( $setting['rotate-x'] ),
					pb_get_value_addon_real_value( $setting['rotate-y'] ),
					pb_get_value_addon_real_value( $setting['rotate-z'] ),
				);
				break;

			case 'skew':
				$transform = sprintf(
					'skew(%s, %s)',
					pb_get_value_addon_real_value( $setting['skew-x'] ),
					pb_get_value_addon_real_value( $setting['skew-y'] ),
				);
				break;
		}

		if ( $transform ) {
			if ( ! empty( $this->properties['transform'] ) ) {
				$this->setProperty(
					'transform',
					sprintf(
						'%s %s',
						$this->properties['transform'],
						$transform
					)
				);
			} else {
				$this->setProperty( 'transform', $transform );
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
			"%s %s %s %s",
			$setting['type'],
			pb_get_value_addon_real_value( $setting['duration'] ),
			$allTimings[ $setting['timing'] ],
			pb_get_value_addon_real_value( $setting['delay'] )
		);

		if ( $transition ) {
			if ( ! empty( $this->properties['transition'] ) ) {
				$this->setProperty(
					'transition',
					sprintf(
						'%s, %s',
						$this->properties['transition'],
						$transition
					)
				);
			} else {
				$this->setProperty( 'transition', $transition );
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
					pb_get_value_addon_real_value( $setting['drop-shadow-x'] ),
					pb_get_value_addon_real_value( $setting['drop-shadow-y'] ),
					pb_get_value_addon_real_value( $setting['drop-shadow-blur'] ),
					pb_get_value_addon_real_value( $setting['drop-shadow-color'] )
				);
		} else {
			$filter =
				sprintf(
					'%s(%s)',
					$setting['type'],
					pb_get_value_addon_real_value( $setting[ $setting['type'] ] ),
				);
		}


		if ( $filter ) {
			if ( ! empty( $this->properties['filter'] ) ) {
				$this->setProperty(
					'filter',
					sprintf(
						'%s %s',
						$this->properties['filter'],
						$filter
					)
				);
			} else {
				$this->setProperty( 'filter', $filter );
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
					pb_get_value_addon_real_value( $setting['drop-shadow-x'] ),
					pb_get_value_addon_real_value( $setting['drop-shadow-y'] ),
					pb_get_value_addon_real_value( $setting['drop-shadow-blur'] ),
					pb_get_value_addon_real_value( $setting['drop-shadow-color'] )
				);
		} else {
			$filter =
				sprintf(
					'%s(%s)',
					$setting['type'],
					pb_get_value_addon_real_value( $setting[ $setting['type'] ] ),
				);
		}


		if ( $filter ) {
			if ( ! empty( $this->properties['backdrop-filter'] ) ) {
				$this->setProperty(
					'backdrop-filter',
					sprintf(
						'%s %s',
						$this->properties['backdrop-filter'],
						$filter
					)
				);
			} else {
				$this->setProperty( 'backdrop-filter', $filter );
			}
		}
	}

}
