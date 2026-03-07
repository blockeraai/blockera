<?php

namespace Blockera\WordPress\RenderBlock;

use Blockera\Setup\Blockera;
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

		$cache = $this->app->make('CacheSystem');
		$key   = 'blockeraGlobalStylesMetaData';

		$cache->setMetaCache($postId, $key, $post_content['styles']['blockeraMetaData']);
		
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

		// Store processed content in cache using helper function.
		$cache = $this->app->make('CacheSystem');
		$cache->setMetaCache(
			$postId,
			'post_content',
			[
				'hash'    => $hash,
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

		$blocks = parse_blocks($post_content);

		if (empty($blocks)) {
			return null;
		}

		$this->processBlocksRecursively($blocks);

		$processed_content = '';

		foreach ($blocks as $block) {
			$processed_content .= serialize_block($block);
		}

		return [
			'content' => $processed_content,
		];
	}

	/**
	 * Process blocks from recursively way.
	 *
	 * @param array $blocks The stack of blocks exists in the content of current post in processing.
	 * 
	 * @return void
	 */
	private function processBlocksRecursively( array &$blocks): void {
		foreach ($blocks as &$block) {

			if (empty($block['blockName'])) {
				continue;
			}

			$blockName  = $block['blockName'];
			$attributes = $block['attrs'] ?? [];

			$blockData = [
				'blockName' => $blockName,
				'attrs' => $attributes,
			];

			if (! blockera_is_supported_block($blockData) || ! empty($attributes['blockeraComputedCss'])) {
				// process inner blocks when parent block has not customizations by blockera editor.
				if (! empty($block['innerBlocks'])) {
					$this->processBlocksRecursively($block['innerBlocks']);
				}
				continue;
			}

			$base_unique_class_name = $attributes['className'] ?? null;

			if (! $base_unique_class_name) {
				continue;
			}

			$unique_selector = blockera_get_normalized_selector($base_unique_class_name);

			$styleEngine = $this->app->make(
				StyleEngine::class,
				[
					'block' => $blockData,
					'fallbackSelector' => $unique_selector,
				]
			);

			$styleEngine->setSupports($this->app->getBlockSupports());

			$computed_css_rules = $styleEngine->getStylesheet();

			if (! empty($attributes['blockeraCustomCSS']['value'])) {

				$custom_css = preg_replace(
					[ '/(\.|#)block/i', '/&/i' ],
					$unique_selector,
					$attributes['blockeraCustomCSS']['value']
				);

				if (! empty($custom_css)) {
					$computed_css_rules .= PHP_EOL . $custom_css;
				}
			}

			$attributes['blockeraComputedCss'] = base64_encode($computed_css_rules);

			$block['attrs'] = $attributes;

			// process inner blocks.
			if (! empty($block['innerBlocks'])) {
				$this->processBlocksRecursively($block['innerBlocks']);
			}
		}
	}
}
