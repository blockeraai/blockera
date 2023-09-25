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
	 * @throws BaseException
	 * @return array
	 */
	public function getProperties(): array {

		foreach ( $this->settings as $setting ) {

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
	 * @return void
	 */
	protected function collectProps( array $setting ): void {

		// Image Background
		switch ( $setting['type'] ) {
			case 'clip':
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
	 * @return array retrieve background image style props as array
	 */
	protected function setBackground( array $setting ): array {

		if ( ! $this->isValidSetting( $setting ) ) {

			return [];
		}

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

		$this->setProperties( $props );

		return $props;
	}

	/**
	 * Setup radial gradient style properties into stack properties.
	 *
	 * @param array $setting the radial gradient setting
	 *
	 * @return array retrieve radial gradient style props as array
	 */
	protected function setLinearGradient( array $setting ): array {

		if ( ! $this->isValidSetting( $setting ) ) {

			return [];
		}

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

		$this->setProperties( $props );

		return $props;
	}

	/**
	 * Setup radial gradient style properties into stack properties.
	 *
	 * @param array $setting the radial gradient setting
	 *
	 * @return array retrieve radial gradient style props as array
	 */
	protected function setRadialGradient( array $setting ): array {

		if ( ! $this->isValidSetting( $setting ) ) {

			return [];
		}

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

		$this->setProperties( $props );

		return $props;
	}

	/**
	 * Setup mesh gradient style properties into stack properties.
	 *
	 * @param array $setting the mesh gradient setting
	 *
	 * @return array retrieve mesh gradient style props as array
	 */
	protected function setMeshGradient( array $setting ): array {

		if ( ! $this->isValidSetting( $setting ) ) {

			return [];
		}

		$gradient = $setting['mesh-gradient'];

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

		$this->setProperties( $props );

		return $props;
	}

}
