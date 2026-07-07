<?php

namespace Blockera\WordPress\RenderBlock;

/**
 * Class ContentCleanup
 *
 * Handles extraction of inline styles from content, converts them to CSS rules,
 * and removes inline styles from elements. Uses efficient regex-based processing
 * with priority-based selector determination.
 *
 * @package Blockera\WordPress\RenderBlock
 */
class ContentCleanup {

	/**
	 * Cache for compiled regex patterns.
	 *
	 * @var array
	 */
	protected static array $pattern_cache = [];

	/**
	 * Collected CSS rules.
	 *
	 * @var array
	 */
	protected array $css_rules = [];

	/**
	 * Cached parent elements index (position => parent_data).
	 *
	 * @var array
	 */
	protected array $parent_index = [];

	/**
	 * Counter for generating unique child class names per parent.
	 * Key is parent class name, value is the current counter.
	 *
	 * @var array<string, int>
	 */
	protected array $parent_child_counters = [];

	/**
	 * List of CSS classes that should be excluded from processing when found on child elements.
	 * 
	 * Child elements (Priority 3) with these classes will be skipped during style extraction.
	 * Root blocks (Priority 1/2) with these classes will still be processed.
	 *
	 * @var array<string>
	 */
	protected static array $excluded_child_classes = [
		'wp-block-cover__background',
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
	 * List of CSS properties and values to preserve in inline styles.
	 * 
	 * Properties listed here will remain in the style attribute instead of being
	 * extracted to external CSS. This is useful for properties that need to remain
	 * inline for functionality (e.g., display: none for hidden elements).
	 * 
	 * Format: ['property-name' => 'value']
	 * 
	 * @var array<string, string>
	 */
	protected static array $preserved_inline_properties = [
		'display' => 'none',
	];

	/**
	 * Cached regex pattern for extracting preserved properties from style values.
	 * 
	 * Built once from $preserved_inline_properties array and cached for performance.
	 * 
	 * @var string|null
	 */
	protected static ?string $preserved_properties_pattern = null;

	/**
	 * Cached property pattern for style cleanup.
	 *
	 * @var string|null
	 */
	protected static ?string $style_property_pattern = null;

	/**
	 * Process content to extract inline styles and convert them to CSS.
	 *
	 * @param string $content The HTML content to process.
	 *
	 * @return array Array with 'content' (processed HTML) and 'style' (CSS without <style> tags) keys.
	 */
	public function process( string $content ): array {

		if ( empty( $content ) ) {
			return [
				'content' => $this->removeHasClassesFromBlockeraBlocks($content),
				'style'   => '',
			];
		}

		// Quick check: if 'style' keyword not found, return early.
		if ( false === strpos( $content, 'style=' ) ) {
			return [
				'content' => $this->removeHasClassesFromBlockeraBlocks($content),
				'style'   => '',
			];
		}

		$this->css_rules             = [];
		$this->parent_index          = [];
		$this->parent_child_counters = [];

		// Build parent index once for efficient lookups.
		$this->buildParentIndex( $content );

		// Find all elements with inline styles.
		$matches = $this->findElementsWithInlineStyles( $content );

		if ( empty( $matches ) ) {
			return [
				'content' => $this->removeHasClassesFromBlockeraBlocks($content),
				'style'   => '',
			];
		}

		// Process matches in reverse order to maintain string positions during replacements.
		$processed_content = $content;
		$matches           = array_reverse( $matches );

		foreach ( $matches as $match ) {
			$full_tag     = $match[0][0];
			$tag_name     = strtolower( $match[1][0] );
			$before_attrs = $match[2][0];
			$style_value  = $match[3][0];
			$after_attrs  = $match[4][0];
			$position     = $match[0][1];

			// Decode HTML entities from attribute value before CSS processing.
			// Values like --separator: &quot;/&quot; must become --separator: "/" so semicolon
			// normalization does not split inside entities such as &quot;.
			$style_value = $this->decodeStyleAttributeValue( $style_value );

			// Determine selector based on priority logic.
			$all_attrs_combined = $before_attrs . ' ' . $after_attrs;
			$child_class_value  = $this->extractClassAttribute( $all_attrs_combined );
			
			// Skip child elements with excluded classes (e.g., wp-block-cover__background).
			if ( $this->shouldSkipChildElement( $child_class_value ) ) {
				continue;
			}
			
			$selector_data = $this->determineSelector( $processed_content, $position, $before_attrs, $after_attrs, $child_class_value );

			// Skip processing if selector is empty (e.g., parent is wp-block-* without blockera-block-*).
			if ( empty( $selector_data['selector'] ) ) {
				continue;
			}

			// Extract preserved properties (e.g., display: none) from style value.
			$extracted            = $this->extractPreservedProperties( $style_value );
			$preserved_properties = $extracted['preserved'];
			$remaining_style      = $extracted['remaining'];

			// Normalize remaining style to check if it's empty.
			$normalized_remaining = $this->normalizeStyleValue( $remaining_style );
			$trimmed_style_value  = trim( $style_value );
			$original_was_empty   = empty( $trimmed_style_value );

			// Special case: If only preserved properties exist (no remaining styles),
			// skip processing entirely - keep inline style as-is, don't add class, don't create CSS rule.
			if ( ! empty( $preserved_properties ) && empty( $normalized_remaining ) && ! $original_was_empty ) {
				// Skip processing - leave the tag unchanged (inline style remains, no class added).
				continue;
			}

			// Extract original class value before processing (to ensure we preserve it).
			// Priority: child_class_value (already extracted) > full_tag.
			$original_class_value = $child_class_value;
			if ( empty( $original_class_value ) ) {
				$original_class_value = $this->extractClassAttribute( $full_tag );
			}

			// Extract and remove inline style from element, preserving specified properties.
			$updated_tag = $this->extractAndRemoveStyle( $tag_name, $before_attrs, $after_attrs, $full_tag, $preserved_properties );

			// If original_class_value is still empty, check if extractAndRemoveStyle preserved a class.
			if ( empty( $original_class_value ) ) {
				$preserved_class = $this->extractClassAttribute( $updated_tag );
				if ( ! empty( $preserved_class ) ) {
					$original_class_value = $preserved_class;
				}
			}

			// If a new class needs to be added, add it to the tag.
			if ( ! empty( $selector_data['new_class'] ) ) {
				if ( ! empty( $original_class_value ) ) {
					// Combine original and new classes.
					$all_classes = trim( $original_class_value . ' ' . $selector_data['new_class'] );
					// Remove existing class attribute, normalize whitespace, and add new class in optimized sequence.
					$updated_tag = preg_replace( '/\s*\bclass\s*=\s*["\'][^"\']*["\']/', '', $updated_tag );
					$updated_tag = trim( preg_replace( '/\s+/', ' ', $updated_tag ) );
					$updated_tag = $this->insertClassAttribute( $updated_tag, $all_classes );
				} else {
					// No original class - just add new class.
					$updated_tag = $this->addClassToTag( $updated_tag, $selector_data['new_class'] );
				}
			}

			// Replace the tag in content.
			// The regex match doesn't include the closing '>', so we need to check if there's one
			// right after the match and include it in the replacement.
			$replace_length = strlen( $full_tag );
			$next_char_pos  = $position + $replace_length;
			if ( $next_char_pos < strlen( $processed_content ) && '>' === $processed_content[ $next_char_pos ] ) {
				// Include the '>' in the replacement.
				$replace_length++;
			}

			$processed_content = substr_replace( $processed_content, $updated_tag, $position, $replace_length );

			// Store CSS rule.
			// Use remaining styles (preserved properties excluded) for CSS output.
			// Determine if we should add CSS rule:
			// - If original style was empty (style=""), create empty CSS rule (;).
			// - If remaining styles are empty after extracting preserved properties, skip CSS rule.
			// - Otherwise, add CSS rule with normalized styles.
			$remaining_is_empty = empty( $normalized_remaining );
			
			if ( $original_was_empty ) {
				// Original style was empty - create empty CSS rule to match old behavior.
				$this->css_rules[] = [
					'selector' => $selector_data['selector'],
					'styles'   => ';',
				];
			} elseif ( ! $remaining_is_empty ) {
				// Remaining styles exist after extracting preserved properties - add CSS rule.
				$this->css_rules[] = [
					'selector' => $selector_data['selector'],
					'styles'   => $normalized_remaining,
				];
			}
			// If original had styles but remaining is empty (all were preserved), skip CSS rule.
		}

		// Build CSS content without <style> tags.
		$css_content = $this->buildStyleContent();

		return [
			'content' => $this->removeHasClassesFromBlockeraBlocks($processed_content),
			'style'   => $css_content,
		];
	}

	/**
	 * Find all elements with inline style attributes using regex.
	 *
	 * @param string $content The HTML content to search.
	 *
	 * @return array Array of matches with PREG_SET_ORDER | PREG_OFFSET_CAPTURE format.
	 */
	protected function findElementsWithInlineStyles( string $content ): array {

		// Pattern allows empty style values (style="") as well as non-empty values.
		// Handles quotes in style values by matching until the matching closing quote.
		// For double-quoted attributes, value can contain single quotes and HTML entities.
		// For single-quoted attributes, value can contain double quotes and HTML entities.
		// Use two separate patterns to handle double and single quotes properly.
		$matches = [];

		// Pattern for double-quoted style attributes.
		$pattern_double = '/<([a-zA-Z][a-zA-Z0-9]*)\s+([^>]*?)\bstyle\s*=\s*"((?:[^"\\\\]|\\\\.|&[^;]*;)*)"([^>]*)/is';
		preg_match_all( $pattern_double, $content, $matches_double, PREG_SET_ORDER | PREG_OFFSET_CAPTURE );
		foreach ( $matches_double as $match ) {
			// Ensure after_attrs doesn't contain '>' and clean it.
			$after_attrs = isset( $match[4] ) ? $match[4] : [ '', 0 ];
			if ( isset( $after_attrs[0] ) ) {
				$after_attrs[0] = str_replace( '>', '', $after_attrs[0] );
			}
			$matches[] = [
				$match[0], // Full match.
				$match[1], // Tag name.
				$match[2], // Before attributes.
				$match[3], // Style value.
				$after_attrs, // After attributes (cleaned).
			];
		}

		// Pattern for single-quoted style attributes.
		$pattern_single = '/<([a-zA-Z][a-zA-Z0-9]*)\s+([^>]*?)\bstyle\s*=\s*\'((?:[^\'\\\\]|\\\\.|&[^;]*;)*)\'([^>]*)/is';
		preg_match_all( $pattern_single, $content, $matches_single, PREG_SET_ORDER | PREG_OFFSET_CAPTURE );
		foreach ( $matches_single as $match ) {
			// Ensure after_attrs doesn't contain '>' and clean it.
			$after_attrs = isset( $match[4] ) ? $match[4] : [ '', 0 ];
			if ( isset( $after_attrs[0] ) ) {
				$after_attrs[0] = str_replace( '>', '', $after_attrs[0] );
			}
			$matches[] = [
				$match[0], // Full match.
				$match[1], // Tag name.
				$match[2], // Before attributes.
				$match[3], // Style value.
				$after_attrs, // After attributes (cleaned).
			];
		}

		return $matches;
	}

	/**
	 * Determine selector for an element based on priority logic.
	 *
	 * Priority 1: blockera-block-* class
	 * Priority 2: wp-block-* class
	 *             - If wp-block-* contains underscore (_), continue to Priority 3
	 *             - If wp-block-* has no underscore, skip processing (return empty selector)
	 * Priority 3: Search backwards for parent element with blockera-block-* or wp-block-* class
	 *             and combine with child element classes
	 *             - If parent has blockera-block-*, process it
	 *             - If parent has only wp-block-* (no blockera-block-*), skip processing
	 *
	 * @param string $content The full HTML content.
	 * @param int    $position The position of the current element in the content.
	 * @param string $before_attrs Attributes before style attribute.
	 * @param string $after_attrs Attributes after style attribute.
	 * @param string $child_class_value The child element's class attribute value.
	 *
	 * @return array Array with 'selector' and optionally 'new_class' keys.
	 */
	protected function determineSelector( string $content, int $position, string $before_attrs, string $after_attrs, string $child_class_value = '' ): array {

		// Combine all attributes to check for classes.
		$all_attrs = $before_attrs . ' ' . $after_attrs;

		// Extract class attribute value if not provided.
		if ( empty( $child_class_value ) ) {
			$child_class_value = $this->extractClassAttribute( $all_attrs );
		}

		if ( ! empty( $child_class_value ) ) {
			// Priority 1: Check for blockera-block-* class.
			$blockera_class = $this->findBlockeraBlockClass( $child_class_value );
			if ( ! empty( $blockera_class ) ) {
				return [
					'selector' => '.' . $blockera_class,
				];
			}

			// Priority 2: Check for wp-block-* class.
			$wp_block_class = $this->findWpBlockClass( $child_class_value );
			if ( ! empty( $wp_block_class ) ) {
				// If wp-block-* class contains underscore, continue to Priority 3 (search for parent).
				if ( strpos( $wp_block_class, '_' ) !== false ) {
					// Continue to Priority 3 - don't skip yet, let it search for parent.
				} else {
					// wp-block-* without underscore and without blockera-block-* should be skipped.
					// Skip immediately, don't check parent.
					return [
						'selector' => '',
					];
				}
			}
		}

		// Priority 3: Search backwards for parent element.
		$parent_data = $this->searchBackwardsForParent( $content, $position );

		if ( ! empty( $parent_data ) ) {
			// If parent is wp-block-* and doesn't have blockera-block-* class, skip processing.
			if ( $parent_data['is_wp_block'] && ! $parent_data['has_blockera_block'] ) {
				return [
					'selector' => '',
				];
			}

			$parent_selector = '.' . $parent_data['class'];

			// Build child selector from first 2 classes (prioritizing wp-* or classes with numbers).
			// If child has wp-block-* with underscore, use that class in the selector.
			$child_selector = '';
			$unique_class   = null;
			if ( ! empty( $child_class_value ) ) {
				$wp_block_class_with_underscore = $this->findWpBlockClass( $child_class_value );
				if ( ! empty( $wp_block_class_with_underscore ) && strpos( $wp_block_class_with_underscore, '_' ) !== false ) {
					// Use the wp-block-* class with underscore as the child selector.
					$child_selector = '.' . $wp_block_class_with_underscore;
				} else {
					// Check if child has neither blockera-block-* nor wp-block-* classes.
					$blockera_class = $this->findBlockeraBlockClass( $child_class_value );
					$wp_block_class = $this->findWpBlockClass( $child_class_value );
					
					// If element has neither blockera-block-* nor wp-block-* classes, always generate unique class.
					if ( empty( $blockera_class ) && empty( $wp_block_class ) ) {
						$parent_class = $parent_data['class'];

						// Initialize counter for this parent if not exists.
						if ( ! isset( $this->parent_child_counters[ $parent_class ] ) ) {
							$this->parent_child_counters[ $parent_class ] = 0;
						}
						// Increment counter and generate unique class.
						$this->parent_child_counters[ $parent_class ]++;
						$counter        = $this->parent_child_counters[ $parent_class ];
						$unique_class   = $parent_class . '-child-' . $counter;
						$child_selector = '.' . $unique_class;
					} else {
						// Build child selector from first 2 classes (prioritizing wp-* or classes with numbers).
						$child_selector = $this->buildChildSelector( $child_class_value );
					}
				}
			}

			// If child has no classes, generate a unique class using parent class + counter.
			if ( empty( $child_selector ) ) {
				$parent_class = $parent_data['class'];

				// Initialize counter for this parent if not exists.
				if ( ! isset( $this->parent_child_counters[ $parent_class ] ) ) {
					$this->parent_child_counters[ $parent_class ] = 0;
				}
				// Increment counter and generate unique class.
				$this->parent_child_counters[ $parent_class ]++;
				$counter        = $this->parent_child_counters[ $parent_class ];
				$unique_class   = $parent_class . '-child-' . $counter;
				$child_selector = '.' . $unique_class;
			}

			// Combine parent selector with child selector.
			$combined_selector = $parent_selector . ' ' . $child_selector;
			$result            = [
				'selector' => $combined_selector,
			];

			// If we generated a unique class for the child, add it to the result.
			if ( null !== $unique_class ) {
				$result['new_class'] = $unique_class;
			}

			return $result;
		}

		// Fallback: no selector found.
		return [
			'selector' => '',
		];
	}

	/**
	 * Extract class attribute value from attributes string.
	 *
	 * @param string $attrs The attributes string.
	 *
	 * @return string The class attribute value, or empty string if not found.
	 */
	protected function extractClassAttribute( string $attrs ): string {

		if ( ! preg_match( '/\bclass\s*=\s*["\']([^"\']+)["\']/i', $attrs, $matches ) ) {
			return '';
		}

		$result = trim( $matches[1] );
		return $result;
	}

	/**
	 * Check if a child element should be skipped based on excluded classes.
	 * 
	 * Child elements (Priority 3) with excluded classes are skipped.
	 * Root blocks (Priority 1/2) with excluded classes are still processed.
	 *
	 * @param string $class_value The class attribute value.
	 *
	 * @return bool True if element should be skipped, false otherwise.
	 */
	protected function shouldSkipChildElement( string $class_value ): bool {

		if ( empty( $class_value ) ) {
			return false;
		}

		// Check if any excluded class is present (fast string check).
		$has_excluded_class = false;
		foreach ( self::$excluded_child_classes as $excluded_class ) {
			if ( strpos( $class_value, $excluded_class ) !== false ) {
				$has_excluded_class = true;
				break;
			}
		}

		if ( ! $has_excluded_class ) {
			return false;
		}

		// Verify element is NOT a root block.
		// Priority 1: Check for blockera-block-* class (root block).
		$blockera_class = $this->findBlockeraBlockClass( $class_value );
		if ( ! empty( $blockera_class ) ) {
			// Root block - do not skip.
			return false;
		}

		// Priority 2: Check for wp-block-* class without underscore (root block).
		$wp_block_class = $this->findWpBlockClass( $class_value );
		if ( ! empty( $wp_block_class ) && strpos( $wp_block_class, '_' ) === false ) {
			// Root block - do not skip.
			return false;
		}

		// Element has excluded class and is a child element (Priority 3) - skip it.
		return true;
	}

	/**
	 * Find blockera-block-* class in class string.
	 *
	 * @param string $class_value The class attribute value.
	 *
	 * @return string The blockera-block-* class, or empty string if not found.
	 */
	protected function findBlockeraBlockClass( string $class_value ): string {

		// Split classes and search for blockera-block-* pattern.
		$classes = preg_split( '/\s+/', trim( $class_value ) );

		foreach ( $classes as $class ) {
			// Match blockera-block-* pattern (e.g., "blockera-block-abc123").
			if ( preg_match( '/^blockera-block-([^\s]+)$/', $class, $matches ) ) {
				return $class;
			}
		}

		return '';
	}

	/**
	 * Find wp-block-* class in class string.
	 *
	 * @param string $class_value The class attribute value.
	 *
	 * @return string The wp-block-* class, or empty string if not found.
	 */
	protected function findWpBlockClass( string $class_value ): string {

		$classes = preg_split( '/\s+/', trim( $class_value ) );

		foreach ( $classes as $class ) {
			if ( preg_match( '/^wp-(block|element|elements)-/', $class ) ) {
				return $class;
			}
		}

		return '';
	}

	/**
	 * Build child selector from first 2 classes, prioritizing wp-* classes or classes with numbers.
	 *
	 * @param string $class_value The class attribute value.
	 *
	 * @return string The child selector (e.g., ".wp-block-button.custom-class"), or empty string.
	 */
	protected function buildChildSelector( string $class_value ): string {

		if ( empty( trim( $class_value ) ) ) {
			return '';
		}

		$classes = preg_split( '/\s+/', trim( $class_value ) );

		if ( empty( $classes ) ) {
			return '';
		}

		// Separate classes into priority groups.
		$priority_classes = []; // wp-* classes or classes with numbers.
		$other_classes    = [];

		foreach ( $classes as $class ) {
			$class = trim( $class );
			if ( empty( $class ) ) {
				continue;
			}

			// Check if class starts with "wp-" or contains a number.
			if ( preg_match( '/^wp-/i', $class ) || preg_match( '/\d/', $class ) ) {
				$priority_classes[] = $class;
			} else {
				$other_classes[] = $class;
			}
		}

		// Take up to 2 classes: prioritize wp-* or classes with numbers, then others.
		$selected_classes = array_slice( $priority_classes, 0, 2 );

		// If we don't have 2 yet, add from other classes.
		if ( count( $selected_classes ) < 2 ) {
			$needed           = 2 - count( $selected_classes );
			$selected_classes = array_merge( $selected_classes, array_slice( $other_classes, 0, $needed ) );
		}

		if ( empty( $selected_classes ) ) {
			return '';
		}

		// Build selector: .class1.class2.
		$selector = '.' . implode( '.', $selected_classes );

		return $selector;
	}

	/**
	 * Build parent index once for efficient lookups.
	 * Finds all parent elements with blockera-block-* or wp-block-* classes.
	 *
	 * @param string $content The full HTML content.
	 *
	 * @return void
	 */
	protected function buildParentIndex( string $content ): void {

		// Pattern to find opening tags with class attribute containing blockera-block-* or wp-block-*.
		$pattern = '/<([a-zA-Z][a-zA-Z0-9]*)\s+[^>]*\bclass\s*=\s*["\']([^"\']*(?:blockera-block-|wp-block-)[^"\']*)["\'][^>]*>/is';

		// Find all matches in the entire content.
		preg_match_all( $pattern, $content, $matches, PREG_SET_ORDER | PREG_OFFSET_CAPTURE );

		if ( empty( $matches ) ) {
			return;
		}

		// Build index: position => parent_data.
		foreach ( $matches as $match ) {
			$position   = $match[0][1];
			$class_attr = $match[2][0];

			// Check if parent has blockera-block-* class.
			$blockera_class     = $this->findBlockeraBlockClass( $class_attr );
			$has_blockera_block = ! empty( $blockera_class );

			if ( $has_blockera_block ) {
				$this->parent_index[ $position ] = [
					'class'             => $blockera_class,
					'is_wp_block'       => false,
					'has_blockera_block' => true,
				];
				continue;
			}

			// Check if parent has wp-block-* class.
			$wp_block_class = $this->findWpBlockClass( $class_attr );
			if ( ! empty( $wp_block_class ) ) {
				$this->parent_index[ $position ] = [
					'class'             => $wp_block_class,
					'is_wp_block'       => true,
					'has_blockera_block' => false,
				];
			}
		}

		// Sort by position (ascending) for efficient binary search.
		ksort( $this->parent_index );
	}

	/**
	 * Search backwards in parent index for most recent parent before given position.
	 * Uses cached parent index for fast lookup instead of regex on each call.
	 * Only returns parents that are still open (not closed) at the current position.
	 * Finds the closest tag with blockera-block-* or wp-block-* (where * doesn't contain underscore).
	 *
	 * @param string $content The full HTML content.
	 * @param int    $position The position to search backwards from.
	 *
	 * @return array Array with 'class', 'is_wp_block', and 'has_blockera_block' keys, or empty array if not found.
	 */
	protected function searchBackwardsForParent( string $content, int $position ): array {

		if ( $position <= 0 || empty( $this->parent_index ) ) {
			return [];
		}

		// Since parent_index is sorted by position (ascending), iterate in reverse
		// to find the most recent (closest) parent before target position.
		$parent_positions = array_keys( $this->parent_index );
		$count            = count( $parent_positions );

		// Iterate backwards to find the CLOSEST parent matching criteria.
		// Return immediately on first match since we're iterating from closest to farthest.
		for ( $i = $count - 1; $i >= 0; $i-- ) {
			$parent_pos = $parent_positions[ $i ];

			// Only consider parents before the target position.
			if ( $parent_pos >= $position ) {
				continue;
			}

			$parent_data = $this->parent_index[ $parent_pos ];

			// Check if this parent element is still open at the current position.
			if ( ! $this->isParentStillOpen( $content, $parent_pos, $position ) ) {
				continue;
			}

			// Check for blockera-block-* class - return immediately (closest match).
			if ( ! empty( $parent_data['has_blockera_block'] ) ) {
				return $parent_data;
			}

			// Check for wp-block-* class without underscore - return immediately (closest match).
			if ( $parent_data['is_wp_block'] ) {
				$wp_block_class = $parent_data['class'];
				if ( strpos( $wp_block_class, '_' ) === false ) {
					return $parent_data;
				}
			}
		}

		// No matching parent found.
		return [];
	}

	/**
	 * Check if a parent element is still open (not closed) at a given position.
	 *
	 * @param string $content The full HTML content.
	 * @param int    $parent_open_pos The position where the parent opening tag starts.
	 * @param int    $current_pos The position to check if parent is still open.
	 *
	 * @return bool True if parent is still open, false if closed.
	 */
	protected function isParentStillOpen( string $content, int $parent_open_pos, int $current_pos ): bool {

		// Extract the substring between parent opening tag and current position.
		$substring = substr( $content, $parent_open_pos, $current_pos - $parent_open_pos );

		// Extract tag name from parent opening tag.
		// Pattern: <tag_name ...>.
		if ( ! preg_match( '/<([a-zA-Z][a-zA-Z0-9]*)\s+/', $substring, $tag_match ) ) {
			return false;
		}

		$tag_name = strtolower( $tag_match[1] );

		// Check if this is a self-closing tag (e.g., <img />, <br />).
		// Self-closing tags are considered "closed" immediately.
		$parent_tag = substr( $substring, 0, min( 200, strlen( $substring ) ) ); // Limit to first 200 chars for efficiency.
		if ( preg_match( '/\/\s*>/', $parent_tag ) ) {
			return false;
		}

		// Count opening and closing tags for this element type.
		// We need to track the balance: for each opening tag, we need a matching closing tag.
		// The parent itself counts as +1, so if we have equal openings and closings,
		// the parent is closed.
		$opening_pattern = '/<' . preg_quote( $tag_name, '/' ) . '(?:\s+[^>]*)?>/i';
		$closing_pattern = '/<\/' . preg_quote( $tag_name, '/' ) . '\s*>/i';

		// Find all opening tags (including the parent itself).
		preg_match_all( $opening_pattern, $substring, $openings, PREG_OFFSET_CAPTURE );
		$opening_count = count( $openings[0] );

		// Find all closing tags.
		preg_match_all( $closing_pattern, $substring, $closings, PREG_OFFSET_CAPTURE );
		$closing_count = count( $closings[0] );

		// If we have equal or more closings than openings, the parent is closed.
		// We need more openings than closings to keep the parent open.
		return $opening_count > $closing_count;
	}

	/**
	 * Extract and remove inline style attribute from element tag.
	 *
	 * @param string $tag_name The tag name.
	 * @param string $before_attrs Attributes before style attribute.
	 * @param string $after_attrs Attributes after style attribute.
	 * @param string $original_tag The original full tag.
	 * @param string $preserved_properties Optional. Preserved properties to keep in style attribute (e.g., "display: none").
	 *
	 * @return string The updated tag without style attribute (or with preserved properties if provided).
	 */
	protected function extractAndRemoveStyle( string $tag_name, string $before_attrs, string $after_attrs, string $original_tag, string $preserved_properties = '' ): string {

		// Remove any '>' characters that might have been incorrectly captured in attributes.
		// The '>' should only appear as the tag closer, not in attributes.
		$before_attrs = str_replace( '>', '', $before_attrs );
		$after_attrs  = str_replace( '>', '', $after_attrs );

		// Combine all attributes.
		$all_attrs = trim( $before_attrs . ' ' . $after_attrs );

		// Remove style attribute. Handle both double and single quotes, including quotes in the value.
		// For double-quoted: match style="..." where ... can contain single quotes and HTML entities.
		// For single-quoted: match style='...' where ... can contain double quotes and HTML entities.
		$all_attrs = preg_replace( '/\s*\bstyle\s*=\s*"((?:[^"\\\\]|\\\\.|&[^;]*;)*)"/', '', $all_attrs );
		$all_attrs = preg_replace( '/\s*\bstyle\s*=\s*\'((?:[^\'\\\\]|\\\\.|&[^;]*;)*)\'/', '', $all_attrs );

		// Normalize whitespace.
		$all_attrs = preg_replace( '/\s+/', ' ', trim( $all_attrs ) );

		// Build new tag.
		$new_tag = '<' . $tag_name;
		if ( ! empty( $all_attrs ) ) {
			$new_tag .= ' ' . $all_attrs;
		}

		// If preserved properties exist, add them back as style attribute.
		if ( ! empty( $preserved_properties ) ) {
			$new_tag .= ' style="' . esc_attr( $preserved_properties ) . '"';
		}

		$new_tag .= '>';

		return $new_tag;
	}

	/**
	 * Add class to tag attributes.
	 *
	 * @param string $tag The tag string.
	 * @param string $new_class The new class to add.
	 *
	 * @return string The updated tag with new class added.
	 */
	protected function addClassToTag( string $tag, string $new_class ): string {

		// Check if tag already has class attribute.
		if ( preg_match( '/\bclass\s*=\s*["\']([^"\']+)["\']/', $tag, $matches ) ) {
			// Append new class to existing classes.
			$existing_classes = $matches[1];
			$new_classes      = trim( $existing_classes . ' ' . $new_class );
			$tag              = preg_replace( '/(\bclass\s*=\s*["\'])([^"\']+)(["\'])/', '$1' . $new_classes . '$3', $tag, 1 );
		} else {
			$tag = $this->insertClassAttribute( $tag, $new_class );
		}

		return $tag;
	}

	/**
	 * Insert (or rebuild) class attribute before the tag closer.
	 *
	 * Must handle both normal tags (`>`) and self-closing tags (`/>` or `/ >`)
	 * without producing invalid output like `/ class="..."`.
	 *
	 * @param string $tag The full tag string (opening tag only).
	 * @param string $class_value The class value to set.
	 *
	 * @return string The updated tag with `class="..."` inserted before close.
	 */
	protected function insertClassAttribute( string $tag, string $class_value ): string {

		$class_attr = 'class="' . esc_attr( $class_value ) . '"';

		// Replace the first tag closer. Keep self-closing slash at the end.
		// Examples:
		// - `<img ... />`  -> `<img ... class="x" />`
		// - `<img .../ >`  -> `<img ... class="x" />`
		// - `<div ...>`    -> `<div ... class="x">`.
		$updated = preg_replace_callback(
			'/\s*(\/?)\s*>/i',
			static function ( array $m ) use ( $class_attr ): string {
				return ( isset( $m[1] ) && '/' === $m[1] )
					? ' ' . $class_attr . ' />'
					: ' ' . $class_attr . '>';
			},
			$tag,
			1
		);

		return is_string( $updated ) && '' !== $updated ? $updated : $tag;
	}

	/**
	 * Normalize style value by removing extra spaces around colons and semicolons.
	 *
	 * @param string $style_value The raw style value from the style attribute.
	 *
	 * @return string The normalized style value.
	 */
	protected function normalizeStyleValue( string $style_value ): string {

		// Trim the value.
		$normalized = trim( $style_value );

		if ( empty( $normalized ) ) {
			return '';
		}

		// Remove extra spaces around colons (e.g., "color  :  red" → "color: red").
		$normalized = preg_replace( '/\s*:\s*/', ': ', $normalized );

		// Remove extra spaces around semicolons (e.g., "red  ;" → "red;").
		// Note: Add space after semicolon for separation between declarations.
		$normalized = preg_replace( '/\s*;\s*/', '; ', $normalized );

		// Collapse multiple spaces to single space.
		$normalized = preg_replace( '/\s+/', ' ', $normalized );

		// Trim again to remove any leading/trailing spaces (including after last semicolon).
		$normalized = trim( $normalized );

		// Remove trailing space after the last semicolon if present.
		$normalized = preg_replace( '/;\s*$/', ';', $normalized );

		return $normalized;
	}

	/**
	 * Decode HTML entities in a style attribute value for CSS output.
	 *
	 * Inline style attributes encode quotes as &quot; etc. CSS rules must use
	 * the decoded characters; otherwise semicolon normalization breaks on entity terminators.
	 *
	 * @param string $style_value Raw style attribute value from HTML.
	 *
	 * @return string Decoded style value safe for CSS processing.
	 */
	protected function decodeStyleAttributeValue( string $style_value ): string {

		if ( '' === $style_value || false === strpos( $style_value, '&' ) ) {
			return $style_value;
		}

		return html_entity_decode( $style_value, ENT_QUOTES | ENT_HTML5, 'UTF-8' );
	}

	/**
	 * Extract preserved properties from style value and return remaining styles.
	 * 
	 * Preserved properties (e.g., display: none) are kept in inline styles,
	 * while other properties are extracted to external CSS.
	 * 
	 * Uses cached regex pattern for performance. Pattern is built once from
	 * $preserved_inline_properties array and reused.
	 * 
	 * @param string $style_value The style value to process.
	 * 
	 * @return array Array with 'preserved' (string) and 'remaining' (string) keys.
	 */
	protected function extractPreservedProperties( string $style_value ): array {

		// Early return if empty.
		if ( empty( trim( $style_value ) ) ) {
			return [
				'preserved' => '',
				'remaining' => '',
			];
		}

		// Build and cache regex pattern once (lazy initialization).
		if ( null === self::$preserved_properties_pattern ) {
			$properties = [];
			$values     = [];

			foreach ( self::$preserved_inline_properties as $prop => $val ) {
				// Escape special regex characters in property and value names.
				$properties[] = preg_quote( $prop, '/' );
				$values[]     = preg_quote( $val, '/' );
			}

			// Build alternation patterns: (prop1|prop2|...) and (val1|val2|...).
			$prop_pattern = implode( '|', $properties );
			$val_pattern  = implode( '|', $values );

			// Pattern matches: property:value with optional !important and semicolon.
			// Case-insensitive, handles spacing variations.
			self::$preserved_properties_pattern = '/\b(' . $prop_pattern . ')\s*:\s*(' . $val_pattern . ')(\s*!important)?\s*;?/i';
		}

		// Extract all preserved properties in one pass.
		$preserved_parts = [];
		$remaining       = $style_value;

		// Find all matches and collect preserved properties.
		if ( preg_match_all( self::$preserved_properties_pattern, $style_value, $matches, PREG_SET_ORDER ) ) {
			foreach ( $matches as $match ) {
				$prop_name  = $match[1];
				$prop_value = $match[2];
				$important  = isset( $match[3] ) && ! empty( trim( $match[3] ) ) ? ' !important' : '';

				// Normalize: single space, proper format.
				$normalized = strtolower( $prop_name ) . ': ' . strtolower( $prop_value ) . $important;

				// Store preserved property (avoid duplicates).
				$preserved_key = $normalized;
				if ( ! isset( $preserved_parts[ $preserved_key ] ) ) {
					$preserved_parts[ $preserved_key ] = $normalized;
				}
			}

			// Remove all preserved properties from remaining string in one pass.
			$remaining = preg_replace( self::$preserved_properties_pattern, '', $style_value );
		}

		// Normalize remaining styles: clean up extra semicolons and whitespace.
		$remaining = trim( $remaining );
		$remaining = preg_replace( '/\s*;\s*/', '; ', $remaining );
		$remaining = preg_replace( '/\s+/', ' ', $remaining );
		$remaining = trim( $remaining, '; ' );

		// Combine preserved properties into single string.
		$preserved = ! empty( $preserved_parts ) ? implode( '; ', $preserved_parts ) : '';

		return [
			'preserved' => $preserved,
			'remaining' => $remaining,
		];
	}

	/**
	 * Build CSS content from all collected CSS rules (without <style> tags).
	 *
	 * @return string The CSS content, or empty string if no rules.
	 */
	protected function buildStyleContent(): string {

		if ( empty( $this->css_rules ) ) {
			return '';
		}

		$css_content = '';
		foreach ( $this->css_rules as $rule ) {
			$selector = $rule['selector'];
			$styles   = $rule['styles'];

			// Handle empty styles: output as ';' to match expected format.
			if ( empty( $styles ) ) {
				$styles = ';';
			} else {
				// Ensure styles end with semicolon if not empty.
				if ( substr( $styles, -1 ) !== ';' ) {
					$styles .= ';';
				}
			}

			// Wrap selector in :where() for zero specificity.
			// If selector has whitespace (child selector), wrap only the part after first space.
			// Single selectors are not wrapped.
			$space_pos = strpos( $selector, ' ' );
			if ( false !== $space_pos ) {
				// Child selector: wrap only the part after first space.
				$parent_part      = substr( $selector, 0, $space_pos );
				$child_part       = substr( $selector, $space_pos + 1 );
				$wrapped_selector = $parent_part . ' :where(' . $child_part . ')';
			} else {
				// Single selector: use as-is without wrapping.
				$wrapped_selector = $selector;
			}

			$css_content .= $wrapped_selector . ' { ' . $styles . ' }' . PHP_EOL;
		}

		return $css_content;
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

		// Early return: quick string checks to avoid expensive regex when there's nothing to process.
		// Must have both blockera-block-* and has-* patterns to proceed.
		if ( strpos( $html, 'blockera-block-' ) === false || strpos( $html, 'has-' ) === false ) {
			return $html;
		}

		// Quick heuristic check for removable patterns (font-family, font-size, or color).
		// Full validation happens in regex, but this avoids regex when clearly no matches.
		if ( strpos( $html, '-font-family' ) === false && strpos( $html, '-font-size' ) === false && strpos( $html, '-color' ) === false ) {
			return $html;
		}

		// Cache compiled regex patterns to avoid recompilation on every call.
		$cache_key = 'remove_has_classes';
		if ( ! isset( self::$pattern_cache[ $cache_key ] ) ) {
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
			$match_pattern = '/(<[^>]*?\bclass\s*=\s*["\'])(?=[^"\']*blockera-block-[^"\']*)(?=[^"\']*(?:has-[^"\']*-font-family|has-[^"\']*-font-size|has-[^"\']*-color))([^"\']*)(["\'])/i';

			// Single regex pattern to remove all matching classes: matches class with word boundaries and optional whitespace.
			// Exclude has-inline-color, has-text-color, has-link-color, and has-border-color from removal (these are user-defined classes).
			$remove_pattern = '/\s*\b(?:has-[a-zA-Z0-9-]+-font-family|has-[a-zA-Z0-9-]+-font-size|has-(?!inline-|text-|link-|border-)[a-zA-Z0-9-]+-color)\b\s*/';

			self::$pattern_cache[ $cache_key ] = [
				'match'  => $match_pattern,
				'remove' => $remove_pattern,
			];
		}

		$patterns = self::$pattern_cache[ $cache_key ];

		// Use static closure to avoid capturing $this and reduce overhead.
		return preg_replace_callback(
			$patterns['match'],
			static function ( $matches ) use ( $patterns ) {
				$quote_start = $matches[1];
				$class_value = $matches[2];
				$quote_end   = $matches[3];

				// Single regex replace: remove all matching classes and clean up multiple spaces in one pass.
				// Replace matching classes with single space, then normalize whitespace.
				$new_class_value = preg_replace( $patterns['remove'], ' ', $class_value );
				// Normalize whitespace: collapse multiple spaces and trim in one pass.
				$new_class_value = trim( preg_replace( '/\s+/', ' ', $new_class_value ) );

				return $quote_start . $new_class_value . $quote_end;
			},
			$html
		);
	}
}
