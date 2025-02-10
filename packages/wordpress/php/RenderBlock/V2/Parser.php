<?php

namespace Blockera\WordPress\RenderBlock\V2;

use Blockera\Data\Cache\Cache;
use Blockera\Editor\StyleEngine;
use Blockera\Bootstrap\Application;

class Parser {

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
     * Store classnames.
     *
     * @var array
     */
    protected array $classnames = [];

    /**
     * Cache instance.
     * 
     * @var Cache
     */
    protected Cache $cache;

    /**
     * Style engine instance.
     *
     * @var StyleEngine
     */
    protected StyleEngine $style_engine;

    /**
     * The Parser class constructor.
     *
     * @param Application $app The application container object.
     */
    public function __construct( Application $app) {
        $this->app   = $app;
        $this->cache = $app->make(Cache::class, [ 'product_id' => 'blockera' ]);
    }

    /**
     * Clean up inline styles from parsed blocks and convert them to CSS classes.
     *
     * @param array $parsed_blocks Array of parsed blocks from WordPress content.
     * @param int   $post_id The post id. default is 0 to indicate that the post id is not available.
     *
     * @return array{
     *   parsed_blocks: array,
     *   generated_css_styles: array,
     *   serialized_blocks: string
     * } The array with parsed blocks, generated CSS styles and serialized blocks.
     */
    public function cleanupInlineStyles( array $parsed_blocks, int $post_id = 0): array {
        // Early return if no blocks.
        if (empty($parsed_blocks)) {
            return [
                'parsed_blocks' => [],
                'serialized_blocks' => '',
                'generated_css_styles' => [],
            ];
        }

        $this->parsed_blocks = $parsed_blocks;
        $this->processBlocksInBatches();

        // Filter out empty blocks before serializing.
        $filtered_blocks = array_filter(
            $this->parsed_blocks,
            function( $block) {
				return ! empty($block['blockName']);
			}
        );

        $serialized_blocks = serialize_blocks($filtered_blocks);

		$data = [
            'parsed_blocks' => $this->parsed_blocks,
            'generated_css_styles' => $this->styles,
            'serialized_blocks' => $serialized_blocks,
        ];

        // Cache the results.
        $this->cache->setCache($post_id, 'post_content', $data);

        return $data;
    }

    /**
     * Process blocks in batches to optimize memory usage.
     *
     * @return void
     */
    protected function processBlocksInBatches(): void { 
        $batch_size   = 50; // Process 50 blocks at a time.
        $total_blocks = count($this->parsed_blocks);
        
        for ($i = 0; $i < $total_blocks; $i += $batch_size) {
            $batch = array_slice($this->parsed_blocks, $i, $batch_size, true);
            
            foreach ($batch as $key => $block) {
                if (! blockera_is_supported_block($block) || ! $this->isValidBlock($block)) {
                	continue;
                }

                $this->current_block = $block;
                $this->processBlockContent($key, $block);
            }

            // Clear memory after each batch.
            gc_collect_cycles();
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
        return ! empty($block) && ! empty($block['innerContent']) && ! empty($block['blockName']);
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
        $contents   = [];
        $attributes = $block['attrs'] ?? [];
        
        // Pre-calculate common values.
        $blockera_hash_id          = blockera_get_small_random_hash($attributes['blockeraPropsId'] ?? '');
        $blockera_class_name       = sprintf('blockera-block blockera-block-%s', $blockera_hash_id);
        $is_force_update_classname = blockera_is_force_update_classname($blockera_class_name, $block['innerHTML'] ?? '', $this->classnames);
        
        // Set classname once.
        $this->setClassname($attributes['className'] ?? '');
        $unique_class_name = blockera_get_normalized_selector($is_force_update_classname ? $blockera_class_name : ( $attributes['className'] ?? '' ));

        foreach ($block['innerContent'] as $_key => $innerContent) {
            if (empty($innerContent)) {
                continue;
            }

            $contents[] = [
                'content' => $innerContent,
                'id' => $_key,
                'args' => [
                    'block' => $block,
                    'block_id' => $key,
                    'block_path' => $args['block_path'] ?? [],
                    'unique_class_name' => $unique_class_name,
                    'blockera_class_name' => $blockera_class_name,
                    'force_update_classname' => $is_force_update_classname,
                ],
            ];
        }

        // Process contents in parallel if possible.
        foreach ($contents as $item) {
            $this->cleanupProcess(
                $item['content'],
                $item['id'],
                $item['args']
            );
        }

        // Process inner blocks recursively.
        if (! empty($block['innerBlocks'])) {
            foreach ($block['innerBlocks'] as $inner_key => $inner_block) {
                if (blockera_is_supported_block($inner_block) && $this->isValidBlock($inner_block)) {
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
						]
                    );
                }
            }
        }
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
        
        // Process in a single pass.
        while ($processor->next_tag()) {
            $style = $processor->get_attribute('style');

            $processor->remove_attribute('style');

			if ($args['force_update_classname']) {
                $this->updateClassname($processor, $args['blockera_class_name']);
            }
			
			$inline_styles = [];
			$declarations  = is_string($style) ? explode(';', $style) : [];

			foreach ($declarations as $declaration) {
				$inline_styles[ $args['unique_class_name'] ][] = $declaration;
			}

			// Generate styles once.
			$this->style_engine = $this->app->make(
                StyleEngine::class,
                [
					'block' => $args['block'],
					'fallbackSelector' => $args['unique_class_name'],
				]
            );

			$computed_css_rules = $this->style_engine->getStylesheet($inline_styles);

			if (in_array($computed_css_rules, $this->styles, true)) {
				continue;
			}

			$this->styles[] = $computed_css_rules;
        }

        // Update block content.
        $this->updateBlockContent($processor, $id, $args);
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
            $this->parsed_blocks[ $args['block_id'] ]['attrs']['blockeraProcessed'] = true;
            $this->parsed_blocks[ $args['block_id'] ]['attrs']['blockeraPropsId']   = wp_generate_uuid4();
            $this->parsed_blocks[ $args['block_id'] ]['innerContent'][ $id ]        = $updated_html;
            return;
        }

        $current = &$this->parsed_blocks;
        foreach ($args['block_path'] as $path) {
            $current = &$current[ $path['id'] ]['innerBlocks'];
        }

        $current[ $args['block_id'] ]['attrs']['blockeraProcessed'] = true;
        $current[ $args['block_id'] ]['attrs']['blockeraPropsId']   = wp_generate_uuid4();
        $current[ $args['block_id'] ]['innerContent'][ $id ]        = $updated_html;
    }

    /**
     * Update classname for current tag.
     *
     * @param \WP_HTML_Tag_Processor $processor The HTML tag processor object.
     * @param string                 $classname The classname to update.
     *
     * @return void
     */
    protected function updateClassname( \WP_HTML_Tag_Processor $processor, string $classname): void {
        $previous_class = $processor->get_attribute('class');
        $regexp         = blockera_get_unique_class_name_regex();

        if (! empty($previous_class)) {
            if (preg_match($regexp, $classname, $matches) && preg_match($regexp, $previous_class)) {
                $final_classname = preg_replace($regexp, $matches[0], $previous_class);
            } else {
                $final_classname = $classname . ' ' . $previous_class;
            }
            $processor->set_attribute('class', $final_classname);
        } else {
            $processor->set_attribute('class', $classname);
        }
    }

    /**
     * Push block classname into stack.
     *
     * @param string $classname the block "className" attribute value.
     *
     * @return void
     */
    protected function setClassname( string $classname): void {
        if (! empty($classname) && preg_match(blockera_get_unique_class_name_regex(), $classname, $matches)) {
            $this->classnames[] = $matches[0];
        }
    }
}
