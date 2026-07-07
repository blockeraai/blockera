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
		$prefix     = $args['prefix'] ?? '';
		$suffix     = $args['suffix'] ?? '';
		$variations = $args['variations'] ?? [];

		$selectors = [ $selector ];

		// Check if selector contains pseudo-class functions like :is(), :where(), :not(), etc.
		// These functions can contain multiple selectors separated by commas, which should not be split.
		if ( ! preg_match( blockera_regex_pseudo_class_functions_pattern(), $selector, $matches ) ) {

			// Split the selector by commas.
			$selectors = explode( ',', $selector );
		}

		// Initialize an array to store modified selectors.
		$modifiedSelectors = [];

		// Loop through each part of the selector.
		foreach ( $selectors as $sel ) {
			// Trim any extra whitespace from the current selector part.
			$trimmedSel = trim( $sel );

			// Check if the current selector contains the part (like ".wp-block-sample").
			$anchor_part = $part;

			if ( preg_match( '/[\s>+~]/', $part ) && preg_match( '/^(\.[^\s>+~]+)/', $part, $class_match ) ) {
				$anchor_part = $class_match[1];
			}

			if ( strpos( $trimmedSel, $part ) !== false || strpos( $trimmedSel, $anchor_part ) !== false ) {
				// Remove dot.
				$partWithoutDot = substr( $anchor_part, 1 );

				// Regular expression pattern to detecting a specific part of selector.
				$pattern = '/\.\b' . preg_quote( $partWithoutDot, '/' ) . '\b(?!\w+|-|_)/';

				// Add the prefix around the part.
				$modifiedWithPrefix = preg_replace( $pattern, $prefix . $anchor_part, $trimmedSel );
				if ( str_contains( $prefix, $anchor_part ) ) {
					$modifiedWithPrefix = self::mergePrefixWithSelectorPart(
						$prefix,
						$anchor_part,
						$trimmedSel,
						$variations
					);
				} elseif ( ! empty( $variations ) ) {
					$modifiedWithPrefix = self::appendVariationsAfterPart(
						$modifiedWithPrefix,
						$anchor_part,
						$variations
					);
				}

				// Add the modified selector to the array with the prefix.
				if ( ! in_array( $modifiedWithPrefix, $modifiedSelectors, true ) ) {
					$modifiedSelectors[] = $modifiedWithPrefix;
				}

				// If a suffix is provided, create a new selector and add it as a separate selector.
				if ( ! empty( $suffix ) ) {
					$modifiedWithSuffix = preg_replace( $pattern, $anchor_part . $suffix, $trimmedSel );

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

	/**
	 * Prefer the root selector when it already contains the target block part.
	 *
	 * @param string $selector   The prepared support selector.
	 * @param string $root       The root block css selector.
	 * @param string $block_part The matched block class part (e.g. ".wp-block-button").
	 * @param array  $args       Optional arguments:
	 *                           - wrap (callable): Optional wrapper for the merged base selector.
	 *
	 * @return string|null The preferred selector, or null when root does not already contain the target.
	 */
	public static function preferContainedRootSelector(
		string $selector,
		string $root,
		string $block_part,
		array $args = []
	): ?string {

		if ( '' === trim( $root ) || '' === trim( $block_part ) ) {

			return null;
		}

		$selector_pseudos = self::extractTrailingPseudos( $selector );
		$selector_base    = self::stripTrailingPseudos( $selector );

		$variations = self::extractBlockVariationClasses( $root );
		$root_base  = self::stripBlockVariationClasses( self::stripTrailingPseudos( $root ) );

		$root_contains_selector = str_ends_with( $root, $selector )
			|| ( '' !== $selector_base && str_ends_with( $root_base, $selector_base ) );

		if ( ! $root_contains_selector ) {

			return null;
		}

		$merged = '' !== $root_base ? $root_base : $root;
		$merged = self::appendVariationsToSelector( $merged, $block_part, $variations );

		$missing_variations = array_values(
			array_filter(
				$variations,
				static fn( string $variation ): bool => ! str_contains( $merged, $variation )
			)
		);

		if ( ! empty( $missing_variations ) ) {
			$merged = self::appendVariationsAfterLastCompound( $merged, $missing_variations );
		}

		if ( isset( $args['wrap'] ) && is_callable( $args['wrap'] ) ) {
			$merged = $args['wrap']( $merged );
		}

		return $merged . $selector_pseudos;
	}

	/**
	 * Extract style and size variation classes from a selector.
	 *
	 * @param string $selector The css selector.
	 *
	 * @return string[] Ordered variation class tokens.
	 */
	public static function extractBlockVariationClasses( string $selector ): array {

		$variations = [];

		if ( preg_match_all( '/\.is-style-[^\s,.#\[:]+/', $selector, $style_matches ) ) {
			$variations = array_merge( $variations, $style_matches[0] );
		}

		if ( preg_match_all( '/\.is-size-[^\s,.#\[:]+/', $selector, $size_matches ) ) {
			$variations = array_merge( $variations, $size_matches[0] );
		}

		return array_values( array_unique( $variations ) );
	}

	/**
	 * Remove style and size variation classes from a selector.
	 *
	 * @param string $selector The css selector.
	 *
	 * @return string The selector without variation classes.
	 */
	public static function stripBlockVariationClasses( string $selector ): string {

		return preg_replace(
			[ '/\.is-style-[^\s,.#\[:]+/', '/\.is-size-[^\s,.#\[:]+/' ],
			'',
			$selector
		);
	}

	/**
	 * Append missing variation classes after a block part.
	 *
	 * @param string   $selector   The css selector.
	 * @param string   $part       The block class part to append after.
	 * @param string[] $variations Variation class tokens to append.
	 *
	 * @return string The selector with missing variations appended.
	 */
	public static function appendVariationsAfterPart( string $selector, string $part, array $variations ): string {

		if ( empty( $variations ) ) {

			return $selector;
		}

		$missing = array_values(
			array_filter(
				$variations,
				static fn( string $variation ): bool => ! str_contains( $selector, $variation )
			)
		);

		if ( empty( $missing ) ) {

			return $selector;
		}

		return preg_replace(
			'/' . preg_quote( $part, '/' ) . '/',
			$part . implode( '', $missing ),
			$selector,
			1
		);
	}

	/**
	 * Append missing variation classes after the last compound in a selector.
	 *
	 * @param string   $selector   The css selector.
	 * @param string[] $variations Variation class tokens to append.
	 *
	 * @return string The selector with missing variations appended.
	 */
	public static function appendVariationsAfterLastCompound( string $selector, array $variations ): string {

		if ( empty( $variations ) ) {

			return $selector;
		}

		$missing = array_values(
			array_filter(
				$variations,
				static fn( string $variation ): bool => ! str_contains( $selector, $variation )
			)
		);

		if ( empty( $missing ) ) {

			return $selector;
		}

		$suffix = implode( '', $missing );

		if ( preg_match( '/^(.*[\s>+~])([^\s>+~]+)$/', $selector, $matches ) ) {

			return $matches[1] . $matches[2] . $suffix;
		}

		return $selector . $suffix;
	}

	/**
	 * Append missing variation classes to the appropriate compound in a selector.
	 *
	 * Compound selectors (with space/`>`/`+`/`~`) receive variations on the last compound
	 * (e.g. `.wp-block-list > li.is-style-x`). Simple selectors receive them after the
	 * matched wp-block class part (e.g. `.wp-block-button.is-style-outline`).
	 *
	 * @param string   $selector   The css selector.
	 * @param string   $block_part The matched block class part.
	 * @param string[] $variations Variation class tokens to append.
	 *
	 * @return string The selector with missing variations appended.
	 */
	public static function appendVariationsToSelector( string $selector, string $block_part, array $variations ): string {

		if ( empty( $variations ) ) {

			return $selector;
		}

		if ( preg_match( '/[\s>+~]/', $selector ) ) {

			return self::appendVariationsAfterLastCompound( $selector, $variations );
		}

		return self::appendVariationsAfterPart( $selector, $block_part, $variations );
	}

	/**
	 * Extract trailing pseudo-classes and pseudo-elements from a selector.
	 *
	 * @param string $selector The css selector.
	 *
	 * @return string Trailing pseudo tokens (e.g. ":hover:focus" or "::before").
	 */
	public static function extractTrailingPseudos( string $selector ): string {

		$base = self::stripTrailingPseudos( $selector );

		if ( strlen( $base ) >= strlen( $selector ) ) {

			return '';
		}

		return substr( $selector, strlen( $base ) );
	}

	/**
	 * Remove trailing pseudo-classes and pseudo-elements from a selector.
	 *
	 * @param string $selector The css selector.
	 *
	 * @return string The selector base without trailing pseudo tokens.
	 */
	public static function stripTrailingPseudos( string $selector ): string {

		$result            = $selector;
		$functions_pattern = rtrim( blockera_regex_pseudo_class_functions_pattern( true ), '/' ) . '$/';

		do {
			$previous = $result;

			if ( preg_match( $functions_pattern, $result ) ) {
				$result = preg_replace( $functions_pattern, '', $result );
				continue;
			}

			$result = preg_replace( '/(?:::?[a-zA-Z-]+)$/', '', $result, 1 );
		} while ( $previous !== $result && '' !== $result );

		return $result;
	}

	/**
	 * Merge a prefix that already contains the target part with selector pseudo tokens.
	 *
	 * @param string   $prefix     The prefix selector.
	 * @param string   $part       The target block part.
	 * @param string   $selector   The original selector branch.
	 * @param string[] $variations Optional variation classes to append after the block part.
	 *
	 * @return string The merged selector.
	 */
	private static function mergePrefixWithSelectorPart(
		string $prefix,
		string $part,
		string $selector,
		array $variations = []
	): string {

		$merged = self::appendVariationsAfterPart( $prefix, $part, $variations );

		$part_pos = strpos( $selector, $part );

		if ( false !== $part_pos ) {

			return $merged . substr( $selector, $part_pos + strlen( $part ) );
		}

		return $merged . self::extractTrailingPseudos( $selector );
	}

	/**
	 * Convert a string to snake case.
	 *
	 * @param string $string The string to convert to snake case.
	 *
	 * @return string The snake case string.
	 */
	public static function snakeCase( string $string ): string {

		// Handle empty strings.
		if ( empty( $string ) ) {
			return '';
		}

		// Convert camelCase to snake_case.
		$pattern     = '/(?<!^)[A-Z]/';
		$replacement = '_$0';
		$string      = preg_replace( $pattern, $replacement, $string );

		// Convert to lowercase.
		$string = strtolower( $string );

		// Replace any remaining non-alphanumeric characters with underscores.
		$string = preg_replace( '/[^a-z0-9]+/', '_', $string );

		// Remove leading/trailing underscores.
		return trim( $string, '_' );
	}

	/**
	 * Check if plugin is installed.
	 *
	 * @param string $plugin_slug The slug of the plugin.
	 *
	 * @return bool true if the plugin is installed, false otherwise.
	 */
	public static function isPluginInstalled( string $plugin_slug ): bool {

		$plugin_file = WP_PLUGIN_DIR . '/' . $plugin_slug . '/' . $plugin_slug . '.php';

		return file_exists( $plugin_file );
	}

	/**
	 * Convert a string to pascal case.
	 *
	 * @param string $string The string to convert to pascal case.
	 * @param array  $args   The arguments to convert to pascal case.
	 *
	 * @return string The pascal case string.
	 */
	public static function pascalCase( string $string, array $args = [] ): string {

		$parsed_string = explode( '-', $string );

		return implode(
            $args['separator'] ?? '', 
            array_map(
                function( string $item ):string {
                    return ucfirst( $item );
                },
                $parsed_string
            )
		);
	}

	/**
	 * Convert a string to pascal case with space.
	 *
	 * @param string $string The string to convert to pascal case with space.
	 *
	 * @return string The pascal case with space string.
	 */
	public static function pascalCaseWithSpace( string $string ): string {

		return static::pascalCase($string, [ 'separator' => ' ' ]);
	}

	/**
	 * Convert a string to camel case.
	 *
	 * @param string $string The string to convert to camel case.
	 *
	 * @return string The camel case string.
	 */
	public static function camelCase( string $string ): string {

		return lcfirst( self::pascalCase( $string ) );
	}

	/**
	 * Get the current page URL.
	 *
	 * @return string The current page URL.
	 */
	public static function getCurrentPageURL(): string {

		return home_url($_SERVER['REQUEST_URI']);
	}

	/**
	 * Extract the domain name from a URL.
	 *
	 * @param string $url The URL to extract the domain name from.
	 * @param bool   $with_scheme Whether to include the scheme in the domain name.
	 *
	 * @return string The domain name.
	 */
	public static function extractDomainName( string $url, bool $with_scheme = true): string {

		$parsed_url = parse_url(home_url($url));

		if (empty($parsed_url['query'])) {

			$host = $parsed_url['host'] ?? '';

			if (! empty($parsed_url['port'])) {
				$host .= ':' . $parsed_url['port'];
			}

			return $with_scheme && ! empty($parsed_url['scheme']) && ! empty($host) ? "{$parsed_url['scheme']}://{$host}" : $host;
		}

		parse_str($parsed_url['query'], $params);

		$parsed_redirect_url = parse_url($url);

		if (empty($parsed_redirect_url)) {

			return '';
		}

		$host = $parsed_redirect_url['host'];

		if (! empty($parsed_redirect_url['port'])) {
			$host .= ':' . $parsed_redirect_url['port'];
		}

		if ($with_scheme) {

			return "{$parsed_redirect_url['scheme']}://{$host}";
		}

		return $host;
	}

	/**
	 * Extract a parameter from a URL.
	 *
	 * @param string $url The URL to extract the parameter from.
	 * @param string $param The parameter to extract from the URL.
	 *
	 * @return string The parameter value.
	 */
	public static function extractParamFromURL( string $url, string $param): string {

		$parsed_url = parse_url($url);

		if (empty($parsed_url['query'])) {

			return '';
		}

		parse_str($parsed_url['query'], $params);

		return $params[ $param ] ?? '';
	}
}
