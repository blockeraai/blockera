<?php

namespace Blockera\Editor\StyleDefinitions;

/**
 * Class Background definition to generate css rules.
 *
 * @package Background
 */
class Background extends BaseStyleDefinition {

	/**
	 * Hold collection of options to generate style
	 *
	 * @var array
	 */
	protected array $options = [
		'is-important' => true,
	];

	/**
	 * Hold default props for background stack properties
	 *
	 * @var array|string[]
	 */
	protected array $default_props = [
		// Background Size.
		'background-size'     => 'auto',
		// Background Position.
		'background-position' => '0 0',
		// Background Repeat.
		'background-repeat'   => 'repeat',
	];

	/**
	 * Get the allowed available properties.
	 *
	 * @return string[]
	 */
	public function getAllowedProperties(): array {

		return [
			'blockeraBackgroundClip'  => 'background-clip',
			'blockeraBackgroundColor' => 'background-color',
			'blockeraBackground'      => 'background-image',
		];
	}

	/**
	 * Compatibility
	 *
	 * @inheritDoc
	 */
	protected function calculateFallbackFeatureId( string $cssProperty ): string {

		$paths = [
			'background-color' => 'color.background',
		];

		return $paths[ $cssProperty ] ?? '';
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
	 * Collect all css props.
	 *
	 * @param array $setting The background settings.
	 *
	 * @return array
	 */
	protected function css( array $setting ): array {

		$declaration = [];
		$cssProperty = $setting['type'];

		if ( empty( $cssProperty ) ) {

			return $declaration;
		}

		if ( ! $this->isValidSetting( $setting ) ) {

			return $this->declarations;
		}

		$this->setSelector( $cssProperty );

		switch ( $cssProperty ) {

			case 'background-clip':
				$declaration = array_merge(
					[
						$cssProperty              => $setting[ $cssProperty ],
						'-webkit-background-clip' => $setting[ $cssProperty ],
					],
					'text' === $setting[ $cssProperty ] ? [ '-webkit-text-fill-color' => 'transparent' ] : []
				);
				break;

			case 'background-color':
				$declaration = [
					$cssProperty => blockera_get_value_addon_real_value( $setting[ $cssProperty ] ) . $this->getImportant(),
				];
				break;

			case 'background-image':
			case 'linear-gradient':
			case 'radial-gradient':
			case 'mesh-gradient':
				array_map(
					[ $this, 'setActiveBackgroundType' ],
					array_filter(
						blockera_get_sorted_repeater( $setting[ $cssProperty ] ),
						[
							$this,
							'isValidSetting',
						]
					)
				);
				break;
		}

		$this->setCss( array_merge( $declaration, $this->declarations ) );

		return $this->css;
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
	 * @param array $setting The background image setting.
	 *
	 * @return void
	 */
	protected function setBackground( array $setting ): void {

		if ( 'custom' === $setting['image-size'] ) {
			$size = sprintf(
				'%s %s',
				! empty( $setting['image-size-width'] ) ? blockera_get_value_addon_real_value( $setting['image-size-width'] ) : '',
				! empty( $setting['image-size-height'] ) ? blockera_get_value_addon_real_value( $setting['image-size-height'] ) : ''
			);
		} else {
			$size = $setting['image-size'];
		}

		$left = ! empty( $setting['image-position']['left'] ) ? blockera_get_value_addon_real_value( $setting['image-position']['left'] ) : '';
		$top  = ! empty( $setting['image-position']['top'] ) ? blockera_get_value_addon_real_value( $setting['image-position']['top'] ) : '';

		$props = [
			// Background Image.
			'background-image'      => "url('{$setting['image']}'){$this->getImportant()}",
			// Background Size.
			'background-size'       => $size . $this->getImportant(),
			// Background Position.
			'background-position'   => ( $left . ' ' . $top ) . $this->getImportant(),
			// Background Repeat.
			'background-repeat'     => ( $setting['image-repeat'] ?? '' ) . $this->getImportant(),
			// Background Attachment.
			'background-attachment' => ( $setting['image-attachment'] ?? '' ) . $this->getImportant(),
		];

		$this->setDeclarations( $this->modifyProperties( $props ) );
	}

	/**
	 * Setup radial gradient style properties into stack properties.
	 *
	 * @param array $setting The radial gradient setting.
	 *
	 * @return void
	 */
	protected function setLinearGradient( array $setting ): void {

		$gradient     = $setting['linear-gradient'];
		$isValueAddon = is_array( $gradient ) && isset( $gradient['isValueAddon'] ) && $gradient['isValueAddon'];

		if ( $isValueAddon ) {
			$gradient = blockera_get_value_addon_real_value( $gradient );
		} else {

			$gradient = preg_replace(
				'/linear-gradient\(\s*(.*?),/im',
				'linear-gradient(' . $setting['linear-gradient-angel'] . 'deg,',
				$gradient
			);

			if ( 'repeat' === $setting['linear-gradient-repeat'] ) {
				$gradient = str_replace(
					'linear-gradient(',
					'repeating-linear-gradient(',
					$gradient
				);
			}
		}

		$props = array_merge(
			$this->default_props,
			[
				// Background Image.
				'background-image'      => $gradient . $this->getImportant(),
				// Background Attachment.
				'background-attachment' => ( $setting['linear-gradient-attachment'] ?? 'scroll' ) . $this->getImportant(),
			]
		);

		$this->setDeclarations( $this->modifyProperties( $props ) );
	}

	/**
	 * Setup radial gradient style properties into stack properties.
	 *
	 * @param array $setting The radial gradient setting.
	 *
	 * @return void
	 */
	protected function setRadialGradient( array $setting ): void {

		$gradient     = $setting['radial-gradient'];
		$isValueAddon = is_array( $gradient ) && isset( $gradient['isValueAddon'] ) && $gradient['isValueAddon'];

		if ( $isValueAddon ) {
			$gradient = blockera_get_value_addon_real_value( $gradient );

			$props = array_merge(
				$this->default_props,
				[
					// Background Image.
					'background-image'      => $gradient . $this->getImportant(),
					// Background Attachment.
					'background-attachment' => ( $setting['radial-gradient-attachment'] ?? 'scroll' ) . $this->getImportant(),
				]
			);
		} else {

			if ( 'repeat' === $setting['radial-gradient-repeat'] ) {
				$gradient = str_replace(
					'radial-gradient(',
					'repeating-radial-gradient(',
					$gradient
				);
			}

			$left = ! empty( $setting['radial-gradient-position']['left'] ) ? blockera_get_value_addon_real_value( $setting['radial-gradient-position']['left'] ) : '';
			$top  = ! empty( $setting['radial-gradient-position']['top'] ) ? blockera_get_value_addon_real_value( $setting['radial-gradient-position']['top'] ) : '';

			// Gradient Position.
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

			// Gradient Size.
			if ( $setting['radial-gradient-size'] ) {
				$gradient = str_replace(
					'circle at ',
					"circle {$setting['radial-gradient-size']} at ",
					$gradient
				);
			}

			$props = array_merge(
				$this->default_props,
				[
					// Background Image.
					'background-image'      => $gradient . $this->getImportant(),
					// Background Repeat.
					'background-repeat'     => ( $setting['radial-gradient-repeat'] ?? $this->default_props['repeat'] ) . $this->getImportant(),
					// Background Attachment.
					'background-attachment' => ( $setting['radial-gradient-attachment'] ?? 'scroll' ) . $this->getImportant(),
				]
			);
		}

		$this->setDeclarations( $this->modifyProperties( $props ) );
	}

	/**
	 * Setup mesh gradient style properties into stack properties.
	 *
	 * @param array $setting The mesh gradient setting.
	 *
	 * @return void
	 */
	protected function setMeshGradient( array $setting ): void {

		$gradient = $setting['mesh-gradient'];

		if ( is_array( $gradient ) ) {

			$gradient = implode( ', ', $gradient );
		}

		$colors = $setting['mesh-gradient-colors'];

		usort(
			$colors,
			function ( $a, $b ) {

				return $a['order'] - $b['order'];
			}
		);

		foreach ( $colors as $index => $color ) {

			if ( ! isset( $color['color'] ) ) {
				continue;
			}

			$gradient = str_replace(
				"var(--c{$index})",
				blockera_get_value_addon_real_value( $color['color'] ),
				$gradient
			);
		}

		$props = array_merge(
			$this->default_props,
			[
				// override bg color.
				'background-color'      => ( array_values( $colors )[0]['color'] ? blockera_get_value_addon_real_value( array_values( $colors )[0]['color'] ) : '' ) . $this->getImportant(),
				// Image.
				'background-image'      => $gradient . $this->getImportant(),
				// Background Attachment.
				'background-attachment' => $setting['mesh-gradient-attachment'] . $this->getImportant(),
			]
		);

		$this->setDeclarations( $this->modifyProperties( $props ) );
	}

	/**
	 * Modify css properties.
	 *
	 * @param array $props the css properties.
	 *
	 * @return array the modified props by merge with perv values.
	 */
	protected function modifyProperties( array $props ): array {

		if ( empty( $this->declarations['image'] ) ) {

			return $props;
		}

		foreach ( $props as $prop => $propValue ) {

			if ( empty( $this->declarations[ $prop ] ) ) {

				continue;
			}

			$props[ $prop ] = sprintf(
				'%s, %s',
				str_replace( '!important', '', $this->declarations[ $prop ] ),
				$propValue
			);
		}

		return $props;
	}

}
