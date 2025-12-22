<?php

namespace Blockera\WordPress\RenderBlock;

use Blockera\Setup\Blockera;
use Blockera\Data\Cache\Cache;
use Blockera\Editor\StyleEngine;
use Blockera\Bootstrap\Application;

/**
 * Class SavePost to cache styles for current post published.
 *
 * @package SavePost
 */
class SavePost {

    /**
     * Store instance of app container.
     *
     * @var Application|Blockera
     */
    protected Application $app;

    /**
     * Constructor of SavePost class.
     *
     * @param Application $app the instance of Application container.
     */
    public function __construct( Application $app) { 
        $this->app = $app;
    }

    /**
     * Save post to database action,
     * we will use this to cache post data with generate css and manipulate html.
     *
     * @param int      $postId The current post Identifier.
     * @param \WP_Post $post   The instance of WP_Post class.
	 *
     * @return void
     */
    public function save( int $postId, \WP_Post $post): void {

		$this->saveGlobalStyles($postId, $post);
		$this->saveGeneratePostStyles($postId, $post);
    }

	/**
	 * Save global styles meta data to post meta.
	 *
	 * @param integer  $postId The current post Identifier.
	 * @param \WP_Post $post The instance of WP_Post class.
	 * 
	 * @return void
	 */
	protected function saveGlobalStyles( int $postId, \WP_Post $post): void {
		if (get_post_type($postId) !== 'wp_global_styles') {
			return;
		}

		$post_content = $post->post_content;
		$post_content = json_decode($post_content, true);

		if (! isset($post_content['styles']['blockeraMetaData'])) {
			return;
		}

		update_post_meta($postId, 'blockeraGlobalStylesMetaData', $post_content['styles']['blockeraMetaData']);
		
		unset($post_content['styles']['blockeraMetaData']);
		$post_content = json_encode($post_content);

		wp_update_post(
            array(
				'ID' => $postId,
				'post_content' => $post_content,
            )
        );
	}

	/**
	 * Save and generate post styles by processing block comments and caching the result.
	 *
	 * @param int      $postId The current post Identifier.
	 * @param \WP_Post $post   The instance of WP_Post class.
	 *
	 * @return void
	 */
	protected function saveGeneratePostStyles( int $postId, \WP_Post $post): void {

		// Process post_content to generate CSS and add blockeraComputedCss.
		$result = $this->processPostContentForStyles($post->post_content);

		if (empty($result)) {
			return;
		}

		// Calculate hash of original post_content for cache validation.
		$hash = md5($post->post_content);

		// Store processed content in cache.
		$cache = $this->app->make(Cache::class, [ 'product_id' => 'blockera' ]);
		$cache->setCache(
            $postId,
            'post_content',
            [
				'hash' => $hash,
				'content' => $result['content'],
			]
        );
	}

	/**
	 * Process post_content to generate CSS for all supported blocks.
	 *
	 * @param string $post_content The post content with block comments.
	 *
	 * @return array|null Array with 'content' key containing processed post_content, or null if processing failed.
	 */
	public function processPostContentForStyles( string $post_content): ?array {
		if (! blockera_contains_blockera_block($post_content)) {
			return null;
		}

		// Find all block comments using a pattern that matches the block name.
		// We'll extract JSON manually to handle nested structures.
		// Block names can contain: letters, numbers, underscores, hyphens, and slashes (for namespace/block-name format).
		$pattern = '#<!--\s*wp:([\w\/-]+)(\s+.*?)?(/)?-->#s';
		
		$processed_content = $post_content;

		// Find all block comments.
		preg_match_all($pattern, $processed_content, $matches, PREG_SET_ORDER | PREG_OFFSET_CAPTURE);

		if (empty($matches)) {
			return null;
		}

		// Process matches in reverse order to preserve offsets when replacing.
		$matches = array_reverse($matches);

		foreach ($matches as $match) {
			$block_name   = $match[1][0];
			$full_match   = $match[0][0];
			$match_offset = $match[0][1];
			
			// Determine if self-closing.
			$is_self_closing = ! empty($match[3][0]);
			
			// Extract JSON attributes manually to handle nested structures.
			// Find the position after block name.
			$block_name_end   = $match_offset + strlen('<!-- wp:' . $block_name);
			$after_block_name = substr($processed_content, $block_name_end);
			
			// Skip whitespace.
			$json_start_pos = strspn($after_block_name, " \t\f\r\n");
			$json_start     = $block_name_end + $json_start_pos;
			
			// Check if JSON starts with '{'.
			if ($json_start >= strlen($processed_content) || '{' !== $processed_content[ $json_start ]) {
				continue; // No JSON attributes.
			}
			
			// Find matching closing brace by counting braces.
			$brace_count = 0;
			$json_end    = $json_start;
			$in_string   = false;
			$escape_next = false;
			
			for ($i = $json_start; $i < strlen($processed_content); $i++) {
				$char = $processed_content[ $i ];
				
				if ($escape_next) {
					$escape_next = false;
					continue;
				}
				
				if ('\\' === $char) {
					$escape_next = true;
					continue;
				}
				
				if ('"' === $char && ! $escape_next) {
					$in_string = ! $in_string;
					continue;
				}
				
				if (! $in_string) {
					if ('{' === $char) {
						$brace_count++;
					} elseif ('}' === $char) {
						$brace_count--;
						if (0 === $brace_count) {
							$json_end = $i + 1;
							break;
						}
					}
				}
			}
			
			// Extract JSON string.
			$attributes_json = substr($processed_content, $json_start, $json_end - $json_start);

			// Skip if attributes JSON is empty.
			if (empty(trim($attributes_json)) || '{}' === $attributes_json) {
				continue;
			}

			// Parse JSON attributes.
			$attributes = json_decode($attributes_json, true);
			
			// Skip if JSON parsing failed.
			if (JSON_ERROR_NONE !== json_last_error() || ! is_array($attributes)) {
				continue;
			}

			// Create block array structure.
			$block = [
				// WordPress by default uses 'core/' namespace for self blocks, and while we extracting it from post content we don't have the namespace, so we add it here.
				// It should be contains the namespace to preparing block from \WP_Block_Registry::$registered_block_types stack.
				'blockName' => ! str_contains($block_name, '/') ? 'core/' . $block_name : $block_name,
				'attrs' => $attributes,
			];

			// Check if block is supported by Blockera.
			if (! blockera_is_supported_block($block)) {
				continue;
			}

			// Generate unique classname and selector (simple base classname, no ensureUniqueClassname).
			if (! empty($attributes['className'])) {
				$base_unique_class_name = $attributes['className'];
			} else {
				// Generate the blockera block unique css classname.
				$hash_suffix            = blockera_get_small_random_hash();
				$base_unique_class_name = 'blockera-block blockera-block-' . $hash_suffix;
			}

			$unique_class_name = $base_unique_class_name;
			$unique_selector   = blockera_get_normalized_selector($unique_class_name);

			// Create StyleEngine instance.
			$styleEngine = $this->app->make(
				StyleEngine::class,
				[
					'block' => $block,
					'fallbackSelector' => $unique_selector,
				]
			);
			$styleEngine->setSupports($this->app->getBlockSupports());
			$computed_css_rules = $styleEngine->getStylesheet();

			// Add blockeraCustomCSS if present.
			if (! empty($attributes['blockeraCustomCSS']['value'])) {
				// Replace placeholders with the unique selector.
				$custom_css = preg_replace([ '/(\.|#)block/i', '/&/i' ], $unique_selector, $attributes['blockeraCustomCSS']['value']);
				if (! empty($custom_css)) {
					$computed_css_rules .= PHP_EOL . $custom_css;
				}
			}

			// Base64 encode the CSS to prevent issues with special characters and newlines in JSON.
			// Add blockeraComputedCss to block attrs (regenerate even if exists).
			$attributes['blockeraComputedCss'] = base64_encode($computed_css_rules);

			// Reconstruct block comment preserving original format.
			$new_attributes_json = wp_json_encode($attributes, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
			
			if ($is_self_closing) {
				$new_block_comment = '<!-- wp:' . $block_name . ' ' . $new_attributes_json . ' /-->';
			} else {
				$new_block_comment = '<!-- wp:' . $block_name . ' ' . $new_attributes_json . ' -->';
			}

			// Replace original comment in post_content.
			$processed_content = substr_replace($processed_content, $new_block_comment, $match_offset, strlen($full_match));
		}

		/**
		 * Cleanup HTML by removing inline styles.
		 * 
		 * This inline styles are added by block editor but Blockera adds them.
		 * By removing it we reduce the later clean process and also reduce the CSS size.
		 * 
		 * @see ContentCleanup::cleanupBlockeraBlocksInlineStyles()
		 */
		$content_cleanup   = $this->app->make(ContentCleanup::class);
		$processed_content = $content_cleanup->cleanupBlockeraBlocksInlineStyles($processed_content);

		return [
			'content' => $processed_content,
		];
	}
}
