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
	 * @param array  $global_css_props_classes The global CSS props classes.
	 *
	 * @return array Array with 'html' (cleaned) and 'css' (generated rules).
	 */
	public function cleanupHTML( string $html, array $global_css_props_classes = [] ): array {

		if ( empty( $html ) ) {
			return [
				'html' => $html,
				'css'  => [],
			];
		}

		$this->css_rules = [];
		$cleaned_html    = $html;

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

		$offset = 0;

		// Process each element with inline styles if detected.
		foreach ( $matches as $key => $match ) {
			$full_tag     = $match[0][0];
			$tag_name     = strtolower( $match[1][0] );
			$before_attrs = $match[2][0];
			$style        = $match[3][0];
			$after_attrs  = $match[4][0];
			$position     = $match[0][1] + $offset;

			$all_attrs = $before_attrs . ' ' . $after_attrs;

			$selector = $this->generateSelectorFromAttrs( $tag_name, $all_attrs, 0 !== $key );

			if ( ! empty( $selector ) && ! empty( $style ) ) {
				$declarations = $this->parseStyleDeclarations( $style );

				if ( ! empty( $declarations ) ) {
					$this->css_rules[ 0 === $key ? 'root': 'child' ][ $selector ] = $declarations;
				}
			}

			$classes_to_add = [];
			if ( ! empty( $global_css_props_classes ) ) {
				foreach ( $global_css_props_classes as $prop => $prop_class ) {
					if ( str_contains( $style, $prop ) ) {
						$classes_to_add[] = $prop_class;
					}
				}
			}

			$updated_attrs = $all_attrs;
			if ( ! empty( $classes_to_add ) ) {
				$updated_attrs = $this->addClassnamesToAttrs( trim($all_attrs), $classes_to_add );
			}
			$updated_attrs = trim( $updated_attrs );

			$new_tag = '<' . $tag_name;

			if ( ! empty( $updated_attrs ) ) {
				$new_tag .= ' ' . $updated_attrs;
			}

			$new_tag .= '>';

			// Replace the original html with the cleaned html, to remove inline styles and update classnames.
			$cleaned_html = substr_replace( $cleaned_html, $new_tag, $position, strlen( $full_tag ) );
			$offset      += strlen( $new_tag ) - strlen( $full_tag );
		}

		return [
			'html' => $cleaned_html,
			'css'  => $this->formatCssRules(),
		];
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

		if ( preg_match( '/<([a-zA-Z][a-zA-Z0-9]*)\s+([^>]*)>/is', $html, $match, PREG_OFFSET_CAPTURE ) ) {
			$tag_name = $match[1][0];
			$attrs    = $match[2][0];
			$position = $match[0][1];
			$full_tag = $match[0][0];

			if ( preg_match( '/class\s*=\s*["\']([^"\']*)["\']/', $attrs, $class_match ) ) {
				$existing_class = $class_match[1];
				$classes        = array_filter( explode( ' ', $existing_class ) );

				// If wrapper already has the same classname, return original HTML.
				if ( in_array( $classname, $classes, true ) ) {
					return $html;
				}

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
					$attrs
				);

				$new_tag = '<' . $tag_name . ' ' . $new_attrs . '>';
			} else {
				$new_tag = '<' . $tag_name . ' class="' . $classname . '" ' . trim( $attrs ) . '>';
			}

			return substr_replace( $html, $new_tag, $position, strlen( $full_tag ) );
		}

		if ( preg_match( '/<([a-zA-Z][a-zA-Z0-9]*)\s*>/is', $html, $match, PREG_OFFSET_CAPTURE ) ) {
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
			$full_tag = $match[0][0];
			$position = $match[0][1] + $offset;
			$tag_name = $match[1][0];
			$attrs    = isset( $match[2] ) ? $match[2][0] : '';

			if ( preg_match( '/class\s*=\s*["\']([^"\']*)["\']/', $attrs, $class_match ) ) {
				$existing_class = $class_match[1];
				$classes        = array_filter( explode( ' ', $existing_class ) );

				if ( in_array( $classname, $classes, true ) ) {
					continue;
				}

				$classes[] = $classname;
				$new_class = implode( ' ', $classes );
				$new_attrs = preg_replace(
					'/class\s*=\s*["\'][^"\']*["\']/',
					'class="' . $new_class . '"',
					$attrs
				);

				$new_tag = '<' . $tag_name . ' ' . trim( $new_attrs ) . '>';
			} else {
				if ( ! empty( $attrs ) ) {
					$new_tag = '<' . $tag_name . ' class="' . $classname . '" ' . trim( $attrs ) . '>';
				} else {
					$new_tag = '<' . $tag_name . ' class="' . $classname . '">';
				}
			}

			$html    = substr_replace( $html, $new_tag, $position, strlen( $full_tag ) );
			$offset += strlen( $new_tag ) - strlen( $full_tag );
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

		if ( str_starts_with( $selector, '#' ) ) {
			$id = substr( $selector, 1 );
			return '/<([a-zA-Z][a-zA-Z0-9]*)\s+([^>]*?id\s*=\s*["\']' . preg_quote( $id, '/' ) . '["\'][^>]*)>/is';
		}

		if ( str_starts_with( $selector, '.' ) ) {
			$class = substr( $selector, 1 );
			return '/<([a-zA-Z][a-zA-Z0-9]*)\s+([^>]*?class\s*=\s*["\'][^"\']*\b' . preg_quote( $class, '/' ) . '\b[^"\']*["\'][^>]*)>/is';
		}

		return '/<(' . preg_quote( $selector, '/' ) . ')(\s+[^>]*)?>/is';
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

		if ( empty( $placeholder_id ) ) {
			$placeholder_id = $this->generatePlaceholderId();
		}

		$placeholder   = $this->formatPlaceholder( $placeholder_id );
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
	 * Detect if HTML element has children (nested HTML elements).
	 *
	 * @param string $html The HTML content to check.
	 *
	 * @return bool True if has children elements, false otherwise.
	 */
	public function hasChildren( string $html ): bool {

		if ( empty( $html ) ) {
			return false;
		}

		$html = trim( $html );

		if ( ! preg_match( '/<([a-zA-Z][a-zA-Z0-9]*)\s*[^>]*>/i', $html, $opening_match ) ) {
			return false;
		}

		$tag_name = strtoupper( $opening_match[1] );

		$self_closing_tags = [
			'IMG',
			'BR',
			'HR',
			'INPUT',
			'META',
			'LINK',
			'AREA',
			'BASE',
			'COL',
			'EMBED',
			'PARAM',
			'SOURCE',
			'TRACK',
			'WBR',
		];

		if ( in_array( $tag_name, $self_closing_tags, true ) ) {
			return false;
		}

		$opening_pattern = '/<' . preg_quote( $tag_name, '/' ) . '(?:\s[^>]*)?\s*>/i';
		$closing_pattern = '/<\/' . preg_quote( $tag_name, '/' ) . '\s*>/i';

		if ( ! preg_match( $opening_pattern, $html, $opening_matches, PREG_OFFSET_CAPTURE ) ) {
			return false;
		}

		if ( ! preg_match( $closing_pattern, $html, $closing_matches, PREG_OFFSET_CAPTURE ) ) {
			return false;
		}

		$opening_end   = $opening_matches[0][1] + strlen( $opening_matches[0][0] );
		$closing_start = $closing_matches[0][1];

		if ( $closing_start <= $opening_end ) {
			return false;
		}

		$inner_content = substr( $html, $opening_end, $closing_start - $opening_end );
		$inner_content = trim( $inner_content );

		if ( empty( $inner_content ) ) {
			return false;
		}

		return (bool) preg_match( '/<[a-zA-Z][^>]*>/', $inner_content );
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
			
			foreach ( $classnames as $classname ) {
				if ( ! in_array( $classname, $classes, true ) ) {
					$classes[] = $classname;
				}
			}

			$new_class = implode( ' ', $classes );
			$attrs     = preg_replace(
				'/class\s*=\s*["\'][^"\']*["\']/',
				'class="' . $new_class . '"',
				$attrs
			);
		} else {
			$new_class = implode( ' ', $classnames );
			$attrs     = 'class="' . $new_class . '" ' . $attrs;
		}

		return $attrs;
	}

	/**
	 * Generate CSS selector from tag name and attributes.
	 *
	 * Priority: ID > Classname + Tag > Tag
	 *
	 * @param string $tag_name The HTML tag name.
	 * @param string $attrs    The attributes string.
	 *
	 * @return string The generated CSS selector.
	 */
	protected function generateSelectorFromAttrs( string $tag_name, string $attrs, bool $with_tagname = false ): string {

		if ( preg_match( '/id\s*=\s*["\']([^"\']+)["\']/', $attrs, $id_match ) ) {
			return '#' . $id_match[1];
		}

		if ( preg_match( '/class\s*=\s*["\']([^"\']+)["\']/', $attrs, $class_match ) ) {
			$classname        = $class_match[1];
			$filtered_classes = $this->filterClassnames( $classname );

			if ( ! empty( $filtered_classes ) ) {
				$concatenated_classes = '.' . implode( '.', $filtered_classes );

				if ( $with_tagname ) {
					return $tag_name . $concatenated_classes;
				}

				return $concatenated_classes;
			}
		}

		return $tag_name;
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

		$classes  = array_filter( explode( ' ', $classname ) );
		$filtered = [];

		foreach ( $classes as $class ) {
			// when we have 2 classnames, we should break the loop.
			if ( count( $filtered ) >= 2 ) {
				break;
			}

			// if classname starts with "blockera-block-*", we should return it immediately.
			if ( str_contains( $class, 'blockera-block' ) ) {
				$filtered[] = $class;
			}
			
			// if classname contains numbers, we should add it to the filtered array.
			if ( preg_match( '/\d/', $class ) && ! in_array( $class, $filtered, true ) ) {
				$filtered[] = $class;
			}
		}

		if ( empty( $filtered ) && ! empty( $classes ) ) {
			// If no blockera or numeric classes found, use first available classes.
			$filtered = array_slice( $classes, 0, 2 );
		}

		return $filtered;
	}

	/**
	 * Parse style attribute value into declarations array.
	 *
	 * @param string $style The style attribute value.
	 * @param bool   $basic_flag The basic flag. If true, only convert parse declarations to array.
	 *
	 * @return array Array of CSS declarations.
	 */
	public static function parseStyleDeclarations( string $style, bool $basic_flag = true ): array {

		$declarations = [];
		$style        = trim( $style );

		if ( empty( $style ) ) {
			return $declarations;
		}

		$parts = explode( ';', $style );

		// If basic flag is true, return the parts array.
		if ( $basic_flag ) {
			return $parts;
		}

		foreach ( $parts as $part ) {
			$part = trim( $part );

			if ( empty( $part ) ) {
				continue;
			}

			if ( ! str_contains( $part, ':' ) ) {
				continue;
			}

			list( $property, $value ) = array_map( 'trim', explode( ':', $part, 2 ) );

			if ( ! empty( $property ) && ! empty( $value ) ) {
				$declarations[] = $property . ': ' . $value;
			}
		}

		return $declarations;
	}

	/**
	 * Format collected CSS rules into a CSS string.
	 *
	 * @return array The formatted CSS rules.
	 */
	protected function formatCssRules(): array {

		if ( empty( $this->css_rules ) ) {
			return [];
		}

		foreach ( $this->css_rules as $id => $css_rules ) {
			foreach ($css_rules as $selector => $declarations) {
				$declarations_str = implode( '; ', $declarations );

				if ( 'root' === $id ) {
					$parts = array_filter(array_map('trim', $declarations));

					$merged_declarations = [];

					foreach ($parts as $part) {
						list( $property, $value ) = array_filter(array_map( 'trim', explode( ':', $part) ));
					
						$merged_declarations = array_merge(
							$merged_declarations,
							[ $property => $value ]
						);
					}

					unset($this->css_rules[ $id ][ $selector ]);
					$this->css_rules[ $id ][ $selector ] = $merged_declarations;

					continue;
				}

				if ( ! str_ends_with( $declarations_str, ';' ) ) {
					$declarations_str .= ';';
				}

				$this->css_rules[ $id ][ $selector ] = ' { ' . $declarations_str . ' }';
			}
		}

		return $this->css_rules;
	}

	/**
	 * Generate a unique placeholder ID.
	 *
	 * @return string The generated placeholder ID.
	 */
	protected function generatePlaceholderId(): string {

		return uniqid( '', true );
	}

	/**
	 * Format placeholder with ID.
	 *
	 * @param string $placeholder_id The placeholder ID.
	 *
	 * @return string The formatted placeholder.
	 */
	protected function formatPlaceholder( string $placeholder_id ): string {

		return $this->placeholder_prefix . '_' . $placeholder_id . '}}';
	}
}

