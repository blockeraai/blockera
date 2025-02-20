<?php

namespace Blockera\WordPress\RenderBlock\V1;

use Blockera\Bootstrap\Application;
use Blockera\Exceptions\BaseException;
use Blockera\Utils\Adapters\DomParser;
use Illuminate\Contracts\Container\BindingResolutionException;
use Symfony\Component\VarDumper\VarDumper;

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
     * Render constructor.
     *
     * @param Application $app the app instance.
     */
    public function __construct( Application $app) { 
        $this->app = $app;
    }

    /**
     * Render block icon element.
     *
     * @param string $html   The block html output.
     * @param Parser $parser The block parser instance.
     * @param array  $args   The extra arguments to render block icon element.
     *
     * @throws BindingResolutionException|BaseException Exception for binding parser service into app container problems.
     * @return string The block html include icon element if icon is existing.
     */
    protected function renderIcon( string $html, Parser $parser, array $args): string {

        // blockera active experimental icon extension?
        $is_enable_icon_extension = blockera_get_experimental([ 'editor', 'extensions', 'iconExtension' ]);

        // phpcs:disable
        // create dom adapter.
        /**
         * @var DomParser $dom
         */
        if ($is_enable_icon_extension) {

            $dom = $this->app->make(DomParser::class)::str_get_html($html);
        }
        // phpcs:enable

        // phpcs:disable
        // TODO: add into cache mechanism.
        //manipulation HTML of block content
        if ($is_enable_icon_extension) {

            $parser->htmlManipulate(array_merge($args, [ $dom ]));
            //retrieve final html of block content
            $html = preg_replace([ '/(<[^>]+) style=".*?"/i', '/wp-block-\w+__(\w+|\w+-\w+)-\d+(\w+|%)/i' ], [ '$1', '' ], $dom->html());
        }

        // phpcs:enable

        return $html;
    }

    /**
     * Block parser to customize HTML template!
     *
     * @param string $html  WordPress block rendered HTML.
     * @param array  $block WordPress block details.
	 * @param array  $supports The supports.
     *
     * @throws BindingResolutionException|BaseException Exception for binding parser service into app container problems.
     * @return string block HTML.
     */
    public function render( string $html, array $block, array $supports): string {

        // Check block to is support by Blockera?
        if (! blockera_is_supported_block($block) || is_admin() || defined('REST_REQUEST') && REST_REQUEST) {

            return $html;
        }

        // Extract block attributes.
        $attributes = $block['attrs'];
        // Calculate block hash.
        $hash = blockera_get_block_hash($block);
        // Generate blockera hash identify with "blockeraPropsId" attribute value.
        $blockera_hash_id = blockera_get_small_random_hash($attributes['blockeraPropsId']);
        // Get blockera block unique css classname.
        $blockera_class_name = sprintf('blockera-block blockera-block-%s', $blockera_hash_id);

        // Is need to update block HTML output?
        $need_to_update_html = $this->needToUpdateHTML($attributes['className'] ?? '', $block['innerHTML']);

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

            if ($need_to_update_html) {

                // Represent html string.
                return $this->getUpdatedHTML($html, $cache_data['classname']);
            }

            return $html;
        }

        // Delete cache data while previous cache data is existing but changed block render process data.
        if ($cache_validate) {

            blockera_delete_block_cache($cache_key);
        }

        // Get normalized blockera block unique css classname.
        $unique_class_name = blockera_get_normalized_selector($need_to_update_html ? $blockera_class_name : $attributes['className']);

        /**
         * Get parser object.
         *
         * @var Parser $parser the instance of Parser class.
         */
        $parser = $this->app->make(Parser::class);
		$parser->setSupports($supports);

        // Computation css rules for current block by server side style engine...
        $computed_css_rules = $parser->getCss(compact('block', 'unique_class_name'));

        // Print css into inline style on "wp_head" action occur.
        blockera_add_inline_css($computed_css_rules);

        // Render icon element.
        $html = $this->renderIcon($html, $parser, compact('block', 'unique_class_name'));

        if ($need_to_update_html) {

            // Represent html string.
            $html = $this->getUpdatedHTML($html, $blockera_class_name);
        }

        // Create new block cache data.
        $data = [
            'hash'      => $hash,
            'css'       => $computed_css_rules,
            'classname' => $need_to_update_html ? $blockera_class_name : $attributes['className'],
        ];

        // Sets cache data with merge previous data.
        blockera_set_block_cache($cache_key, $data);

        return $html;
    }

    /**
     * Is need to update block content?
     * The target of this method is prevented of avoid block unique classnames.
     *
     * @param string $block_classname the block "className" attribute value.
     * @param string $inner_html The block inner html output.
     *
     * @return bool true on success, false on otherwise.
     */
    protected function needToUpdateHTML( string $block_classname, string $inner_html): bool {

        // Imagine th block classname or classnames property is empty, so we should update html output.
        if (empty($block_classname) || empty($this->classnames)) {

            return true;
        }

        // Try to detect blockera block unique classname and check it to sure not registered in classnames stack.
        if (preg_match($this->getUniqueClassnameRegex(), $block_classname, $matches)) {

            // If inner html is empty, we should update html output.
            if (empty($inner_html)) {

                return true;
            }

            return in_array($matches[0], $this->classnames, true);
        }

        return false;
    }

    /**
     * Returns the string representation of the HTML Tag Processor.
     *
     * @param string $html      the target html string.
     * @param string $classname the unique classname.
     *
     * @return string the update html.
     */
    protected function getUpdatedHTML( string $html, string $classname): string {

        $processor = new \WP_HTML_Tag_Processor($html);

        if ($processor->next_tag()) {

            // Regular Expression to detect blockera unique classname.
            $regexp = $this->getUniqueClassnameRegex();

            // Get tag previous classname value.
            $previous_class = $processor->get_attribute('class');

            if (! empty($previous_class)) {

                // Backward compatibility.
                if (preg_match($regexp, $classname, $matches) && preg_match($regexp, $previous_class)) {

                    $final_classname = preg_replace($regexp, $matches[0], $previous_class);

                } else {

                    $final_classname = $classname . ' ' . $previous_class;
                }
            }

            $processor->set_attribute('class', $final_classname ?? $classname);
        }

        return $processor->get_updated_html();
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

        if (preg_match($this->getUniqueClassnameRegex(), $classname, $matches)) {

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

}
