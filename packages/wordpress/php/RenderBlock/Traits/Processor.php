<?php

namespace Blockera\WordPress\RenderBlock\Traits;

trait Processor {

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

		foreach ($inline_styles as $root_selector => $styles) {
			$inners = array_filter(
				$styles,
				function ( $style) {
					return is_array($style);
				}
			);

			foreach ($inners as $selector => $declarations) {
				// Normalize declarations.
				$declarations = preg_replace('/\:/', ': ', $declarations);
				// Create css rule.
				$css_rule = $selector . ' { ' . implode(';' . PHP_EOL, $declarations) . ' }';

				if (! in_array($css_rule, $this->styles, true)) {
					$this->styles[] = $css_rule;
				}

				unset($styles[ $selector ]);
			}

			// Ensure that the root style is added to the styles property while $styles is not empty.
			if (! empty($styles)) {
				// Normalize styles.
				$styles = preg_replace('/\:/', ': ', $styles);
				// Create css rule.
				$css_rule = $root_selector . ' { ' . implode(';' . PHP_EOL, $styles) . ' }';

				if (! in_array($css_rule, $this->styles, true)) {
					$this->styles[] = $css_rule;	
				}
			}
		}
	}
}
