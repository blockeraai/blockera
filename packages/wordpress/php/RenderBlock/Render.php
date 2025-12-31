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

		/**
		 * Dom parser instance.
		 * Create dom parser instance only once when the first feature is processed.
		 * 
		 * @var DomParser $dom_parser
		 */
		$dom_parser = null;

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

			if (empty($dom_parser)) {
				$dom_parser = $fm->getApp()->dom_parser::str_get_html($html);
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
		if (! blockera_is_supported_block($block)) {
			return $html;
		}

		// Store the block array.
		$this->block = $block;

		$extracted_name = explode('/', $block['blockName']);

		$this->id = $extracted_name[1];

		$attributes              = $block['attrs'];
		$should_update_classname = false;
		$base_unique_class_name  = '';

		if (preg_match(blockera_get_unique_class_name_regex(), $attributes['className'], $matches)) {
			$base_unique_class_name = $matches[0];
		}
		
		// Generate the blockera block unique css classname.
		if ( ! $base_unique_class_name ) {
			$base_unique_class_name = 'blockera-block blockera-block-' . blockera_get_small_random_hash();
		}

		// Ensure the classname is unique across all blocks if not inside query loop.
		if (! QueryLoopContext::isInside()) {
			[
				'classname' => $unique_class_name,
				'updated' => $should_update_classname,
				'computed_css' => $computed_css,
			]                = $this->computeFinalCSS($base_unique_class_name, $block);
			$unique_selector = blockera_get_normalized_selector($unique_class_name);
		} else {
			$unique_class_name = $base_unique_class_name;
			$unique_selector   = blockera_get_normalized_selector($unique_class_name);
			$computed_css      = isset($attributes['blockeraComputedCss']) ? base64_decode($attributes['blockeraComputedCss'], true) : '';
		}

		$args['unique_selector'] = $unique_selector;

		// Update the html with the new classname if the classname is updated.
		if ($should_update_classname) {
			$html                   = str_replace($base_unique_class_name, $unique_class_name, $html);
			$base_unique_class_name = $unique_class_name;
		}

		// Fire up all features to manipulate the html.
		$html = $this->getFeaturesHTML(
            $html,
            [
				'block' => $this->block,
				'unique_selector' => $args['unique_selector'],
            ]
		);

		// Check if blockeraComputedCss exists - if so, use cached CSS instead of generating from attributes.
		if ( ! empty($computed_css)) {
			$this->styles[] = $computed_css;
		}

		$styles = $this->getStyles();

		/**
		 * Add properties classes to the elements.
		 * 
		 * Like blockera-has-font-weight, blockera-has-font-size, etc.
		 */
		$classes_to_add = [];
		foreach ( $this->global_css_props_classes as $prop => $prop_class ) {
			if ( str_contains( $styles, $prop ) ) {
				$classes_to_add[] = $prop_class;
			}
		}

		if ( ! empty( $classes_to_add ) ) {
			// Build replacement string efficiently: avoid trim() overhead by building directly.
			// Since $classes_to_add is non-empty, we always have a space separator.
			$new_class_name = $base_unique_class_name . ' ' . implode( ' ', $classes_to_add );

			// Use regex to replace only when $base_unique_class_name is followed by " or ' or space.
			// Cache preg_quote result and use simpler pattern for better performance.
			$escaped = preg_quote($base_unique_class_name, '/');
			$html    = preg_replace('/' . $escaped . '(?=["\'\s])/', $new_class_name, $html);
		}

		// We should ensure the generated css is unique.
		// Because maybe this generated css related to the loop blocks and we should not print duplicate css for them.
		if (! empty($styles) && ! in_array($styles, $this->getGeneratedCSS(), true)) {
			$this->updateGeneratedCSS($styles);
		}

		// Enqueue block assets.
		$this->enqueueBlockAssets( $extracted_name[0], $this->id );

		// Resetting styles properties.
		$this->resetStylesProperties();

        return $html;
    }

	/**
	 * Enqueue block assets.
	 *
	 * @param string $block_library_prefix The block library prefix (core, woocommerce, third-party, etc.).
	 *
	 * @return void
	 */
	protected function enqueueBlockAssets( string $block_library_prefix ): void {
		$this->setContext('blocks-core');
		$this->setSubContext(blockera_get_block_library_name( $block_library_prefix ));
		$this->enqueueAssets($this->args['plugin_base_path'], $this->args['plugin_base_url'], $this->args['plugin_version']);
	}

	/**
	 * Reset styles properties.
	 *
	 * @return void
	 */
	public function resetStylesProperties(): void {
		
		$this->styles        = [];
		$this->inline_styles = '';
	}

	/**
	 * Process content cleanup: extract inline styles and convert them to CSS rules.
	 *
	 * @param string $content The HTML content to process.
	 *
	 * @return string The processed content with inline styles removed.
	 */
	public function processContentCleanup( string $content): string {

		// Ensure blocks are rendered (content usually already is, but this is safe).
		if ( has_blocks( $content ) ) {
			$content = do_blocks( $content );
		}

		// Extract inline styles and convert them to CSS rules.
		$content_cleanup = $this->app->make(ContentCleanup::class);
		$result          = $content_cleanup->process( $content );

		$content = $result['content'];
		$style   = $result['style'];

		if (! empty($style)) {
			// Add inline styles to the generated css to ensure it's printed with other styles .
			$this->updateGeneratedCSS($style);
		}

		return $content;
	}

}
