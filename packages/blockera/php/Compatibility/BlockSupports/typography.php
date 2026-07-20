<?php

if (! function_exists('blockera_get_typography_font_size_value')) {
	/**
	 * Returns a font-size value based on a given font-size preset.
	 * Takes into account fluid typography parameters and attempts to return a CSS
	 * formula depending on available, valid values.
	 *
	 * Uses {@see blockera_get_global_settings()} instead of core
	 * {@see wp_get_global_settings()} so fluid calc does not cold-start
	 * {@see WP_Theme_JSON_Resolver}.
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

		/*
		 * Fallback to Blockera global settings (request-cached). Skip the merge when the
		 * caller already passed typography + layout (e.g. JSON stylesheet generation).
		 */
		if ( empty( $settings ) || ! isset( $settings['typography'], $settings['layout'] ) ) {
			static $global_settings = null;
			if ( null === $global_settings ) {
				$global_settings = blockera_get_global_settings();
			}
			$settings = empty( $settings )
				? $global_settings
				: wp_parse_args( $settings, $global_settings );
		}

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

if ( ! function_exists( 'blockera_apply_typography_support' ) ) {
	/**
	 * Adds CSS classes and inline styles for typography features such as font sizes
	 * to the incoming attributes array. This will be applied to the block markup in
	 * the front-end.
	 *
	 * Same contract as {@see wp_apply_typography_support()}; uses
	 * {@see blockera_get_typography_font_size_value()} so fluid font-size does not
	 * cold-start core {@see wp_get_global_settings()}.
	 *
	 * @since 5.6.0
	 * @since 6.1.0 Used the style engine to generate CSS and classnames.
	 * @since 6.3.0 Added support for text-columns.
	 * @since 7.0.0 Added support for text-indent.
	 * @access private
	 *
	 * @param WP_Block_Type $block_type       Block type.
	 * @param array         $block_attributes Block attributes.
	 * @return array Typography CSS classes and inline styles.
	 */
	function blockera_apply_typography_support( $block_type, $block_attributes ) {
		if ( ! ( $block_type instanceof WP_Block_Type ) ) {
			return array();
		}

		$typography_supports = $block_type->supports['typography'] ?? false;
		if ( ! $typography_supports ) {
			return array();
		}

		if ( wp_should_skip_block_supports_serialization( $block_type, 'typography' ) ) {
			return array();
		}

		$has_font_family_support     = $typography_supports['__experimentalFontFamily'] ?? false;
		$has_font_size_support       = $typography_supports['fontSize'] ?? false;
		$has_font_style_support      = $typography_supports['__experimentalFontStyle'] ?? false;
		$has_font_weight_support     = $typography_supports['__experimentalFontWeight'] ?? false;
		$has_letter_spacing_support  = $typography_supports['__experimentalLetterSpacing'] ?? false;
		$has_line_height_support     = $typography_supports['lineHeight'] ?? false;
		$has_text_align_support      = $typography_supports['textAlign'] ?? false;
		$has_text_columns_support    = $typography_supports['textColumns'] ?? false;
		$has_text_decoration_support = $typography_supports['__experimentalTextDecoration'] ?? false;
		$has_text_transform_support  = $typography_supports['__experimentalTextTransform'] ?? false;
		$has_text_indent_support     = $typography_supports['textIndent'] ?? false;
		$has_writing_mode_support    = $typography_supports['__experimentalWritingMode'] ?? false;

		// Whether to skip individual block support features.
		$should_skip_font_size       = wp_should_skip_block_supports_serialization( $block_type, 'typography', 'fontSize' );
		$should_skip_font_family     = wp_should_skip_block_supports_serialization( $block_type, 'typography', 'fontFamily' );
		$should_skip_font_style      = wp_should_skip_block_supports_serialization( $block_type, 'typography', 'fontStyle' );
		$should_skip_font_weight     = wp_should_skip_block_supports_serialization( $block_type, 'typography', 'fontWeight' );
		$should_skip_line_height     = wp_should_skip_block_supports_serialization( $block_type, 'typography', 'lineHeight' );
		$should_skip_text_align      = wp_should_skip_block_supports_serialization( $block_type, 'typography', 'textAlign' );
		$should_skip_text_columns    = wp_should_skip_block_supports_serialization( $block_type, 'typography', 'textColumns' );
		$should_skip_text_decoration = wp_should_skip_block_supports_serialization( $block_type, 'typography', 'textDecoration' );
		$should_skip_text_transform  = wp_should_skip_block_supports_serialization( $block_type, 'typography', 'textTransform' );
		$should_skip_letter_spacing  = wp_should_skip_block_supports_serialization( $block_type, 'typography', 'letterSpacing' );
		$should_skip_text_indent     = wp_should_skip_block_supports_serialization( $block_type, 'typography', 'textIndent' );
		$should_skip_writing_mode    = wp_should_skip_block_supports_serialization( $block_type, 'typography', 'writingMode' );

		$typography_block_styles = array();
		if ( $has_font_size_support && ! $should_skip_font_size ) {
			$preset_font_size                    = array_key_exists( 'fontSize', $block_attributes )
				? "var:preset|font-size|{$block_attributes['fontSize']}"
				: null;
			$custom_font_size                    = $block_attributes['style']['typography']['fontSize'] ?? null;
			$typography_block_styles['fontSize'] = $preset_font_size ? $preset_font_size : blockera_get_typography_font_size_value(
				array(
					'size' => $custom_font_size,
				)
			);
		}

		if ( $has_font_family_support && ! $should_skip_font_family ) {
			$preset_font_family                    = array_key_exists( 'fontFamily', $block_attributes )
				? "var:preset|font-family|{$block_attributes['fontFamily']}"
				: null;
			$custom_font_family                    = isset( $block_attributes['style']['typography']['fontFamily'] )
				? wp_typography_get_preset_inline_style_value( $block_attributes['style']['typography']['fontFamily'], 'font-family' )
				: null;
			$typography_block_styles['fontFamily'] = $preset_font_family ? $preset_font_family : $custom_font_family;
		}

		if (
			$has_font_style_support &&
			! $should_skip_font_style &&
			isset( $block_attributes['style']['typography']['fontStyle'] )
		) {
			$typography_block_styles['fontStyle'] = wp_typography_get_preset_inline_style_value(
				$block_attributes['style']['typography']['fontStyle'],
				'font-style'
			);
		}

		if (
			$has_font_weight_support &&
			! $should_skip_font_weight &&
			isset( $block_attributes['style']['typography']['fontWeight'] )
		) {
			$typography_block_styles['fontWeight'] = wp_typography_get_preset_inline_style_value(
				$block_attributes['style']['typography']['fontWeight'],
				'font-weight'
			);
		}

		if ( $has_line_height_support && ! $should_skip_line_height ) {
			$typography_block_styles['lineHeight'] = $block_attributes['style']['typography']['lineHeight'] ?? null;
		}

		if ( $has_text_align_support && ! $should_skip_text_align ) {
			$typography_block_styles['textAlign'] = $block_attributes['style']['typography']['textAlign'] ?? null;
		}

		if ( $has_text_columns_support && ! $should_skip_text_columns && isset( $block_attributes['style']['typography']['textColumns'] ) ) {
			$typography_block_styles['textColumns'] = $block_attributes['style']['typography']['textColumns'] ?? null;
		}

		if (
			$has_text_decoration_support &&
			! $should_skip_text_decoration &&
			isset( $block_attributes['style']['typography']['textDecoration'] )
		) {
			$typography_block_styles['textDecoration'] = wp_typography_get_preset_inline_style_value(
				$block_attributes['style']['typography']['textDecoration'],
				'text-decoration'
			);
		}

		if (
			$has_text_transform_support &&
			! $should_skip_text_transform &&
			isset( $block_attributes['style']['typography']['textTransform'] )
		) {
			$typography_block_styles['textTransform'] = wp_typography_get_preset_inline_style_value(
				$block_attributes['style']['typography']['textTransform'],
				'text-transform'
			);
		}

		if (
			$has_letter_spacing_support &&
			! $should_skip_letter_spacing &&
			isset( $block_attributes['style']['typography']['letterSpacing'] )
		) {
			$typography_block_styles['letterSpacing'] = wp_typography_get_preset_inline_style_value(
				$block_attributes['style']['typography']['letterSpacing'],
				'letter-spacing'
			);
		}

		if ( $has_writing_mode_support &&
			! $should_skip_writing_mode &&
			isset( $block_attributes['style']['typography']['writingMode'] )
		) {
			$typography_block_styles['writingMode'] = $block_attributes['style']['typography']['writingMode'] ?? null;
		}

		if ( $has_text_indent_support && ! $should_skip_text_indent && isset( $block_attributes['style']['typography']['textIndent'] ) ) {
			$typography_block_styles['textIndent'] = $block_attributes['style']['typography']['textIndent'] ?? null;
		}

		$attributes = array();
		$classnames = array();
		$styles     = wp_style_engine_get_styles(
			array( 'typography' => $typography_block_styles ),
			array( 'convert_vars_to_classnames' => true )
		);

		if ( ! empty( $styles['classnames'] ) ) {
			$classnames[] = $styles['classnames'];
		}

		if ( $has_text_align_support && ! $should_skip_text_align && isset( $block_attributes['style']['typography']['textAlign'] ) ) {
			$classnames[] = 'has-text-align-' . $block_attributes['style']['typography']['textAlign'];
		}

		if ( ! empty( $classnames ) ) {
			$attributes['class'] = implode( ' ', $classnames );
		}

		if ( ! empty( $styles['css'] ) ) {
			$attributes['style'] = $styles['css'];
		}

		return $attributes;
	}
}

if ( ! function_exists( 'blockera_render_typography_support' ) ) {
	/**
	 * Renders typography styles/content to the block wrapper.
	 *
	 * Same contract as {@see wp_render_typography_support()}; uses
	 * {@see blockera_get_typography_font_size_value()} so fluid custom font-size
	 * on `render_block` does not cold-start core {@see wp_get_global_settings()}.
	 *
	 * @since 6.1.0
	 *
	 * @param string $block_content Rendered block content.
	 * @param array  $block         Block object.
	 * @return string Filtered block content.
	 */
	function blockera_render_typography_support( $block_content, $block ) {
		if ( ! empty( $block['attrs']['fitText'] ) && $block['attrs']['fitText'] && ! is_admin() ) {
			wp_enqueue_script_module( '@wordpress/block-editor/utils/fit-text-frontend' );

			// Add Interactivity API directives for fit text to work with client-side navigation.
			if ( ! empty( $block_content ) ) {
				$processor = new WP_HTML_Tag_Processor( $block_content );
				if ( $processor->next_tag() ) {
					if ( ! $processor->get_attribute( 'data-wp-interactive' ) ) {
						$processor->set_attribute( 'data-wp-interactive', true );
					}
					$processor->set_attribute( 'data-wp-context---core-fit-text', 'core/fit-text::{"fontSize":""}' );
					$processor->set_attribute( 'data-wp-init---core-fit-text', 'core/fit-text::callbacks.init' );
					$processor->set_attribute( 'data-wp-style--font-size', 'core/fit-text::context.fontSize' );
					$block_content = $processor->get_updated_html();
				}
			}
			// fitText supersedes any other typography features.
			return $block_content;
		}
		if ( ! isset( $block['attrs']['style']['typography']['fontSize'] ) ) {
			return $block_content;
		}

		$custom_font_size = $block['attrs']['style']['typography']['fontSize'];
		$fluid_font_size  = blockera_get_typography_font_size_value( array( 'size' => $custom_font_size ) );

		/*
		 * Checks that $fluid_font_size does not match $custom_font_size,
		 * which means it's been mutated by the fluid font size functions.
		 */
		if ( ! empty( $fluid_font_size ) && $fluid_font_size !== $custom_font_size ) {
			// Replaces the first instance of `font-size:$custom_font_size` with `font-size:$fluid_font_size`.
			return preg_replace( '/font-size\s*:\s*' . preg_quote( $custom_font_size, '/' ) . '\s*;?/', 'font-size:' . esc_attr( $fluid_font_size ) . ';', $block_content, 1 );
		}

		return $block_content;
	}
}
