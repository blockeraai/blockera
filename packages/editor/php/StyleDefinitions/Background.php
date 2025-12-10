<?php

namespace Blockera\Editor\StyleDefinitions;

use Blockera\Editor\StyleDefinitions\Contracts\Repeater;

/**
 * Class Background definition to generate css rules.
 *
 * @package Background
 */
class Background extends BaseStyleDefinition implements Repeater {

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
	 * Valid repeater item types as hash for O(1) lookup.
	 * 
	 * @var array<string, true>
	 */
	private const REPEATER_ITEM_TYPES = [
		'image'           => true,
		'linear-gradient' => true,
		'radial-gradient' => true,
		'mesh-gradient'   => true,
	];

	/**
	 * Check is valid setting for style?
	 *
	 * @param array $setting array of style setting.
	 *
	 * @return bool true on success, false on otherwise.
	 */
	public function isValidSetting( array $setting ): bool {

		// Direct isset check avoids empty() function call overhead.
		if ( ! isset( $setting['type'] ) || '' === $setting['type'] ) {
			return false;
		}

		$type = $setting['type'];

		if ( ! isset( self::REPEATER_ITEM_TYPES[ $type ] ) ) {
			return false;
		}

		// Direct truthy checks avoid empty() overhead and double array access.
		return ( isset( $setting['isVisible'] ) && $setting['isVisible'] ) 
			|| ( isset( $setting[ $type ] ) && $setting[ $type ] );
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

		// Direct isset check avoids empty() overhead.
		if ( ! isset( $setting['type'] ) || '' === $setting['type'] ) {
			return $declaration;
		}

		$cssProperty = $setting['type'];

		// Early return if property not set - avoids function call.
		if ( ! isset( $setting[ $cssProperty ] ) ) {
			return $declaration;
		}

		$sortedRepeater = blockera_get_sorted_repeater( $setting[ $cssProperty ] );

		// Inline filtering avoids callback overhead and array_values reindexing.
		// Direct foreach is faster than array_filter + array_map callbacks.
		$filteredSettings = [];
		foreach ( $sortedRepeater as $item ) {
			if ( $this->isValidSetting( $item ) ) {
				$filteredSettings[] = $item;
			}
		}

		if ( empty( $filteredSettings ) ) {
			return $declaration;
		}

		// Direct foreach avoids array_map callback overhead.
		foreach ( $filteredSettings as $filteredSetting ) {
			$this->setActiveBackgroundType( $filteredSetting );
		}

		$this->setCss( $this->declarations );

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

		// Direct comparison avoids function call overhead.
		if ( isset( $setting['image-size'] ) && 'custom' === $setting['image-size'] ) {
			// Inline string concatenation avoids sprintf overhead.
			$width  = ( isset( $setting['image-size-width'] ) && '' !== $setting['image-size-width'] ) 
				? blockera_get_value_addon_real_value( $setting['image-size-width'] ) 
				: '';
			$height = ( isset( $setting['image-size-height'] ) && '' !== $setting['image-size-height'] ) 
				? blockera_get_value_addon_real_value( $setting['image-size-height'] ) 
				: '';
			$size   = $width . ' ' . $height;
		} else {
			$size = $setting['image-size'] ?? '';
		}

		// Direct isset checks avoid empty() overhead and nested array access.
		$left = ( isset( $setting['image-position']['left'] ) && '' !== $setting['image-position']['left'] ) 
			? blockera_get_value_addon_real_value( $setting['image-position']['left'] ) 
			: '';
		$top  = ( isset( $setting['image-position']['top'] ) && '' !== $setting['image-position']['top'] ) 
			? blockera_get_value_addon_real_value( $setting['image-position']['top'] ) 
			: '';

		// Direct string concatenation avoids sprintf overhead.
		$position = $left . ' ' . $top;

		$props = [
			// Background Image.
			'background-image'      => "url('{$setting['image']}')",
			// Background Size.
			'background-size'       => $size,
			// Background Position.
			'background-position'   => $position,
			// Background Repeat.
			'background-repeat'     => $setting['image-repeat'] ?? '',
			// Background Attachment.
			'background-attachment' => $setting['image-attachment'] ?? '',
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

		$gradient = $setting['linear-gradient'];

		// Optimized check: combine is_array and isset into single condition.
		// Avoids multiple function calls and array access.
		if ( is_array( $gradient ) && isset( $gradient['isValueAddon'] ) && $gradient['isValueAddon'] ) {
			$gradient = blockera_get_value_addon_real_value( $gradient );
		} else {
			// preg_replace is necessary here for pattern matching, but we can optimize the replacement string.
			$angle    = $setting['linear-gradient-angel'] ?? '';
			$gradient = preg_replace(
				'/linear-gradient\(\s*(.*?),/im',
				'linear-gradient(' . $angle . 'deg,',
				$gradient
			);

			// Direct comparison avoids function call.
			if ( isset( $setting['linear-gradient-repeat'] ) && 'repeat' === $setting['linear-gradient-repeat'] ) {
				$gradient = str_replace(
					'linear-gradient(',
					'repeating-linear-gradient(',
					$gradient
				);
			}
		}

		// Direct array assignment avoids array_merge overhead (creates new array).
		// Since we know default_props structure, we can assign directly.
		$props                          = $this->default_props;
		$props['background-image']      = $gradient;
		$props['background-attachment'] = $setting['linear-gradient-attachment'] ?? 'scroll';

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

		$gradient = $setting['radial-gradient'];

		// Optimized check: combine is_array and isset into single condition.
		if ( is_array( $gradient ) && isset( $gradient['isValueAddon'] ) && $gradient['isValueAddon'] ) {
			$gradient = blockera_get_value_addon_real_value( $gradient );

			// Direct array assignment avoids array_merge overhead.
			$props                          = $this->default_props;
			$props['background-image']      = $gradient;
			$props['background-attachment'] = $setting['radial-gradient-attachment'] ?? 'scroll';
		} else {
			// Direct comparison avoids function call.
			if ( isset( $setting['radial-gradient-repeat'] ) && 'repeat' === $setting['radial-gradient-repeat'] ) {
				$gradient = str_replace(
					'radial-gradient(',
					'repeating-radial-gradient(',
					$gradient
				);
			}

			// Direct isset checks avoid empty() overhead.
			$left = ( isset( $setting['radial-gradient-position']['left'] ) && '' !== $setting['radial-gradient-position']['left'] ) 
				? blockera_get_value_addon_real_value( $setting['radial-gradient-position']['left'] ) 
				: '';
			$top  = ( isset( $setting['radial-gradient-position']['top'] ) && '' !== $setting['radial-gradient-position']['top'] ) 
				? blockera_get_value_addon_real_value( $setting['radial-gradient-position']['top'] ) 
				: '';

			// Gradient Position - truthy check is faster than && for strings.
			if ( '' !== $left && '' !== $top ) {
				$gradient = str_replace(
					'gradient(',
					"gradient( circle at {$left} {$top},",
					$gradient
				);
			}

			// Gradient Size - direct isset check.
			if ( isset( $setting['radial-gradient-size'] ) && '' !== $setting['radial-gradient-size'] ) {
				$gradient = str_replace(
					'circle at ',
					"circle {$setting['radial-gradient-size']} at ",
					$gradient
				);
			}

			// Direct array assignment avoids array_merge overhead.
			$props                          = $this->default_props;
			$props['background-image']      = $gradient;
			$props['background-repeat']     = $setting['radial-gradient-repeat'] ?? $this->default_props['background-repeat'];
			$props['background-attachment'] = $setting['radial-gradient-attachment'] ?? 'scroll';
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

		// Inline sort comparison avoids closure overhead.
		// Direct comparison function is faster than closure.
		usort(
            $colors,
            static function ( $a, $b ) {
				return ( $a['order'] ?? 0 ) - ( $b['order'] ?? 0 );
			} 
        );

		// Build replacement map once to avoid repeated str_replace calls.
		// Multiple str_replace in loop creates new strings each iteration.
		$replacements = [];
		$firstColor   = null;
		foreach ( $colors as $index => $color ) {
			if ( ! isset( $color['color'] ) ) {
				continue;
			}

			// Store first color for background-color property.
			if ( null === $firstColor ) {
				$firstColor = $color['color'];
			}

			$replacements[ "var(--c{$index})" ] = blockera_get_value_addon_real_value( $color['color'] );
		}

		// Single strtr call is faster than multiple str_replace in loop.
		// strtr uses hash table lookup, more efficient for multiple replacements.
		if ( ! empty( $replacements ) ) {
			$gradient = strtr( $gradient, $replacements );
		}

		// Direct array assignment avoids array_merge overhead.
		$props = $this->default_props;
		// Direct array access avoids array_values() overhead (creates new array).
		$props['background-color']      = ( null !== $firstColor ) ? blockera_get_value_addon_real_value( $firstColor ) : '';
		$props['background-image']      = $gradient;
		$props['background-attachment'] = $setting['mesh-gradient-attachment'] ?? '';

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

		// isset is faster than empty() for array key checks.
		// Direct string concatenation avoids sprintf overhead.
		foreach ( $props as $prop => $propValue ) {
			if ( ! isset( $this->declarations[ $prop ] ) || '' === $this->declarations[ $prop ] ) {
				continue;
			}

			// Inline str_replace and concatenation avoids sprintf function call overhead.
			$existing       = str_replace( '!important', '', $this->declarations[ $prop ] );
			$props[ $prop ] = $existing . ', ' . $propValue;
		}

		return $props;
	}
}
