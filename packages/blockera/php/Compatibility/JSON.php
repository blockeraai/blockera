<?php

namespace Blockera\Setup\Compatibility;

use Blockera\Setup\Blockera;
use Blockera\Editor\StyleEngine;

class JSON extends \WP_Theme_JSON {

	/**
	 * The prefix for block style variations.
	 *
	 * @var string
	 */
	private static string $style_variation_prefix = 'is-style-';

	/**
	 * Store features support list.
	 *
	 * @var array $supports Features support list.
	 */
	private static array $supports;

	/**
	 * Preset metadata: core (WP_Theme_JSON) plus paths aligned with packages/global-styles-ui (see theme-json-preset-data.ts).
	 * CSS values for Blockera-specific presets are resolved via {@see StyleEngine} callbacks, not in this class.
	 *
	 * @var array<int, array<string, mixed>>
	 */
	const PRESETS_METADATA = array(
		array(
			'path'              => array( 'dimensions', 'aspectRatios' ),
			'prevent_override'  => array( 'dimensions', 'defaultAspectRatios' ),
			'use_default_names' => false,
			'value_key'         => 'ratio',
			'css_vars'          => '--wp--preset--aspect-ratio--$slug',
			'classes'           => array(),
			'properties'        => array( 'aspect-ratio' ),
		),
		array(
			'path'              => array( 'color', 'palette' ),
			'prevent_override'  => array( 'color', 'defaultPalette' ),
			'use_default_names' => false,
			'value_key'         => 'color',
			'css_vars'          => '--wp--preset--color--$slug',
			'classes'           => array(
				'.has-$slug-color'            => 'color',
				'.has-$slug-background-color' => 'background-color',
				'.has-$slug-border-color'     => 'border-color',
			),
			'properties'        => array( 'color', 'background-color', 'border-color' ),
		),
		array(
			'path'              => array( 'color', 'gradients' ),
			'prevent_override'  => array( 'color', 'defaultGradients' ),
			'use_default_names' => false,
			'value_key'         => 'gradient',
			'css_vars'          => '--wp--preset--gradient--$slug',
			'classes'           => array( '.has-$slug-gradient-background' => 'background' ),
			'properties'        => array( 'background' ),
		),
		array(
			'path'              => array( 'color', 'duotone' ),
			'prevent_override'  => array( 'color', 'defaultDuotone' ),
			'use_default_names' => false,
			'value_func'        => null,
			'css_vars'          => null,
			'classes'           => array(),
			'properties'        => array( 'filter' ),
		),
		array(
			'path'              => array( 'typography', 'fontSizes' ),
			'prevent_override'  => array( 'typography', 'defaultFontSizes' ),
			'use_default_names' => true,
			'value_func'        => 'wp_get_typography_font_size_value',
			'css_vars'          => '--wp--preset--font-size--$slug',
			'classes'           => array( '.has-$slug-font-size' => 'font-size' ),
			'properties'        => array( 'font-size' ),
		),
		array(
			'path'              => array( 'typography', 'blockeraLineHeights' ),
			'prevent_override'  => array( 'typography', 'blockeraDefaultLineHeights' ),
			'use_default_names' => true,
			'value_key'         => 'size',
			'css_vars'          => '--wp--preset--line-height--$slug',
			'classes'           => array(),
			'properties'        => array( 'line-height' ),
		),
		array(
			'path'              => array( 'typography', 'fontFamilies' ),
			'prevent_override'  => false,
			'use_default_names' => false,
			'value_key'         => 'fontFamily',
			'css_vars'          => '--wp--preset--font-family--$slug',
			'classes'           => array( '.has-$slug-font-family' => 'font-family' ),
			'properties'        => array( 'font-family' ),
		),
		array(
			'path'              => array( 'spacing', 'spacingSizes' ),
			'prevent_override'  => array( 'spacing', 'defaultSpacingSizes' ),
			'use_default_names' => true,
			'value_key'         => 'size',
			'css_vars'          => '--wp--preset--spacing--$slug',
			'classes'           => array(),
			'properties'        => array( 'padding', 'margin' ),
		),
		array(
			'path'              => array( 'blockeraWidthSizes' ),
			'prevent_override'  => false,
			'use_default_names' => true,
			'value_key'         => 'size',
			'css_vars'          => '--wp--preset--width-size--$slug',
			'classes'           => array(),
			'properties'        => array( 'width', 'min-width', 'max-width', 'height', 'min-height', 'max-height' ),
		),
		array(
			'path'              => array( 'shadow', 'presets' ),
			'prevent_override'  => array( 'shadow', 'defaultPresets' ),
			'use_default_names' => false,
			'value_func'        => array( StyleEngine::class, 'shadowPresetValue' ),
			'css_vars'          => '--wp--preset--shadow--$slug',
			'classes'           => array(),
			'properties'        => array( 'box-shadow' ),
		),
		array(
			'path'              => array( 'border', 'radiusSizes' ),
			'prevent_override'  => false,
			'use_default_names' => false,
			'value_key'         => 'size',
			'css_vars'          => '--wp--preset--border-radius--$slug',
			'classes'           => array(),
			'properties'        => array( 'border-radius' ),
		),
		array(
			'path'              => array( 'blockeraDimensionSizes' ),
			'prevent_override'  => false,
			'use_default_names' => true,
			'value_key'         => 'size',
			'css_vars'          => '--wp--preset--dimension--$slug',
			'classes'           => array(),
			'properties'        => array( 'min-height' ),
		),
		array(
			'path'              => array( 'border', 'blockeraBorder', 'presets' ),
			'prevent_override'  => false,
			'use_default_names' => false,
			'value_func'        => array( StyleEngine::class, 'borderPresetValue' ),
			'css_vars'          => '--wp--preset--border--$slug',
			'classes'           => array(),
			'properties'        => array( 'border' ),
		),
		array(
			'path'              => array( 'blockeraTransition', 'presets' ),
			'prevent_override'  => false,
			'use_default_names' => false,
			'value_func'        => array( StyleEngine::class, 'transitionPresetValue' ),
			'css_vars'          => '--wp--preset--transition--$slug',
			'classes'           => array(),
			'properties'        => array( 'transition' ),
		),
		array(
			'path'              => array( 'blockeraTransform', 'presets' ),
			'prevent_override'  => false,
			'use_default_names' => false,
			'value_func'        => array( StyleEngine::class, 'transformPresetValue' ),
			'css_vars'          => '--wp--preset--transform--$slug',
			'classes'           => array(),
			'properties'        => array( 'transform' ),
		),
		array(
			'path'              => array( 'blockeraFilter', 'presets' ),
			'prevent_override'  => false,
			'use_default_names' => false,
			'value_func'        => array( StyleEngine::class, 'filterPresetValue' ),
			'css_vars'          => '--wp--preset--filter--$slug',
			'classes'           => array(),
			'properties'        => array( 'filter' ),
		),
		array(
			'path'              => array( 'blockeraTextShadow', 'presets' ),
			'prevent_override'  => false,
			'use_default_names' => false,
			'value_func'        => array( StyleEngine::class, 'textShadowPresetValue' ),
			'css_vars'          => '--wp--preset--text-shadow--$slug',
			'classes'           => array(),
			'properties'        => array( 'text-shadow' ),
		),
	);

	/**
	 * Set the prefix for block style variations.
	 *
	 * @param string $prefix The prefix for block style variations.
	 * @return void
	 */
	public static function set_style_variation_prefix( string $prefix ): void {
		self::$style_variation_prefix = $prefix;
	}

	/**
	 * Merged valid settings schema for sanitization (core + Blockera global-styles-ui preset groups).
	 *
	 * @return array<string, mixed>
	 */
	protected static function get_valid_settings_schema(): array {
		static $schema = null;
		if ( null !== $schema ) {
			return $schema;
		}
		$schema = array_replace_recursive(
			\WP_Theme_JSON::VALID_SETTINGS,
			BlockeraSettingsPaths::valid_settings_extension()
		);

		return $schema;
	}

	/**
	 * Constructor.
	 *
	 * @param array  $data The data to construct the JSON with.
	 * @param string $origin The origin of the data.
	 */
	public function __construct( array $data = array(), string $origin = 'theme', string $style_variation_prefix = 'is-style-') {
		self::$style_variation_prefix = $style_variation_prefix;

		parent::__construct($data, $origin);

		global $blockera_block_supports;

		$this->set_supports($blockera_block_supports);
	}

	/**
	 * Build an instance from already-processed theme.json raw data.
	 *
	 * Skips migrate / sanitize / preset-origin keying. Use only with data from
	 * {@see get_raw_data()} (or equivalent post-construct shape).
	 *
	 * Hot path: cloning merged trees and URI resolution without re-sanitizing.
	 *
	 * @param array $data Already-processed theme.json data.
	 * @return self
	 */
	public static function with_raw_data( array $data ): self {
		static $reflections = array();

		$class = static::class;
		if ( ! isset( $reflections[ $class ] ) ) {
			$reflections[ $class ] = new \ReflectionClass( $class );
		}

		$instance             = $reflections[ $class ]->newInstanceWithoutConstructor();
		$instance->theme_json = $data;

		global $blockera_block_supports;
		$instance->set_supports( is_array( $blockera_block_supports ?? null ) ? $blockera_block_supports : array() );

		return $instance;
	}

	/**
	 * Set features support list.
	 *
	 * @param array $supports Features support list.
	 * @return void
	 */
	public function set_supports( array $supports): void {
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
	protected static function sanitize( $input, $valid_block_names, $valid_element_names, $valid_variations ): array {
		if ( ! is_array( $input ) ) {
			return array();
		}

		// Flip once per class (VALID_TOP_LEVEL_KEYS is a constant).
		static $top_level_keys_flip_by_class = array();
		$class                               = static::class;
		if ( ! isset( $top_level_keys_flip_by_class[ $class ] ) ) {
			$top_level_keys_flip_by_class[ $class ] = array_flip( static::VALID_TOP_LEVEL_KEYS );
		}

		// Preserve only the top most level keys.
		$output = array_intersect_key( $input, $top_level_keys_flip_by_class[ $class ] );

		/*
		 * Remove any rules that are annotated as "top" in VALID_STYLES constant.
		 * Some styles are only meant to be available at the top-level (e.g.: blockGap),
		 * hence, the schema for blocks & elements should not have them.
		 *
		 * Cached per class: blockera_get_valid_supports(VALID_STYLES) + top-strip is stable.
		 */
		static $styles_non_top_by_class = array();
		if ( ! isset( $styles_non_top_by_class[ $class ] ) ) {
			$styles_non_top_level = blockera_get_valid_supports( static::VALID_STYLES );
			foreach ( $styles_non_top_level as $section => $props ) {
				if ( ! is_array( $props ) ) {
					continue;
				}
				foreach ( $props as $prop => $value ) {
					if ( 'top' === $value ) {
						unset( $styles_non_top_level[ $section ][ $prop ] );
					}
				}
			}
			$styles_non_top_by_class[ $class ] = $styles_non_top_level;
		}
		$styles_non_top_level = $styles_non_top_by_class[ $class ];

		/*
		 * Cache schema parts that depend only on valid block/element name lists
		 * (not on per-input variations). Variations are applied below per $input.
		 */
		static $schema_base_cache = array();
		$base_key                 = $class . "\0" . implode( "\0", $valid_block_names ) . "\0" . implode( "\0", $valid_element_names );

		if ( ! isset( $schema_base_cache[ $base_key ] ) ) {
			$schema_styles_elements = array();
			$pseudo_selectors       = static::VALID_ELEMENT_PSEUDO_SELECTORS;

			/*
			 * Set allowed element pseudo selectors based on per element allow list.
			 * Target data structure in schema:
			 * e.g.
			 * - top level elements: `$schema['styles']['elements']['link'][':hover']`.
			 * - block level elements: `$schema['styles']['blocks']['core/button']['elements']['link'][':hover']`.
			 */
			foreach ( $valid_element_names as $element ) {
				$schema_styles_elements[ $element ] = $styles_non_top_level;

				if ( isset( $pseudo_selectors[ $element ] ) ) {
					foreach ( $pseudo_selectors[ $element ] as $pseudo_selector ) {
						$schema_styles_elements[ $element ][ $pseudo_selector ] = $styles_non_top_level;
					}
				}
			}

			$schema_styles_blocks   = array();
			$schema_settings_blocks = array();
			$settings_schema        = static::get_valid_settings_schema();

			/*
			 * Generate a schema for blocks.
			 * - Block styles can contain `elements` & `variations` definitions.
			 * - Variations definitions cannot be nested.
			 * - Variations can contain styles for inner `blocks`.
			 * - Variation inner `blocks` styles can contain `elements`.
			 */
			foreach ( $valid_block_names as $block ) {
				$schema_settings_blocks[ $block ]             = $settings_schema;
				$schema_styles_blocks[ $block ]               = $styles_non_top_level;
				$schema_styles_blocks[ $block ]['elements']   = $schema_styles_elements;
				$schema_styles_blocks[ $block ]['variations'] = array();
			}

			$block_style_variation_styles             = $styles_non_top_level;
			$block_style_variation_styles['blocks']   = $schema_styles_blocks;
			$block_style_variation_styles['elements'] = $schema_styles_elements;

			$schema_base_cache[ $base_key ] = array(
				'schema_styles_elements'         => $schema_styles_elements,
				'schema_styles_blocks'           => $schema_styles_blocks,
				'schema_settings_blocks'         => $schema_settings_blocks,
				'block_style_variation_styles'   => $block_style_variation_styles,
				'settings_schema'                => $settings_schema,
				'font_families_schema'           => static::schema_in_root_and_per_origin( static::FONT_FAMILY_SCHEMA ),
			);
		}

		$base                         = $schema_base_cache[ $base_key ];
		$schema_styles_elements       = $base['schema_styles_elements'];
		$schema_settings_blocks       = $base['schema_settings_blocks'];
		$block_style_variation_styles = $base['block_style_variation_styles'];
		// COW copy: per-input variation writes must not mutate the cached base.
		// Cached base already has empty variations[]; only overwrite blocks that need them.
		$schema_styles_blocks = $base['schema_styles_blocks'];

		$input_blocks = ( isset( $input['styles']['blocks'] ) && is_array( $input['styles']['blocks'] ) )
			? $input['styles']['blocks']
			: null;

		if ( null !== $input_blocks ) {
			foreach ( $valid_block_names as $block ) {
				if (
					empty( $input_blocks[ $block ]['variations'] ) ||
					! is_array( $input_blocks[ $block ]['variations'] ) ||
					! isset( $valid_variations[ $block ] )
				) {
					continue;
				}

				/*
				 * Important tips:
				 * 1. WP_Theme_JSON class used of array_intersect to validate variations based on available items from static config.
				 * 2. Blockera\Setup\Compatibility\JSON class which override step 1 functionality to support of dynamic items which provided from user config in editor.
				 */
				$style_variation_names = array_keys( $input_blocks[ $block ]['variations'] );
				foreach ( $valid_variations[ $block ] as $variation_name ) {
					$style_variation_names[] = $variation_name;
				}

				$schema_styles_blocks[ $block ]['variations'] = array_fill_keys(
					$style_variation_names,
					$block_style_variation_styles
				);
			}
		}

		$schema                       = array();
		$schema['styles']             = $styles_non_top_level;
		$schema['styles']['blocks']   = $schema_styles_blocks;
		$schema['styles']['elements'] = $schema_styles_elements;
		$schema['settings']           = $base['settings_schema'];
		$schema['settings']['blocks'] = $schema_settings_blocks;
		$schema['settings']['typography']['fontFamilies'] = $base['font_families_schema'];

		// Remove anything that's not present in the schema.
		foreach ( array( 'styles', 'settings' ) as $subtree ) {
			if ( ! isset( $input[ $subtree ] ) ) {
				continue;
			}

			if ( ! is_array( $input[ $subtree ] ) ) {
				unset( $output[ $subtree ] );
				continue;
			}

			$result = static::remove_keys_not_in_schema( $input[ $subtree ], $schema[ $subtree ] );

			if ( empty( $result ) ) {
				unset( $output[ $subtree ] );
			} else {
				$output[ $subtree ] = static::resolve_custom_css_format( $result );
			}
		}

		return $output;
	}

	/**
	 * Given a tree, converts the internal representation of variables to the CSS representation.
	 * Modifies the local tree copy in-place and returns it (same contract as WP_Theme_JSON).
	 *
	 * Hot path (sanitize → styles/settings): large nested theme.json trees.
	 * Optimizations vs core-style recursive walk:
	 * - Early return for empty trees.
	 * - Iterative BFS stack-of-refs (zero recursive PHP calls; Xdebug showed ~23k self-calls).
	 * - Skip empty nested arrays (no stack push; foreach would be a no-op).
	 * - Inline convert_custom_properties (no per-leaf helper + no duplicate prefix check).
	 * - Request-level static cache for repeated var: tokens across the tree / sanitize passes.
	 * - C-level `str_starts_with( $data, 'var:' )` prefix detect.
	 *
	 * @since 6.3.0
	 *
	 * @param array $tree Input to process.
	 * @return array The modified $tree.
	 */
	private static function resolve_custom_css_format( $tree ) {
		if ( ! $tree ) {
			return $tree;
		}

		static $cache = array();

		$stack    = array();
		$stack[0] = &$tree;

		// Grow-only stack: each nested array is queued once; mutate leaves via foreach-by-ref.
		// $n tracks stack size so we avoid count() on every iteration.
		for ( $i = 0, $n = 1; $i < $n; ++$i ) {
			foreach ( $stack[ $i ] as &$data ) {
				if ( is_array( $data ) ) {
					// Empty arrays need no walk (equivalent to foreach no-op).
					if ( $data ) {
						$stack[ $n++ ] = &$data;
					}
				} elseif ( is_string( $data ) && str_starts_with( $data, 'var:' ) ) {
					$data = $cache[ $data ] ??= 'var(--wp--' . str_replace( '|', '--', substr( $data, 4 ) ) . ')';
				}
			}
			unset( $data );
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
	private static function convert_custom_properties( $value ) {
		// Align with resolve_custom_css_format hot path (C-level prefix + single replace).
		if ( str_starts_with( $value, 'var:' ) ) {
			return 'var(--wp--' . str_replace( '|', '--', substr( $value, 4 ) ) . ')';
		}

		return $value;
	}

	/**
	 * Build a StyleEngine for global-styles CSS without Application::make()/resolve().
	 *
	 * Hot path during blockera_add_global_styles_for_blocks (dozens of engines per request).
	 *
	 * @param array  $block              Block payload with blockName + attrs.
	 * @param string $fallback_selector  CSS selector.
	 * @param array  $supports           Feature supports list.
	 * @param bool   $is_style_variation Whether this engine targets a style variation.
	 * @return StyleEngine
	 */
	private static function make_global_style_engine(
		array $block,
		string $fallback_selector,
		array $supports,
		bool $is_style_variation = false
	): StyleEngine {
		static $app         = null;
		static $breakpoint  = null;
		static $breakpoints = null;

		if ( null === $app ) {
			$app         = Blockera::getInstance();
			$breakpoint  = blockera_core_config( 'breakpoints.base' );
			$breakpoints = $app->getEntity( 'breakpoints' );
		}

		$style_engine = new StyleEngine( $block, $fallback_selector, true );
		$style_engine->setApp( $app );
		$style_engine->setBreakpoint( $breakpoint );
		$style_engine->setBreakpoints( $breakpoints );
		$style_engine->setSupports( $supports );

		if ( $is_style_variation ) {
			$style_engine->setIsStyleVariation( true );
		}

		return $style_engine;
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
	public function get_blockera_styles_for_block( $block_metadata ) {
		$node        = _wp_array_get( $this->theme_json, $block_metadata['path'], array() );
		$block_rules = '';
		$block_name  = $block_metadata['name'] ?? null;
		$supports    = static::$supports;

		// Hoist metadata key sets once (C-level array_flip; reused for root + variations).
		static $root_exclude_keys = null;
		if ( null === $root_exclude_keys ) {
			$root_exclude_keys = array_fill_keys(
				array_merge( array( 'variations' ), \blockera_get_block_styles_metadata_keys() ),
				true
			);
		}
		static $variation_exclude_keys = null;
		if ( null === $variation_exclude_keys ) {
			$variation_exclude_keys = array_fill_keys(
				\blockera_get_block_style_variation_metadata_style_keys(),
				true
			);
		}

		// 1. Generate css rules for the block root customization.
		if ( null !== $block_name ) {
			$attrs = array();
			foreach ( $node as $key => $value ) {
				if ( ! isset( $root_exclude_keys[ $key ] ) ) {
					$attrs[ $key ] = $value;
				}
			}

			$style_engine = self::make_global_style_engine(
				array(
					'blockName' => $block_name,
					'attrs'     => $attrs,
				),
				$block_metadata['selector'],
				$supports
			);
			$block_rules .= $style_engine->getStylesheet();
		}

		// 2. Generate css rules for the block style variations.
		if ( ! empty( $block_metadata['variations'] ) ) {
			foreach ( $block_metadata['variations'] as $style_variation ) {
				$style_variation_node = _wp_array_get( $this->theme_json, $style_variation['path'], array() );

				$variation_attrs = array();
				foreach ( $style_variation_node as $key => $value ) {
					if ( ! isset( $variation_exclude_keys[ $key ] ) ) {
						$variation_attrs[ $key ] = $value;
					}
				}

				$style_engine = self::make_global_style_engine(
					array(
						'blockName' => $block_name,
						'attrs'     => $variation_attrs,
					),
					trim( $style_variation['selector'] ),
					$supports,
					true
				);
				$block_rules .= $style_engine->getStylesheet();
			}
		}

		return $block_rules;
	}

	/**
	 * Generates a selector for a block style variation.
	 *
	 * @since 6.5.0
	 *
	 * @param string $variation_name Name of the block style variation.
	 * @param string $block_selector CSS selector for the block.
	 * @return string Block selector with block style variation selector added to it.
	 */
	protected static function get_block_style_variation_selector( $variation_name, $block_selector ) {
		$variation_class = '.' . self::$style_variation_prefix . $variation_name;

		if ( ! $block_selector ) {
			return $variation_class;
		}

		static $pattern = '/((?::\([^)]+\))?\s*)([^\s:]+)/';

		$append = static function ( array $matches ) use ( $variation_class ): string {
			return $matches[1] . $matches[2] . $variation_class;
		};

		// Fast path: single selector (no comma) — one preg, no explode/implode.
		if ( false === strpos( $block_selector, ',' ) ) {
			return preg_replace_callback( $pattern, $append, $block_selector, 1 );
		}

		$selector_parts = explode( ',', $block_selector );
		$result         = array();
		foreach ( $selector_parts as $part ) {
			$result[] = preg_replace_callback( $pattern, $append, $part, 1 );
		}

		return implode( ',', $result );
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

		// O(1) type membership vs repeated in_array scans.
		$types_set = array_fill_keys( $types, true );

		$blocks_metadata = static::get_blocks_metadata();
		$style_nodes     = static::get_style_nodes( $this->theme_json, $blocks_metadata, $options );
		$setting_nodes   = static::get_setting_nodes( $this->theme_json, $blocks_metadata );

		$root_selector_const = static::ROOT_BLOCK_SELECTOR;
		$root_style_key      = false;
		foreach ( $style_nodes as $i => $node ) {
			if ( isset( $node['selector'] ) && $root_selector_const === $node['selector'] ) {
				$root_style_key = $i;
				break;
			}
		}
		$root_settings_key = false;
		foreach ( $setting_nodes as $i => $node ) {
			if ( isset( $node['selector'] ) && $root_selector_const === $node['selector'] ) {
				$root_settings_key = $i;
				break;
			}
		}

		$scope = $options['scope'] ?? null;
		if ( ! empty( $scope ) ) {
			foreach ( $setting_nodes as &$node ) {
				$node['selector'] = static::scope_selector( $scope, $node['selector'] );
			}
			foreach ( $style_nodes as &$node ) {
				$node = static::scope_style_node_selectors( $scope, $node );
			}
			unset( $node );
		}

		$root_selector_opt = $options['root_selector'] ?? null;
		if ( ! empty( $root_selector_opt ) ) {
			if ( false !== $root_settings_key ) {
				$setting_nodes[ $root_settings_key ]['selector'] = $root_selector_opt;
			}
			if ( false !== $root_style_key ) {
				$style_nodes[ $root_style_key ]['selector'] = $root_selector_opt;
			}
		}

		$stylesheet = '';

		if ( isset( $types_set['variables'] ) ) {
			$stylesheet .= $this->get_css_variables( $setting_nodes, $origins );
		}

		if ( isset( $types_set['styles'] ) ) {
			if ( false !== $root_style_key && empty( $options['skip_root_layout_styles'] ) ) {
				$stylesheet .= $this->get_root_layout_rules( $style_nodes[ $root_style_key ]['selector'], $style_nodes[ $root_style_key ] );
			}
			$stylesheet .= $this->get_block_classes( $style_nodes );
			$stylesheet .= $this->get_blockera_block_rules( $style_nodes );
		} elseif ( isset( $types_set['base-layout-styles'] ) ) {
			$root_selector          = $root_selector_const;
			$columns_selector       = '.wp-block-columns';
			$post_template_selector = '.wp-block-post-template';
			if ( ! empty( $scope ) ) {
				$root_selector          = static::scope_selector( $scope, $root_selector );
				$columns_selector       = static::scope_selector( $scope, $columns_selector );
				$post_template_selector = static::scope_selector( $scope, $post_template_selector );
			}
			if ( ! empty( $root_selector_opt ) ) {
				$root_selector = $root_selector_opt;
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

		if ( isset( $types_set['presets'] ) ) {
			$stylesheet .= $this->get_preset_classes( $setting_nodes, $origins );
		}

		// Load the custom CSS last so it has the highest specificity.
		if ( isset( $types_set['custom-css'] ) ) {
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
		$parts = array();

		foreach ( $style_nodes as $metadata ) {
			if ( null === $metadata['selector'] ) {
				continue;
			}
			$parts[] = $this->get_blockera_styles_for_block( $metadata );
		}

		return $parts ? implode( '', $parts ) : '';
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
		$is_root_selector         = ( static::ROOT_BLOCK_SELECTOR === $selector );
		$allow_root_styles        = ( $is_root_selector && $use_root_padding );
		// Length of '--wp--style--root--' (fixed; avoids strlen per call).
		$root_style_length    = 19;
		$apply_bg_defaults    = ( ! $is_root_selector && ! empty( $styles['background']['backgroundImage']['id'] ) );
		$bg_size_for_defaults = $apply_bg_defaults ? ( $styles['background']['backgroundSize'] ?? null ) : null;
		$protected            = static::PROTECTED_PROPERTIES;
		// Root keys that appear in PROTECTED_PROPERTIES (avoid implode on every property).
		static $protected_roots_by_class = array();
		$class                           = static::class;
		if ( ! isset( $protected_roots_by_class[ $class ] ) ) {
			$roots = array();
			foreach ( $protected as $protected_path ) {
				if ( isset( $protected_path[0] ) ) {
					$roots[ $protected_path[0] ] = true;
				}
			}
			$protected_roots_by_class[ $class ] = $roots;
		}
		$protected_roots = $protected_roots_by_class[ $class ];

		foreach ( $properties as $css_property => $value_path ) {
			if ( ! is_array( $value_path ) || ! isset( $value_path[0] ) ) {
				continue;
			}

			// Root custom props: strncmp is a C-level prefix compare (same as str_starts_with).
			$is_root_style = ( isset( $css_property[18] ) && 0 === strncmp( $css_property, '--wp--style--root--', 19 ) );
			if ( $is_root_style && ! $allow_root_styles ) {
				continue;
			}

			/*
			 * Hot path: skip when the top-level styles key is missing/null.
			 * Equivalent to get_property_value() → '' (empty values never emit; root-var
			 * discard of a never-emitted name is a no-op).
			 */
			$root_key = $value_path[0];
			if ( ! isset( $styles[ $root_key ] ) ) {
				continue;
			}

			/*
			 * Inline the common get_property_value() path (unrolled 1–3 segments) to avoid
			 * _wp_array_get() + static call overhead. Fall back for refs / deeper paths.
			 */
			$path_len = count( $value_path );
			if ( 2 === $path_len ) {
				$level0 = $styles[ $root_key ];
				$k1     = $value_path[1];
				if ( ! is_array( $level0 ) ) {
					$value = '';
				} elseif ( isset( $level0[ $k1 ] ) ) {
					$value = $level0[ $k1 ];
				} elseif ( array_key_exists( $k1, $level0 ) ) {
					$value = $level0[ $k1 ];
				} else {
					$value = '';
				}
			} elseif ( 3 === $path_len ) {
				$level0 = $styles[ $root_key ];
				$k1     = $value_path[1];
				if ( ! is_array( $level0 ) || ( ! isset( $level0[ $k1 ] ) && ! array_key_exists( $k1, $level0 ) ) ) {
					$value = '';
				} else {
					$level1 = $level0[ $k1 ];
					$k2     = $value_path[2];
					if ( ! is_array( $level1 ) ) {
						$value = '';
					} elseif ( isset( $level1[ $k2 ] ) ) {
						$value = $level1[ $k2 ];
					} elseif ( array_key_exists( $k2, $level1 ) ) {
						$value = $level1[ $k2 ];
					} else {
						$value = '';
					}
				}
			} elseif ( 1 === $path_len ) {
				$value = $styles[ $root_key ];
			} else {
				$value = static::get_property_value( $styles, $value_path, $theme_json );
			}

			if ( 1 === $path_len || 2 === $path_len || 3 === $path_len ) {
				if ( '' === $value || null === $value ) {
					$value = '';
				} elseif ( is_array( $value ) && isset( $value['ref'] ) ) {
					// Ref resolution stays in get_property_value() (rare path).
					$value = static::get_property_value( $styles, $value_path, $theme_json );
				}
			}

			/*
			 * Root-level padding styles don't currently support strings with CSS shorthand values.
			 * This may change: https://github.com/WordPress/gutenberg/issues/40132.
			 */
			if ( '--wp--style--root--padding' === $css_property && is_string( $value ) ) {
				continue;
			}

			// After the early continue, $is_root_style implies $use_root_padding is truthy.
			if ( $is_root_style ) {
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

			if ( empty( $value ) && $apply_bg_defaults ) {
				if ( 'background-size' === $css_property ) {
					$value = 'cover';
				} elseif ( 'background-position' === $css_property ) {
					// If the background size is set to `contain` and no position is set, set the position to `center`.
					$value = 'contain' === $bg_size_for_defaults ? '50% 50%' : null;
				}
			}

			// Skip if empty and not "0" or value represents array of longhand values.
			if ( ( empty( $value ) && ! is_numeric( $value ) ) || is_array( $value ) ) {
				continue;
			}

			/*
			 * Look up protected properties, keyed by value path.
			 * Skip protected properties that are explicitly set to `null`.
			 * Only implode when the path root can match PROTECTED_PROPERTIES.
			 */
			if ( isset( $protected_roots[ $root_key ] ) ) {
				$path_string = implode( '.', $value_path );
				if (
					isset( $protected[ $path_string ] ) &&
					_wp_array_get( $settings, $protected[ $path_string ], null ) === null
				) {
					continue;
				}
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
		// Single pass: remove only the first match per duplicate (same as array_search + splice).
		if ( $root_variable_duplicates ) {
			$discard_set = array_fill_keys( $root_variable_duplicates, true );
			$filtered    = array();
			foreach ( $declarations as $declaration ) {
				$name = $declaration['name'];
				if ( isset( $discard_set[ $name ] ) ) {
					unset( $discard_set[ $name ] );
					continue;
				}
				$filtered[] = $declaration;
			}

			return $filtered;
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
