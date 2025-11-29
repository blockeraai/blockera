<?php

namespace Blockera\WordPress\RenderBlock\Traits;

trait Processor {

	/**
	 * Store the is doing transpiling flag property.
	 *
	 * @var bool $is_doing_transpile 
	 */
	protected bool $is_doing_transpile = false;

	/**
	 * The classname for the transpiled block.
	 *
	 * @var string
	 */
	protected string $transpile_classname = 'be-transpiled';

	/**
     * Store styles.
     *
     * @var array
     */
    protected array $styles = [];

	/**
	 * Store inline styles collected from the block html.
	 *
	 * @var array $inline_styles the inline styles array.
	 */
	protected array $inline_styles = [];

	/**
	 * Normalize inline styles.
	 *
	 * @param string $classname the block classname.
	 *
	 * @return array the normalized inline styles.
	 */
	protected function normalizeInlineStyles( string $classname): array {
		$inline_styles = [];

		if (! empty($this->inline_styles) && $this->is_doing_transpile) {

			foreach ($this->inline_styles as $_selector => $declarations) {

				foreach ($declarations as $declaration) {
					if (empty(trim($declaration))) {
						continue;
					}

					// Normalizing declaration.
					$declaration = preg_replace('/\:/', ': ', trim($declaration));

					// handle root element inline styles.
					if ($_selector === $classname) {
						$inline_styles['root'][ $classname ][] = $declaration;
						continue;
					}

					// handle child elements inline styles.
					$inline_styles['child'][ $_selector ][] = $declaration;
				}
			}
		}

		return $inline_styles;
	}

	/**
	 * Convert inline styles to css declarations.
	 *
	 * @param \WP_HTML_Tag_Processor $processor The HTML tag processor object.
	 * @param string                 $selector The selector.
	 * @param string                 $style The style attribute value.
	 *
	 * @return array The css declarations.
	 */
	protected function createCssDeclarations( \WP_HTML_Tag_Processor $processor, string $selector, string $style): array {
		$properties = '';
		$class      = $processor->get_attribute('class') ?? '';

		$classes = explode(' ', $class);
		$classes = array_filter(
            $classes,
            function ( $class) {
				return $this->transpile_classname !== $class;
			}
        );

		if ($style) {
			$properties    = explode(';', $style);
			$root_class    = str_replace('.blockera-block.', '', $selector);
			$class_details = blockera_get_wp_classname_details($class);

			// Customize selector based on current tag being processed.
			$tag_name = $processor->get_tag();

			$picked_classname = blockera_pick_specific_classname($classes);
			$child_selector   = blockera_create_css_selector($picked_classname);

			if (! str_contains($class, $root_class)) {
				if (! ( $class_details['is_matched'] ?? false )) {
					// First class as a selector.
					$selector = $selector . ' ' . strtolower($tag_name) . $child_selector;
				}
			} else {				
				// Check if this is the first tag by checking if class contains the root class.
				$is_first_tag = $class && str_contains($class, str_replace('.blockera-block.', '', $selector));
				
				// If not the first tag, append tag name or classname to selector for specificity.
				if (! $class && ! $is_first_tag && $tag_name) {
					$selector = $selector . ' ' . strtolower($tag_name);
				} elseif (! $is_first_tag && $tag_name) {
					$selector = $selector . ' ' . strtolower($tag_name) . $child_selector;
				}
			}
		}

		return compact('properties', 'selector');
	}

	/**
	 * Add inline styles to stack.
	 *
	 * @param array $inline_styles The inline styles.
	 *
	 * @return void
	 */
	protected function addInlineStylesToStack( array $inline_styles): void {
		
		if (empty($inline_styles)) {
			return;
		}

		foreach ($inline_styles as $selector => $styles) {
			$css = implode(';' . PHP_EOL, $styles);

			if (! str_ends_with($css, ';')) {
				$css .= ';';
			}

			// Create css rule.
			$css_rule = $selector . ' { ' . $css . ' }';

			if (! in_array($css_rule, $this->styles, true)) {
				$this->styles[] = $css_rule;
			}
		}
	}
}
