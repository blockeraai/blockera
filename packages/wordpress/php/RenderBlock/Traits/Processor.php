<?php

namespace Blockera\WordPress\RenderBlock\Traits;

trait Processor {

	/**
     * Store styles.
     *
     * @var array
     */
    protected array $styles = [];

	/**
	 * Global css props classes.
	 *
	 * @var array
	 */
	protected array $global_css_props_classes = [];

	/**
	 * Set the global css props classes.
	 *
	 * @param array $global_css_props_classes The global css props classes.
	 *
	 * @return void
	 */
	public function setGlobalCssPropsClasses( array $global_css_props_classes): void {
		$this->global_css_props_classes = $global_css_props_classes;
	}

	/**
     * Update classname for current tag.
     *
     * @param \WP_HTML_Tag_Processor $processor The HTML tag processor object.
     * @param string                 $classname The classname to update.
	 * @param array                  $block The block data.
     *
     * @return void
     */
    protected function updateClassname( \WP_HTML_Tag_Processor $processor, string $classname, array $block): void {
        $previous_class  = $processor->get_attribute('class');
        $regexp          = blockera_get_unique_class_name_regex();
		$final_classname = '';

        if (! empty($previous_class) && ! empty($classname)) {

            if (preg_match($regexp, $classname, $matches) && ! preg_match($regexp, $previous_class)) {

                $final_classname = $classname . ' ' . $previous_class;
            } else {

				if (! preg_match($regexp, $classname) && ! str_contains($previous_class, $classname)) {

					$final_classname = $classname . ' ' . $previous_class;
				} else {

					if (! str_contains($classname, 'be-transpiled') && preg_match($regexp, $previous_class) && preg_match($regexp, $classname)) {

						$classname = preg_replace('/\./', ' ', $classname);

						if (str_contains($previous_class, $classname)) {

							if (! str_contains($previous_class, 'be-transpiled') && ! blockera_block_has_icon($block)) {
								$previous_class = str_replace($classname, $classname . ' be-transpiled', $previous_class);
							}
						}
					}

					$final_classname = $previous_class;
				}
			}
        }

		// Prevent double adding the be-transpiled class to block wrapper element.
		// It should has not icon element.
		if (! empty($final_classname) && ! str_contains($final_classname, 'be-transpiled') && ! blockera_block_has_icon($block)) {
			$final_classname .= ' be-transpiled';
		}

		if (! empty($final_classname)) {
			$processor->set_attribute('class', $final_classname);
		}
    }

	/**
	 * Add css props classes to the classname of current tag.
	 * Update classname based on global css props classes.
	 * Just for backward compatibility with WordPress original block output.
	 *
	 * @param \WP_HTML_Tag_Processor $processor The HTML tag processor object.
	 * @param string                 $style The style attribute value.
	 * @param array                  $block The block data.
	 *
	 * @return void
	 */
	protected function addCssPropsClasses( \WP_HTML_Tag_Processor $processor, string $style, array $block): void {
		if (! $style) {
			return;
		}

		foreach ($this->global_css_props_classes as $prop => $prop_class) {
			if (str_contains($style, $prop)) {
				$this->updateClassname($processor, $prop_class, $block);
			}
		}
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
		$class      = $processor->get_attribute('class');

		if ($style) {
			$declarations = explode(';', $style);
			$root_class   = str_replace('.blockera-block.', '', $selector);

			if (! empty(trim($class ?? '')) && ! preg_match('/wp-(block|element|elements)/i', $class) && ! str_contains($class, $root_class)) {
				$properties = $declarations;
				// to shorten the selector, remove the be-transpiled class from the classname.
				$class = str_replace(' be-transpiled', '', $class);
				// concatenate the selector with the current tag classname to ensure that the specificity is high.
				$selector = $selector . ' .' . preg_replace('/\s/', '.', $class);
			} else {
				$properties = $declarations;
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
				$inner_style = $selector . ' { ' . implode(';' . PHP_EOL, $declarations) . ' }';

				if (! in_array($inner_style, $this->styles, true)) {
					$this->styles[] = $inner_style;
				}

				unset($styles[ $selector ]);
			}

			// Ensure that the root style is added to the styles property while $styles is not empty.
			if (! empty($styles)) {
				$root_style = $root_selector . ' { ' . implode(';' . PHP_EOL, $styles) . ' }';

				if (! in_array($root_style, $this->styles, true)) {
					$this->styles[] = $root_style;
				}
			}
		}
	}
}
