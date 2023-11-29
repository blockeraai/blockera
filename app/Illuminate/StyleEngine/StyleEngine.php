<?php

namespace Publisher\Framework\Illuminate\StyleEngine;

use Publisher\Framework\Illuminate\Support\View;

/**
 * The main class integrating all WP_Style_Engine_* classes.
 *
 * The Style Engine aims to provide a consistent API for rendering styling for blocks
 * across both client-side and server-side applications.
 *
 * This class is final and should not be extended.
 *
 * Please, use getStyles() instead.
 *
 * @access private
 * @since  1.0.0
 */
final class StyleEngine {

	public function __construct() {

		add_filter( 'safe_style_css', [ $this, 'filter_safe_style_css' ] );
		add_filter( 'safecss_filter_attr_allow_css', [ $this, 'filter_allow_css' ], 10, 2 );
	}

	/**
	 * Filter css style props.
	 *
	 * @param array $styles array of safe style css
	 *
	 * @return array array of safe style css valid properties
	 */
	public function filter_safe_style_css( array $styles ): array {

		$styles[] = 'top';
		$styles[] = 'flex';
		$styles[] = 'left';
		$styles[] = 'order';
		$styles[] = 'right';
		$styles[] = 'width';
		$styles[] = 'bottom';
		$styles[] = 'border';
		$styles[] = 'height';
		$styles[] = 'filter';
		$styles[] = 'cursor';
		$styles[] = 'display';
		$styles[] = 'row-gap';
		$styles[] = 'opacity';
		$styles[] = 'z-index';
		$styles[] = 'outline';
		$styles[] = 'position';
		$styles[] = 'overflow';
		$styles[] = 'transform';
		$styles[] = 'flex-wrap';
		$styles[] = 'column-gap';
		$styles[] = 'word-break';
		$styles[] = 'align-self';
		$styles[] = 'transition';
		$styles[] = 'column-gap';
//		$styles[] = 'line-height';
		$styles[] = 'border-top';
		$styles[] = 'text-stroke';
		$styles[] = 'text-indent';
		$styles[] = 'perspective';
		$styles[] = 'border-left';
		$styles[] = 'text-shadow';
		$styles[] = 'align-items';
		$styles[] = 'border-right';
		$styles[] = 'writing-mode';
		$styles[] = 'column-count';
		$styles[] = 'align-content';
		$styles[] = 'border-bottom';
		$styles[] = 'border-radius';
		$styles[] = 'flex-direction';
		$styles[] = 'outline-offset';
		$styles[] = 'mix-blend-mode';
		$styles[] = 'backdrop-filter';
		$styles[] = 'background-clip';
		$styles[] = 'text-orientation';
		$styles[] = 'transform-origin';
		$styles[] = 'column-rule-width';
		$styles[] = 'column-rule-color';
		$styles[] = 'column-rule-style';
		$styles[] = 'background-repeat';
		$styles[] = 'perspective-origin';
		$styles[] = 'backface-visibility';
		$styles[] = 'background-position';
		$styles[] = 'border-top-left-radius';
		$styles[] = 'border-top-right-radius';
		$styles[] = '-webkit-text-stroke-color';
		$styles[] = '-webkit-text-stroke-width';
		$styles[] = 'border-bottom-left-radius';
		$styles[] = 'border-bottom-right-radius';

		return $styles;
	}

	/**
	 * Filter allow css rule in WordPress core API
	 *
	 * @hooked "safecss_filter_attr_allow_css"
	 * @param bool   $allow_css       result of match regex pattern
	 * @param string $css_test_string css style string
	 *
	 * @return bool true on success, false when otherwise!
	 */
	public function filter_allow_css( bool $allow_css, string $css_test_string ): bool {

		if ( ! $allow_css ) {

			$props = [
				'filter',
				'transform',
				'transition',
				'backdrop-filter',
				'background-image',
			];

			//to support new allowed css properties
			return preg_match( '/(' . implode( '|', $props ) . '):(\s|).*\(/', $css_test_string );
		}

		return true;
	}

	/**
	 * Style definitions that contain the instructions to
	 * parse/output valid Gutenberg styles from a block's attributes.
	 *
	 * For every style definition, the following properties are valid:
	 *
	 *  - classnames    => (array) An array of classnames to be returned for block styles.
	 *                     The key is a classname or pattern.
	 *                     A value of `true` means the classname should be applied always.
	 *                     Otherwise, a valid CSS property (string) to match the incoming value,
	 *                     e.g. "color" to match var:preset|color|somePresetSlug.
	 *  - css_vars      => (array) An array of key value pairs used to generate CSS var values.
	 *                     The key is a CSS var pattern, whose `$slug` fragment will be replaced with a preset slug.
	 *                     The value should be a valid CSS property (string) to match the incoming value,
	 *                     e.g. "color" to match var:preset|color|somePresetSlug.
	 *  - property_keys => (array) An array of keys whose values represent a valid CSS property,
	 *                     e.g. "margin" or "border".
	 *  - path          => (array) A path that accesses the corresponding style value in the block style object.
	 *  - value_func    => (string) The name of a function to generate a CSS definition array
	 *                     for a particular style object. The output of this function should be
	 *                     `array( "$property" => "$value", ... )`.
	 *
	 * @since 1.0.0
	 * @return array
	 */
	protected static function getStyleDefinitionsConfig(): array {

		return View::load( 'Illuminate.StyleEngine.StyleDefinitions.config', [], true );
	}

	/**
	 * Util: Extracts the slug in kebab case from a preset string,
	 * e.g. `heavenly-blue` from `var:preset|color|heavenlyBlue`.
	 *
	 * @param string $style_value  A single CSS preset value.
	 * @param string $property_key The CSS property that is the second element of the preset string.
	 *                             Used for matching.
	 *
	 * @since 1.0.0
	 *
	 * @return string The slug, or empty string if not found.
	 */
	protected static function getSlugFromPresetValue( string $style_value, string $property_key ): string {

		if ( str_contains( $style_value, "var:preset|{$property_key}|" ) ) {
			$index_to_splice = strrpos( $style_value, '|' ) + 1;

			return _wp_to_kebab_case( substr( $style_value, $index_to_splice ) );
		}

		return '';
	}

	/**
	 * Util: Generates a CSS var string, e.g. `var(--wp--preset--color--background)`
	 * from a preset string such as `var:preset|space|50`.
	 *
	 * @param string   $style_value  A single CSS preset value.
	 * @param string[] $css_vars     An associate array of CSS var patterns
	 *                               used to generate the var string.
	 *
	 * @since 1.0.0
	 *
	 * @return string The CSS var, or an empty string if no match for slug found.
	 */
	protected static function getCssVarValue( string $style_value, array $css_vars ): string {

		foreach ( $css_vars as $property_key => $css_var_pattern ) {

			$slug = self::getSlugFromPresetValue( $style_value, $property_key );

			if ( self::isValidStyleValue( $slug ) ) {
				$var = strtr(
					$css_var_pattern,
					array( '$slug' => $slug )
				);

				return "var($var)";
			}
		}

		return '';
	}

	/**
	 * Util: Checks whether an incoming block style value is valid.
	 *
	 * @param string $style_value A single CSS preset value.
	 *
	 * @since 1.0.0
	 *
	 * @return bool
	 */
	protected static function isValidStyleValue( string $style_value ): bool {

		return '0' === $style_value || ! empty( $style_value );
	}

	/**
	 * Stores a CSS rule using the provided CSS selector and CSS declarations.
	 *
	 * @param string   $store_name       A valid store key.
	 * @param string   $css_selector     When a selector is passed, the function will return
	 *                                   a full CSS rule `$selector { ...rules }`
	 *                                   otherwise a concatenated string of properties and values.
	 * @param string[] $css_declarations An associative array of CSS definitions,
	 *                                   e.g. `array( "$property" => "$value", "$property" => "$value" )`.
	 *
	 * @since 1.0.0
	 *
	 */
	public static function storeCssRule( string $store_name, string $css_selector, array $css_declarations ): void {

		if ( empty( $store_name ) || empty( $css_selector ) || empty( $css_declarations ) ) {

			return;
		}

		self::getStore( $store_name )->add_rule( $css_selector )->add_declarations( $css_declarations );
	}

	/**
	 * Returns a store by store key.
	 *
	 * @param string $store_name A store key.
	 *
	 * @since 1.0.0
	 *
	 * @return \WP_Style_Engine_CSS_Rules_Store|null
	 */
	public static function getStore( string $store_name ): ?\WP_Style_Engine_CSS_Rules_Store {

		return \WP_Style_Engine_CSS_Rules_Store::get_store( $store_name );
	}

	/**
	 * Returns classnames and CSS based on the values in a styles object.
	 *
	 * Return values are parsed based on the instructions in getStyleDefinitionsConfig().
	 * @see   getStyleDefinitionsConfig()
	 *
	 * @param array   $block_styles               The style object.
	 * @param array   $options                    {
	 *                                            Optional. An array of options. Default empty array.
	 *
	 * @type bool     $convert_vars_to_classnames Whether to skip converting incoming CSS var patterns,
	 *                                                   e.g. `var:preset|<PRESET_TYPE>|<PRESET_SLUG>`,
	 *                                                   to `var( --wp--preset--* )` values. Default false.
	 * @type string   $selector                   Optional. When a selector is passed,
	 *                                                   the value of `$css` in the return value will comprise
	 *                                                   a full CSS rule `$selector { ...$css_declarations }`,
	 *                                                   otherwise, the value will be a concatenated string
	 *                                                   of CSS declarations.
	 * }
	 * @since 1.0.0
	 *
	 * @return array {
	 * @type string[] $classnames                 Array of class names.
	 * @type string[] $declarations               An associative array of CSS definitions,
	 *                                  e.g. `array( "$property" => "$value", "$property" => "$value" )`.
	 * }
	 */
	public static function parseBlockStyles( array $block_styles = [], array $options = [] ): array {

		$parsed_styles = array(
			'classnames'   => array(),
			'declarations' => array(),
		);

		if ( empty( $block_styles ) ) {

			return $parsed_styles;
		}

		// Collect CSS and classnames.
		foreach ( self::getStyleDefinitionsConfig() as $definition_group_key => $definition_group_style ) {

			if ( empty( $block_styles[ $definition_group_key ] ) ) {
				continue;
			}

			foreach ( $definition_group_style as $style_definition ) {

				$style_value = arrayGet( $block_styles, $style_definition['path'] );

				if ( ! $style_value || ! self::isValidStyleValue( $style_value ) ) {
					continue;
				}

				$parsed_styles['classnames']   = array_merge( $parsed_styles['classnames'], self::getClassnames( $style_value, $style_definition ) );
				$parsed_styles['declarations'] = array_merge( $parsed_styles['declarations'], self::getCssDeclarations( $style_value, $style_definition, $options ) );
			}
		}

		return $parsed_styles;
	}

	/**
	 * Returns classnames, and generates classname(s) from a CSS preset property pattern,
	 * e.g. `var:preset|<PRESET_TYPE>|<PRESET_SLUG>`.
	 *
	 * @see   getStyleDefinitionsConfig()
	 *
	 * @param array  $style_definition A single style definition from getStyleDefinitionsConfig().
	 * @param string $style_value      A single raw style value or CSS preset property
	 *                                 from the `$block_styles` array.
	 *
	 * @since 1.0.0
	 *
	 * @return string[] An array of CSS classnames, or empty array if there are none.
	 */
	protected static function getClassnames( string $style_value, array $style_definition ): array {

		if ( empty( $style_value ) ) {
			return [];
		}

		$classnames = [];

		if ( empty( $style_definition['classnames'] ) ) {

			return $classnames;
		}

		foreach ( $style_definition['classnames'] as $classname => $property_key ) {

			if ( true === $property_key ) {
				$classnames[] = $classname;
			}

			$slug = self::getSlugFromPresetValue( $style_value, $property_key );

			if ( $slug ) {
				/*
				 * Right now we expect a classname pattern to be stored in getStyleDefinitionsConfig().
				 * One day, if there are no stored schemata, we could allow custom patterns or
				 * generate classnames based on other properties
				 * such as a path or a value or a prefix passed in options.
				 */
				$classnames[] = strtr( $classname, [ '$slug' => $slug ] );
			}
		}

		return $classnames;
	}

	/**
	 * Returns an array of CSS declarations based on valid block style values.
	 *
	 * @see   getStyleDefinitionsConfig()
	 *
	 * @param array $style_definition           A single style definition from getStyleDefinitionsConfig().
	 * @param mixed $style_value                A single raw style value from $block_styles array.
	 * @param array $options                    {
	 *                                          Optional. An array of options. Default empty array.
	 *
	 * @type bool   $convert_vars_to_classnames Whether to skip converting incoming CSS var patterns,
	 *                                            e.g. `var:preset|<PRESET_TYPE>|<PRESET_SLUG>`,
	 *                                            to `var( --wp--preset--* )` values. Default false.
	 * }
	 * @since 1.0.0
	 *
	 * @return string[] An associative array of CSS definitions, e.g. `array( "$property" => "$value", "$property" => "$value" )`.
	 */
	protected static function getCssDeclarations( $style_value, array $style_definition, array $options = [] ): array {

		if ( isset( $style_definition['value_func'] ) && is_callable( $style_definition['value_func'] ) ) {
			return call_user_func( $style_definition['value_func'], $style_value, $style_definition, $options );
		}

		$css_declarations     = array();
		$style_property_keys  = $style_definition['property_keys'];
		$should_skip_css_vars = isset( $options['convert_vars_to_classnames'] ) && true === $options['convert_vars_to_classnames'];

		/*
		 * Build CSS var values from `var:preset|<PRESET_TYPE>|<PRESET_SLUG>` values, e.g, `var(--wp--css--rule-slug )`.
		 * Check if the value is a CSS preset and there's a corresponding css_var pattern in the style definition.
		 */
		if ( is_string( $style_value ) && str_contains( $style_value, 'var:' ) ) {

			if ( ! $should_skip_css_vars && ! empty( $style_definition['css_vars'] ) ) {

				$css_var = self::getCssVarValue( $style_value, $style_definition['css_vars'] );

				if ( self::isValidStyleValue( $css_var ) ) {
					$css_declarations[ $style_property_keys['default'] ] = $css_var;
				}
			}

			return $css_declarations;
		}

		/*
		 * Default rule builder.
		 * If the input contains an array, assume box model-like properties
		 * for styles such as margins and padding.
		 */
		if ( is_array( $style_value ) ) {

			// Bail out early if the `'individual'` property is not defined.

			if ( ! isset( $style_property_keys['individual'] ) ) {

				return $css_declarations;
			}

			foreach ( $style_value as $key => $value ) {

				if ( is_string( $value ) && str_contains( $value, 'var:' ) && ! $should_skip_css_vars && ! empty( $style_definition['css_vars'] ) ) {

					$value = self::getCssVarValue( $value, $style_definition['css_vars'] );
				}

				$individual_property = sprintf( $style_property_keys['individual'], _wp_to_kebab_case( $key ) );

				if ( $individual_property && self::isValidStyleValue( $value ) ) {
					$css_declarations[ $individual_property ] = $value;
				}
			}

			return $css_declarations;
		}

		$css_declarations[ $style_property_keys['default'] ] = $style_value;

		return $css_declarations;
	}

	/**
	 * Style value parser that returns a CSS definition array comprising style properties
	 * that have keys representing individual style properties, otherwise known as longhand CSS properties.
	 *
	 * Example:
	 *
	 *     "$style_property-$individual_feature: $value;"
	 *
	 * Which could represent the following:
	 *
	 *     "border-{top|right|bottom|left}-{color|width|style}: {value};"
	 *
	 * or:
	 *
	 *     "border-image-{outset|source|width|repeat|slice}: {value};"
	 *
	 * @see   getStyleDefinitionsConfig()
	 *
	 * @param array $individual_property_definition A single style definition from getStyleDefinitionsConfig()
	 *                                              representing an individual property of a CSS property,
	 *                                              e.g. 'top' in 'border-top'.
	 * @param array $style_value                    A single raw style value from `$block_styles` array.
	 * @param array $options                        {
	 *                                              Optional. An array of options. Default empty array.
	 *
	 * @type bool   $convert_vars_to_classnames     Whether to skip converting incoming CSS var patterns,
	 *                                            e.g. `var:preset|<PRESET_TYPE>|<PRESET_SLUG>`,
	 *                                            to `var( --wp--preset--* )` values. Default false.
	 * }
	 * @since 1.0.0
	 *
	 * @return string[] An associative array of CSS definitions, e.g. `array( "$property" => "$value", "$property" => "$value" )`.
	 */
	protected static function getIndividualPropertyCssDeclarations( array $style_value, array $individual_property_definition, array $options = array() ): array {

		if ( empty( $style_value ) || empty( $individual_property_definition['path'] ) ) {

			return [];
		}

		/*
		 * The first item in $individual_property_definition['path'] array
		 * tells us the style property, e.g. "border". We use this to get a corresponding
		 * CSS style definition such as "color" or "width" from the same group.
		 *
		 * The second item in $individual_property_definition['path'] array
		 * refers to the individual property marker, e.g. "top".
		 */
		$definition_group_key    = $individual_property_definition['path'][0];
		$individual_property_key = $individual_property_definition['path'][1];
		$should_skip_css_vars    = isset( $options['convert_vars_to_classnames'] ) && true === $options['convert_vars_to_classnames'];
		$css_declarations        = array();

		foreach ( $style_value as $css_property => $value ) {

			if ( empty( $value ) ) {
				continue;
			}

			// Build a path to the individual rules in definitions.
			$style_definition_path = array( $definition_group_key, $css_property );
			$style_definition      = arrayGet( self::getStyleDefinitionsConfig(), $style_definition_path, null );

			if ( $style_definition && isset( $style_definition['property_keys']['individual'] ) ) {

				// Set a CSS var if there is a valid preset value.
				if ( is_string( $value ) && str_contains( $value, 'var:' ) && ! $should_skip_css_vars && ! empty( $individual_property_definition['css_vars'] ) ) {

					$value = self::getCssVarValue( $value, $individual_property_definition['css_vars'] );
				}

				$individual_css_property = sprintf( $style_definition['property_keys']['individual'], $individual_property_key );

				$css_declarations[ $individual_css_property ] = $value;
			}
		}

		return $css_declarations;
	}

	/**
	 * Returns compiled CSS from CSS declarations.
	 *
	 * @param string[] $css_declarations An associative array of CSS definitions,
	 *                                   e.g. `array( "$property" => "$value", "$property" => "$value" )`.
	 * @param string   $css_selector     When a selector is passed, the function will return
	 *                                   a full CSS rule `$selector { ...rules }`,
	 *                                   otherwise a concatenated string of properties and values.
	 *
	 * @since 1.0.0
	 *
	 * @return string A compiled CSS string.
	 */
	public static function compileCss( array $css_declarations, string $css_selector ): string {

		if ( empty( $css_declarations ) ) {

			return '';
		}

		// Return an entire rule if there is a selector.
		if ( $css_selector ) {

			$css_rule = new \WP_Style_Engine_CSS_Rule( $css_selector, $css_declarations );

			return $css_rule->get_css();
		}

		$css_declarations = new \WP_Style_Engine_CSS_Declarations( $css_declarations );

		return $css_declarations->get_declarations_string();
	}

	/**
	 * Returns a compiled stylesheet from stored CSS rules.
	 *
	 * @param \WP_Style_Engine_CSS_Rule[] $css_rules An array of WP_Style_Engine_CSS_Rule objects
	 *                                               from a store or otherwise.
	 * @param array                       $options   {
	 *                                               Optional. An array of options. Default empty array.
	 *
	 * @type string|null                  $context   An identifier describing the origin of the style object,
	 *                                 e.g. 'block-supports' or 'global-styles'. Default 'block-supports'.
	 *                                 When set, the style engine will attempt to store the CSS rules.
	 * @type bool                         $optimize  Whether to optimize the CSS output, e.g. combine rules.
	 *                                 Default false.
	 * @type bool                         $prettify  Whether to add new lines and indents to output.
	 *                                 Defaults to whether the `SCRIPT_DEBUG` constant is defined.
	 * }
	 * @since 1.0.0
	 *
	 * @return string A compiled stylesheet from stored CSS rules.
	 */
	public static function compileStylesheetFromCssRules( array $css_rules, array $options = array() ): string {

		$processor = new \WP_Style_Engine_Processor();
		$processor->add_rules( $css_rules );

		return $processor->get_css( $options );
	}

}
