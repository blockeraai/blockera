<?php

if (! function_exists('blockera_get_typography_font_size_value')) {
	/**
	 * Returns a font-size value based on a given font-size preset.
	 * Takes into account fluid typography parameters and attempts to return a CSS
	 * formula depending on available, valid values.
	 *
	 * @since 6.1.0
	 * @since 6.1.1 Adjusted rules for min and max font sizes.
	 * @since 6.2.0 Added 'settings.typography.fluid.minFontSize' support.
	 * @since 6.3.0 Using layout.wideSize as max viewport width, and logarithmic scale factor to calculate minimum font scale.
	 * @since 6.4.0 Added configurable min and max viewport width values to the typography.fluid theme.json schema.
	 * @since 6.6.0 Deprecated bool argument $should_use_fluid_typography.
	 * @since 6.7.0 Font size presets can enable fluid typography individually, even if it’s disabled globally.
	 *
	 * @param array      $preset   {
	 *     Required. fontSizes preset value as seen in theme.json.
	 *
	 *     @type string           $name Name of the font size preset.
	 *     @type string           $slug Kebab-case, unique identifier for the font size preset.
	 *     @type string|int|float $size CSS font-size value, including units if applicable.
	 * }
	 * @param bool|array $settings Optional Theme JSON settings array that overrides any global theme settings.
	 *                             Default is false.
	 * @return string|null Font-size value or null if a size is not passed in $preset.
	 */
	function blockera_get_typography_font_size_value( $preset, $settings = array() ) {
		if ( ! isset( $preset['size'] ) ) {
			return null;
		}

		/*
		* Catches falsy values and 0/'0'. Fluid calculations cannot be performed on `0`.
		* Also returns early when a preset font size explicitly disables fluid typography with `false`.
		*/
		$fluid_font_size_settings = $preset['fluid'] ?? null;
		if ( false === $fluid_font_size_settings || empty( $preset['size'] ) ) {
			return $preset['size'];
		}

		/*
		* As a boolean (deprecated since 6.6), $settings acts as an override to switch fluid typography "on" (`true`) or "off" (`false`).
		*/
		if ( is_bool( $settings ) ) {
			_deprecated_argument( __FUNCTION__, '6.6.0', __( '`boolean` type for second argument `$settings` is deprecated. Use `array()` instead.', 'blockera' ) );
			$settings = array(
				'typography' => array(
					'fluid' => $settings,
				),
			);
		}

		// Fallback to global settings as default.
		$global_settings = blockera_get_global_settings();
		$settings        = wp_parse_args(
			$settings,
			$global_settings
		);

		$typography_settings = $settings['typography'] ?? array();

		/*
		* Return early when fluid typography is disabled in the settings, and there
		* are no local settings to enable it for the individual preset.
		*
		* If this condition isn't met, either the settings or individual preset settings
		* have enabled fluid typography.
		*/
		if ( empty( $typography_settings['fluid'] ) && empty( $fluid_font_size_settings ) ) {
			return $preset['size'];
		}

		$fluid_settings  = isset( $typography_settings['fluid'] ) ? $typography_settings['fluid'] : array();
		$layout_settings = isset( $settings['layout'] ) ? $settings['layout'] : array();

		// Defaults.
		$default_maximum_viewport_width       = '1600px';
		$default_minimum_viewport_width       = '320px';
		$default_minimum_font_size_factor_max = 0.75;
		$default_minimum_font_size_factor_min = 0.25;
		$default_scale_factor                 = 1;
		$default_minimum_font_size_limit      = '14px';

		// Defaults overrides.
		$minimum_viewport_width = isset( $fluid_settings['minViewportWidth'] ) ? $fluid_settings['minViewportWidth'] : $default_minimum_viewport_width;
		$maximum_viewport_width = isset( $layout_settings['wideSize'] ) && ! empty( wp_get_typography_value_and_unit( $layout_settings['wideSize'] ) ) ? $layout_settings['wideSize'] : $default_maximum_viewport_width;
		if ( isset( $fluid_settings['maxViewportWidth'] ) ) {
			$maximum_viewport_width = $fluid_settings['maxViewportWidth'];
		}
		$has_min_font_size       = isset( $fluid_settings['minFontSize'] ) && ! empty( wp_get_typography_value_and_unit( $fluid_settings['minFontSize'] ) );
		$minimum_font_size_limit = $has_min_font_size ? $fluid_settings['minFontSize'] : $default_minimum_font_size_limit;

		// Try to grab explicit min and max fluid font sizes.
		$minimum_font_size_raw = isset( $fluid_font_size_settings['min'] ) ? $fluid_font_size_settings['min'] : null;
		$maximum_font_size_raw = isset( $fluid_font_size_settings['max'] ) ? $fluid_font_size_settings['max'] : null;

		// Font sizes.
		$preferred_size = wp_get_typography_value_and_unit( $preset['size'] );

		// Protects against unsupported units.
		if ( empty( $preferred_size['unit'] ) ) {
			return $preset['size'];
		}

		/*
		* Normalizes the minimum font size limit according to the incoming unit,
		* in order to perform comparative checks.
		*/
		$minimum_font_size_limit = wp_get_typography_value_and_unit(
			$minimum_font_size_limit,
			array(
				'coerce_to' => $preferred_size['unit'],
			)
		);

		// Don't enforce minimum font size if a font size has explicitly set a min and max value.
		if ( ! empty( $minimum_font_size_limit ) && ( ! $minimum_font_size_raw && ! $maximum_font_size_raw ) ) {
			/*
			* If a minimum size was not passed to this function
			* and the user-defined font size is lower than $minimum_font_size_limit,
			* do not calculate a fluid value.
			*/
			if ( $preferred_size['value'] <= $minimum_font_size_limit['value'] ) {
				return $preset['size'];
			}
		}

		// If no fluid max font size is available use the incoming value.
		if ( ! $maximum_font_size_raw ) {
			$maximum_font_size_raw = $preferred_size['value'] . $preferred_size['unit'];
		}

		/*
		* If no minimumFontSize is provided, create one using
		* the given font size multiplied by the min font size scale factor.
		*/
		if ( ! $minimum_font_size_raw ) {
			$preferred_font_size_in_px = 'px' === $preferred_size['unit'] ? $preferred_size['value'] : $preferred_size['value'] * 16;

			/*
			* The scale factor is a multiplier that affects how quickly the curve will move towards the minimum,
			* that is, how quickly the size factor reaches 0 given increasing font size values.
			* For a - b * log2(), lower values of b will make the curve move towards the minimum faster.
			* The scale factor is constrained between min and max values.
			*/
			$minimum_font_size_factor     = min( max( 1 - 0.075 * log( $preferred_font_size_in_px, 2 ), $default_minimum_font_size_factor_min ), $default_minimum_font_size_factor_max );
			$calculated_minimum_font_size = round( $preferred_size['value'] * $minimum_font_size_factor, 3 );

			// Only use calculated min font size if it's > $minimum_font_size_limit value.
			if ( ! empty( $minimum_font_size_limit ) && $calculated_minimum_font_size <= $minimum_font_size_limit['value'] ) {
				$minimum_font_size_raw = $minimum_font_size_limit['value'] . $minimum_font_size_limit['unit'];
			} else {
				$minimum_font_size_raw = $calculated_minimum_font_size . $preferred_size['unit'];
			}
		}

		$fluid_font_size_value = wp_get_computed_fluid_typography_value(
			array(
				'minimum_viewport_width' => $minimum_viewport_width,
				'maximum_viewport_width' => $maximum_viewport_width,
				'minimum_font_size'      => $minimum_font_size_raw,
				'maximum_font_size'      => $maximum_font_size_raw,
				'scale_factor'           => $default_scale_factor,
			)
		);

		if ( ! empty( $fluid_font_size_value ) ) {
			return $fluid_font_size_value;
		}

		return $preset['size'];
	}
}
