<?php

namespace Blockera\WordPress\RenderBlock\V2;

use Blockera\Data\Cache\Cache;
use Blockera\Editor\StyleEngine;
use Blockera\Bootstrap\Application;
use Blockera\Exceptions\BaseException;
use Illuminate\Contracts\Container\BindingResolutionException;

/**
 * Class Render filtering WordPress BlockType render process.
 *
 * @package Render
 */
class RenderContent {

    /**
     * Hold application instance.
     *
     * @var Application
     */
    protected Application $app;

    /**
     * Store all block classnames.
     *
     * @var array $classnames the classnames array stack.
     */
    protected array $classnames = [];

    /**
     * Store all inline styles.
     *
     * @var array $inline_styles the inline styles array stack.
     */
    protected array $inline_styles = [];

    /**
     * Store template content.
     *
     * @var array $blocks the blocks array.
     */
    protected array $blocks = [];

    /**
     * Render constructor.
     *
     * @param Application $app the app instance.
     */
    public function __construct( Application $app) {
        $this->app = $app;
    }

    /**
     * Fire WordPress actions or filters Hooks.
     *
     * @return void
     */
    public function applyHooks(): void {
		// phpcs:ignore
        // add_filter('render_block', [ $this, 'render' ], 10, 3);
        add_action('pre_get_posts', [ $this, 'filterPostsContent' ]);
    }

    /**
     * Filter site editor templates.
     *
     * @param \WP_Query $query The WordPress query instance.
     *
     * @return void
     */
    public function filterPostsContent( \WP_Query $query) {
		if (! $query->is_main_query() || is_admin() || wp_doing_ajax() || isset($_REQUEST['_wp-find-template'])) {
            return;
		}

        add_filter(
            'the_posts',
            function ( $posts) {
                if (empty($posts)) {
                    return $posts;
                }

				$parser = $this->app->make(Parser::class);

                foreach ($posts as $post) {
                    if (empty($post->post_content)) {
                        continue;
                    }

                    // Skip global styles post type.
                    if ('wp_global_styles' === $post->post_type) {
                        continue;
                    }

                    // Skip front page while post type is not wp_template.
                    if (is_front_page() && 'wp_template' !== $post->post_type) {
                        continue;
                    }

                    $parsed_blocks = parse_blocks($post->post_content);

                    // Skip empty parsed blocks.
                    if (empty($parsed_blocks)) {
                        continue;
                    }

                    // Get cache data.
                    $cache               = $this->app->make(Cache::class, [ 'product_id' => 'blockera' ]);
					$cached_post_content = $cache->getCache($post->ID, 'post_content');

					if (! empty($cached_post_content)) {
						
						$styles                   = $cached_post_content['generated_css_styles'];
						$serialized_cached_blocks = $cached_post_content['serialized_blocks'];
						$parsed_blocks            = $cached_post_content['parsed_blocks'];

						blockera_add_inline_css(
							implode(PHP_EOL, $styles)
						);

						$post->post_content = $serialized_cached_blocks;

						continue;
					}
					
					$parsed_blocks = parse_blocks($post->post_content);

					// Excluding empty post content.
					if (empty($parsed_blocks)) {

						return;
					}

					// Get the updated blocks after cleanup.
					$data = $parser->cleanupInlineStyles($parsed_blocks, $post->ID);

					$post->post_content = $data['serialized_blocks'];

					blockera_add_inline_css(
						implode(PHP_EOL, $data['generated_css_styles'])
					);
                }

                return $posts;
            }
        );
    }

    /**
     * Rendering block.
     *
     * @param string $html  WordPress block rendered HTML.
     * @param array  $block WordPress block details.
     *
     * @throws BindingResolutionException|BaseException Exception for binding parser service into app container problems.
     * @return string block HTML.
     */
    public function render( string $html, array $block, $args): string {
        // Check block to is support by Blockera?
        if (! blockera_is_supported_block($block) || wp_is_json_request() || defined('REST_REQUEST') || is_front_page()) {
            return $html;
        }

        // Get post id.
        $post_id = $this->getPostId();
        // Extract block attributes.
        $attributes = $block['attrs'];
        // Generate blockera hash identify with "blockeraPropsId" attribute value.
        $blockera_hash_id = blockera_get_small_random_hash($attributes['blockeraPropsId']);
        // Get blockera block unique css classname.
        $blockera_class_name = sprintf('blockera-block blockera-block-%s', $blockera_hash_id);
        // Get blockera props id.
        $propsId = $block['attrs']['blockeraPropsId'];

        // Pushing block classname into stack.
        $this->setClassname($attributes['className'] ?? '');

        // Get cache data.
        $cache                    = $this->app->make(Cache::class, [ 'product_id' => 'blockera' ]);
        $post_content             = $cache->getCache($post_id, 'post_content');
        $serialized_cached_blocks = $post_content['serialized_blocks'];
        $styles                   = $post_content['generated_css_styles'];

        // Get cached block from cache data.
        $cached_block = $this->findCachedBlock($block, $serialized_cached_blocks);

        // Verified cache data is existing.
        if (! empty($cached_block)) {
            // Print css into inline style on "wp_head" action occur.
            blockera_add_inline_css($styles);

            // Return cached block innerHTML.
            return implode(PHP_EOL, $cached_block['innerContent']);
        }

        // Return original block HTML.
        return $html;
    }

    /**
     * Find cached block from cache data.
     *
     * @param array  $block The block to find.
     * @param string $serialized_cached_blocks The serialized cached blocks.
     *
     * @return array The cached block.
     */
    private function findCachedBlock( array $block, string $serialized_cached_blocks): array {

        // Get blockera props id.
        $propsId = $block['attrs']['blockeraPropsId'];

        // Get target block from cache data.
        $cached_block = array_filter(
            parse_blocks($serialized_cached_blocks),
            function ( array $block) use ( $propsId) {
                return ( $block['attrs']['blockeraPropsId'] ?? '' ) === $propsId;
            }
        );

        if (empty($cached_block)) {
            return [];
        }

        return array_values($cached_block)[0];
    }

    /**
     * Append inline styles for a block into blockera stylesheet wrapper.
     *
     * Takes a block and its associated arguments to generate and append CSS styles.
     * The styles are computed using the StyleEngine and added as inline CSS.
     *
     * @param array $block The block to generate styles for.
     * @param array $args {
     *     Arguments for style generation.
     *     @type string $blockera_class_name The unique CSS class name for targeting the block.
     *     @type array  $inline_styles      Cached inline styles to apply to the block.
     * }
     *
     * @return void
     */
    public function appendInlineStyles( array $block, $args): void {
        if (empty($args['styles'])) {
            return;
        }

        $style_engine = $this->app->make(
            StyleEngine::class,
            [
                'block'             => $block,
                'fallbackSelector' => $args['blockera_class_name'],
            ]
        );

        // Computation css rules for current block by server side style engine...
        $style_engine->setInlineStyles($args['inline_styles']);
        $computed_css_rules = $style_engine->getStylesheet($args['inline_styles']);

        // Print css into inline style on "wp_head" action occur.
        blockera_add_inline_css($computed_css_rules);
    }

    /**
     * Is need to update block classname?
     * The target of this method is prevented of duplicate block classnames.
     *
     * @param string $block_classname the block "className" attribute value.
     * @param string $inner_html The block inner html output.
     *
     * @return bool true on success, false on otherwise.
     */
    protected function isForceUpdateClassname( string $block_classname, string $inner_html): bool {
        // Imagine th block classname is empty, so we should update html output.
        if (empty($block_classname)) {

            return true;
        }

        // Try to detect blockera block unique classname and check it to sure not registered in classnames stack.
        if (preg_match(blockera_get_unique_class_name_regex(), $block_classname, $matches)) {

            // If inner html is empty, we should update html output.
            if (empty($inner_html)) {

                return true;
            }

            return in_array($matches[0], $this->classnames, true);
        }

        return false;
    }

    /**
     * Push block classname into stack.
     *
     * @param string $classname the block "className" attribute value.
     *
     * @return void
     */
    protected function setClassname( string $classname): void {
        if (empty($classname)) {

            return;
        }

        if (preg_match(blockera_get_unique_class_name_regex(), $classname, $matches)) {

            $this->classnames[] = $matches[0];
        }
    }

    /**
     * Retrieve regex pattern to detect unique classname.
     *
     * @return string the regular expression to detect blockera unique classname.
     */
    protected function getUniqueClassnameRegex(): string {
        return '/\b(blockera-block-\S+)\b/';
    }

    /**
     * Get inline styles.
     *
     * @return array the inline styles array.
     */
    public function getInlineStyles(): array {
        return $this->inline_styles;
    }

    /**
     * Set inline styles.
     *
     * @param array $inline_styles The inline styles.
     *
     * @return void
     */
    public function setInlineStyles( array $inline_styles): void {
        $this->inline_styles = $inline_styles;
    }

    /**
     * Get current post ID from URL or fallback methods
     *
     * @return int
     */
    protected function getPostId(): int {
        $post_id = 0;

        // Try to get from query var first.
        if (get_query_var('p')) {
            $post_id = get_query_var('p');
        } elseif (get_query_var('page_id')) {
            $post_id = get_query_var('page_id');
        } else {
            // Fallback to URL parsing.
            $url_path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
            if ($url_path) {
                // Remove trailing slash and get last segment.
                $slug = basename(rtrim($url_path, '/'));

                // Try to find post by slug.
                $post = get_page_by_path($slug);
                if ($post) {
                    $post_id = $post->ID;
                }
            }
        }

        // If still no post ID, try get_the_ID() as last resort.
        if (! $post_id && function_exists('get_the_ID')) {
            $post_id = get_the_ID();
        }

        return $post_id;
    }
}
