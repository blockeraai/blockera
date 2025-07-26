<?php

namespace Blockera\WordPress\RenderBlock\V1;

use Blockera\Bootstrap\Application;
use Blockera\Exceptions\BaseException;
use Blockera\Features\FeaturesManager;
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
	 * Cache status.
	 *
	 * @var bool $cache_status true if cache is enabled, false otherwise.
	 */
	protected bool $cache_status = true;

    /**
     * Store all block classnames.
     *
     * @var array $classnames the classnames array stack.
     */
    protected array $classnames = [];

	/**
	 * Store the is doing transpiling flag property.
	 *
	 * @var bool $is_doing_transpile 
	 */
	protected bool $is_doing_transpile = false;

    /**
     * Render constructor.
     *
     * @param Application $app the app instance.
	 * @param bool        $cache_status true if cache is enabled, false otherwise.
     */
    public function __construct( Application $app, bool $cache_status = true) { 
        $this->app          = $app;
		$this->cache_status = $cache_status;
    }

	/**
	 * Set is doing transpiling flag.
	 *
	 * @param bool $is_doing_transpile true if transpiling, false otherwise.
	 *
	 * @return void
	 */
	public function setIsDoingTranspile( bool $is_doing_transpile): void {

		$this->is_doing_transpile = $is_doing_transpile;
	}

	/**
	 * Set cache status.
	 *
	 * @param bool $status true if cache is enabled, false otherwise.
	 *
	 * @return void
	 */
	public function setCacheStatus( bool $status): void {

		$this->cache_status = $status;
	}
	

    /**
     * Render block icon element.
     *
     * @param string $html   The block html output.
     * @param array  $args   The extra arguments to render block icon element.
     *
     * @throws BindingResolutionException|BaseException Exception for binding parser service into app container problems.
     * @return string The block html include icon element if icon is existing.
     */
    protected function renderBlockWithFeatures( string $html, array $args): string {

        // blockera active experimental icon extension?
        $args['experimental-features-status']['icon'] = blockera_get_experimental([ 'editor', 'extensions', 'iconExtension' ]);

		$fm = $this->app->make(FeaturesManager::class);

		// Get all registered features.
		$features = $fm->getRegisteredFeatures();

		// Get dom parser.
		$dom_parser = $fm->getApp()->dom_parser::str_get_html($html);

		foreach ($features as $feature) {

			// Skip if feature is not enabled.
			if (! $feature->isEnabled()) {
				continue;
			}

			$selector = blockera_get_compatible_block_css_selector(
				blockera_get_block_type_property($args['block']['blockName'], 'selectors'),
				'htmlEditable.root',
				[
					'fallback' => false,
					'block-type' => 'master',
					'block-name' => $args['block']['blockName'],
					'blockera-unique-selector' => $args['unique_class_name'],
				]
			);

			if (empty($selector)) {
				continue;
			}

			$args['dom']          = $dom_parser;
			$args['origin_html']  = $html;
			$args['htmlEditable'] = compact('selector');

			$html = $feature->htmlManipulate($dom_parser, $args);
		}

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
        if (! blockera_is_supported_block($block) || is_admin() || ( blockera_get_admin_options([ 'earlyAccessLab', 'optimizeStyleGeneration' ]) && defined('REST_REQUEST') && REST_REQUEST )) {

            return $html;
        }

        // Extract block attributes.
        $attributes = $block['attrs'];
        // Calculate block hash.
        $hash = blockera_get_block_hash($block);
        // Generate blockera hash identify with "blockeraPropsId" attribute value.
        $blockera_hash_id = blockera_get_small_random_hash($attributes['blockeraPropsId']);

		if (defined('BLOCKERA_PHPUNIT_RUN_TESTS') && BLOCKERA_PHPUNIT_RUN_TESTS) {
			// Get blockera block unique css classname.
        	$blockera_class_name = 'blockera-block blockera-block-test';
		} else {
			// Get blockera block unique css classname.
        	$blockera_class_name = sprintf('blockera-block blockera-block-%s', $blockera_hash_id);
		}

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
		// Get normalized blockera block unique css classname.
        $unique_class_name = blockera_get_normalized_selector($need_to_update_html ? $blockera_class_name : $attributes['className']);

        // Validate cache data.
        if ($cache_validate && $hash === $cache_data['hash'] && $this->cache_status) {

			$css = $cache_data['css'];

			// If custom css is set, add it to the block css.
			if (! empty($attributes['blockeraCustomCSS']['value'])) {
				$css .= preg_replace('/(\.|#)block/i', $unique_class_name, $attributes['blockeraCustomCSS']['value']);
			}

            // Print css into inline style on "wp_head" action occur.
            blockera_add_inline_css($css);

            if ($need_to_update_html) {

                // Represent html string.
                return $this->getUpdatedHTML($html, $cache_data['classname']);
            }

            return $html;
        }

        /**
         * Get parser object.
         *
         * @var Parser $parser the instance of Parser class.
         */
        $parser = $this->app->make(Parser::class);
		$parser->setSupports($supports);

        // Computation css rules for current block by server side style engine...
        $computed_css_rules = $parser->getCss(compact('block', 'unique_class_name'));

		// If custom css is set, add it to the block css.
		if (! empty($attributes['blockeraCustomCSS']['value'])) {
			$computed_css_rules .= preg_replace('/(\.|#)block/i', $unique_class_name, $attributes['blockeraCustomCSS']['value']);
		}

        // Print css into inline style on "wp_head" action occur.
        blockera_add_inline_css($computed_css_rules);

        if ($need_to_update_html) {

            // Represent html string.
            $html = $this->getUpdatedHTML($html, $blockera_class_name);
        }

        // Render block with features.
        $html = $this->renderBlockWithFeatures($html, compact('block', 'unique_class_name', 'computed_css_rules'));

        // Create new block cache data.
        $data = [
            'hash'      => $hash,
            'css'       => $computed_css_rules,
            'classname' => $need_to_update_html ? $blockera_class_name : $attributes['className'],
        ];

		if ($this->cache_status) {

			// Sets cache data with merge previous data.
			blockera_set_block_cache($cache_key, $data);
		}

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

			// Remove style attribute if transpiling.
			if ($this->is_doing_transpile) {

				$processor->remove_attribute('style');
			}
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
