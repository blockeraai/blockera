<?php

namespace Blockera\DataEditor;

/**
 * Class Utility provided static utility methods.
 *
 * @package Utility
 */
class Utility {

	/**
	 * Accesses an array in depth based on a path of keys.
	 *
	 * It is the PHP equivalent of JavaScript's `lodash.get()` and mirroring it may help other components
	 * retain some symmetry between client and server implementations.
	 *
	 * Example usage:
	 *
	 *     $input_array = array(
	 *         'a' => array(
	 *             'b' => array(
	 *                 'c' => 1,
	 *             ),
	 *         ),
	 *     );
	 *     arrayGet( $input_array, array( 'a', 'b', 'c' ) );
	 *
	 * @param array $input_array   An array from which we want to retrieve some information.
	 * @param array $path          An array of keys describing the path with which to retrieve information.
	 * @param mixed $default_value Optional. The return value if the path does not exist within the array,
	 *                             or if `$input_array` or `$path` are not arrays. Default null.
	 *
	 * @since  1.0.0
	 *
	 * @return mixed The value from the path specified.
	 */
	public static function arrayGet( array $input_array, array $path, $default_value = null ) {

		// Confirm $path is valid.
		if ( empty( $path ) ) {
			return $default_value;
		}

		foreach ( $path as $path_element ) {
			if ( ! is_array( $input_array ) ) {
				return $default_value;
			}

			if ( is_string( $path_element ) || is_integer( $path_element ) || null === $path_element ) {
				/*
				 * Check if the path element exists in the input array.
				 * We check with `isset()` first, as it is a lot faster
				 * than `array_key_exists()`.
				 */
				if ( isset( $input_array[ $path_element ] ) ) {
					$input_array = $input_array[ $path_element ];
					continue;
				}

				/*
				 * If `isset()` returns false, we check with `array_key_exists()`,
				 * which also checks for `null` values.
				 */
				if ( array_key_exists( $path_element, $input_array ) ) {
					$input_array = $input_array[ $path_element ];
					continue;
				}
			}

			return $default_value;
		}

		return $input_array;
	}

}
