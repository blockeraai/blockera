<?php

namespace Publisher\Framework\Illuminate\StyleEngine\StyleDefinitions;

use Publisher\Framework\Exceptions\BaseException;

class Background extends BaseStyleDefinition {

	/**
	 * hold default props for background stack properties
	 *
	 * @var array|string[]
	 */
	protected array $defaultProps = [
		// Background Size
		'size'     => 'auto',
		// Background Position
		'position' => '0 0',
		// Background Repeat
		'repeat'   => 'repeat',
	];

	/**
	 * Retrieve css properties.
	 *
	 * @return array the css properties.
	 */
	public function getProperties(): array {

		array_map( [ $this, 'collectProps' ], $this->settings );

		return $this->properties;
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
	 * @return void
	 */
	protected function collectProps( array $setting ): void {

		if ( ! $this->isValidSetting( $setting ) ) {

			return;
		}

		// Image Background
		switch ( $setting['type'] ) {
			case 'clip':

				if ( 'text' === $setting[ $setting['type'] ] ) {
					$this->setProperties( [
						'-webkit-text-fill-color' => 'transparent',
					] );
				}

				$this->setProperties( array_merge(
					$this->properties,
					[
						$setting['type']          => $setting[ $setting['type'] ],
						'-webkit-background-clip' => $setting[ $setting['type'] ],
					]
				) );
				break;

			case 'color':

				$this->setProperties( [
					$setting['type'] => $setting[ $setting['type'] ] . $this->getImportant(),
				] );
				break;

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

	protected function getCacheKey( string $suffix = '' ): string {

		return getClassname( __NAMESPACE__, __CLASS__ ) . parent::getCacheKey( $suffix );
	}

	/**
	 * Setup background image style properties into stack properties.
	 *
	 * @param array $setting the background image setting
	 *
	 * @return void
	 */
	protected function setBackground( array $setting ): void {

		$props = [
			//Background Image
			'image'      => "url('{$setting['image']}'){$this->getImportant()}",
			// Background Size
			'size'       => ( $setting['image-size'] === 'custom' ? "{$setting['image-size-width']} {$setting['image-size-height']}" : $setting['image-size'] ) . $this->getImportant(),
			// Background Position
			'position'   => ( ( $setting['image-position']['left'] ?? '' ) . ' ' . ( $setting['image-position']['top'] ?? '' ) ) . $this->getImportant(),
			// Background Repeat
			'repeat'     => ( $setting['image-repeat'] ?? '' ) . $this->getImportant(),
			// Background Attachment
			'attachment' => ( $setting['image-attachment'] ?? '' ) . $this->getImportant(),
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

		$gradient = $setting['linear-gradient'];

		if ( $setting['linear-gradient-repeat'] === 'repeat' ) {
			$gradient = str_replace(
				'linear-gradient(',
				'repeating-linear-gradient(',
				$gradient
			);
		}

		$props = array_merge(
			$this->defaultProps,
			[
				//Background Image
				'image'      => ( preg_replace(
						'/(\d.*)deg,/im',
						$setting['linear-gradient-angel'] . 'deg,',
						$gradient
					) ) . $this->getImportant(),
				// Background Attachment
				'attachment' => ( $setting['linear-gradient-attachment'] ?? 'scroll' ) . $this->getImportant(),
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

		$radialGradient = $setting['radial-gradient'];

		if ( $setting['radial-gradient-repeat'] === 'repeat' ) {
			$radialGradient = str_replace(
				'radial-gradient(',
				'repeating-radial-gradient(',
				$radialGradient
			);
		}

		// Gradient Position
		if (
			$setting['radial-gradient-position']['left'] &&
			$setting['radial-gradient-position']['top']
		) {
			$radialGradient = str_replace(
				'gradient(',
				"gradient( circle at {$setting['radial-gradient-position']['left']} {$setting['radial-gradient-position']['top']},",
				$radialGradient
			);
		}

		// Gradient Size
		if ( $setting['radial-gradient-size'] ) {
			$radialGradient = str_replace(
				'circle at ',
				"circle {$setting['radial-gradient-size']} at ",
				$radialGradient
			);
		}

		$props = array_merge(
			$this->defaultProps,
			[
				//Background Image
				'image'      => $radialGradient . $this->getImportant(),
				//Background Repeat
				'repeat'     => ( $setting['radial-gradient-repeat'] ?? $this->defaultProps['repeat'] ) . $this->getImportant(),
				// Background Attachment
				'attachment' => ( $setting['radial-gradient-attachment'] ?? 'scroll' ) . $this->getImportant(),
			]
		);

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

		foreach ( $setting['mesh-gradient-colors'] as $index => $color ) {

			if ( ! isset( $setting['mesh-gradient-colors'][ $index ]['color'] ) ) {
				continue;
			}

			$gradient = str_replace(
				"var(--c{$index})",
				$setting['mesh-gradient-colors'][ $index ]['color'],
				$gradient
			);
		}

		$props = array_merge(
			$this->defaultProps,
			[
				// override bg color
				'color'      => ( $setting['mesh-gradient-colors'][0]['color'] ?? '' ) . $this->getImportant(),
				// Image
				'image'      => $gradient . $this->getImportant(),
				// Background Attachment
				'attachment' => $setting['mesh-gradient-attachment'] . $this->getImportant(),
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
