<?php

namespace Blockera\WordPress\RenderBlock\V1;

use Blockera\Bootstrap\Application;
use Blockera\Exceptions\BaseException;
use Blockera\Features\Core\FeaturesManager;
use Blockera\Bootstrap\Traits\AssetsLoaderTrait;
use Blockera\WordPress\RenderBlock\Traits\Processor;
use Blockera\WordPress\RenderBlock\Traits\ClassnameManagement;
use Illuminate\Contracts\Container\BindingResolutionException;

/**
 * Class Render filtering WordPress BlockType render process.
 *
 * @package Render
 */
class Render {

	use AssetsLoaderTrait, Processor, ClassnameManagement;

    /**
     * Hold application instance.
     *
     * @var Application
     */
    protected Application $app;

	/**
	 * Store the block array.
	 *
	 * @var array $block the block array.
	 */
	protected array $block;

	/**
	 * Cache status.
	 *
	 * @var bool $cache_status true if cache is enabled, false otherwise.
	 */
	protected bool $cache_status = true;

	/**
	 * Store the args array.
	 *
	 * @var array $args the args array.
	 */
	protected array $args = [];

	/**
	 * Store the id.
	 *
	 * @var string $id the id.
	 */
	protected string $id;

    /**
     * Render constructor.
     *
     * @param Application $app the app instance.
	 * @param bool        $cache_status true if cache is enabled, false otherwise.
	 * @param array       $args the args array.
     */
    public function __construct( Application $app, bool $cache_status = true, array $args = []) { 
        $this->app          = $app;
		$this->args         = $args;
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

		$fm = $this->app->make(FeaturesManager::class);

		// Get all registered features.
		$features = $fm->getRegisteredFeatures();

		// Get dom parser.
		$dom_parser = $fm->getApp()->dom_parser::str_get_html($html);

		foreach ($features as $feature) {

			$feature->setBlock($args['block']);

			// Skip if feature is not enabled.
			if (! $feature->isBlockSupported()) {
				continue;
			}

			$selector = blockera_get_compatible_block_css_selector(
				blockera_get_block_type_property($args['block']['blockName'], 'selectors'),
				'htmlEditable.root',
				[
					'fallback' => false,
					'block-type' => 'master',
					'block-name' => $args['block']['blockName'],
					'blockera-unique-selector' => $args['unique_selector'],
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

		// Store the block array.
		$this->block = $block;

		$extracted_name = explode('/', $block['blockName']);

		$this->id = $extracted_name[1];
		$this->setContext('blocks-core');
		$this->setSubContext(blockera_get_block_library_name( $extracted_name[0] ));
		$this->enqueueAssets($this->args['plugin_base_path'], $this->args['plugin_base_url'], $this->args['plugin_version']);

        // Extract block attributes.
        $attributes = $block['attrs'];
        // Calculate block hash.
        $hash = blockera_get_block_hash($block);
        // Generate blockera hash identify with "blockeraPropsId" attribute value.
        $blockera_hash_id = blockera_get_small_random_hash($attributes['blockeraPropsId']);

		// Get blockera block unique css classname.
        $blockera_class_name = sprintf('blockera-block blockera-block-%s', $blockera_hash_id);

        // Get block cache key.
        $cache_key = blockera_get_block_cache_key($block);
        // Prepare cache data.
        $cache_data = blockera_get_block_cache($cache_key);
        // Get cache validate result.
        $cache_validate = ! empty($cache_data['css']) && ! empty($cache_data['hash']) && ! empty($cache_data['classname']);
		// Get normalized blockera block unique css classname.
        $base_unique_class_name = $attributes['className'] ?? $blockera_class_name;
		// Ensure the classname is unique across all blocks.
		$unique_class_name = $this->ensureUniqueClassname(
			$base_unique_class_name,
			$attributes['blockeraPropsId'],
			$block
		);
		$unique_selector   = blockera_get_normalized_selector($unique_class_name);

        // Validate cache data.
        if ($cache_validate && $hash === $cache_data['hash'] && $this->cache_status) {

			$css = $cache_data['css'];

			// If custom css is set, add it to the block css.
			if (! empty($attributes['blockeraCustomCSS']['value'])) {
				$css .= preg_replace([ '/(\.|#)block/i', '/&/i' ], $unique_selector, $attributes['blockeraCustomCSS']['value']);
			}

            // Print css into inline style on "wp_head" action occur.
            blockera_add_inline_css($css);
			
			// Render block with features.
			$html = $this->renderBlockWithFeatures(
                $html,
                [
					'block' => $block,
					'computed_css_rules' => $css,
					'unique_selector' => $unique_selector,
				]
            );

            // Render block with features.
            return $this->getUpdatedHTML($html, $cache_data['classname']);
        }

		$args['force_update_classname'] = $unique_class_name !== $base_unique_class_name;

		// Represent html string.
        $html = $this->getUpdatedHTML($html, $unique_class_name, $args);

		// Normalize inline styles while doing transpiling.
		$inline_styles = $this->normalizeInlineStyles($unique_selector);

		/**
         * Get parser object.
         *
         * @var Parser $parser the instance of Parser class.
         */
        $parser = $this->app->make(Parser::class);
		$parser->setSupports($supports);
		$parser->setInlineStyles($inline_styles['root'] ?? []);

        // Computation css rules for current block by server side style engine...
        $computed_css_rules = $parser->getCss(compact('block', 'unique_selector'));

		// Render block with features.
        $html = $this->renderBlockWithFeatures($html, compact('block', 'unique_selector', 'computed_css_rules'));

		// Push to stack the generated styles by style engine for current processed block.
		if (! empty($computed_css_rules)) {
			$this->styles[] = $computed_css_rules;
        }

		// Push to stack the inline styles for current processed block.
		if ($this->is_doing_transpile && ! empty($inline_styles['child'])) {
			$this->addInlineStylesToStack($inline_styles['child']);
		}

		// If custom css is set, add it to the block css.
		if (! empty($attributes['blockeraCustomCSS']['value'])) {
			$this->styles[] .= preg_replace([ '/(\.|#)block/i', '/&/i' ], $unique_selector, $attributes['blockeraCustomCSS']['value']);
		}

		// Combine all styles to a single string.
		$computed_css_rules = implode(PHP_EOL, array_unique($this->styles));

		// Print css into inline style on "wp_head" action occur.
        blockera_add_inline_css($computed_css_rules);
		
        // Create new block cache data.
        $data = [
            'hash'      => $hash,
            'classname' => $unique_selector,
            'css'       => $computed_css_rules,
        ];

		if ($this->cache_status) {

			// Sets cache data with merge previous data.
			blockera_set_block_cache($cache_key, $data);
		}

		// Resetting styles properties.
		$this->resetStylesProperties();

        return $html;
    }

    /**
     * Returns the string representation of the HTML Tag Processor.
     *
     * @param string $html      the target html string.
     * @param string $classname the unique classname.
	 * @param array  $args the arguments to update html.
     *
     * @return string the update html.
     */
    protected function getUpdatedHTML( string $html, string $classname, array $args): string {

		if (! isset($args['force_update_classname'])) {
			$args['force_update_classname'] = false;
		}
		
        $processor = new \WP_HTML_Tag_Processor($html);

		// Indicate if the first tag is processed.
		$is_processed_first_tag = false;

        while ($processor->next_tag()) {
			$style = $processor->get_attribute('style');

            if (! $is_processed_first_tag) {
				$args['block'] = $this->block;
				$this->updateClassname($processor, $classname, $args);

				// Set the is processed first tag flag to true.
				$is_processed_first_tag = true;
			}

			// Remove style attribute if transpiling.
			if ($this->is_doing_transpile && $style && ! $this->cache_status) {
				// Create css declarations.
				$declarations = $this->createCssDeclarations($processor, blockera_get_normalized_selector($classname), $style ?? '');
				if (! empty($declarations['properties'])) {
					$this->inline_styles[ $declarations['selector'] ] = $declarations['properties'];
				}

				// Remove style attribute.
				$processor->remove_attribute('style');
			}
        }

        return $processor->get_updated_html();
    }

	/**
	 * Reset styles properties.
	 *
	 * @return void
	 */
	protected function resetStylesProperties(): void {
		
		$this->styles        = [];
		$this->inline_styles = [];
	}
}
