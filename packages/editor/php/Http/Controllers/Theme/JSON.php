<?php

namespace Blockera\Editor\Http\Controllers\Theme;

use Blockera\Setup\Blockera;
use Blockera\Editor\StyleEngine;
use Blockera\SiteBuilder\StyleEngine as SiteBuilderStyleEngine;

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
            $schema_settings_blocks[ $block ]           = static::VALID_SETTINGS;
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
                $style_variation_names = array_intersect(
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
        $schema['settings']                               = static::VALID_SETTINGS;
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

        return $output;
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
    public function get_styles_for_block( $block_metadata) {
        $node                 = _wp_array_get($this->theme_json, $block_metadata['path'], array());
        $use_root_padding     = isset($this->theme_json['settings']['useRootPaddingAwareAlignments']) && true === $this->theme_json['settings']['useRootPaddingAwareAlignments'];
        $selector             = $block_metadata['selector'];
        $settings             = isset($this->theme_json['settings']) ? $this->theme_json['settings'] : array();
        $feature_declarations = static::get_feature_declarations_for_node($block_metadata, $node);
        $is_root_selector     = static::ROOT_BLOCK_SELECTOR === $selector;

        // If there are style variations, generate the declarations for them, including any feature selectors the block may have.
        $style_variation_declarations = array();
        $style_variation_custom_css   = array();
        if (! empty($block_metadata['variations'])) {
            foreach ($block_metadata['variations'] as $style_variation) {
                $style_variation_node           = _wp_array_get($this->theme_json, $style_variation['path'], array());
                $clean_style_variation_selector = trim($style_variation['selector']);

                // Generate any feature/subfeature style declarations for the current style variation.
                $variation_declarations = static::get_feature_declarations_for_node($block_metadata, $style_variation_node);

                // Combine selectors with style variation's selector and add to overall style variation declarations.
                foreach ($variation_declarations as $current_selector => $new_declarations) {
                    /*
                     * Clean up any whitespace between comma separated selectors.
                     * This prevents these spaces breaking compound selectors such as:
                     * - `.wp-block-list:not(.wp-block-list .wp-block-list)`
                     * - `.wp-block-image img, .wp-block-image.my-class img`
                     */
                    $clean_current_selector = preg_replace('/,\s+/', ',', $current_selector);
                    $shortened_selector     = str_replace($block_metadata['selector'], '', $clean_current_selector);

                    // Prepend the variation selector to the current selector.
                    $split_selectors    = explode(',', $shortened_selector);
                    $updated_selectors  = array_map(
                        static function ( $split_selector) use ( $clean_style_variation_selector) {
                            return $clean_style_variation_selector . $split_selector;
                        },
                        $split_selectors
                    );
                    $combined_selectors = implode(',', $updated_selectors);

                    // Add the new declarations to the overall results under the modified selector.
                    $style_variation_declarations[ $combined_selectors ] = $new_declarations;
                }

                // Compute declarations for remaining styles not covered by feature level selectors.
                $style_variation_declarations[ $style_variation['selector'] ] = static::compute_style_properties($style_variation_node, $settings, null, $this->theme_json);
                // Store custom CSS for the style variation.
                if (isset($style_variation_node['css'])) {
                    $style_variation_custom_css[ $style_variation['selector'] ] = $this->process_blocks_custom_css($style_variation_node['css'], $style_variation['selector']);
                }
            }
        }
        
		/*
         * Get a reference to element name from path.
         * $block_metadata['path'] = array( 'styles','elements','link' );
         * Make sure that $block_metadata['path'] describes an element node, like [ 'styles', 'element', 'link' ].
         * Skip non-element paths like just ['styles'].
         */
        $is_processing_element = in_array('elements', $block_metadata['path'], true);

        $current_element = $is_processing_element ? $block_metadata['path'][ count($block_metadata['path']) - 1 ] : null;

        $element_pseudo_allowed = array();

        if (isset(static::VALID_ELEMENT_PSEUDO_SELECTORS[ $current_element ])) {
            $element_pseudo_allowed = static::VALID_ELEMENT_PSEUDO_SELECTORS[ $current_element ];
        }

        /*
         * Check for allowed pseudo classes (e.g. ":hover") from the $selector ("a:hover").
         * This also resets the array keys.
         */
        $pseudo_matches = array_values(
            array_filter(
                $element_pseudo_allowed,
                static function ( $pseudo_selector) use ( $selector) {
                    /*
                     * Check if the pseudo selector is in the current selector,
                     * ensuring it is not followed by a dash (e.g., :focus should not match :focus-visible).
                     */
                    return preg_match('/' . preg_quote($pseudo_selector, '/') . '(?!-)/', $selector) === 1;
                }
            )
        );

        $pseudo_selector = isset($pseudo_matches[0]) ? $pseudo_matches[0] : null;

        /*
         * If the current selector is a pseudo selector that's defined in the allow list for the current
         * element then compute the style properties for it.
         * Otherwise just compute the styles for the default selector as normal.
         */
        if ($pseudo_selector && isset($node[ $pseudo_selector ]) &&
            isset(static::VALID_ELEMENT_PSEUDO_SELECTORS[ $current_element ])
            && in_array($pseudo_selector, static::VALID_ELEMENT_PSEUDO_SELECTORS[ $current_element ], true)
        ) {
            $declarations = static::compute_style_properties($node[ $pseudo_selector ], $settings, null, $this->theme_json, $selector, $use_root_padding);
        } else {
			$style_engine = Blockera::getInstance()->make(
				class_exists(SiteBuilderStyleEngine::class) ? SiteBuilderStyleEngine::class : StyleEngine::class,
				[
					'block' => [
						'blockName' => $block_metadata['name'],
						'attrs' => $node,
					],
					'fallbackSelector' => $selector,
				]
			);
			$style_engine->setSupports(static::$supports);
			$computed_css_rules = $style_engine->getStylesheet();

            $declarations = static::compute_style_properties($node, $settings, null, $this->theme_json, $selector, $use_root_padding);
        }

        $block_rules = '';

		/**
		 * If the Blockera style engine is used, add the computed CSS rules to the block rules.
		 */
		if (isset($computed_css_rules)) {
			$block_rules .= $computed_css_rules;
		}

        /*
         * 1. Bespoke declaration modifiers:
         * - 'filter': Separate the declarations that use the general selector
         * from the ones using the duotone selector.
         * - 'background|background-image': set the html min-height to 100%
         * to ensure the background covers the entire viewport.
         */
        $declarations_duotone       = array();
        $should_set_root_min_height = false;

        foreach ($declarations as $index => $declaration) {
            if ('filter' === $declaration['name']) {
                /*
                 * 'unset' filters happen when a filter is unset
                 * in the site-editor UI. Because the 'unset' value
                 * in the user origin overrides the value in the
                 * theme origin, we can skip rendering anything
                 * here as no filter needs to be applied anymore.
                 * So only add declarations to with values other
                 * than 'unset'.
                 */
                if ('unset' !== $declaration['value']) {
                    $declarations_duotone[] = $declaration;
                }
                unset($declarations[ $index ]);
            }

            if ($is_root_selector && ( 'background-image' === $declaration['name'] || 'background' === $declaration['name'] )) {
                $should_set_root_min_height = true;
            }
        }

        /*
         * If root styles has a background-image or a background (gradient) set,
         * set the min-height to '100%'. Minus `--wp-admin--admin-bar--height` for logged-in view.
         * Setting the CSS rule on the HTML tag ensures background gradients and images behave similarly,
         * and matches the behavior of the site editor.
         */
        if ($should_set_root_min_height) {
            $block_rules .= static::to_ruleset(
                'html',
                array(
                    array(
                        'name'  => 'min-height',
                        'value' => 'calc(100% - var(--wp-admin--admin-bar--height, 0px))',
                    ),
                )
            );
        }

        // Update declarations if there are separators with only background color defined.
        if ('.wp-block-separator' === $selector) {
            $declarations = static::update_separator_declarations($declarations);
        }

        /*
         * Root selector (body) styles should not be wrapped in `:root where()` to keep
         * specificity at (0,0,1) and maintain backwards compatibility.
         *
         * Top-level element styles using element-only specificity selectors should
         * not get wrapped in `:root :where()` to maintain backwards compatibility.
         *
         * Pseudo classes, e.g. :hover, :focus etc., are a class-level selector so
         * still need to be wrapped in `:root :where` to cap specificity for nested
         * variations etc. Pseudo selectors won't match the ELEMENTS selector exactly.
         */
        $element_only_selector = $is_root_selector || (
            $current_element &&
            isset(static::ELEMENTS[ $current_element ]) &&
            // buttons, captions etc. still need `:root :where()` as they are class based selectors.
            ! isset(static::__EXPERIMENTAL_ELEMENT_CLASS_NAMES[ $current_element ]) &&
            static::ELEMENTS[ $current_element ] === $selector
        );

        // 2. Generate and append the rules that use the general selector.
        $general_selector = $element_only_selector ? $selector : ":root :where($selector)";
        $block_rules     .= static::to_ruleset($general_selector, $declarations);

        // 3. Generate and append the rules that use the duotone selector.
        if (isset($block_metadata['duotone']) && ! empty($declarations_duotone)) {
            $block_rules .= static::to_ruleset($block_metadata['duotone'], $declarations_duotone);
        }

        // 4. Generate Layout block gap styles.
        if (
            ! $is_root_selector &&
            ! empty($block_metadata['name'])
        ) {
            $block_rules .= $this->get_layout_styles($block_metadata);
        }

        // 5. Generate and append the feature level rulesets.
        foreach ($feature_declarations as $feature_selector => $individual_feature_declarations) {
            $block_rules .= static::to_ruleset(":root :where($feature_selector)", $individual_feature_declarations);
        }

        // 6. Generate and append the style variation rulesets.
        foreach ($style_variation_declarations as $style_variation_selector => $individual_style_variation_declarations) {
            $block_rules .= static::to_ruleset(":root :where($style_variation_selector)", $individual_style_variation_declarations);
            if (isset($style_variation_custom_css[ $style_variation_selector ])) {
                $block_rules .= $style_variation_custom_css[ $style_variation_selector ];
            }
        }

        // 7. Generate and append any custom CSS rules.
        if (isset($node['css']) && ! $is_root_selector) {
            $block_rules .= $this->process_blocks_custom_css($node['css'], $selector);
        }

        return $block_rules;
    }

	/**
     * Returns a filtered declarations array if there is a separator block with only a background
     * style defined in theme.json by adding a color attribute to reflect the changes in the front.
     *
     * @since 6.1.1
     *
     * @param array $declarations List of declarations.
     * @return array $declarations List of declarations filtered.
     */
    private static function update_separator_declarations( $declarations) {
        $background_color     = '';
        $border_color_matches = false;
        $text_color_matches   = false;

        foreach ($declarations as $declaration) {
            if ('background-color' === $declaration['name'] && ! $background_color && isset($declaration['value'])) {
                $background_color = $declaration['value'];
            } elseif ('border-color' === $declaration['name']) {
                $border_color_matches = true;
            } elseif ('color' === $declaration['name']) {
                $text_color_matches = true;
            }

            if ($background_color && $border_color_matches && $text_color_matches) {
                break;
            }
        }

        if ($background_color && ! $border_color_matches && ! $text_color_matches) {
            $declarations[] = array(
                'name'  => 'color',
                'value' => $background_color,
            );
        }

        return $declarations;
    }
}
