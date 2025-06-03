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

		$installed_plugins = get_plugins();

		return isset( $installed_plugins[ $plugin_slug . '/' . $plugin_slug . '.php' ] );
	}

	/**
	 * Convert a string to pascal case.
	 *
	 * @param string $string The string to convert to pascal case.
	 *
	 * @return string The pascal case string.
	 */
	public static function pascalCase( string $string ): string {

		$parsed_string = explode( '-', $string );

		return implode(
            '', 
            array_map(
                function( string $item ):string {
                    return ucfirst( $item );
                },
                $parsed_string
            )
		);
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

			return $with_scheme && ! empty($parsed_url['scheme']) && ! empty($parsed_url['host']) ? "{$parsed_url['scheme']}://{$parsed_url['host']}" : $parsed_url['host'] ?? '';
		}

		parse_str($parsed_url['query'], $params);

		$parsed_redirect_uri = parse_url($url);

		if ($with_scheme) {

			return "{$parsed_redirect_uri['scheme']}://{$parsed_redirect_uri['host']}";
		}

		return $parsed_redirect_uri['host'];
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
