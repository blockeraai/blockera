<?php

namespace Blockera\WordPress\RenderBlock\V2;

use Blockera\Editor\StyleEngine;
use Blockera\Bootstrap\Application;
use Blockera\Exceptions\BaseException;
use Illuminate\Contracts\Container\BindingResolutionException;

/**
 * Class Render filtering WordPress BlockType render process.
 *
 * @package Render
 */
class Render {

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
        add_filter('render_block', [ $this, 'render' ], 10, 3);
    }

    /**
     * Block parser to customize HTML template!
     *
     * @param string $html  WordPress block rendered HTML.
     * @param array  $block WordPress block details.
     *
     * @throws BindingResolutionException|BaseException Exception for binding parser service into app container problems.
     * @return string block HTML.
     */
    public function render( string $html, array $block): string {
        // Check block to is support by Blockera?
        if (! blockera_is_supported_block($block) || is_admin()) {

            return $html;
        }

        /**
         * Get parser object.
         *
         * @var Parser $parser the instance of Parser class.
         */
        $parser = $this->app->make(Parser::class);

        // Extract block attributes.
        $attributes = $block['attrs'];
        // Calculate block hash.
        $hash = blockera_get_block_hash($block);
        // Generate blockera hash identify with "blockeraPropsId" attribute value.
        $blockera_hash_id = blockera_get_small_random_hash($attributes['blockeraPropsId']);
        // Get blockera block unique css classname.
        $blockera_class_name = sprintf('blockera-block blockera-block-%s', $blockera_hash_id);

        // Is need to update block HTML output?
        $forced_update_classname = $this->isForceUpdateClassname($attributes['className'] ?? '', $block['innerHTML']);

        // Pushing block classname into stack.
        $this->setClassname($attributes['className'] ?? '');

        // Get block cache key.
        $cache_key = blockera_get_block_cache_key($block);
        // Prepare cache data.
        $cache_data = blockera_get_block_cache($cache_key);
        // Get cache validate result.
        $cache_validate = ! empty($cache_data['css']) && ! empty($cache_data['hash']) && ! empty($cache_data['classname']);

        // Validate cache data.
        if ($cache_validate && $hash === $cache_data['hash']) {

            // Print css into inline style on "wp_head" action occur.
            blockera_add_inline_css($cache_data['css']);

            return $html;
        }

        // Delete cache data while previous cache data is existing but changed block render process data.
        if ($cache_validate) {

            blockera_delete_block_cache($cache_key);
        }

        // Get normalized blockera block unique css classname.
        $unique_class_name = blockera_get_normalized_selector($forced_update_classname ? $blockera_class_name : $attributes['className']);

        $style_engine = $this->app->make(
            StyleEngine::class,
            [
                'block'             => $block,
                'fallbackSelector' => $unique_class_name,
            ]
        );
        $processor    = new \WP_HTML_Tag_Processor($html);

        // Cleanup inline styles with removed it from html tag and return styles as array.
        $inline_styles = $parser->cleanupInlineStyles($processor);

        // Computation css rules for current block by server side style engine...
        $style_engine->setInlineStyles($inline_styles);
        $computed_css_rules = $style_engine->getStylesheet($inline_styles);

        // Print css into inline style on "wp_head" action occur.
        blockera_add_inline_css($computed_css_rules);

        // Create new block cache data.
        $data = [
            'hash'      => $hash,
            'css'       => $computed_css_rules,
            'classname' => $forced_update_classname ? $blockera_class_name : $attributes['className'],
        ];

        // Sets cache data with merge previous data.
        blockera_set_block_cache($cache_key, $data);

        return $processor->get_updated_html();
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
}
