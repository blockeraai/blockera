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
	 * Process content to extract inline styles and convert them to CSS.
	 *
	 * @param string $content The HTML content to process.
	 *
	 * @return array Array with 'content' (processed HTML) and 'style' (CSS without <style> tags) keys.
	 */
	public function process( string $content ): array {

		if ( empty( $content ) ) {
			return [
				'content' => $content,
				'style'   => '',
			];
		}

		// Quick check: if 'style' keyword not found, return early.
		if ( false === strpos( $content, 'style=' ) ) {
			return [
				'content' => $content,
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
				'content' => $content,
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

			// Determine selector based on priority logic.
			$all_attrs_combined = $before_attrs . ' ' . $after_attrs;
			$child_class_value  = $this->extractClassAttribute( $all_attrs_combined );
			$selector_data      = $this->determineSelector( $processed_content, $position, $before_attrs, $after_attrs, $child_class_value );

			// Skip processing if selector is empty (e.g., parent is wp-block-* without blockera-block-*).
			if ( empty( $selector_data['selector'] ) ) {
				continue;
			}

			// Extract and remove inline style from element.
			$updated_tag = $this->extractAndRemoveStyle( $tag_name, $before_attrs, $after_attrs, $full_tag );

			// If a new class needs to be added, add it to the tag.
			if ( ! empty( $selector_data['new_class'] ) ) {
				$updated_tag = $this->addClassToTag( $updated_tag, $selector_data['new_class'] );
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

			// Store CSS rule (even for empty style values).
			// Normalize style value: remove extra spaces around colons and semicolons.
			$normalized_style  = $this->normalizeStyleValue( $style_value );
			$this->css_rules[] = [
				'selector' => $selector_data['selector'],
				'styles'   => $normalized_style,
			];
		}

		// Build CSS content without <style> tags.
		$css_content = $this->buildStyleContent();

		return [
			'content' => $processed_content,
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
			if ( ! empty( $child_class_value ) ) {
				$wp_block_class_with_underscore = $this->findWpBlockClass( $child_class_value );
				if ( ! empty( $wp_block_class_with_underscore ) && strpos( $wp_block_class_with_underscore, '_' ) !== false ) {
					// Use the wp-block-* class with underscore as the child selector.
					$child_selector = '.' . $wp_block_class_with_underscore;
				} else {
					// Build child selector from first 2 classes (prioritizing wp-* or classes with numbers).
					$child_selector = $this->buildChildSelector( $child_class_value );
				}
			}

			// If child has no classes, generate a unique class using parent class + counter.
			$unique_class = null;
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

			// If we generated a unique class for the child (only when it had no classes), add it to the result.
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

		return trim( $matches[1] );
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
	 *
	 * @return string The updated tag without style attribute.
	 */
	protected function extractAndRemoveStyle( string $tag_name, string $before_attrs, string $after_attrs, string $original_tag ): string {

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
			// Add new class to existing classes.
			$existing_classes = $matches[1];
			$new_classes      = $existing_classes . ' ' . $new_class;
			$tag              = preg_replace( '/(\bclass\s*=\s*["\'])([^"\']+)(["\'])/', '$1' . $new_classes . '$3', $tag, 1 );
		} else {
			// Add new class attribute before closing >.
			$tag = preg_replace( '/>/', ' class="' . $new_class . '">', $tag, 1 );
		}

		return $tag;
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
			$wrapped_selector = ':where(' . $selector . ')';

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

}
