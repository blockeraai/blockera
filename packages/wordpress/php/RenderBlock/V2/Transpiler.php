<?php

namespace Blockera\WordPress\RenderBlock\V2;

use Blockera\Data\Cache\Cache;
use Blockera\Editor\StyleEngine;
use Blockera\Bootstrap\Application;

class Transpiler {

    /**
     * Hold the Application class instance.
     *
     * @var Application $app
     */
    protected Application $app;

    /**
     * Store styles.
     *
     * @var array
     */
    protected array $styles = [];

    /**
     * Store parsed blocks.
     *
     * @var array
     */
    protected array $parsed_blocks = [];
	
	/**
	 * Store current block.
	 *
	 * @var array
	 */
	protected array $current_block = [];

	/**
	 * Store allowed inner block flag.
	 *
	 * @var boolean
	 */
	protected bool $is_allowed_inner = false;
	
    /**
     * Cache instance.
     *
     * @var Cache
     */
    protected Cache $cache;

    /**
     * Style engine instance.
     *
     * @var StyleEngine|SiteBuilderStyleEngine
     */
    protected $style_engine;

	/**
	 * Global css props classes.
	 *
	 * @var array
	 */
	protected array $global_css_props_classes = [];

    /**
     * The Parser class constructor.
     *
     * @param Application $app The application container object.
     * @param Cache       $cache The cache instance.
     */
    public function __construct( Application $app, Cache $cache) {
        $this->app   = $app;
        $this->cache = $cache;
    }

	/**
	 * Set the global css props classes.
	 *
	 * @param array $global_css_props_classes The global css props classes.
	 *
	 * @return void
	 */
	public function setGlobalCssPropsClasses( array $global_css_props_classes): void {
		$this->global_css_props_classes = $global_css_props_classes;
	}

    /**
     * Clean up inline styles from parsed blocks and convert them to CSS classes.
     *
     * @param string $content The content of the post.
     * @param int    $post_id The post id. default is 0 to indicate that the post id is not available.
	 * @param array  $supports The supports.
     *
     * @return array{
     *   parsed_blocks: array,
     *   generated_css_styles: array,
     *   serialized_blocks: string
     * } The array with parsed blocks, generated CSS styles and serialized blocks.
     */
    public function cleanupInlineStyles( string $content, int $post_id = 0, array $supports = []): array {

        $this->parsed_blocks = parse_blocks($content);
		
		$data = [ 
			'parsed_blocks'        => [],
			'serialized_blocks'    => '',
			'generated_css_styles' => [],
		];

        // Early return if no blocks.
        if (empty($this->parsed_blocks)) {
            return $data;
        }

        $this->processBlocksInBatches($supports);

		if (empty($this->styles)) {
			return $data;
		}

        // FIXME: we should not filter out empty blocks before serializing, because this is not the valid way to serialize blocks and maybe missed some blocks.
        // Filter out empty blocks before serializing.
        $filtered_blocks = array_filter(
            $this->parsed_blocks,
            function ( $block) {
                return ! empty($block['blockName']);
            }
        );

        $serialized_blocks = serialize_blocks($filtered_blocks);

        $data = [
            'hash' => md5($content),
            'parsed_blocks' => $this->parsed_blocks,
            'serialized_blocks' => $serialized_blocks,
            'generated_css_styles' => array_unique($this->styles),
        ];

        // Cache the results.
        $this->cache->setCache($post_id, 'post_content', $data);

		$this->reset();

        return $data;
    }

    /**
     * Process blocks in batches to optimize memory usage.
	 * 
	 * @param array $supports The supports.
     *
     * @return void
     */
    protected function processBlocksInBatches( array $supports): void {

		for ($i = 0; $i < count($this->parsed_blocks); $i++) {

			$this->current_block = $this->parsed_blocks[ $i ];

			$this->processBlockContent($i, $this->parsed_blocks[ $i ], compact('supports'));
		}
    }

    /**
     * Process inner blocks content.
     *
     * @param array $blocks The blocks to process.
     * @param int   $key   The block key.
     * @param array $args  The arguments.
     *
     * @return void
     */
    protected function processInnerBlocks( array $blocks, int $key, array $args = []): void {
        // Process inner blocks content.
        if (empty($blocks)) {
            return;
        }
		
		foreach ($blocks as $inner_key => $inner_block) {
			$attributes     = $inner_block['attrs'];
			$has_attributes = (bool) ( $attributes['blockeraPropsId'] ?? '' );

			$content = implode('', $inner_block['innerContent']);

			// Process inner block content.
			$this->processBlockContent(
				$inner_key,
				$inner_block,
				[
					'block_path' => array_merge(
						$args['block_path'] ?? [],
						[
							[
								'id' => $key,
							],
						]
                    ),
					'is_inner' => true,
					'supports' => $args['supports'],
					'force_process' => ( empty($attributes) && str_contains($content, 'style="') ) || $has_attributes,
				]
			);
		}
    }

    /**
     * Check if a block is valid for processing.
     *
     * @param array $block The block to validate.
     *
     * @return bool true if block is valid, false otherwise.
     */
    protected function isValidBlock( array $block): bool {
        return ! empty($block) && ! empty($block['attrs']) && ! empty($block['innerContent']) && ! empty($block['blockName']) && ! blockera_is_icon_block($block);
    }

    /**
     * Process the content of a single block.
     *
     * @param int   $key   Block index.
     * @param array $block Block data.
     * @param array $args Additional arguments.
     *
     * @return void
     */
    protected function processBlockContent( int $key, array $block, array $args = []): void {
        $attributes = $block['attrs'] ?? [];

        // Pre-calculate common values.
        $blockera_hash_id    = blockera_get_small_random_hash($attributes['blockeraPropsId'] ?? '');
        $blockera_class_name = sprintf('blockera-block blockera-block-%s', $blockera_hash_id);
        $unique_class_name   = blockera_get_normalized_selector($blockera_class_name);

		$is_inner      = ! empty($args['is_inner']);
		$invalid_inner = empty($args['force_process']);

		$is_allowed = $is_inner && ! $invalid_inner && in_array($block, $this->current_block['innerBlocks'], true);

		// Process only valid, supported, and not dynamic blocks or one of items in parent block inners list.
		if ($this->isValidBlock( $block ) && blockera_is_supported_block($block) || $is_allowed) {

			foreach ($block['innerContent'] as $_key => $innerContent) {
				if (empty($innerContent)) {
					continue;
				}

				if (! $invalid_inner && $is_inner) {
					$this->is_allowed_inner = true;
				}

				$this->cleanupProcess(
					$innerContent,
					$_key,
					[
						'block' => $block,
						'block_id' => $key,
						'supports' => $args['supports'],
						'block_path' => $args['block_path'] ?? [],
						'unique_class_name' => $unique_class_name,
						'blockera_class_name' => $blockera_class_name,
						'force-process' => $args['force-process'] ?? false,
						'permitted_inner' => ! $invalid_inner && $is_inner,
					]
				);
			}
		}

        // Process inner blocks recursively.
        $this->processInnerBlocks($block['innerBlocks'], $key, $args);
    }

    /**
     * Process content to cleanup inline styles.
     *
     * @param string $content HTML content to process.
     * @param int    $id      Content index.
     * @param array  $args    Additional arguments.
     * @return void
     */
    public function cleanupProcess( string $content, int $id, array $args = []): void {
        $processor = new \WP_HTML_Tag_Processor($content);

        // Inline styles stacks.
        $inline_styles       = [];
		$inline_declarations = [];
		$roo_selector        = blockera_get_normalized_selector($args['block']['attrs']['className'] ?? '');
		$selector            = $roo_selector ? $roo_selector : $args['unique_class_name'];

        // Process in a single pass.
        while ($processor->next_tag()) {
            $style = $processor->get_attribute('style');
            $class = $processor->get_attribute('class');

			// Skip if the class contains 'be-transpiled', because it shows that the block is already transpiled.
			if ($class && str_contains($class, 'be-transpiled') || ( ! $this->is_allowed_inner && ! $args['permitted_inner'] && $args['block'] !== $this->current_block )) {

				return;
			}

			// Update classname based on global css props classes.
			// Just for backward compatibility with WordPress original block output.
			if ($style) {
				foreach ($this->global_css_props_classes as $prop => $prop_class) {
					if (str_contains($style, $prop)) {
						$this->updateClassname($processor, $prop_class, $args['block']);
					}
				}
			}

			// Update classname based on blockera class name.
			// Add be-transpiled class to the block wrapper element.
			$this->updateClassname($processor, $class ? $class : $args['blockera_class_name'], $args['block']);

			if ($style) {
				$declarations = explode(';', $style);
				$root_class   = str_replace('.blockera-block.', '', $selector);

				if (! empty(trim($class ?? '')) && ! preg_match('/wp-(block|element|elements)/i', $class) && ! str_contains($class, $root_class)) {
					$inline_declarations[ $selector . ' .' . str_replace(' ', '.', $class) ] = $declarations;
				} else {
					$inline_declarations[ $selector ] = $declarations;
				}

				$processor->remove_attribute('style');
			}
        }

		foreach ($inline_declarations as $_selector => $declarations) {

			foreach ($declarations as $declaration) {
				if ($_selector === $selector) {
					$inline_styles[ $selector ][] = $declaration;
					continue;
				}

            	$inline_styles[ $selector ][ $_selector ][] = $declaration;            
        	}
		}

        // Generate styles once.
        $this->style_engine = $this->app->make(
            StyleEngine::class,
            [
                'block' => $args['block'],
                'fallbackSelector' => $selector,
            ]
        );
		$this->style_engine->setSupports($args['supports']);
        $this->style_engine->setInlineStyles($inline_styles);
        $computed_css_rules = $this->style_engine->getStylesheet();

		$filtered_styles = array_filter(
            $this->styles,
            function( string $style) use ( $computed_css_rules): bool {
				return str_contains($style, $computed_css_rules);
			}
        );

        if (! empty($computed_css_rules) && empty($filtered_styles)) {
			$this->styles[] = $computed_css_rules;

        } elseif (empty($computed_css_rules)) {

			$this->force_add_inline_styles($inline_styles);
		}

		$attributes = $args['block']['attrs'] ?? [];

		// If custom css is set, add it to the block css.
		if (! empty($attributes['blockeraCustomCSS']['value'])) {
			$this->styles[] = preg_replace([ '/(\.|#)block/i', '/&/i' ], $selector, $attributes['blockeraCustomCSS']['value']);
		}

        // Update block content.
        $this->updateBlockContent($processor, $id, $args);
    }

	/**
	 * Force add inline styles.
	 *
	 * @param array $inline_styles The inline styles.
	 *
	 * @return void
	 */
	protected function force_add_inline_styles( array $inline_styles): void {
		
		foreach ($inline_styles as $root_selector => $styles) {
			$inners = array_filter(
				$styles,
				function ( $style) {
					return is_array($style);
				}
			);

			foreach ($inners as $selector => $declarations) {
				$inner_style = $selector . ' { ' . implode(';' . PHP_EOL, $declarations) . ' }';

				if (! in_array($inner_style, $this->styles, true)) {
					$this->styles[] = $inner_style;
				}

				unset($styles[ $selector ]);
			}

			$root_style = $root_selector . ' { ' . implode(';' . PHP_EOL, $styles) . ' }';

			if (! in_array($root_style, $this->styles, true)) {
				$this->styles[] = $root_style;
			}
		}
	}

    /**
     * Update block content after processing.
     *
     * @param \WP_HTML_Tag_Processor $processor HTML processor instance.
     * @param int                    $id      Content index.
     * @param array                  $args    Additional arguments.
     *
     * @return void
     */
    protected function updateBlockContent( \WP_HTML_Tag_Processor $processor, int $id, array $args): void {
        $updated_html = $processor->get_updated_html();

        if (empty($args['block_path'])) {
			if (! defined('BLOCKERA_DEVELOPMENT') || ! BLOCKERA_DEVELOPMENT) {
				$this->parsed_blocks[ $args['block_id'] ]['attrs']['blockeraProcessed'] = true;
				$this->parsed_blocks[ $args['block_id'] ]['attrs']['blockeraPropsId']   = wp_generate_uuid4();
			}

            $this->parsed_blocks[ $args['block_id'] ]['innerContent'][ $id ] = $updated_html;

            return;
        }

        $current = &$this->parsed_blocks;
        foreach ($args['block_path'] as $path) {
            $current = &$current[ $path['id'] ]['innerBlocks'];
        }

        if (! defined('BLOCKERA_DEVELOPMENT') || ! BLOCKERA_DEVELOPMENT) {
			$current[ $args['block_id'] ]['attrs']['blockeraProcessed'] = true;
			$current[ $args['block_id'] ]['attrs']['blockeraPropsId']   = wp_generate_uuid4();
		}

        $current[ $args['block_id'] ]['innerContent'][ $id ] = $updated_html;
    }

    /**
     * Update classname for current tag.
     *
     * @param \WP_HTML_Tag_Processor $processor The HTML tag processor object.
     * @param string                 $classname The classname to update.
	 * @param array                  $block The block data.
     *
     * @return void
     */
    protected function updateClassname( \WP_HTML_Tag_Processor $processor, string $classname, array $block): void {
        $previous_class  = $processor->get_attribute('class');
        $regexp          = blockera_get_unique_class_name_regex();
		$final_classname = '';

        if (! empty($previous_class)) {

            if (preg_match($regexp, $classname, $matches) && ! preg_match($regexp, $previous_class)) {

                $final_classname = $classname . ' ' . $previous_class;
            } else {

				if (! preg_match($regexp, $classname) && ! str_contains($previous_class, $classname)) {

					$final_classname = $classname . ' ' . $previous_class;
				} else {
					
					$final_classname = $previous_class;
				}
			}
        }

		// Prevent double adding the be-transpiled class to block wrapper element.
		// It should has not icon element.
		if (! empty($final_classname) && ! str_contains($final_classname, 'be-transpiled') && ! blockera_block_has_icon($block)) {
			$final_classname .= ' be-transpiled';
		}

		if (! empty($final_classname)) {
			$processor->set_attribute('class', $final_classname);
		}
    }

    /**
     * Clean up resources and reset state.
     *
     * @return void
     */
    public function reset() {
        // Clear arrays.
        $this->styles        = [];
        $this->parsed_blocks = [];

        // Force garbage collection.
        gc_collect_cycles();
    }
}
