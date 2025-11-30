<?php

namespace Blockera\WordPress\RenderBlock\V2;

use Blockera\Data\Cache\Cache;
use Blockera\Editor\StyleEngine;
use Blockera\Bootstrap\Application;

class Transpiler {

	use \Blockera\WordPress\RenderBlock\Traits\Processor, \Blockera\WordPress\RenderBlock\Traits\ClassnameManagement;

    /**
     * Hold the Application class instance.
     *
     * @var Application $app
     */
    protected Application $app;

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

		// Set the is doing transpiling flag to true.
		$this->is_doing_transpile = true;
        $this->parsed_blocks      = parse_blocks($content);
		
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
        $blockera_hash_id = blockera_get_small_random_hash($attributes['blockeraPropsId'] ?? '');
        $unique_classname = sprintf('blockera-block blockera-block-%s', $blockera_hash_id);
        $unique_selector  = blockera_get_normalized_selector($unique_classname);

		$is_inner      = ! empty($args['is_inner']);
		$invalid_inner = empty($args['force_process']);

		$is_allowed = $is_inner && ! $invalid_inner && in_array($block, $this->current_block['innerBlocks'], true);

		// Process only valid, supported, and not dynamic blocks or one of items in parent block inners list.
		if ($this->isValidBlock( $block ) && blockera_is_supported_block($block) || $is_allowed) {

			foreach ($block['innerContent'] as $_key => $innerContent) {
				if (empty($innerContent) || ! $innerContent || empty(trim($innerContent))) {
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
						'unique_selector' => $unique_selector,
						'unique_classname' => $unique_classname,
						'block_path' => $args['block_path'] ?? [],
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
		$block_classname     = $args['block']['attrs']['className'] ?? $this->current_block['attrs']['className'];

		// Get base unique classname.
		$base_unique_classname = $block_classname ?? $args['unique_classname'];
		$selector 			   = blockera_get_normalized_selector($base_unique_classname);

		$block      = $args['block'];
		$attributes = $args['block']['attrs'] ?? [];

		// Indicate if the first tag is processed.
		$is_first_tag = true;

        // Process in a single pass.
        while ($processor->next_tag()) {
            $style = $processor->get_attribute('style');
            $class = $processor->get_attribute('class');

			// Skip if the class contains $transpile_classname, because it shows that the block is already transpiled.
			if ($class && str_contains($class, $this->transpile_classname) || ( ! $this->is_allowed_inner && ! $args['permitted_inner'] && $args['block'] !== $this->current_block )) {

				return;
			}

			// Backward compatible with WordPress original block output.
			$this->addCssPropsClasses($processor, $style ?? '', $args['block']);

			// Get fallback classname.
			$fallback_classname = $class ? $class : $base_unique_classname;

			// Handling block setup while exist inside in loop block as a inner block.
			$this->setupBlockInLoop($block, 'processBlockContent', 1);

			// If the generated new unique classname for block.
			if ($is_first_tag) {

				if (! $this->is_doing_transpile_loop) {
					// Get unique classname from fallback classname by using regex.
					preg_match(blockera_get_unique_class_name_regex(), $fallback_classname, $matches);
	
					// Ensure the classname is unique across all blocks.
					$unique_classname = $this->ensureUniqueClassname(
						$matches[0] ?? $base_unique_classname,
						$attributes['blockeraPropsId'] ?? $this->current_block['attrs']['blockeraPropsId'],
						$block
					);
	
					if ($unique_classname !== $base_unique_classname && $unique_classname !== $class) {
						// Turn on "force-update-classname" for wrapper element while self classname is duplicate!
						$args['force_update_classname'] = true;
						// Update selector.
						$selector = blockera_get_normalized_selector($unique_classname);
					}
				}

				// Set the is first tag flag to false.
				$is_first_tag = false;
			}

			// Update classname based on blockera class name.
			// Add $transpile_classname class to the block wrapper element.
			$this->updateClassname($processor, $unique_classname ?? $fallback_classname, $args);

			// Create css declarations.
			$declarations = $this->createCssDeclarations($processor, $selector, $style ?? '');
			if (! empty($declarations['properties'])) {
				$this->inline_styles[ $declarations['selector'] ] = $declarations['properties'];
			}
			
			// Remove style attribute from the block wrapper element after processing.
			$processor->remove_attribute('style');

			// Unset unique classname to avoid memory leak.
			unset($unique_classname);
        }

		// Normalize inline styles while doing transpiling.
		$inline_styles = $this->normalizeInlineStyles($selector);

        // Generate styles once.
        $this->style_engine = $this->app->make(
            StyleEngine::class,
            [
                'block' => $args['block'],
                'fallbackSelector' => $selector,
            ]
        );
		$this->style_engine->setSupports($args['supports']);
		$this->style_engine->setInlineStyles($inline_styles['root'] ?? []);
        $computed_css_rules = $this->style_engine->getStylesheet();

		// Push to stack the generated styles by style engine for current processed block.
        if (! empty($computed_css_rules)) {
			$this->styles[] = $computed_css_rules;
        }
		
		// Push to stack the inline styles for current processed block.
		if (! empty($inline_styles['child'])) {
			$this->addInlineStylesToStack($inline_styles['child']);
		}

		$attributes = $args['block']['attrs'] ?? [];

		// If custom css is set, add it to the block css.
		if (! empty($attributes['blockeraCustomCSS']['value'])) {
			$this->styles[] = preg_replace([ '/(\.|#)block/i', '/&/i' ], $selector, $attributes['blockeraCustomCSS']['value']);
		}

        // Update block content.
        $this->updateBlockContent($processor, $id, $args);

		// Reset inline styles.
		$this->inline_styles = [];
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
     * Clean up resources and reset state.
     *
     * @return void
     */
    public function reset() {
        // Clear arrays.
        $this->styles        = [];
        $this->parsed_blocks = [];

		// Set the is doing transpiling flag to false.
		$this->is_doing_transpile = false;

        // Force garbage collection.
        gc_collect_cycles();
    }
}
