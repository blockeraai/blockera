<?php

namespace Publisher\Framework\Illuminate\StyleEngine\StyleDefinitions;

class Background extends BaseStyleDefinition {

	protected array $options = [
		'is-important' => true,
	];

	/**
	 * hold default props for background stack properties
	 *
	 * @var array|string[]
	 */
	protected array $defaultProps = [
		// Background Size
		'background-size'     => 'auto',
		// Background Position
		'background-position' => '0 0',
		// Background Repeat
		'background-repeat'   => 'repeat',
	];

	/**
	 * Get the allowed available properties.
	 *
	 * @return string[]
	 */
	public function getAllowedProperties(): array {

		return [
			'publisherBackgroundClip'  => 'background-clip',
			'publisherBackgroundColor' => 'background-color',
			'publisherBackground'      => 'background-image',
		];
	}

	/**
	 * Check is valid setting for style?
	 *
	 * @param array $setting array of style setting.
	 *
	 * @return bool true on success, false on otherwise.
	 */
	protected function isValidSetting( array $setting ): bool {

		$repeaterItemType = [ 'image', 'linear-gradient', 'radial-gradient', 'mesh-gradient' ];

		if ( in_array( $setting['type'], $repeaterItemType, true ) ) {

			return ! empty( $setting[ $setting['type'] ] ) && ! empty( $setting['isVisible'] );
		}

		return ! empty( $setting[ $setting['type'] ] );
	}

	/**
	 * collect all css props
	 *
	 * @param array $setting the background settings
	 *
	 * @return array
	 */
	protected function collectProps( array $setting ): array {

		if ( empty( $setting['type'] ) ) {

			return $this->properties;
		}

		$type = $setting['type'];

		if ( ! $this->isValidSetting( $setting ) ) {

			return $this->properties;
		}

		$properties = [];

		switch ( $type ) {

			case 'background-clip':
				$properties = array_merge(
					[
						$type                     => $setting[ $type ],
						'-webkit-background-clip' => $setting[ $type ],
					],
					'text' === $setting[ $type ] ? [ '-webkit-text-fill-color' => 'transparent' ] : []
				);
				break;

			case 'background-color':
				$properties = [
					$type => pb_get_value_addon_real_value($setting[ $type ]) . $this->getImportant(),
				];
				break;

			case 'background-image':
			case 'linear-gradient':
			case 'radial-gradient':
			case 'mesh-gradient':
				array_map( [ $this, 'setActiveBackgroundType' ], array_filter( $setting[ $type ], [ $this, 'isValidSetting' ] ) );
				break;
		}

		$this->setProperties( array_merge( $this->properties, $properties ) );

		return $this->properties;
	}

	/**
	 * Set css properties of active background type.
	 *
	 * @param array $setting
	 *
	 * @return void
	 */
	protected function setActiveBackgroundType( array $setting ): void {

		switch ( $setting['type'] ) {

			case 'image':
				$this->setBackground( $setting );
				break;

			case 'linear-gradient':
				$this->setLinearGradient( $setting );
				break;

			case 'radial-gradient':
				$this->setRadialGradient( $setting );
				break;

			case 'mesh-gradient':
				$this->setMeshGradient( $setting );
				break;
		}
	}

	/**
	 * Setup background image style properties into stack properties.
	 *
	 * @param array $setting the background image setting
	 *
	 * @return void
	 */
	protected function setBackground( array $setting ): void {

		if ( $setting['image-size'] === 'custom' ) {
			$size = sprintf(
				'%s %s',
				! empty( $setting['image-size-width'] ) ? pb_get_value_addon_real_value( $setting['image-size-width'] ) : '',
				! empty( $setting['image-size-height'] ) ? pb_get_value_addon_real_value( $setting['image-size-height'] ) : ''
			);
		} else {
			$size = $setting['image-size'];
		}

		$left = ! empty( $setting['image-position']['left'] ) ? pb_get_value_addon_real_value( $setting['image-position']['left'] ) : '';
		$top  = ! empty( $setting['image-position']['top'] ) ? pb_get_value_addon_real_value( $setting['image-position']['top'] ) : '';

		$props = [
			//Background Image
			'background-image'      => "url('{$setting['image']}'){$this->getImportant()}",
			// Background Size
			'background-size'       => $size . $this->getImportant(),
			// Background Position
			'background-position'   => ( $left . ' ' . $top ) . $this->getImportant(),
			// Background Repeat
			'background-repeat'     => ( $setting['image-repeat'] ?? '' ) . $this->getImportant(),
			// Background Attachment
			'background-attachment' => ( $setting['image-attachment'] ?? '' ) . $this->getImportant(),
		];

		$this->setProperties( $this->modifyProperties( $props ) );
	}

	/**
	 * Setup radial gradient style properties into stack properties.
	 *
	 * @param array $setting the radial gradient setting
	 *
	 * @return void
	 */
	protected function setLinearGradient( array $setting ): void {

		$gradient     = $setting['linear-gradient'];
		$isValueAddon = is_array( $gradient ) && isset( $gradient['isValueAddon'] ) && $gradient['isValueAddon'];

		if ( $isValueAddon ) {
			$gradient = pb_get_value_addon_real_value( $gradient );
		} else {

			$gradient = preg_replace(
				'/linear-gradient\(\s*(.*?),/im',
				'linear-gradient(' . $setting['linear-gradient-angel'] . 'deg,',
				$gradient
			);

			if ( $setting['linear-gradient-repeat'] === 'repeat' ) {
				$gradient = str_replace(
					'linear-gradient(',
					'repeating-linear-gradient(',
					$gradient
				);
			}
		}

		$props = array_merge(
			$this->defaultProps,
			[
				//Background Image
				'background-image'      => $gradient . $this->getImportant(),
				// Background Attachment
				'background-attachment' => ( $setting['linear-gradient-attachment'] ?? 'scroll' ) . $this->getImportant(),
			]
		);

		$this->setProperties( $this->modifyProperties( $props ) );
	}

	/**
	 * Setup radial gradient style properties into stack properties.
	 *
	 * @param array $setting the radial gradient setting
	 *
	 * @return void
	 */
	protected function setRadialGradient( array $setting ): void {

		$gradient     = $setting['radial-gradient'];
		$isValueAddon = is_array( $gradient ) && isset( $gradient['isValueAddon'] ) && $gradient['isValueAddon'];


		if ( $isValueAddon ) {
			$gradient = pb_get_value_addon_real_value( $gradient );

			$props = array_merge(
				$this->defaultProps,
				[
					//Background Image
					'background-image'      => $gradient . $this->getImportant(),
					// Background Attachment
					'background-attachment' => ( $setting['radial-gradient-attachment'] ?? 'scroll' ) . $this->getImportant(),
				]
			);
		} else {

			if ( $setting['radial-gradient-repeat'] === 'repeat' ) {
				$gradient = str_replace(
					'radial-gradient(',
					'repeating-radial-gradient(',
					$gradient
				);
			}

			$left = ! empty( $setting['radial-gradient-position']['left'] ) ? pb_get_value_addon_real_value( $setting['radial-gradient-position']['left'] ) : '';
			$top  = ! empty( $setting['radial-gradient-position']['top'] ) ? pb_get_value_addon_real_value( $setting['radial-gradient-position']['top'] ) : '';

			// Gradient Position
			if (
				$left &&
				$top
			) {
				$gradient = str_replace(
					'gradient(',
					"gradient( circle at {$left} {$top},",
					$gradient
				);
			}

			// Gradient Size
			if ( $setting['radial-gradient-size'] ) {
				$gradient = str_replace(
					'circle at ',
					"circle {$setting['radial-gradient-size']} at ",
					$gradient
				);
			}

			$props = array_merge(
				$this->defaultProps,
				[
					//Background Image
					'background-image'      => $gradient . $this->getImportant(),
					//Background Repeat
					'background-repeat'     => ( $setting['radial-gradient-repeat'] ?? $this->defaultProps['repeat'] ) . $this->getImportant(),
					// Background Attachment
					'background-attachment' => ( $setting['radial-gradient-attachment'] ?? 'scroll' ) . $this->getImportant(),
				]
			);
		}

		$this->setProperties( $this->modifyProperties( $props ) );
	}

	/**
	 * Setup mesh gradient style properties into stack properties.
	 *
	 * @param array $setting the mesh gradient setting
	 *
	 * @return void
	 */
	protected function setMeshGradient( array $setting ): void {

		$gradient = $setting['mesh-gradient'];

		if ( is_array( $gradient ) ) {

			$gradient = implode( ', ', $gradient );
		}

		$colors = $setting['mesh-gradient-colors'];

		usort($colors, function ($a, $b) {
			return $a['order'] - $b['order'];
		});

		foreach ( $colors as $index => $color ) {

			if ( ! isset( $color['color'] ) ) {
				continue;
			}

			$gradient = str_replace(
				"var(--c{$index})",
				pb_get_value_addon_real_value( $color['color'] ),
				$gradient
			);
		}

		$props = array_merge(
			$this->defaultProps,
			[
				// override bg color
				'background-color'      => ( array_values( $colors )[0]['color'] ? pb_get_value_addon_real_value( array_values( $colors )[0]['color'] ) : '' ) . $this->getImportant(),
				// Image
				'background-image'      => $gradient . $this->getImportant(),
				// Background Attachment
				'background-attachment' => $setting['mesh-gradient-attachment'] . $this->getImportant(),
			]
		);

		$this->setProperties( $this->modifyProperties( $props ) );
	}

	/**
	 * Modify css properties.
	 *
	 * @param array $props the css properties.
	 *
	 * @return array the modified props by merge with perv values.
	 */
	protected function modifyProperties( array $props ): array {

		if ( empty( $this->properties['image'] ) ) {

			return $props;
		}

		foreach ( $props as $prop => $propValue ) {

			if ( empty( $this->properties[ $prop ] ) ) {

				continue;
			}

			$props[ $prop ] = sprintf(
				'%s, %s',
				str_replace( '!important', '', $this->properties[ $prop ] ),
				$propValue
			);
		}

		return $props;
	}

}
