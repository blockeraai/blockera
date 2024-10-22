<?php

namespace Blockera\Utils;

class Utils {

	/**
	 * Kebab-case is a naming convention where words are separated by hyphens (-).
	 *
	 * @param string $string the string to convert kebab case.
	 *
	 * @return string the kebab case string.
	 */
	public static function kebabCase( string $string ): string {

		// Insert hyphens before uppercase letters.
		$string = preg_replace( '/([a-z])([A-Z])/', '$1-$2', $string );

		// Convert to lowercase first.
		$string = strtolower( $string );

		// Replace non-word characters with hyphens.
		$string = preg_replace( '/[^a-z0-9]+/', '-', $string );

		// Remove leading and trailing hyphens.
		return trim( $string, '-' );
	}

	/**
	 * Modifies a CSS selector by adding a prefix and/or replacing the suffix for a specific part of the selector.
	 *
	 * This function allows you to prepend (prefix) and replace the suffix of a specific part of a CSS selector.
	 * If a suffix is provided, instead of modifying the same selector, a new selector with the suffix is
	 * added and separated by a comma.
	 *
	 * Example:
	 * Input:
	 *     - Selector: ".wp-block-sample, .wp-block-sample .first-child, .wp-block-sample .second-child"
	 *     - Part: ".wp-block-sample"
	 *     - Args:
	 *         ['prefix' => '.test-before', 'suffix' => '.test-after']
	 * Output:
	 *     ".test-before.wp-block-sample, .wp-block-sample.test-after,
	 *      .test-before.wp-block-sample .first-child, .wp-block-sample.test-after .first-child,
	 *      .test-before.wp-block-sample .second-child, .wp-block-sample.test-after .second-child"
	 *
	 * @param string $selector The original CSS selector string, potentially containing multiple parts separated by commas.
	 * @param string $part     The specific part of the selector you want to modify (e.g., ".wp-block-sample").
	 * @param array  $args     An associative array containing:
	 *                         - 'prefix' (optional): A string to be added before the part of the selector. Default is an empty string.
	 *                         - 'suffix' (optional): A string to be used to create a new selector with the suffix. Default is an empty string.
	 *
	 * @return string The modified CSS selector with the prefix applied to the specified part and the suffix added as a new selector.
	 */
	public static function modifySelectorPos( string $selector, string $part, array $args = [] ): string {

		if ( empty( $part ) ) {

			return $selector;
		}

		// Extract prefix and suffix from $args array, default to empty strings if not provided.
		$prefix = $args['prefix'] ?? '';
		$suffix = $args['suffix'] ?? '';

		// Split the selector by commas.
		$selectors = explode( ',', $selector );

		// Initialize an array to store modified selectors.
		$modifiedSelectors = [];

		// Loop through each part of the selector.
		foreach ( $selectors as $sel ) {
			// Trim any extra whitespace from the current selector part.
			$trimmedSel = trim( $sel );

			// Check if the current selector contains the part (like ".wp-block-sample").
			if ( strpos( $trimmedSel, $part ) !== false ) {
				// Remove dot.
				$partWithoutDot = substr( $part, 1 );

				// Regular expression pattern to detecting a specific part of selector.
				$pattern = '/\.\b' . preg_quote( $partWithoutDot, '/' ) . '\b(?!\w+|-|_)/';

				// Add the prefix around the part.
				$modifiedWithPrefix = preg_replace( $pattern, $prefix . $part, $trimmedSel );

				// Add the modified selector to the array with the prefix.
				if ( ! in_array( $modifiedWithPrefix, $modifiedSelectors, true ) ) {
					$modifiedSelectors[] = $modifiedWithPrefix;
				}

				// If a suffix is provided, create a new selector and add it as a separate selector.
				if ( ! empty( $suffix ) ) {
					$modifiedWithSuffix = preg_replace( $pattern, $part . $suffix, $trimmedSel );

					// Add the modified selector to the array with the suffix.
					if ( ! in_array( $modifiedWithSuffix, $modifiedSelectors, true ) ) {

						$modifiedSelectors[] = $modifiedWithSuffix;
					}
				}
			} else {
				// If the part is not found, just add the original selector unchanged.
				$modifiedSelectors[] = $trimmedSel;
			}
		}

		// Join the modified selectors with commas and return.
		return implode( ', ', $modifiedSelectors );
	}

}
