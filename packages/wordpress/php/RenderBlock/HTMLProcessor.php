<?php

namespace Blockera\WordPress\RenderBlock;

/**
 * Class HTMLProcessor
 *
 * Handles HTML manipulation using regular expressions including:
 * - Inline style collection and CSS generation
 * - Wrapper element classname management
 * - HTML placeholder system for variable replacement
 * - Children detection
 *
 * @package Blockera\WordPress\RenderBlock
 */
class HTMLProcessor {

	/**
	 * The root selector.
	 *
	 * @var string
	 */
	protected string $root_selector = '';

	/**
	 * Placeholder prefix for HTML variable replacement.
	 *
	 * @var string
	 */
	protected string $placeholder_prefix = '${{BLOCKERA_HTML_PLACEHOLDER';

	/**
	 * Store collected CSS rules.
	 *
	 * @var array
	 */
	protected array $css_rules = [];

	/**
	 * Cache for compiled regex patterns.
	 *
	 * @var array
	 */
	protected static array $pattern_cache = [];

	/**
	 * Cache for self-closing tags lookup.
	 *
	 * @var array
	 */
	protected static array $self_closing_tags = [
		'IMG'    => true,
		'BR'     => true,
		'HR'     => true,
		'INPUT'  => true,
		'META'   => true,
		'LINK'   => true,
		'AREA'   => true,
		'BASE'   => true,
		'COL'    => true,
		'EMBED'  => true,
		'PARAM'  => true,
		'SOURCE' => true,
		'TRACK'  => true,
		'WBR'    => true,
	];

	/**
	 * List of CSS properties to remove from block wrapper inline styles.
	 * 
	 * This list should be generated dynamically by using following script in Blockera main repository:
	 * ".patch/block_wrapper_properties_to_remove.js"
	 *
	 * @var array
	 */
	protected static array $block_wrapper_properties_to_remove = [
		'align-items',
		'align-self',
		'aspect-ratio',
		'background',
		'background-color',
		'border',
		'border-bottom-color',
		'border-bottom-left-radius',
		'border-bottom-right-radius',
		'border-bottom-style',
		'border-bottom-width',
		'border-color',
		'border-left-color',
		'border-left-width',
		'border-radius',
		'border-right-color',
		'border-right-width',
		'border-style',
		'border-top-color',
		'border-top-left-radius',
		'border-top-right-radius',
		'border-top-style',
		'border-top-width',
		'border-width',
		'box-shadow',
		'color',
		'display',
		'flex',
		'flex-basis',
		'flex-direction',
		'font-size',
		'font-style',
		'font-weight',
		'gap',
		'height',
		'justify-content',
		'letter-spacing',
		'line-height',
		'margin-bottom',
		'margin-left',
		'margin-right',
		'margin-top',
		'min-height',
		'min-width',
		'object-fit',
		'overflow',
		'padding',
		'padding-bottom',
		'padding-left',
		'padding-right',
		'padding-top',
		'position',
		'text-align',
		'text-decoration',
		'text-transform',
		'transition',
		'width',
		'word-spacing',
		'writing-mode',
	];

	/**
	 * Cached property pattern for style cleanup.
	 *
	 * @var string|null
	 */
	protected static ?string $style_property_pattern = null;

	/**
	 * Sets the root selector property.
	 *
	 * @param string $selector
	 * @return void
	 */
	public function setRootSelector( string $selector) {
		$this->root_selector = $selector;
	}

	/**
	 * Extract the root selector from the self::$root_selector unnormalized.
	 *
	 * @return string The extracted root selector.
	 */
	protected function extractRootSelector(): string {
		if ('' === $this->root_selector) {
			return '';
		}
		
		// Check for '>' first (child combinator has higher priority).
		$pos = strpos($this->root_selector, '>');
		if ( false !== $pos ) {
			// Extract first part before '>'.
			return trim( substr( $this->root_selector, 0, $pos ) );
		}
		
		// Check for space (descendant combinator).
		$pos = strpos($this->root_selector, ' ');
		if ( false !== $pos ) {
			// Extract first part before ' '.
			return trim( substr( $this->root_selector, 0, $pos ) );
		}
		
		// No split needed - return trimmed original.
		return trim($this->root_selector);
	}
	
	/**
	 * Detect the wrapper tag of input HTML without children.
	 * Returns the tag name of the outermost element if it has no child elements.
	 *
	 * @param string $html The HTML content to analyze.
	 *
	 * @return string|null The wrapper tag name (uppercase) or null if not found or has children.
	 */
	protected function detectWrapperTag( string $html ): ?string {

		$html = trim( $html );

		if ( empty( $html ) ) {
			return null;
		}

		/**
		 * Static compiled regex pattern - compiled once, reused across all calls.
		 * This avoids regex compilation overhead on every function call.
		 * Removed capturing group since we only need full match ($opening_match[0]).
		 * Pattern: < + tag name (letter + letters/numbers) + word boundary + attributes + >
		 */ 
		static $pattern = '/^<[a-zA-Z][a-zA-Z0-9]*\b[^>]*>/i';

		// Match the opening tag with its name and attributes.
		if ( ! preg_match( $pattern, $html, $opening_match ) ) {
			return null;
		}

		return $opening_match[0];
	}

	/**
	 * Cleanup HTML by removing inline styles and adding related css global properties classname to elements.
	 * Convert inline styles to css rules.
	 * Collect inline styles from HTML and generate CSS declarations.
	 * Removes inline styles from elements after collection.
	 *
	 * Priority for selector generation:
	 * 1. ID attribute (#element-id)
	 * 2. Classname (filtered) + tag name (tag.class1.class2)
	 * 3. Tag name only
	 *
	 * @param string $html The HTML content to process.
	 * @param array  $global_css_props_classes The global CSS props classes. Optional.
	 *
	 * @return array Array with 'html' (cleaned) and 'css' (generated rules).
	 */
	public function cleanupHTML( string $html, array $global_css_props_classes = [] ): array {

		if ( empty( $html ) ) {
			return [
				'html' => $html,
				'css'  => '',
			];
		}

		$this->css_rules = [];

		/**
		 * Extract inline styles from HTML.
		 * 
		 * Regex pattern breakdown:
		 * - Group 1: ([a-zA-Z][a-zA-Z0-9]*) - Tag name (e.g., 'div', 'span')
		 * - Group 2: ([^>]*?) - Attributes before style attribute (before_attrs)
		 * - Group 3: ([^"\']+) - Style attribute value (style)
		 * - Group 4: ([^>]*) - Attributes after style attribute (after_attrs)
		 * 
		 * Note: \b before 'style' ensures it's a separate word, not part of another attribute (e.g., 'displaystyle')
		 */ 
		preg_match_all(
			'/<([a-zA-Z][a-zA-Z0-9]*)\s+([^>]*?)\bstyle\s*=\s*["\']([^"\']+)["\']([^>]*)>/is',
			$html,
			$matches,
			PREG_SET_ORDER | PREG_OFFSET_CAPTURE
		);

		if ( empty( $matches ) ) {

			// Remove WP has-*- classes from elements that have blockera-block-* classes.
			$html = $this->removeHasClassesFromBlockeraBlocks( $html );

			return [
				'html' => $html,
				'css'  => '',
			];
		}

		$wrapper                = $this->detectWrapperTag($html);
		$offset                 = 0;
		$has_global_css_classes = ! empty( $global_css_props_classes );
		$cleaned_html           = $html;

		$is_debug_mode = defined('BLOCKERA_DEVELOPMENT') && BLOCKERA_DEVELOPMENT;

		// Process each element with inline styles if detected.
		foreach ( $matches as $key => $match ) {
			$full_tag           = $match[0][0];
			$full_tag_len       = strlen( $full_tag );
			$tag_name           = strtolower( $match[1][0] );
			$before_attrs       = $match[2][0];
			$style              = $match[3][0];
			$after_attrs        = $match[4][0];
			$position           = $match[0][1] + $offset;
			$has_blockera_class = false !== strpos( $full_tag, 'blockera-block');
			$is_wrapper         = ( $is_debug_mode || $has_blockera_class ) && 0 === $key && $full_tag === $wrapper;
			$selector           = null;

			// Optimize: Combine attrs in single operation.
			$all_attrs      = trim( $before_attrs . ' ' . $after_attrs );
			$classes_to_add = [];

			if ( ! empty( $style ) ) {

				// style formatting.
				$style = str_replace(':', ': ', $style);

				// Add properties classes to the element if it is main wrapper tag.
				// It prevents adding properties classes to other elements.
				if ( $has_global_css_classes && $is_wrapper ) {
					foreach ( $global_css_props_classes as $prop => $prop_class ) {
						if ( str_contains( $style, $prop ) ) {
							$classes_to_add[] = $prop_class;
						}
					}
				}

				/**
				 * Compute special styles from style attribute value.
				 * and remove specials from style attribute value.
				 * to make sure it will be added to element if it is not empty.
				 * 
				 * Special styles are styles that we should nor remove as it can break the JS code. 
				 * for example there is a display:none; on the cancel reply link in comments form block
				 * and for showing it the inline styles will be removed to show it! 
				 * If we convert it to css rules it will not be shown!
				 */
				[
					'style' => $style, // specials are removed.
					'special_styles' => $special_styles,
				] = $this->computeSpecialStyles( $style );

				if ( ! empty( $style ) ) {
					$selector = $this->generateSelectorFromAttrs( $tag_name, $all_attrs, ! $is_wrapper );

					// replace !important style to reduce it's specificity.
					$this->css_rules[ $is_wrapper ? 'root': 'child' ][] = $selector . ' { ' . str_replace(' !important', '', $style) . ' }';
				}

				// Add special styles to the style attribute.
				// to make sure it will be added to element if it is not empty.
				$style = $special_styles;
			}

			// Build new tag.
			$new_tag = '<' . $tag_name;

			// Add style attribute if there was style that should not be removed (specials).
			if ( ! empty( $style ) ) {
				$all_attrs = trim( $before_attrs . ' style="' . rtrim($style, ';') . '" ' . $after_attrs );
			}

			if ( ! empty( $classes_to_add ) ) {
				$all_attrs = $this->addClassnamesToAttrs( $all_attrs, $classes_to_add );
			}

			if ( ! empty( $all_attrs ) ) {
				$new_tag .= ' ' . $all_attrs;
			}

			$new_tag .= '>';

			// Replace the original html with the cleaned html.
			$cleaned_html = substr_replace( $cleaned_html, $new_tag, $position, $full_tag_len );
			$offset      += strlen( $new_tag ) - $full_tag_len;
		}

		// Remove WP has-* classes from elements that have blockera-block-* classes.
		$cleaned_html = $this->removeHasClassesFromBlockeraBlocks( $cleaned_html );

		return [
			'html' => $cleaned_html,
			'css'  => $this->formatCssRules(),
		];
	}


	/**
	 * Cleanup blockera blocks inline styles.
	 * The inline styles are added by block editor but Blockera adds them.
	 * By removing it we reduce the later clean process and also reduce the CSS size.
	 * 
	 * This is of properties that should be removed is self::$block_wrapper_properties_to_remove property.
	 * 
	 * @param string $html The HTML content to process.
	 * 
	 * @return string The cleaned HTML content.
	 */
	public function cleanupBlockeraBlocksInlineStyles( string $html ): string {

		/**
		 * 1. All Blockera Blocks
		 * 
		 * General cleanup: Remove specific CSS properties from inline styles
		 * for elements with "blockera-block-" class.
		 * 
		 * This regex:
		 * 1. Matches tags with "blockera-block-" class that have inline styles
		 * 2. Removes specified CSS properties from the style attribute
		 * 3. Removes the style attribute entirely if it becomes empty
		 * 
		 * Properties removed: font-size, line-height, letter-spacing, text-transform, 
		 * text-align, font-style, font-weight, font-family
		 */
		$result = preg_replace_callback(
            '/<([a-zA-Z][a-zA-Z0-9]*)\s+([^>]*?\bclass\s*=\s*["\'][^"\']*blockera-block-[^"\']*["\'][^>]*)>/is',
            function( $matches ) {
                return $this->cleanupStyleAttribute( $matches[1], $matches[2], $matches[0] );
            },
            $html
		);

		// Handle null return from preg_replace_callback (error case).
		if ( null === $result ) {
			return $html;
		}

		$html = $result;

		/**
		 * 2. Button Block
		 * 
		 * Cleanup: Remove specific CSS properties from inline styles
		 * for <a> tags inside elements with both "blockera-block" and "wp-block-button" classes.
		 * 
		 * This regex:
		 * 1. Matches parent tags with both "blockera-block" and "wp-block-button" classes
		 * 2. Captures the entire element content (from opening to closing tag)
		 * 3. Finds <a> tags inside and removes specified CSS properties from their style attributes
		 * 4. Removes the style attribute entirely if it becomes empty
		 */
		$result = preg_replace_callback(
            '/<([a-zA-Z][a-zA-Z0-9]*)\s+([^>]*?\bclass\s*=\s*["\'](?=[^"\']*blockera-block)(?=[^"\']*wp-block-button)[^"\']*["\'][^>]*)>((?:[^<]|<(?!\/\1>))*)<\/\1>/is',
            function( $matches ) {
                $tag_name  = $matches[1];
                $all_attrs = $matches[2];
                $content   = $matches[3];
                
                // Clean up <a> tags inside the content.
                $cleaned_content = preg_replace_callback(
                    '/<a\s+([^>]*)>/is',
                    function( $a_matches ) {
                        return $this->cleanupStyleAttribute( 'a', $a_matches[1], $a_matches[0] );
                    },
                    $content
                );
                
                // Handle null return from nested preg_replace_callback.
                if ( null === $cleaned_content ) {
                    $cleaned_content = $content;
                }
                
                return '<' . $tag_name . ( ! empty( $all_attrs ) ? ' ' . $all_attrs : '' ) . '>' . $cleaned_content . '</' . $tag_name . '>';
            },
            $html
		);

		// Handle null return from preg_replace_callback (error case).
		if ( null === $result ) {
			$result = $html;
		}

		$html = $result;

		/**
		 * 3. Accordion Heading Block
		 * 
		 * Cleanup: Remove specific CSS properties from inline styles
		 * for elements with "wp-block-accordion-heading__toggle" class inside elements
		 * with both "blockera-block" and "wp-block-accordion-heading" classes.
		 * 
		 * This regex:
		 * 1. Matches parent tags with both "blockera-block" and "wp-block-accordion-heading" classes
		 * 2. Captures the entire element content (from opening to closing tag)
		 * 3. Finds elements with "wp-block-accordion-heading__toggle" class inside and removes specified CSS properties from their style attributes
		 * 4. Removes the style attribute entirely if it becomes empty
		 */
		$result = preg_replace_callback(
            '/<([a-zA-Z][a-zA-Z0-9]*)\s+([^>]*?\bclass\s*=\s*["\'](?=[^"\']*blockera-block)(?=[^"\']*wp-block-accordion-heading)[^"\']*["\'][^>]*)>((?:[^<]|<(?!\/\1>))*)<\/\1>/is',
            function( $matches ) {
                $tag_name  = $matches[1];
                $all_attrs = $matches[2];
                $content   = $matches[3];
                
                // Clean up elements with wp-block-accordion-heading__toggle class inside the content.
                $cleaned_content = preg_replace_callback(
                    '/<([a-zA-Z][a-zA-Z0-9]*)\s+([^>]*?\bclass\s*=\s*["\'][^"\']*wp-block-accordion-heading__toggle[^"\']*["\'][^>]*)>/is',
                    function( $toggle_matches ) {
                        return $this->cleanupStyleAttribute( $toggle_matches[1], $toggle_matches[2], $toggle_matches[0] );
                    },
                    $content
                );
                
                // Handle null return from nested preg_replace_callback.
                if ( null === $cleaned_content ) {
                    $cleaned_content = $content;
                }
                
                return '<' . $tag_name . ( ! empty( $all_attrs ) ? ' ' . $all_attrs : '' ) . '>' . $cleaned_content . '</' . $tag_name . '>';
            },
            $html
		);

		// Handle null return from preg_replace_callback (error case).
		if ( null === $result ) {
			$result = $html;
		}

		$html = $result;

		/**
		 * 4. Image Block
		 * 
		 * Cleanup: Remove specific CSS properties from inline styles
		 * for <img> tags inside elements with both "blockera-block" and "wp-block-image" classes.
		 * 
		 * This regex:
		 * 1. Matches parent tags with both "blockera-block" and "wp-block-image" classes
		 * 2. Captures the entire element content (from opening to closing tag)
		 * 3. Finds <img> tags inside and removes specified CSS properties from their style attributes
		 * 4. Removes the style attribute entirely if it becomes empty
		 */
		$result = preg_replace_callback(
            '/<([a-zA-Z][a-zA-Z0-9]*)\s+([^>]*?\bclass\s*=\s*["\'](?=[^"\']*blockera-block)(?=[^"\']*wp-block-image)[^"\']*["\'][^>]*)>((?:[^<]|<(?!\/\1>))*)<\/\1>/is',
            function( $matches ) {
                $tag_name  = $matches[1];
                $all_attrs = $matches[2];
                $content   = $matches[3];
                
                // Clean up <img /> tags inside the content (img tags are always self-closing, including multiline).
                $cleaned_content = preg_replace_callback(
                    '/<img\s+([^>]*?)\s*\/\s*>/is',
                    function( $img_matches ) {
                        $attrs    = trim( $img_matches[1] );
                        $original = $img_matches[0];

                        $cleaned = $this->cleanupStyleAttribute( 'img', $attrs, $original );
                        
                        // Ensure self-closing format is preserved (img tags are always self-closing).
                        if ( ! str_ends_with( $cleaned, '/>' ) ) {
                            $cleaned = rtrim( $cleaned, '>' ) . ' />';
                        }

                        return $cleaned;
                    },
                    $content
                );
                
                // Handle null return from nested preg_replace_callback.
                if ( null === $cleaned_content ) {
                    $cleaned_content = $content;
                }
                
                return '<' . $tag_name . ( ! empty( $all_attrs ) ? ' ' . $all_attrs : '' ) . '>' . $cleaned_content . '</' . $tag_name . '>';
            },
            $html
		);

		// Handle null return from preg_replace_callback (error case).
		if ( null === $result ) {
			return $html;
		}

		return $result;
	}

	/**
	 * Clean up style attribute by removing specified CSS properties.
	 * 
	 * This used to cleanup blockera blocks inline styles. 
	 * The cleanupBlockeraBlocksInlineStyles() method.
	 * 
	 * Optimized version that uses cached patterns and efficient string operations.
	 * 
	 * @param string $tag_name The HTML tag name.
	 * @param string $all_attrs The attributes string.
	 * @param string $original_match The original matched string to return if no style attribute exists.
	 * 
	 * @return string The cleaned up tag with modified or removed style attribute.
	 */
	protected function cleanupStyleAttribute( string $tag_name, string $all_attrs, string $original_match ): string {
        // Quick check: if 'style' keyword not found, return early.
		if ( false === strpos( $all_attrs, 'style' ) ) {
			return $original_match;
		}

        // Extract style attribute value using regex (needed for proper parsing).
		if ( ! preg_match( '/\bstyle\s*=\s*["\']([^"\']+)["\']/', $all_attrs, $style_matches ) ) {
			return $original_match;
		}

		$style_value = $style_matches[1];
		
        // Build and cache property pattern (only once).
		if ( null === self::$style_property_pattern ) {
			self::$style_property_pattern = '\b(?:' . implode( '|', array_map( 'preg_quote', self::$block_wrapper_properties_to_remove ) ) . ')\s*:\s*[^;]+;?';
		}

        // Remove properties in one pass.
		$style_value = preg_replace( '/' . self::$style_property_pattern . '/i', '', $style_value );
		
        // Clean up: normalize semicolons and trim (combine operations).
		$style_value = trim( preg_replace( '/\s*;\s*/', ';', $style_value ), '; ' );
		
        // Replace or remove style attribute.
		if ( empty( $style_value ) ) {
			// Remove style attribute: find and remove the entire attribute.
			$all_attrs = preg_replace( '/\s*\bstyle\s*=\s*["\'][^"\']*["\']/', '', $all_attrs );
		} else {
			// Replace style value: use captured groups for efficient replacement.
			$all_attrs = preg_replace( '/(\bstyle\s*=\s*["\'])[^"\']*(["\'])/', '$1' . $style_value . '$2', $all_attrs, 1 );
		}
		
        // Normalize whitespace in one pass.
		$all_attrs = preg_replace( '/\s+/', ' ', trim( $all_attrs ) );
		
        // Build result efficiently.
		return '<' . $tag_name . ( $all_attrs ? ' ' . $all_attrs : '' ) . '>';
	}

	/**
	 * Add classname to HTML element(s).
	 *
	 * @param string $html        The HTML content.
	 * @param string $classname   The classname to add.
	 * @param string $selector    Optional CSS selector to target specific elements (e.g., 'div', '.class', '#id').
	 *                            If empty, adds to wrapper element only.
	 *
	 * @return string The HTML with classname added.
	 */
	public function addClassname( string $html, string $classname, string $selector = '' ): string {

		if ( empty( $html ) || empty( $classname ) ) {
			return $html;
		}

		if ( empty( $selector ) ) {
			return $this->addClassnameToWrapper( $html, $classname );
		}

		return $this->addClassnameToElements( $html, $classname, $selector );
	}

	/**
	 * Update the classname of the wrapper (first) HTML element.
	 *
	 * @param string $html      The HTML content.
	 * @param string $classname The classname to add/update.
	 *
	 * @return string The HTML with updated classname.
	 */
	public function updateWrapperClassname( string $html, string $classname ): string {

		if ( empty( $html ) || empty( $classname ) ) {
			return $html;
		}

		return $this->addClassnameToWrapper( $html, $classname );
	}

	/**
	 * Add classname to wrapper (first) element.
	 *
	 * @param string $html      The HTML content.
	 * @param string $classname The classname to add.
	 *
	 * @return string The HTML with updated classname.
	 */
	protected function addClassnameToWrapper( string $html, string $classname ): string {

		// Optimize: Try to match tag with attributes first (most common case).
		if ( preg_match( '/<([a-zA-Z][a-zA-Z0-9]*)\s+([^>]*)>/s', $html, $match, PREG_OFFSET_CAPTURE ) ) {
			$tag_name     = $match[1][0];
			$attrs        = $match[2][0];
			$position     = $match[0][1];
			$full_tag     = $match[0][0];
			$full_tag_len = strlen( $full_tag );

			// Optimize: Use single regex to find and capture class attribute.
			if ( preg_match( '/class\s*=\s*["\']([^"\']*)["\']/', $attrs, $class_match, PREG_OFFSET_CAPTURE ) ) {
				$existing_class = $class_match[1][0];
				
				// Optimize: Quick check if classname already exists.
				if ( str_contains( $existing_class, $classname ) ) {
					$classes = explode( ' ', $existing_class );
					if ( in_array( $classname, $classes, true ) ) {
						return $html;
					}
				}

				$classes = array_filter( explode( ' ', $existing_class ) );

				// Check if any class matches blockera_get_unique_class_name_regex() pattern.
				$unique_class_pattern = blockera_get_unique_class_name_regex();
				$replaced             = false;
				
				foreach ( $classes as $index => $class ) {
					if ( preg_match( $unique_class_pattern, $class ) ) {
						$classes[ $index ] = $classname;
						$replaced          = true;
						break;
					}
				}

				// If no pattern match found, add the new classname.
				if ( ! $replaced ) {
					$classes[] = $classname;
				}

				$new_class = implode( ' ', $classes );
				$new_attrs = preg_replace(
					'/class\s*=\s*["\'][^"\']*["\']/',
					'class="' . $new_class . '"',
					$attrs,
					1
				);

				$new_tag = '<' . $tag_name . ' ' . $new_attrs . '>';
			} else {
				// No class attribute exists.
				$attrs_trimmed = trim( $attrs );
				$new_tag       = '<' . $tag_name . ' class="' . $classname . '"' . ( $attrs_trimmed ? ' ' . $attrs_trimmed : '' ) . '>';
			}

			return substr_replace( $html, $new_tag, $position, $full_tag_len );
		}

		// Optimize: Handle tag without attributes.
		if ( preg_match( '/<([a-zA-Z][a-zA-Z0-9]*)\s*>/s', $html, $match, PREG_OFFSET_CAPTURE ) ) {
			$tag_name = $match[1][0];
			$position = $match[0][1];
			$full_tag = $match[0][0];
			$new_tag  = '<' . $tag_name . ' class="' . $classname . '">';

			return substr_replace( $html, $new_tag, $position, strlen( $full_tag ) );
		}

		return $html;
	}

	/**
	 * Add classname to elements matching a selector.
	 *
	 * @param string $html      The HTML content.
	 * @param string $classname The classname to add.
	 * @param string $selector  CSS selector (tag, .class, #id).
	 *
	 * @return string The HTML with classname added to matching elements.
	 */
	protected function addClassnameToElements( string $html, string $classname, string $selector ): string {

		$pattern = $this->buildPatternFromSelector( $selector );

		if ( empty( $pattern ) ) {
			return $html;
		}

		preg_match_all( $pattern, $html, $matches, PREG_SET_ORDER | PREG_OFFSET_CAPTURE );

		if ( empty( $matches ) ) {
			return $html;
		}

		$offset = 0;

		foreach ( $matches as $match ) {
			$full_tag     = $match[0][0];
			$full_tag_len = strlen( $full_tag );
			$position     = $match[0][1] + $offset;
			$tag_name     = $match[1][0];
			$attrs        = isset( $match[2] ) ? $match[2][0] : '';

			if ( preg_match( '/class\s*=\s*["\']([^"\']*)["\']/', $attrs, $class_match ) ) {
				$existing_class = $class_match[1];
				
				// Optimize: Quick check before array operation.
				if ( str_contains( $existing_class, $classname ) ) {
					$classes = explode( ' ', $existing_class );
					if ( in_array( $classname, $classes, true ) ) {
						continue;
					}
				}

				$classes   = array_filter( explode( ' ', $existing_class ) );
				$classes[] = $classname;
				$new_class = implode( ' ', $classes );
				$new_attrs = preg_replace(
					'/class\s*=\s*["\'][^"\']*["\']/',
					'class="' . $new_class . '"',
					$attrs,
					1
				);

				$new_tag = '<' . $tag_name . ' ' . trim( $new_attrs ) . '>';
			} else {
				$attrs_trimmed = trim( $attrs );
				$new_tag       = '<' . $tag_name . ' class="' . $classname . '"' . ( $attrs_trimmed ? ' ' . $attrs_trimmed : '' ) . '>';
			}

			$html    = substr_replace( $html, $new_tag, $position, $full_tag_len );
			$offset += strlen( $new_tag ) - $full_tag_len;
		}

		return $html;
	}

	/**
	 * Build regex pattern from CSS selector.
	 *
	 * @param string $selector CSS selector (tag, .class, #id).
	 *
	 * @return string Regex pattern.
	 */
	protected function buildPatternFromSelector( string $selector ): string {

		$selector = trim( $selector );

		// Optimize: Cache compiled patterns.
		if ( isset( self::$pattern_cache[ $selector ] ) ) {
			return self::$pattern_cache[ $selector ];
		}

		$pattern = '';

		if ( str_starts_with( $selector, '#' ) ) {
			$id      = substr( $selector, 1 );
			$pattern = '/<([a-zA-Z][a-zA-Z0-9]*)\s+([^>]*?id\s*=\s*["\']' . preg_quote( $id, '/' ) . '["\'][^>]*)>/s';
		} elseif ( str_starts_with( $selector, '.' ) ) {
			$class   = substr( $selector, 1 );
			$pattern = '/<([a-zA-Z][a-zA-Z0-9]*)\s+([^>]*?class\s*=\s*["\'][^"\']*\b' . preg_quote( $class, '/' ) . '\b[^"\']*["\'][^>]*)>/s';
		} else {
			$pattern = '/<(' . preg_quote( $selector, '/' ) . ')(\s+[^>]*)?>/s';
		}

		self::$pattern_cache[ $selector ] = $pattern;

		return $pattern;
	}

	/**
	 * Replace specific HTML content with a placeholder variable.
	 *
	 * @param string $html         The original HTML content.
	 * @param string $target_html  The specific HTML to replace.
	 * @param string $placeholder_id Optional unique identifier for the placeholder.
	 *
	 * @return array Array with 'html' (modified) and 'placeholder' (used placeholder).
	 */
	public function replaceHtmlWithPlaceholder( string $html, string $target_html, string $placeholder_id = '' ): array {

		if ( empty( $html ) || empty( $target_html ) ) {
			return [
				'html'        => $html,
				'placeholder' => '',
			];
		}

		if ( '' === $placeholder_id ) {
			$placeholder_id = blockera_get_small_random_hash();
		}

		$placeholder   = $this->placeholder_prefix . '_' . $placeholder_id . '}}';
		$modified_html = str_replace( $target_html, $placeholder, $html );

		return [
			'html'        => $modified_html,
			'placeholder' => $placeholder,
		];
	}

	/**
	 * Replace placeholder variable with HTML content.
	 *
	 * @param string $html         The HTML content containing placeholder.
	 * @param string $target_html  The HTML to replace placeholder with.
	 * @param string $placeholder_id Optional unique identifier for the placeholder.
	 *
	 * @return string The HTML with placeholder replaced.
	 */
	public function replacePlaceholderWithHtml( string $html, string $target_html, string $placeholder_id = '' ): string {

		if ( empty( $html ) || empty( $target_html ) ) {
			return $html;
		}

		$placeholder = empty( $placeholder_id )
			? $this->placeholder_prefix . '}}'
			: $placeholder_id;

		return str_replace( $placeholder, $target_html, $html );
	}

	/**
	 * Add classnames to an attributes string.
	 *
	 * @param string $attrs    The attributes string.
	 * @param array  $classnames Array of classnames to add.
	 *
	 * @return string The updated attributes string.
	 */
	protected function addClassnamesToAttrs( string $attrs, array $classnames ): string {

		if ( empty( $classnames ) ) {
			return $attrs;
		}

		if ( preg_match( '/class\s*=\s*["\']([^"\']*)["\']/', $attrs, $class_match ) ) {
			$existing_class = $class_match[1];
			$classes        = array_filter( explode( ' ', $existing_class ) );
			
			// Optimize: Use array_flip for O(1) lookup instead of in_array O(n).
			$existing_lookup = array_flip( $classes );
			
			foreach ( $classnames as $classname ) {
				if ( ! isset( $existing_lookup[ $classname ] ) ) {
					$classes[] = $classname;
				}
			}

			$new_class = implode( ' ', $classes );
			$attrs     = preg_replace(
				'/class\s*=\s*["\'][^"\']*["\']/',
				'class="' . $new_class . '"',
				$attrs,
				1
			);
		} else {
			$new_class = implode( ' ', $classnames );
			$attrs     = 'class="' . $new_class . '" ' . $attrs;
		}

		return $attrs;
	}


	/**
	 * Remove has-* classes from elements that have blockera-block-* classes.
	 * Uses regex with lookahead for efficient single-pass processing.
	 *
	 * @param string $html The HTML content to process.
	 *
	 * @return string The HTML with has-* classes removed from blockera-block elements.
	 */
	protected function removeHasClassesFromBlockeraBlocks( string $html ): string {

		if ( empty( $html ) ) {
			return $html;
		}

		/**
		 * Single regex pattern to match class attributes that contain blockera-block-* and at least one removable class.
		 * Uses positive lookahead to check conditions before matching the class value.
		 * Pattern breakdown:
		 * - (<[^>]*?\bclass\s*=\s*["\']) - Captures the opening tag and class attribute start.
		 * - (?=[^"\']*blockera-block-[^"\']*) - Positive lookahead: class must contain blockera-block-*.
		 * - (?=[^"\']*(?:has-[^"\']*-font-family|...)) - Positive lookahead: class must contain at least one removable class.
		 * - ([^"\']*) - Captures the actual class value.
		 * - (["\']) - Captures the closing quote.
		 */
		$pattern = '/(<[^>]*?\bclass\s*=\s*["\'])(?=[^"\']*blockera-block-[^"\']*)(?=[^"\']*(?:has-[^"\']*-font-family|has-[^"\']*-font-size|has-[^"\']*-color))([^"\']*)(["\'])/i';

		// Single regex pattern to remove all matching classes: matches class with word boundaries and optional whitespace.
		$remove_pattern = '/\s*\b(?:has-[a-zA-Z0-9-]+-font-family|has-[a-zA-Z0-9-]+-font-size|has-(?!text-|link-|border-)[a-zA-Z0-9-]+-color)\b\s*/';

		return preg_replace_callback(
			$pattern,
			function ( $matches ) use ( $remove_pattern ) {
				$quote_start = $matches[1];
				$class_value = $matches[2];
				$quote_end   = $matches[3];

				// Single regex replace: remove all matching classes and clean up multiple spaces.
				$new_class_value = preg_replace( $remove_pattern, ' ', $class_value );
				$new_class_value = preg_replace( '/\s+/', ' ', trim( $new_class_value ) );

				return $quote_start . $new_class_value . $quote_end;
			},
			$html
		);
	}

	/**
	 * Generate CSS selector from tag name and attributes.
	 *
	 * Priority: Classname > ID > Tag
	 *
	 * @param string $tag_name The HTML tag name.
	 * @param string $attrs    The attributes string.
	 * @param bool   $with_tagname Whether to include tag name in selector.
	 *
	 * @return string The generated CSS selector.
	 */
	protected function generateSelectorFromAttrs( string $tag_name, string $attrs, bool $with_tagname = false ): string {

		$root_selector = $this->root_selector;

		// if the generating selector with tag name and root selector contains child.
		// in this case we should extract root and use it.
		// Optimize: Use strpos instead of preg_match for simple character checks (faster, less memory).
		if ($with_tagname && '' !== $root_selector && ( false !== strpos($root_selector, '>') || false !== strpos($root_selector, ' ') )) {
			$root_selector = $this->extractRootSelector();
		}

		// First check for class name (preferred over ID).
		if ( preg_match( '/class\s*=\s*["\']([^"\']+)["\']/', $attrs, $class_match ) ) {
			$filtered_classes = $this->filterClassnames( $class_match[1] );

			if ( ! empty( $filtered_classes ) ) {
				$concatenated_classes = '.' . implode( '.', $filtered_classes );

				if ( $with_tagname ) {
					// Optimize: Direct string comparison is faster than empty() for strings.
					if ( '' === $root_selector ) {
						return $tag_name . $concatenated_classes;
					}
					return ':where(' . $root_selector . ' ' . $tag_name . $concatenated_classes . ')';
				}

				return ':where(' . $concatenated_classes . ')';
			}
		}

		// If no class name found, check for ID.
		if ( preg_match( '/id\s*=\s*["\']([^"\']+)["\']/', $attrs, $id_match ) ) {
			$target_selector = $tag_name . '#' . $id_match[1];

			if ($with_tagname && '' !== $root_selector) {
				return ':where(' . $root_selector . ' ' . $target_selector . ')';
			}

			return ':where(' . $target_selector . ')';
		}

		if ($with_tagname && '' !== $root_selector) {
			return ':where(' . $root_selector . ' ' . $tag_name . ')';
		}

		return ':where(' . $tag_name . ')';
	}

	/**
	 * Filter classnames to pick specific ones matching blockera patterns or numeric patterns.
	 * Returns first two matching classnames.
	 *
	 * Patterns:
	 * - blockera-block-* classnames
	 * - Numeric classnames (contains numbers)
	 *
	 * @param string $classname The class attribute value.
	 *
	 * @return array Filtered array of classnames (max 2).
	 */
	protected function filterClassnames( string $classname ): array {

		$classes        = array_filter( explode( ' ', $classname ) );
		$filtered       = [];
		$filtered_count = 0;
		$max_count      = 2;

		// Use isset lookup instead of in_array for O(1) instead of O(n) (eliminates linear search overhead).
		$filtered_lookup = [];

		foreach ( $classes as $class ) {
			// Early break when we have 2 classnames (reduces unnecessary iterations).
			if ( $filtered_count >= $max_count ) {
				break;
			}

			// if classname starts with "blockera-block-*", we should return it immediately.
			if ( str_contains( $class, 'blockera-block' ) ) {
				$filtered[]                = $class;
				$filtered_lookup[ $class ] = true;
				++$filtered_count;
				// Early break if we already have max count after adding blockera class.
				if ( $filtered_count >= $max_count ) {
					break;
				}
				continue;
			}
			
			// if classname contains numbers, we should add it to the filtered array.
			if ( preg_match( '/\d/', $class ) && ! isset( $filtered_lookup[ $class ] ) ) {
				$filtered[]                = $class;
				$filtered_lookup[ $class ] = true;
				++$filtered_count;
			}
		}

		if ( empty( $filtered ) && ! empty( $classes ) ) {
			// If no blockera or numeric classes found, use first available classes.
			$filtered = array_slice( $classes, 0, $max_count );
		}

		return $filtered;
	}

	/**
	 * Compute special styles from style attribute value.
	 *
	 * @param string $style The style attribute value.
	 *
	 * @return array The computed special styles.
	 */
	protected static function computeSpecialStyles( string $style ): array {

		$output = [
			'style' => $style,
			'special_styles' => '',
		];

		/**
		 * Match display:none with optional whitespace, optional !important, and semicolon
		 * Pattern: display (optional whitespace) : (optional whitespace) none (optional whitespace) (optional !important) (optional whitespace) ;
		 */
		if ( preg_match( '/\bdisplay\s*:\s*none\s*(!important)?\s*;/i', $style, $matches ) ) {
			$output['special_styles'] = $matches[0];
			$output['style']          = preg_replace( '/\bdisplay\s*:\s*none\s*(!important)?\s*;/i', '', $style );
		}

		return $output;
	}

	/**
	 * Format collected CSS rules into a CSS string.
	 *
	 * @return string The formatted CSS rules.
	 */
	protected function formatCssRules(): string {

		if ( empty( $this->css_rules ) ) {
			return '';
		}

		$style = '';
		
		foreach ( $this->css_rules as $css_rules ) {
			$style .= implode( PHP_EOL, $css_rules );
		}

		return $style;
	}
}
