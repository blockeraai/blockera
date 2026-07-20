<?php

namespace Blockera\Editor\StyleDefinitions;

use Blockera\Editor\StyleDefinitions\BaseStyleDefinition;

class BorderRadius extends BaseStyleDefinition {

	/**
	 * When a radius field is a variable with border-preset-shaped settings (array or legacy JSON),
	 * resolve to the inner `all` length string when present.
	 *
	 * @param mixed $field Raw field value from block attributes.
	 * @return mixed
	 */
	private static function unwrapRadiusVariableField( $field ) {
		if ( ! is_array( $field ) || ! isset( $field['valueType'] ) || 'variable' !== $field['valueType'] ) {
			return $field;
		}

		$settings = $field['settings'] ?? array();
		$raw      = $settings['value'] ?? null;

		if ( is_array( $raw ) ) {
			$decoded = $raw;
		} elseif ( is_string( $raw ) && '' !== $raw ) {
			$decoded = static::tryDecodeLegacyVariableJsonObject( $raw );
			if ( null === $decoded ) {
				return $field;
			}
		} else {
			return $field;
		}

		if (
			isset( $decoded['all'] ) && is_string( $decoded['all'] )
			&& ( ! isset( $decoded['type'] ) || 'all' === $decoded['type'] )
		) {
			return $decoded['all'];
		}

		return $field;
	}

	/**
	 * Generate CSS declarations for border-radius.
	 * Optimized for minimal function calls and array access overhead.
	 */
	protected function css( array $setting ): array {
		$css_property = $setting['type'] ?? null;

		if ( 'border-radius' !== $css_property || ! isset( $setting[ $css_property ] ) ) {
			return [];
		}

		$border_radius_config = $this->getStyleEngineConfig( 'blockeraBorderRadius' );
		$value                = $setting[ $css_property ];
		$declaration          = [];

		if ( ! empty( $value['isValueAddon'] ) && ! empty( $value['valueType'] ) ) {
			$declaration[ $border_radius_config['all'] ] = blockera_get_value_addon_real_value( $value );
			$this->setCss( $declaration );

			return $this->css;
		}

		$value_type = $value['type'] ?? null;

		if ( 'all' === $value_type ) {
			$config_all                 = $border_radius_config['all'];
			$all_value                  = $value['all'] ?? null;
			$resolved                   = self::unwrapRadiusVariableField( $all_value );
			$declaration[ $config_all ] = ! empty( $resolved )
				? blockera_get_value_addon_real_value( $resolved )
				: '';
		} else {
			$config_top_left     = $border_radius_config['topLeft'];
			$config_top_right    = $border_radius_config['topRight'];
			$config_bottom_right = $border_radius_config['bottomRight'];
			$config_bottom_left  = $border_radius_config['bottomLeft'];

			$top_left_value                  = $value['topLeft'] ?? null;
			$resolved_tl                     = self::unwrapRadiusVariableField( $top_left_value );
			$declaration[ $config_top_left ] = ! empty( $resolved_tl )
				? blockera_get_value_addon_real_value( $resolved_tl )
				: '';

			$top_right_value                  = $value['topRight'] ?? null;
			$resolved_tr                      = self::unwrapRadiusVariableField( $top_right_value );
			$declaration[ $config_top_right ] = ! empty( $resolved_tr )
				? blockera_get_value_addon_real_value( $resolved_tr )
				: '';

			$bottom_right_value                  = $value['bottomRight'] ?? null;
			$resolved_br                         = self::unwrapRadiusVariableField( $bottom_right_value );
			$declaration[ $config_bottom_right ] = ! empty( $resolved_br )
				? blockera_get_value_addon_real_value( $resolved_br )
				: '';

			$bottom_left_value                  = $value['bottomLeft'] ?? null;
			$resolved_bl                        = self::unwrapRadiusVariableField( $bottom_left_value );
			$declaration[ $config_bottom_left ] = ! empty( $resolved_bl )
				? blockera_get_value_addon_real_value( $resolved_bl )
				: '';
		}

		$this->setCss( $declaration );

		return $this->css;
	}
}
