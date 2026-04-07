<?php

namespace Blockera\Setup\Compatibility;

use Blockera\Setup\Blockera;
use Blockera\Editor\StyleEngine;

class JSON extends \WP_Theme_JSON {

	/**
	 * Store features support list.
	 *
	 * @var array $supports Features support list.
	 */
	private static array $supports;

	/**
	 * Constructor.
	 *
	 * @param array  $data The data to construct the JSON with.
	 * @param string $origin The origin of the data.
	 */
	public function __construct( array $data = array(), string $origin = 'theme') {
		parent::__construct($data, $origin);

		global $blockera_block_supports;

		$this->setSupports($blockera_block_supports);
	}

	/**
	 * Set features support list.
	 *
	 * @param array $supports Features support list.
	 * @return void
	 */
	public function setSupports( array $supports): void {
		self::$supports = $supports;
	}

	/**
     * Sanitizes the input according to the schemas.
     *
     * @since 5.8.0
     * @since 5.9.0 Added the `$valid_block_names` and `$valid_element_name` parameters.
     * @since 6.3.0 Added the `$valid_variations` parameter.
     * @since 6.6.0 Updated schema to allow extended block style variations.
     *
     * @param array $input               Structure to sanitize.
     * @param array $valid_block_names   List of valid block names.
     * @param array $valid_element_names List of valid element names.
     * @param array $valid_variations    List of valid variations per block.
	 * 
     * @return array The sanitized output.
     */
    protected static function sanitize( $input, $valid_block_names, $valid_element_names, $valid_variations): array {

		$output = array();

        if (! is_array($input)) {
            return $output;
        }

        // Preserve only the top most level keys.
        $output = array_intersect_key($input, array_flip(static::VALID_TOP_LEVEL_KEYS));

        /*
         * Remove any rules that are annotated as "top" in VALID_STYLES constant.
         * Some styles are only meant to be available at the top-level (e.g.: blockGap),
         * hence, the schema for blocks & elements should not have them.
         */
        $styles_non_top_level = blockera_get_valid_supports(static::VALID_STYLES);
        foreach (array_keys($styles_non_top_level) as $section) {
            // array_key_exists() needs to be used instead of isset() because the value can be null.
            if (array_key_exists($section, $styles_non_top_level) && is_array($styles_non_top_level[ $section ])) {
                foreach (array_keys($styles_non_top_level[ $section ]) as $prop) {
                    if ('top' === $styles_non_top_level[ $section ][ $prop ]) {
                        unset($styles_non_top_level[ $section ][ $prop ]);
                    }
                }
            }
        }

        // Build the schema based on valid block & element names.
        $schema                 = array();
        $schema_styles_elements = array();

        /*
         * Set allowed element pseudo selectors based on per element allow list.
         * Target data structure in schema:
         * e.g.
         * - top level elements: `$schema['styles']['elements']['link'][':hover']`.
         * - block level elements: `$schema['styles']['blocks']['core/button']['elements']['link'][':hover']`.
         */
        foreach ($valid_element_names as $element) {
            $schema_styles_elements[ $element ] = $styles_non_top_level;

            if (isset(static::VALID_ELEMENT_PSEUDO_SELECTORS[ $element ])) {
                foreach (static::VALID_ELEMENT_PSEUDO_SELECTORS[ $element ] as $pseudo_selector) {
                    $schema_styles_elements[ $element ][ $pseudo_selector ] = $styles_non_top_level;
                }
            }
        }

        $schema_styles_blocks   = array();
        $schema_settings_blocks = array();

        $settings_schema = static::extend_valid_settings_schema(static::VALID_SETTINGS);

        /*
         * Generate a schema for blocks.
         * - Block styles can contain `elements` & `variations` definitions.
         * - Variations definitions cannot be nested.
         * - Variations can contain styles for inner `blocks`.
         * - Variation inner `blocks` styles can contain `elements`.
         *
         * As each variation needs a `blocks` schema but further nested
         * inner `blocks`, the overall schema will be generated in multiple passes.
         */
        foreach ($valid_block_names as $block) {
            $schema_settings_blocks[ $block ]           = $settings_schema;
            $schema_styles_blocks[ $block ]             = $styles_non_top_level;
            $schema_styles_blocks[ $block ]['elements'] = $schema_styles_elements;
        }

        $block_style_variation_styles             = $styles_non_top_level;
        $block_style_variation_styles['blocks']   = $schema_styles_blocks;
        $block_style_variation_styles['elements'] = $schema_styles_elements;

        foreach ($valid_block_names as $block) {
            // Build the schema for each block style variation.
            $style_variation_names = array();

            if (
                ! empty($input['styles']['blocks'][ $block ]['variations']) &&
                is_array($input['styles']['blocks'][ $block ]['variations']) &&
                isset($valid_variations[ $block ])
            ) {
				// Important tips:
				// 1. WP_Theme_JSON class used of array_intersect to validate variations based on available items from static config.
				// 2. Blockera\Setup\Compatibility\JSON class which override step 1 functionality to support of dynamic items which provided from user config in editor.
                $style_variation_names = array_merge(
                    array_keys($input['styles']['blocks'][ $block ]['variations']),
                    $valid_variations[ $block ]
                );
            }

            $schema_styles_variations = array();
            if (! empty($style_variation_names)) {
                $schema_styles_variations = array_fill_keys($style_variation_names, $block_style_variation_styles);
            }

            $schema_styles_blocks[ $block ]['variations'] = $schema_styles_variations;
        }

        $schema['styles']                                 = $styles_non_top_level;
        $schema['styles']['blocks']                       = $schema_styles_blocks;
        $schema['styles']['elements']                     = $schema_styles_elements;
        $schema['settings']                               = $settings_schema;
        $schema['settings']['blocks']                     = $schema_settings_blocks;
        $schema['settings']['typography']['fontFamilies'] = static::schema_in_root_and_per_origin(static::FONT_FAMILY_SCHEMA);

        // Remove anything that's not present in the schema.
        foreach (array( 'styles', 'settings' ) as $subtree) {
            if (! isset($input[ $subtree ])) {
                continue;
            }

            if (! is_array($input[ $subtree ])) {
                unset($output[ $subtree ]);
                continue;
            }

            $result = static::remove_keys_not_in_schema($input[ $subtree ], $schema[ $subtree ]);

            if (empty($result)) {
                unset($output[ $subtree ]);
            } else {
                $output[ $subtree ] = static::resolve_custom_css_format($result);
            }
        }

        if (
            isset($output['settings']['border']['presets']) &&
            is_array($output['settings']['border']['presets'])
        ) {
            $output['settings']['border']['presets'] = static::sanitize_blockera_border_presets(
                $output['settings']['border']['presets']
            );
        }

        return $output;
    }

    /**
     * Adds Blockera-only keys to the core {@see \WP_Theme_JSON::VALID_SETTINGS} schema (e.g. box border presets).
     *
     * @param array $settings_schema Core valid settings tree.
     * @return array
     */
    protected static function extend_valid_settings_schema( array $settings_schema ): array {
        if (isset($settings_schema['border']) && is_array($settings_schema['border'])) {
            $settings_schema['border'] = array_merge(
                $settings_schema['border'],
                array(
                    'presets' => null,
                )
            );
        }

        return $settings_schema;
    }

    /**
     * Keeps settings.border.presets aligned with the editor shape (slug, name, border box).
     *
     * @param array $presets Presets tree with theme, default, and custom origins.
     * @return array Sanitized presets.
     */
    protected static function sanitize_blockera_border_presets( array $presets ): array {
        $out = array();

        foreach (array( 'theme', 'default', 'custom' ) as $origin) {
            if (! isset($presets[ $origin ]) || ! is_array($presets[ $origin ])) {
                continue;
            }
            $out[ $origin ] = array();
            foreach ($presets[ $origin ] as $item) {
                $clean = static::sanitize_border_preset_item($item);
                if (null !== $clean) {
                    $out[ $origin ][] = $clean;
                }
            }
        }

        return $out;
    }

    /**
     * @param mixed $item Single preset entry.
     * @return array|null Preset array or null if invalid.
     */
    protected static function sanitize_border_preset_item( $item ): ?array {
        if (! is_array($item)) {
            return null;
        }
        if (
            ! isset($item['slug'], $item['name']) ||
            ! is_string($item['slug']) ||
            ! is_string($item['name'])
        ) {
            return null;
        }

        return array(
            'slug'   => $item['slug'],
            'name'   => $item['name'],
            'border' => static::sanitize_box_border_value($item['border'] ?? null),
        );
    }

    /**
     * @param mixed $border Border value from theme.json / editor.
     * @return array Normalized box border (matches JS sanitizeBorderBoxPresets).
     */
    protected static function sanitize_box_border_value( $border ): array {
        if (! is_array($border)) {
            return static::get_default_box_border_value();
        }

        $type = isset($border['type']) && in_array($border['type'], array( 'all', 'custom' ), true)
            ? $border['type']
            : 'all';

        if ('all' === $type) {
            $all = isset($border['all']) && is_array($border['all'])
                ? static::normalize_border_side($border['all'])
                : static::empty_border_side();

            return array(
                'type' => 'all',
                'all'  => $all,
            );
        }

        $out = array( 'type' => 'custom' );

        foreach (array( 'top', 'right', 'bottom', 'left' ) as $edge) {
            if (isset($border[ $edge ]) && is_array($border[ $edge ])) {
                $out[ $edge ] = static::normalize_border_side($border[ $edge ]);
            }
        }

        return $out;
    }

    /**
     * @return array{width: string, style: string, color: string|array}
     */
    protected static function empty_border_side(): array {
        return array(
            'width' => '',
            'style' => '',
            'color' => '',
        );
    }

    /**
     * @return array{type: string, all: array, ...}
     */
    protected static function get_default_box_border_value(): array {
        return array(
            'type' => 'all',
            'all'  => static::empty_border_side(),
        );
    }

    /**
     * @param array $side Raw side object.
     * @return array{width: string, style: string, color: string|array}
     */
    protected static function normalize_border_side( array $side ): array {
        $width  = isset($side['width']) && is_string($side['width']) ? $side['width'] : '';
        $style  = isset($side['style']) && is_string($side['style']) ? $side['style'] : '';
        $color  = $side['color'] ?? '';
        $colorN = is_string($color) || is_array($color) ? $color : '';

        return array(
            'width' => $width,
            'style' => $style,
            'color' => $colorN,
        );
    }

	/**
     * Given a tree, converts the internal representation of variables to the CSS representation.
     * It is recursive and modifies the input in-place.
     *
     * @since 6.3.0
     *
     * @param array $tree Input to process.
     * @return array The modified $tree.
     */
    private static function resolve_custom_css_format( $tree) {
        $prefix = 'var:';

        foreach ($tree as $key => $data) {
            if (is_string($data) && str_starts_with($data, $prefix)) {
                $tree[ $key ] = self::convert_custom_properties($data);
            } elseif (is_array($data)) {
                $tree[ $key ] = self::resolve_custom_css_format($data);
            }
        }

        return $tree;
    }

	/**
     * This is used to convert the internal representation of variables to the CSS representation.
     * For example, `var:preset|color|vivid-green-cyan` becomes `var(--wp--preset--color--vivid-green-cyan)`.
     *
     * @since 6.3.0
     *
     * @param string $value The variable such as var:preset|color|vivid-green-cyan to convert.
     * @return string The converted variable.
     */
    private static function convert_custom_properties( $value) {
        $prefix     = 'var:';
        $prefix_len = strlen($prefix);
        $token_in   = '|';
        $token_out  = '--';
        if (str_starts_with($value, $prefix)) {
            $unwrapped_name = str_replace(
                $token_in,
                $token_out,
                substr($value, $prefix_len)
            );
            $value          = "var(--wp--$unwrapped_name)";
        }

        return $value;
    }

	/**
     * Gets the CSS rules for a particular block from theme.json.
     *
     * @since 6.1.0
     * @since 6.6.0 Setting a min-height of HTML when root styles have a background gradient or image.
     *              Updated general global styles specificity to 0-1-0.
     *              Fixed custom CSS output in block style variations.
     *
     * @param array $block_metadata Metadata about the block to get styles for.
     * @return string Styles for the block.
     */
    public function get_blockera_styles_for_block( $block_metadata) {
        $node        = _wp_array_get($this->theme_json, $block_metadata['path'], array());
		$block_rules = '';

		// 1. Generate css rules for the block root customization.
		if (isset($block_metadata['name'])) {
			$style_engine = Blockera::getInstance()->make(
				StyleEngine::class,
				[
					'block' => [
						'blockName' => $block_metadata['name'],
						'attrs' => array_diff_key($node, array_flip([ 'variations' ])),
					],
					'fallbackSelector' => $block_metadata['selector'],
					'isGlobalStyle' => true,
				]
			);
			$style_engine->setSupports(static::$supports);
			$block_rules .= $style_engine->getStylesheet();
		}

		// 2. Generate css rules for the block style variations.
        if (! empty($block_metadata['variations'])) {
            foreach ($block_metadata['variations'] as $key => $style_variation) {
				$style_variation_node           = _wp_array_get( $this->theme_json, $style_variation['path'], array() );
				$clean_style_variation_selector = trim( $style_variation['selector'] );

				$style_engine = Blockera::getInstance()->make(
					StyleEngine::class,
					[
						'block' => [
							'blockName' => $block_metadata['name'],
							'attrs' => $style_variation_node,
						],
						'fallbackSelector' => $clean_style_variation_selector,
						'isGlobalStyle' => true,
					]
				);
				$style_engine->setIsStyleVariation(true);
				$style_engine->setSupports(static::$supports);
				$block_rules .= $style_engine->getStylesheet();
            }
        }

        return $block_rules;
    }

	/**
     * Returns the stylesheet that results of processing
     * the theme.json structure this object represents.
     *
     * @since 5.8.0
     * @since 5.9.0 Removed the `$type` parameter, added the `$types` and `$origins` parameters.
     * @since 6.3.0 Add fallback layout styles for Post Template when block gap support isn't available.
     * @since 6.6.0 Added boolean `skip_root_layout_styles` and `include_block_style_variations` options
     *              to control styles output as desired.
     *
     * @param string[] $types   Types of styles to load. Will load all by default. It accepts:
     *                          - `variables`: only the CSS Custom Properties for presets & custom ones.
     *                          - `styles`: only the styles section in theme.json.
     *                          - `presets`: only the classes for the presets.
     *                          - `base-layout-styles`: only the base layout styles.
     *                          - `custom-css`: only the custom CSS.
     * @param string[] $origins A list of origins to include. By default it includes VALID_ORIGINS.
     * @param array    $options {
     *     Optional. An array of options for now used for internal purposes only (may change without notice).
     *
     *     @type string $scope                           Makes sure all style are scoped to a given selector
     *     @type string $root_selector                   Overwrites and forces a given selector to be used on the root node
     *     @type bool   $skip_root_layout_styles         Omits root layout styles from the generated stylesheet. Default false.
     *     @type bool   $include_block_style_variations  Includes styles for block style variations in the generated stylesheet. Default false.
     * }
     * @return string The resulting stylesheet.
     */
	public function get_stylesheet( $types = array( 'variables', 'styles', 'presets' ), $origins = null, $options = array() ) {
		if ( null === $origins ) {
			$origins = static::VALID_ORIGINS;
		}

		if ( is_string( $types ) ) {
			// Dispatch error and map old arguments to new ones.
			_deprecated_argument( __FUNCTION__, '5.9.0' );
			if ( 'block_styles' === $types ) {
				$types = array( 'styles', 'presets' );
			} elseif ( 'css_variables' === $types ) {
				$types = array( 'variables' );
			} else {
				$types = array( 'variables', 'styles', 'presets' );
			}
		}

		$blocks_metadata = static::get_blocks_metadata();
		$style_nodes     = static::get_style_nodes( $this->theme_json, $blocks_metadata, $options );
		$setting_nodes   = static::get_setting_nodes( $this->theme_json, $blocks_metadata );

		$root_style_key    = array_search( static::ROOT_BLOCK_SELECTOR, array_column( $style_nodes, 'selector' ), true );
		$root_settings_key = array_search( static::ROOT_BLOCK_SELECTOR, array_column( $setting_nodes, 'selector' ), true );

		if ( ! empty( $options['scope'] ) ) {
			foreach ( $setting_nodes as &$node ) {
				$node['selector'] = static::scope_selector( $options['scope'], $node['selector'] );
			}
			foreach ( $style_nodes as &$node ) {
				$node = static::scope_style_node_selectors( $options['scope'], $node );
			}
			unset( $node );
		}

		if ( ! empty( $options['root_selector'] ) ) {
			if ( false !== $root_settings_key ) {
				$setting_nodes[ $root_settings_key ]['selector'] = $options['root_selector'];
			}
			if ( false !== $root_style_key ) {
				$style_nodes[ $root_style_key ]['selector'] = $options['root_selector'];
			}
		}

		$stylesheet = '';

		if ( in_array( 'variables', $types, true ) ) {
			$stylesheet .= $this->get_css_variables( $setting_nodes, $origins );
		}

		if ( in_array( 'styles', $types, true ) ) {
			if ( false !== $root_style_key && empty( $options['skip_root_layout_styles'] ) ) {
				$stylesheet .= $this->get_root_layout_rules( $style_nodes[ $root_style_key ]['selector'], $style_nodes[ $root_style_key ] );
			}
			$stylesheet .= $this->get_block_classes( $style_nodes );
			$stylesheet .= $this->get_blockera_block_rules( $style_nodes );
		} elseif ( in_array( 'base-layout-styles', $types, true ) ) {
			$root_selector          = static::ROOT_BLOCK_SELECTOR;
			$columns_selector       = '.wp-block-columns';
			$post_template_selector = '.wp-block-post-template';
			if ( ! empty( $options['scope'] ) ) {
				$root_selector          = static::scope_selector( $options['scope'], $root_selector );
				$columns_selector       = static::scope_selector( $options['scope'], $columns_selector );
				$post_template_selector = static::scope_selector( $options['scope'], $post_template_selector );
			}
			if ( ! empty( $options['root_selector'] ) ) {
				$root_selector = $options['root_selector'];
			}

			/*
			 * Base layout styles are provided as part of `styles`, so only output separately if explicitly requested.
			 * For backwards compatibility, the Columns block is explicitly included, to support a different default gap value.
			 */
			$base_styles_nodes = array(
				array(
					'path'     => array( 'styles' ),
					'selector' => $root_selector,
				),
				array(
					'path'     => array( 'styles', 'blocks', 'core/columns' ),
					'selector' => $columns_selector,
					'name'     => 'core/columns',
				),
				array(
					'path'     => array( 'styles', 'blocks', 'core/post-template' ),
					'selector' => $post_template_selector,
					'name'     => 'core/post-template',
				),
			);

			foreach ( $base_styles_nodes as $base_style_node ) {
				$stylesheet .= $this->get_layout_styles( $base_style_node, $types );
			}
		}

		if ( in_array( 'presets', $types, true ) ) {
			$stylesheet .= $this->get_preset_classes( $setting_nodes, $origins );
		}

		// Load the custom CSS last so it has the highest specificity.
		if ( in_array( 'custom-css', $types, true ) ) {
			// Add the global styles root CSS.
			$stylesheet .= _wp_array_get( $this->theme_json, array( 'styles', 'css' ) );
		}

		return $stylesheet;
	}

	/**
	 * Converts each style section into a list of rulesets
	 * containing the block styles to be appended to the stylesheet.
	 *
	 * @param array $style_nodes Nodes with styles.
	 * 
	 * @return string The new stylesheet.
	 */
	protected function get_blockera_block_rules( $style_nodes ) {
		$block_rules = '';

		foreach ( $style_nodes as $metadata ) {
			if ( null === $metadata['selector'] ) {
				continue;
			}
			$block_rules .= static::get_blockera_styles_for_block( $metadata );
		}

		return $block_rules;
	}

	/**
	 * Given a styles array, it extracts the style properties
	 * and adds them to the $declarations array following the format:
	 *phpcs:disable
	 *     array(
	 *       'name'  => 'property_name',
	 *       'value' => 'property_value',
	 *     )
	 *
	 * @since 5.8.0
	 * @since 5.9.0 Added the `$settings` and `$properties` parameters.
	 * @since 6.1.0 Added `$theme_json`, `$selector`, and `$use_root_padding` parameters.
	 * @since 6.5.0 Output a `min-height: unset` rule when `aspect-ratio` is set.
	 * @since 6.6.0 Pass current theme JSON settings to blockera_get_typography_font_size_value(), and process background properties.
	 * @since 6.7.0 `ref` resolution of background properties, and assigning custom default values.
	 *phpcs:enable
	 * @param array   $styles Styles to process.
	 * @param array   $settings Theme settings.
	 * @param array   $properties Properties metadata.
	 * @param array   $theme_json Theme JSON array.
	 * @param string  $selector The style block selector.
	 * @param boolean $use_root_padding Whether to add custom properties at root level.
	 * @return array Returns the modified $declarations.
	 */
	protected static function compute_style_properties( $styles, $settings = array(), $properties = null, $theme_json = null, $selector = null, $use_root_padding = null ) {
		if ( empty( $styles ) ) {
			return array();
		}

		if ( null === $properties ) {
			$properties = static::PROPERTIES_METADATA;
		}
		$declarations             = array();
		$root_variable_duplicates = array();
		$root_style_length        = strlen( '--wp--style--root--' );

		foreach ( $properties as $css_property => $value_path ) {
			if ( ! is_array( $value_path ) ) {
				continue;
			}

			$is_root_style = str_starts_with( $css_property, '--wp--style--root--' );
			if ( $is_root_style && ( static::ROOT_BLOCK_SELECTOR !== $selector || ! $use_root_padding ) ) {
				continue;
			}

			$value = static::get_property_value( $styles, $value_path, $theme_json );

			/*
			 * Root-level padding styles don't currently support strings with CSS shorthand values.
			 * This may change: https://github.com/WordPress/gutenberg/issues/40132.
			 */
			if ( '--wp--style--root--padding' === $css_property && is_string( $value ) ) {
				continue;
			}

			if ( $is_root_style && $use_root_padding ) {
				$root_variable_duplicates[] = substr( $css_property, $root_style_length );
			}

			/*
			 * Processes background image styles.
			 * If the value is a URL, it will be converted to a CSS `url()` value.
			 * For uploaded image (images with a database ID), apply size and position defaults,
			 * equal to those applied in block supports in lib/background.php.
			 */
			if ( 'background-image' === $css_property && ! empty( $value ) ) {
				$background_styles = wp_style_engine_get_styles(
					array( 'background' => array( 'backgroundImage' => $value ) )
				);
				$value             = $background_styles['declarations'][ $css_property ];
			}
			if ( empty( $value ) && static::ROOT_BLOCK_SELECTOR !== $selector && ! empty( $styles['background']['backgroundImage']['id'] ) ) {
				if ( 'background-size' === $css_property ) {
					$value = 'cover';
				}
				// If the background size is set to `contain` and no position is set, set the position to `center`.
				if ( 'background-position' === $css_property ) {
					$background_size = $styles['background']['backgroundSize'] ?? null;
					$value           = 'contain' === $background_size ? '50% 50%' : null;
				}
			}

			// Skip if empty and not "0" or value represents array of longhand values.
			$has_missing_value = empty( $value ) && ! is_numeric( $value );
			if ( $has_missing_value || is_array( $value ) ) {
				continue;
			}

			/*
			 * Look up protected properties, keyed by value path.
			 * Skip protected properties that are explicitly set to `null`.
			 */
			$path_string = implode( '.', $value_path );
			if (
				isset( static::PROTECTED_PROPERTIES[ $path_string ] ) &&
				_wp_array_get( $settings, static::PROTECTED_PROPERTIES[ $path_string ], null ) === null
			) {
				continue;
			}

			// Calculates fluid typography rules where available.
			if ( 'font-size' === $css_property ) {
				/*
				 * blockera_get_typography_font_size_value() will check
				 * if fluid typography has been activated and also
				 * whether the incoming value can be converted to a fluid value.
				 * Values that already have a clamp() function will not pass the test,
				 * and therefore the original $value will be returned.
				 * Pass the current theme_json settings to override any global settings.
				 */
				$value = blockera_get_typography_font_size_value( array( 'size' => $value ), $settings );
			}

			if ( 'aspect-ratio' === $css_property ) {
				// For aspect ratio to work, other dimensions rules must be unset.
				// This ensures that a fixed height does not override the aspect ratio.
				$declarations[] = array(
					'name'  => 'min-height',
					'value' => 'unset',
				);
			}

			$declarations[] = array(
				'name'  => $css_property,
				'value' => $value,
			);
		}

		// If a variable value is added to the root, the corresponding property should be removed.
		foreach ( $root_variable_duplicates as $duplicate ) {
			$discard = array_search( $duplicate, array_column( $declarations, 'name' ), true );
			if ( is_numeric( $discard ) ) {
				array_splice( $declarations, $discard, 1 );
			}
		}

		return $declarations;
	}

	/**
	 * Add theme JSON variation to local theme directory.
	 *
	 * Creates a style variation file in the theme's styles directory.
	 *
	 * @param string $export_type The export type (not used, kept for compatibility).
	 * @param array  $theme       Theme data including name and slug.
	 * @param bool   $save_fonts  Whether to save font assets to theme.
	 * @return array|\WP_Error The variation data on success, WP_Error on failure.
	 */
	public static function add_theme_json_variation_to_local( $export_type, $theme, $save_fonts = false ) {
		$variation_path = get_stylesheet_directory() . DIRECTORY_SEPARATOR . 'styles' . DIRECTORY_SEPARATOR;

		if ( ! file_exists( $variation_path ) ) {
			wp_mkdir_p( $variation_path );
		}

		if ( file_exists( $variation_path . $theme['slug'] . '.json' ) ) {
			return new \WP_Error( 'variation_already_exists', __( 'Variation already exists.', 'blockera' ) );
		}

		// Get user data using JSONResolver.
		$user_data = JSONResolver::get_user_data();
		
		// Create a new JSON instance (use Blockera's JSON class).
		$theme_json = new JSON();
		
		// Merge user data.
		if ( $user_data instanceof JSON || $user_data instanceof \WP_Theme_JSON ) {
			$theme_json->merge( $user_data );
		}
		
		$variation          = $theme_json->get_data();
		$variation['title'] = $theme['name'];

		// Handle font saving if requested.
		if (
			$save_fonts &&
			isset( $variation['settings']['typography']['fontFamilies'] )
		) {
			$font_families = $variation['settings']['typography']['fontFamilies'];
			// Copy the font assets to the theme assets folder using CBT class.
			// (CBT-specific functionality, so we use their class).
			if ( class_exists( '\CBT_Theme_Fonts' ) ) {
				$copied_font_families = \CBT_Theme_Fonts::copy_font_assets_to_theme( $font_families );
				// Update the variation theme json with the font families with the new paths.
				$variation['settings']['typography']['fontFamilies'] = $copied_font_families;
			}
		}

		// Write the variation file using JSONResolver's stringify method.
		file_put_contents(
			$variation_path . $theme['slug'] . '.json',
			JSONResolver::stringify( $variation )
		);

		return $variation;
	}

	/**
	 * Add the theme JSON to the local theme directory.
	 *
	 * @param string $export_type The export type.
	 * 
	 * @return void
	 */
	public static function add_theme_json_to_local( $export_type ) {
		file_put_contents(
			get_stylesheet_directory() . '/theme.json',
			JSONResolver::export_theme_data( $export_type )
		);
	}
}
