<?php

namespace Blockera\WordPress\RenderBlock;

use Blockera\Editor\StyleEngine;
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
	 * @param array       $args the arguments to render block.
     */
    public function __construct( Application $app, array $args = []) { 
        $this->app  = $app;
		$this->args = $args;
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
    protected function getFeaturesHTML( string $html, array $args): string {

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
        if (! blockera_is_supported_block($block) || is_admin() || 'core/null' === $block['blockName']) {
            return $html;
        }

		// Skip rendering if the request is a AJAX request or a REST request.
		if (wp_doing_ajax() || blockera_is_skip_request()) {
			return $html;
		}

		// Store the block array.
		$this->block = $block;

		// Handling block setup while exist inside in loop block as a inner block.
		$this->setupBlockInLoop($block);

		$extracted_name = explode('/', $block['blockName']);

		$this->id = $extracted_name[1];
		$this->setContext('blocks-core');
		$this->setSubContext(blockera_get_block_library_name( $extracted_name[0] ));
		$this->enqueueAssets($this->args['plugin_base_path'], $this->args['plugin_base_url'], $this->args['plugin_version']);

        // Extract block attributes.
        $attributes = $block['attrs'];
        // Generate blockera hash identify with "blockeraPropsId" attribute value.
        $blockera_hash_id = blockera_get_small_random_hash($attributes['blockeraPropsId']);
		// Get blockera block unique css classname.
        $blockera_class_name = sprintf('blockera-block blockera-block-%s', $blockera_hash_id);
		// Get normalized blockera block unique css classname.
        $base_unique_class_name = $attributes['className'] ?? $blockera_class_name;

		if (! $this->is_doing_transpile_loop) {
			// Ensure the classname is unique across all blocks.
			$unique_class_name = $this->ensureUniqueClassname(
				$base_unique_class_name,
				$attributes['blockeraPropsId'],
				$block
			);
			$unique_selector   = blockera_get_normalized_selector($unique_class_name);
		} else {
			$unique_class_name = $base_unique_class_name;
			$unique_selector   = blockera_get_normalized_selector($unique_class_name);
		}

		$args['unique_selector'] = $unique_selector;

		// Represent html string.
        $html = $this->getUpdatedHTML($html, $unique_class_name, $args);

		// Generate css by style engine.
        $styleEngine = $this->app->make(
            StyleEngine::class,
            [
				'block' => $block,
				'fallbackSelector' => $unique_selector,
			]
        );
		$styleEngine->setSupports($supports);
		$styleEngine->setInlineStyles($this->inline_styles['root'] ?? []);
        $computed_css_rules = $styleEngine->getStylesheet();

		// Push to stack the generated styles by style engine for current processed block.
		if (! empty($computed_css_rules)) {
			$this->styles[] = $computed_css_rules;
        }

		// Push to stack the inline styles for current processed block.
		if (! empty($this->inline_styles['child'])) {
			$this->addInlineStylesToStack($this->inline_styles['child']);
		}

		// If custom css is set, add it to the block css.
		if (! empty($attributes['blockeraCustomCSS']['value'])) {
			// Replace the "block placeholder", "&" and "\\\\u0026" with the unique selector.
			// because the custom css maybe contains the block placeholder, "&" and "\\\\u0026" to indicate the block element selector.
			$this->styles[] = preg_replace([ '/(\.|#)block/i', '/&/i', '/\\\\u0026/' ], $unique_selector, $attributes['blockeraCustomCSS']['value']);
		}

		$styles = $this->getStyles();

		if (! empty($styles)) {
			$this->updateGeneratedCSS($styles);
		}

		// Resetting styles properties.
		$this->resetStylesProperties();

		// Enqueue block assets.
		$this->enqueueBlockAssets($block);

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

		$classes = explode(' ', $classname);

		if (count($classes) > 1) {
			$filtered_classes = array_filter(
                $classes,
                function( string $class): bool {
					return ! str_starts_with($class, 'blockera-block-');
				}
            );

			$classname = $filtered_classes[0] ?? $classes[0];
		}
		
		$args['block'] = $this->block;

		if (empty($this->block['innerBlocks'])) {
			$html = $this->cleanup($html, $classname, $args['unique_selector']);
		} else {
			$html = $this->replaceHTML($html);
			$html = $this->cleanup($html, $classname, $args['unique_selector']);
			$html = $this->replacePlaceholders($html);

			// Reset the processed html inside the parent block.
			$this->resetProcessedHTML();
		}

		$html = $this->getFeaturesHTML(
            $html,
            [
				'block' => $this->block,
				'unique_selector' => $args['unique_selector'],
			]
		);

		$this->updateProcessedHTML($html);
		
		// Render block with features.
        return $html;
    }

	/**
	 * Enqueue block assets.
	 *
	 * @param array $block The block array.
	 *
	 * @return void
	 */
	protected function enqueueBlockAssets( array $block): void {
		$extracted_name = explode('/', $block['blockName']);

		$this->id = $extracted_name[1];
		$this->setContext('blocks-core');
		$this->setSubContext(blockera_get_block_library_name( $extracted_name[0] ));
		$this->enqueueAssets($this->args['plugin_base_path'], $this->args['plugin_base_url'], $this->args['plugin_version']);
	}

	/**
	 * Reset styles properties.
	 *
	 * @return void
	 */
	public function resetStylesProperties(): void {
		
		$this->styles        = [];
		$this->inline_styles = [];
	}
}
