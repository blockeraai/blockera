<?php

namespace Blockera\Editor\Http\Controllers\Theme;

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
        $node        = _wp_array_get($this->theme_json, $block_metadata['path'], array());
        $selector    = $block_metadata['selector'];
		$block_rules = '';

		// 1. Generate css rules for the block style variations.
        if (! empty($block_metadata['variations'])) {
            foreach ($block_metadata['variations'] as $style_variation) {
                $style_variation_node           = _wp_array_get($this->theme_json, $style_variation['path'], array());
                $clean_style_variation_selector = trim($style_variation['selector']);

				$style_engine = Blockera::getInstance()->make(
					StyleEngine::class,
					[
						'block' => [
							'blockName' => $block_metadata['name'],
							'attrs' => $style_variation_node,
						],
						'fallbackSelector' => ":root :where($clean_style_variation_selector)",
						'isGlobalStyle' => true,
					]
				);
				$style_engine->setIsStyleVariation(true);
				$style_engine->setSupports(static::$supports);
				$block_rules .= $style_engine->getStylesheet();
            }
        }

		// 2. Generate css rules for the block root customization.
		if (isset($block_metadata['name'])) {
			$style_engine = Blockera::getInstance()->make(
				StyleEngine::class,
				[
					'block' => [
						'blockName' => $block_metadata['name'],
						'attrs' => array_diff_key($node, array_flip([ 'variations' ])),
					],
					'fallbackSelector' => $selector,
					'isGlobalStyle' => true,
				]
			);
			$style_engine->setSupports(static::$supports);
			$block_rules .= $style_engine->getStylesheet();
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

	/**
     * A public helper to get the block nodes from a theme.json file.
     *
     * @since 6.1.0
     *
     * @return array The block nodes in theme.json.
     */
    public function get_blockera_styles_block_nodes() {
        return static::get_blockera_block_nodes(
            $this->theme_json,
            [],
            [
				'include_block_style_variations' => true,
			]
		);
    }

	/**
     * An internal method to get the block nodes from a theme.json file.
     *
     * @since 6.1.0
     * @since 6.3.0 Refactored and stabilized selectors API.
     * @since 6.6.0 Added optional selectors and options for generating block nodes.
     * @since 6.7.0 Added $include_node_paths_only option.
     *
     * @param array $theme_json The theme.json converted to an array.
     * @param array $selectors  Optional list of selectors per block.
     * @param array $options {
     *     Optional. An array of options for now used for internal purposes only (may change without notice).
     *
     *     @type bool $include_block_style_variations Include nodes for block style variations. Default false.
     *     @type bool $include_node_paths_only        Return only block nodes node paths. Default false.
     * }
     * @return array The block nodes in theme.json.
     */
    private static function get_blockera_block_nodes( $theme_json, $selectors = array(), $options = array()) {
        $nodes = array();
        
        if (! isset($theme_json['styles']['blocks'])) {
            return $nodes;
        }

        $include_variations      = $options['include_block_style_variations'] ?? false;
        $include_node_paths_only = $options['include_node_paths_only'] ?? false;

        // If only node paths are to be returned, skip selector assignment.
        if (! $include_node_paths_only) {
            $selectors = empty($selectors) ? static::get_blocks_metadata() : $selectors;
        }

        foreach ($theme_json['styles']['blocks'] as $name => $node) {
            $node_path = array( 'styles', 'blocks', $name );

            if ($include_node_paths_only) {
                $variation_paths = array();
                if ($include_variations && isset($node['variations'])) {
                    foreach ($node['variations'] as $variation => $variation_node) {
                        $variation_paths[] = array(
                            'path' => array( 'styles', 'blocks', $name, 'variations', $variation ),
                        );
                    }
                }

                $node = array(
                    'path' => $node_path,
                );
                if (! empty($variation_paths)) {
                    $node['variations'] = $variation_paths;
                }
                $nodes[] = $node;
            } else {
                $selector = null;
                if (isset($selectors[ $name ]['selector'])) {
                    $selector = $selectors[ $name ]['selector'];
                }

                $duotone_selector = null;
                if (isset($selectors[ $name ]['duotone'])) {
                    $duotone_selector = $selectors[ $name ]['duotone'];
                }

                $feature_selectors = null;
                if (isset($selectors[ $name ]['selectors'])) {
                    $feature_selectors = $selectors[ $name ]['selectors'];
                }

                $variation_selectors = array();
                if ($include_variations && isset($node['variations'])) {
                    foreach ($node['variations'] as $variation => $node) {
                        $variation_selectors[] = array(
                            'path'     => array( 'styles', 'blocks', $name, 'variations', $variation ),
                            'selector' => $selectors[ $name ]['styleVariations'][ $variation ],
                        );
                    }
                }

                $nodes[] = array(
                    'name'       => $name,
                    'path'       => $node_path,
                    'selector'   => $selector,
                    'selectors'  => $feature_selectors,
                    'duotone'    => $duotone_selector,
                    'features'   => $feature_selectors,
                    'variations' => $variation_selectors,
                    'css'        => $selector,
                );
            }

            if (isset($theme_json['styles']['blocks'][ $name ]['elements'])) {
                foreach ($theme_json['styles']['blocks'][ $name ]['elements'] as $element => $node) {
                    $node_path = array( 'styles', 'blocks', $name, 'elements', $element );
                    if ($include_node_paths_only) {
                        $nodes[] = array(
                            'path' => $node_path,
                        );
                        continue;
                    }

                    $nodes[] = array(
                        'path'     => $node_path,
                        'selector' => $selectors[ $name ]['elements'][ $element ],
                    );

                    // Handle any pseudo selectors for the element.
                    if (isset(static::VALID_ELEMENT_PSEUDO_SELECTORS[ $element ])) {
                        foreach (static::VALID_ELEMENT_PSEUDO_SELECTORS[ $element ] as $pseudo_selector) {
                            if (isset($theme_json['styles']['blocks'][ $name ]['elements'][ $element ][ $pseudo_selector ])) {
                                $node_path = array( 'styles', 'blocks', $name, 'elements', $element );
                                if ($include_node_paths_only) {
                                    $nodes[] = array(
                                        'path' => $node_path,
                                    );
                                    continue;
                                }

                                $nodes[] = array(
                                    'path'     => $node_path,
                                    'selector' => static::append_to_selector($selectors[ $name ]['elements'][ $element ], $pseudo_selector),
                                );
                            }
                        }
                    }
                }
            }
        }

        return $nodes;
    }
}
