<?php

namespace Blockera\Setup\Compatibility;

/**
 * Blockera-only theme.json settings paths (not in WordPress core schema).
 *
 * Keep in sync with packages/data/js/blockera-settings-paths.js.
 */
final class BlockeraSettingsPaths {

	public const ROOT = 'blockera';

	public const BORDER               = 'blockeraBorder';
	public const LINE_HEIGHTS         = 'blockeraLineHeights';
	public const DEFAULT_LINE_HEIGHTS = 'blockeraDefaultLineHeights';
	public const WIDTH_SIZES          = 'blockeraWidthSizes';
	public const TRANSITION           = 'blockeraTransition';
	public const TRANSFORM            = 'blockeraTransform';
	public const FILTER               = 'blockeraFilter';
	public const TEXT_SHADOW          = 'blockeraTextShadow';
	public const DIMENSION_SIZES      = 'blockeraDimensionSizes';

	/**
	 * Valid settings schema extension for {@see JSON::get_valid_settings_schema()}.
	 *
	 * @return array<string, mixed>
	 */
	public static function valid_settings_extension(): array {
		return array(
			self::ROOT => array(
				self::BORDER          => array(
					'presets'        => null,
					'defaultPresets' => null,
				),
				self::LINE_HEIGHTS    => null,
				self::DEFAULT_LINE_HEIGHTS => null,
				self::WIDTH_SIZES     => null,
				self::TRANSITION      => array(
					'presets'        => null,
					'defaultPresets' => null,
				),
				self::TRANSFORM       => array(
					'presets'        => null,
					'defaultPresets' => null,
				),
				self::FILTER          => array(
					'presets'        => null,
					'defaultPresets' => null,
				),
				self::TEXT_SHADOW     => array(
					'presets'        => null,
					'defaultPresets' => null,
				),
				self::DIMENSION_SIZES => null,
			),
		);
	}

	/**
	 * @param array<string, mixed> $experimental_features Reference features tree.
	 * @param array<string, mixed> $blockera_settings     Merged settings from globalStyles.
	 */
	public static function merge_into_experimental_features(
		array &$experimental_features,
		array $blockera_settings
	): void {
		if ( isset( $blockera_settings[ self::ROOT ] ) && is_array( $blockera_settings[ self::ROOT ] ) ) {
			$existing = (array) ( $experimental_features[ self::ROOT ] ?? array() );

			foreach (
				array(
					self::BORDER,
					self::LINE_HEIGHTS,
					self::DEFAULT_LINE_HEIGHTS,
					self::WIDTH_SIZES,
					self::TRANSITION,
					self::TRANSFORM,
					self::FILTER,
					self::TEXT_SHADOW,
					self::DIMENSION_SIZES,
				) as $key
			) {
				if ( array_key_exists( $key, $blockera_settings[ self::ROOT ] ) ) {
					$existing[ $key ] = $blockera_settings[ self::ROOT ][ $key ];
				}
			}

			$experimental_features[ self::ROOT ] = $existing;
		}

		$core_merge_keys = array( 'shadow', 'border', 'dimensions', 'typography', 'layout', 'spacing', 'color' );

		foreach ( $core_merge_keys as $key ) {
			if ( ! isset( $blockera_settings[ $key ] ) || ! is_array( $blockera_settings[ $key ] ) ) {
				continue;
			}

			$experimental_features[ $key ] = array_replace_recursive(
				(array) ( $experimental_features[ $key ] ?? array() ),
				$blockera_settings[ $key ]
			);
		}

		if ( isset( $blockera_settings['blocks'] ) && is_array( $blockera_settings['blocks'] ) ) {
			$experimental_features['blocks'] = array_replace_recursive(
				(array) ( $experimental_features['blocks'] ?? array() ),
				$blockera_settings['blocks']
			);
		}
	}
}
