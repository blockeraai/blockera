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

}
