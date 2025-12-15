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
		$extract_root = explode('>', $this->root_selector);
			
		if (1 < count($extract_root)) {
			$root_selector = trim($extract_root[0]);
		} else {
			$extract_root = explode(' ', $this->root_selector);
			
			if (1 < count($extract_root)) {
				$root_selector = trim($extract_root[0]);
			}
		}

		return $root_selector;
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

		// Match the opening tag with its name and attributes.
		if ( ! preg_match( '/^<([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/i', $html, $opening_match ) ) {
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
				'css'  => [],
			];
		}

		// Get the wrapper tag markup.
		$wrapper = $this->detectWrapperTag($html);

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
				'css'  => [],
			];
		}

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

			// Optimize: Combine attrs in single operation.
			$all_attrs = trim( $before_attrs . ' ' . $after_attrs );

			$selector = $this->generateSelectorFromAttrs( $tag_name, $all_attrs, ! $is_wrapper );

			$classes_to_add = [];

			if ( ! empty( $style ) ) {

				// Add properties classes to the element if it has blockera class and global css classes.
				// It prevents adding properties classes to other elements.
				if ( $has_global_css_classes && $has_blockera_class ) {
					foreach ( $global_css_props_classes as $prop => $prop_class ) {
						if ( str_contains( $style, $prop ) ) {
							$classes_to_add[] = $prop_class;
						}
					}
				}

				if ( ! empty( $selector ) ) {
					$parsed       = $this->parseStyleDeclarations( $style, $is_wrapper );
					$declarations = $parsed['declarations'];
					$style        = $parsed['styles'];

					if ( ! empty( $declarations ) ) {
						$this->css_rules[ $is_wrapper ? 'root': 'child' ][ $selector ] = array_unique($declarations);
					}
				}
			}

			// Build new tag.
			$new_tag = '<' . $tag_name;

			// add style attribute if there was style that should not be removed.
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
		if ($with_tagname && preg_match('/>|\s/', $this->root_selector)) {
			$root_selector = $this->extractRootSelector();
		}

		// First check for class name (preferred over ID).
		if ( preg_match( '/class\s*=\s*["\']([^"\']+)["\']/', $attrs, $class_match ) ) {
			$filtered_classes = $this->filterClassnames( $class_match[1] );

			if ( ! empty( $filtered_classes ) ) {
				$concatenated_classes = '.' . implode( '.', $filtered_classes );

				if ( $with_tagname ) {
					return empty( $root_selector )
						? $tag_name . $concatenated_classes
						: $root_selector . ' :where(' . $tag_name . $concatenated_classes . ')';
				}

				return $concatenated_classes;
			}
		}

		// If no class name found, check for ID.
		if ( preg_match( '/id\s*=\s*["\']([^"\']+)["\']/', $attrs, $id_match ) ) {
			$target_selector = $tag_name . '#' . $id_match[1];

			if ($with_tagname && ! empty($root_selector)) {
				return  $root_selector . ' :where(' . $target_selector . ')';
			}

			return $target_selector;
		}

		if ($with_tagname && ! empty($root_selector)) {
			return $root_selector . ' :where(' . $tag_name . ')';
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
	 * Parse style attribute value into declarations array.
	 *
	 * @param string $style The style attribute value.
	 * @param bool   $basic_flag The basic flag. If true, only convert parse declarations to array.
	 *
	 * @return array Array with 'declarations' (regular CSS declarations) and 'styles' (special style declarations like display: none).
	 */
	public static function parseStyleDeclarations( string $style, bool $basic_flag = true ): array {

		$style = trim( $style );

		if ( '' === $style ) {
			return [
				'declarations'  => [],
				'styles' => [],
			];
		}

		$parts = explode( ';', $style );

		// If basic flag is true, return the parts array in declarations.
		if ( true === $basic_flag ) {
			return [
				'declarations'   => $parts,
				'styles' => '',
			];
		}

		$declarations   = [];
		$special_styles = '';
		$count          = count( $parts );

		for ( $i = 0; $i < $count; ++$i ) {
			$part = trim( $parts[ $i ] );

			if ( '' === $part ) {
				continue;
			}

			$colon_pos = strpos( $part, ':' );

			if ( false === $colon_pos ) {
				continue;
			}

			$property = trim( substr( $part, 0, $colon_pos ) );
			$value    = trim( substr( $part, $colon_pos + 1 ) );

			if ( '' === $property || '' === $value ) {
				continue;
			}

			// Check if this is a special style (e.g., display: none).
			if ( self::isSpecialStyle( $property, $value ) ) {
				// Optimize: Direct string concatenation instead of building declaration first (reduces temporary string allocations).
				$special_styles .= $property . ': ' . $value . ';';
			} else {
				$declarations[] = $property . ': ' . $value;
			}
		}

		return [
			'declarations'   => $declarations,
			'styles' => $special_styles,
		];
	}

	/**
	 * Check if a style property and value combination is a special style.
	 *
	 * @param string $property The CSS property name.
	 * @param string $value    The CSS property value.
	 *
	 * @return bool True if it's a special style, false otherwise.
	 */
	protected static function isSpecialStyle( string $property, string $value ): bool {

		// Check for display: none.
		if ( 'display' === $property && 'none' === $value ) {
			return true;
		}

		// Add more special style checks here as needed.

		return false;
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
				if ( 'root' === $id ) {
					// Optimize: Pre-allocate array and use direct iteration instead of array_map/array_filter chains.
					// This reduces intermediate array allocations and function call overhead.
					$merged_declarations = [];
					$declarations_count  = count($declarations);
					
					for ($i = 0; $i < $declarations_count; ++$i) {
						$part = trim($declarations[ $i ]);
						if ('' === $part) {
							continue;
						}
						
						$colon_pos = strpos($part, ':');
						if (false === $colon_pos) {
							$merged_declarations[ $part ] = ' ';
							continue;
						}
						
						$property                         = trim(substr($part, 0, $colon_pos));
						$value                            = trim(substr($part, $colon_pos + 1));
						$merged_declarations[ $property ] = $value;
					}

					$this->css_rules[ $id ][ $selector ] = $merged_declarations;
					continue;
				}

				// Optimize: Use direct string operations instead of implode when possible (reduces array operations).
				if (empty($declarations)) {
					$this->css_rules[ $id ][ $selector ] = ' { }';
					continue;
				}
				
				// Use foreach to handle both numeric and associative arrays (avoids undefined array key errors).
				$declarations_str = '';
				$first            = true;
				foreach ($declarations as $declaration) {
					if (! $first) {
						$declarations_str .= '; ';
					}
					$declarations_str .= trim($declaration);
					$first             = false;
				}
				
				$declarations_str_len = strlen($declarations_str);
				if (0 === $declarations_str_len || ';' !== $declarations_str[ $declarations_str_len - 1 ]) {
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


