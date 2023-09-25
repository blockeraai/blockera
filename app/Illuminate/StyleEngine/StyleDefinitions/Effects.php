<?php

namespace Publisher\Framework\Illuminate\StyleEngine\StyleDefinitions;

use Publisher\Framework\Exceptions\BaseException;

class Effects extends BaseStyleDefinition {

	/**
	 * @throws BaseException
	 * @return array
	 */
	public function getProperties(): array {

		foreach ( $this->settings as $setting ) {

			if ( ! empty( $this->settings['type'] ) ) {

				switch ( $this->settings['type'] ) {
					case 'transform':
						array_map( [ $this, 'setTransform' ], $this->settings['transform'] );
						break;
					case 'transition':
						array_map( [ $this, 'setTransition' ], $this->settings['transition'] );
						break;
					case 'filter':
						array_map( [ $this, 'setFilter' ], $this->settings['filter'] );
						break;
					case 'backdrop-filter':
						array_map( [ $this, 'setBackdropFilter' ], $this->settings['backdrop-filter'] );
						break;

				}
			}

			if ( ! isset( $setting['isVisible'] ) || ! $setting['isVisible'] ) {

				continue;
			}

			$this->collectProps( $setting );
		}

		return $this->properties;
	}

	/**
	 * Check is valid setting for style?
	 *
	 * @param array $setting array of style setting
	 *
	 * @return bool true on success, false on otherwise.
	 */
	protected function isValidSetting( array $setting ): bool {

		return ! empty( $setting[ $setting['type'] ] );
	}

	/**
	 * collect all css props
	 *
	 * @param array $setting the background settings
	 *
	 * @throws BaseException
	 * @return void
	 */
	protected function collectProps( array $setting ): void {

		// Image Background
		switch ( $setting['type'] ) {
			case'cursor':
			case 'opacity':
			case 'mix-blend-mode':
				$this->setProperties( [
					$setting['type'] => $setting[ $setting['type'] ],
				] );
				break;
		}
	}

	protected function getCacheKey( string $suffix = '' ): string {

		return getClassname( __NAMESPACE__, __CLASS__ ) . parent::getCacheKey( $suffix );
	}

	/**
	 * Setup transform style properties into stack properties.
	 *
	 * @param array $setting the transform setting
	 *
	 * @return array retrieve transform style props as array
	 */
	protected function setTransform( array $setting ): array {

		if ( empty( $setting ) ) {

			return [];
		}

		$props     = [];
		$transform = '';

		switch ( $setting['type'] ) {
			case 'move':
				$transform = "translate3d({$setting['move-x']}, {$setting['move-y']}, {$setting['move-z']})";
				break;

			case 'scale':
				$transform = "scale3d({$setting['scale']}, {$setting['scale']}, 50%)";
				break;

			case 'rotate':
				$transform = "rotateX({$setting['rotate-x']}) rotateY({$setting['rotate-y']}) rotateZ({$setting['rotate-z']})";
				break;

			case 'skew':
				$transform = "skew({$setting['skew-x']}, {$setting['skew-y']})";
				break;
		}

		if ( ! empty( $this->settings['attributes']['publisherTransformSelfPerspective'] ) ) {

			$props['transform'] = sprintf(
				'perspective(%s) %s',
				$this->settings['attributes']['publisherTransformSelfPerspective'],
				$transform
			);
		}

		if ( ! empty( $this->settings['attributes']['publisherTransformSelfOrigin'] ) ) {

			$top  = $this->settings['attributes']['publisherTransformSelfOrigin']['top'] ?? '';
			$left = $this->settings['attributes']['publisherTransformSelfOrigin']['left'] ?? '';

			$props['transform-origin'] = "{$top} {$left}";
		}

		if ( ! empty( $this->settings['attributes']['publisherBackfaceVisibility'] ) ) {

			$props['backface-visibility'] = $this->settings['attributes']['publisherBackfaceVisibility'];
		}

		if ( ! empty( $this->settings['attributes']['publisherTransformChildPerspective'] ) ) {

			$props['perspective'] = $this->settings['attributes']['publisherTransformChildPerspective'] !== '0px' ?
				$this->settings['attributes']['publisherTransformChildPerspective'] :
				'none';
		}

		if ( ! empty( $this->settings['attributes']['publisherTransformChildOrigin'] ) ) {

			$top  = $this->settings['attributes']['publisherTransformChildOrigin']['top'] ?? '';
			$left = $this->settings['attributes']['publisherTransformChildOrigin']['left'] ?? '';

			$props['perspective-origin'] = "{$top} {$left}";
		}

		$this->setProperties( $props );

		return $props ?? [];
	}

	/**
	 * Setup transition style properties into stack properties.
	 *
	 * @param array $setting the transition setting
	 *
	 * @return array retrieve transition style props as array
	 */
	protected function setTransition( array $setting ): array {

		if ( empty( $setting ) ) {

			return [];
		}

		$allTimings = [
			'linear'            => 'linear',
			'ease'              => 'ease',
			'ease-in'           => 'ease-in',
			'ease-out'          => 'ease-out',
			'ease-in-out'       => 'ease-in-out',
			//
			'ease-in-quad'      => 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
			'ease-in-cubic'     => 'cubic-bezier(0.550, 0.055, 0.675, 0.190)',
			'ease-in-quart'     => 'cubic-bezier(0.895, 0.030, 0.685, 0.220)',
			'ease-in-quint'     => 'cubic-bezier(0.755, 0.050, 0.855, 0.060)',
			'ease-in-sine'      => 'cubic-bezier(0.470, 0.000, 0.745, 0.715)',
			'ease-in-expo'      => 'cubic-bezier(0.950, 0.050, 0.795, 0.035)',
			'ease-in-circ'      => 'cubic-bezier(0.600, 0.040, 0.980, 0.335)',
			'ease-in-back'      => 'cubic-bezier(0.600, -0.280, 0.735, 0.045)',
			//
			'ease-out-quad'     => 'cubic-bezier(0.250, 0.460, 0.450, 0.940)',
			'ease-out-cubic'    => 'cubic-bezier(0.215, 0.610, 0.355, 1.000)',
			'ease-out-quart'    => 'cubic-bezier(0.230, 1.000, 0.320, 1.000)',
			'ease-out-quint'    => 'cubic-bezier(0.230, 1.000, 0.320, 1.000)',
			'ease-out-sine'     => 'cubic-bezier(0.390, 0.575, 0.565, 1.000)',
			'ease-out-expo'     => 'cubic-bezier(0.190, 1.000, 0.220, 1.000)',
			'ease-out-circ'     => 'cubic-bezier(0.075, 0.820, 0.165, 1.000)',
			'ease-out-back'     => 'cubic-bezier(0.175, 0.885, 0.320, 1.275)',
			//
			'ease-in-out-quad'  => 'cubic-bezier(0.455, 0.030, 0.515, 0.955)',
			'ease-in-out-cubic' => 'cubic-bezier(0.645, 0.045, 0.355, 1.000)',
			'ease-in-out-quart' => 'cubic-bezier(0.770, 0.000, 0.175, 1.000)',
			'ease-in-out-quint' => 'cubic-bezier(0.860, 0.000, 0.070, 1.000)',
			'ease-in-out-sine'  => 'cubic-bezier(0.445, 0.050, 0.550, 0.950)',
			'ease-in-out-expo'  => 'cubic-bezier(1.000, 0.000, 0.000, 1.000)',
			'ease-in-out-circ'  => 'cubic-bezier(0.785, 0.135, 0.150, 0.860)',
			'ease-in-out-back'  => 'cubic-bezier(0.680, -0.550, 0.265, 1.550)',
		];

		$timing = $allTimings[ $setting['timing'] ];

		$props = [
			//Transition
			'transition' => "{$setting['type']} {$setting['duration']} {$timing} {$setting['delay']}",
		];

		$this->setProperties( $props );

		return $props;
	}

	/**
	 * Setup filter style properties into stack properties.
	 *
	 * @param array $setting the filter setting
	 *
	 * @return array retrieve filter style props as array
	 */
	protected function setFilter( array $setting ): array {

		if ( empty( $setting ) ) {

			return [];
		}

		$props = [
			//Filter
			'filter' => $setting['type'] === 'drop-shadow' ?
				"{$setting['type']}({$setting['drop-shadow-x']} {$setting['drop-shadow-y']} {$setting['drop-shadow-blur']} {$setting['drop-shadow-color']})" :
				"{$setting['type']}({$setting[$setting['type']]})",
		];

		$this->setProperties( $props );

		return $props;
	}

	/**
	 * Setup backdrop-filter style properties into stack properties.
	 *
	 * @param array $setting the backdrop-filter setting
	 *
	 * @return array retrieve backdrop-filter style props as array
	 */
	protected function setBackdropFilter( array $setting ): array {

		if ( empty( $setting ) ) {

			return [];
		}

		$props = [
			//BackdropFilter
			'backdrop-filter' => $setting['type'] === 'drop-shadow' ?
				"{$setting['type']}({$setting['drop-shadow-x']} {$setting['drop-shadow-y']} {$setting['drop-shadow-blur']} {$setting['drop-shadow-color']})" :
				"{$setting['type']}({$setting[$setting['type']]})",
		];

		$this->setProperties( $props );

		return $props;
	}

}
