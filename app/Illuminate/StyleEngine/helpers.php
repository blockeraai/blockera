<?php

use Publisher\Framework\Illuminate\StyleEngine\StyleEngine;

if ( ! function_exists( 'getStyles' ) ) {
	/**
	 * Retrieve styles as array with css and declarations.
	 *
	 * @param array   $styles
	 * @param array   $options
	 *
	 * @return array {
	 * @type string[] $classnames   Array of class names.
	 * @type string[] $declarations An associative array of CSS definitions,
	 *                                  e.g. `array( "$property" => "$value", "$property" => "$value" )`.
	 * }
	 */
	function getStyles( array $styles, array $options = [] ): array {

		$options = wp_parse_args(
			$options,
			array(
				'selector'                   => null,
				'context'                    => null,
				'convert_vars_to_classnames' => false,
			)
		);

		$parsed_styles = StyleEngine::parseBlockStyles( $styles, $options );

		// Output.
		$styles_output = [];

		if ( ! empty( $parsed_styles['declarations'] ) ) {

			$styles_output['css']          = StyleEngine::compileCss( $parsed_styles['declarations'], $options['selector'] );
			$styles_output['declarations'] = $parsed_styles['declarations'];

			if ( ! empty( $options['context'] ) ) {

				StyleEngine::storeCssRule( $options['context'], $options['selector'], $parsed_styles['declarations'] );
			}
		}

		if ( ! empty( $parsed_styles['classnames'] ) ) {

			$styles_output['classnames'] = implode( ' ', array_unique( $parsed_styles['classnames'] ) );
		}

		return array_filter( $styles_output );
	}
}

if ( ! function_exists( 'getUniqueClassname' ) ) {
	/**
	 * Retrieve css classname with suffix string.
	 *
	 * @param string $suffix suffix for use in create css classname
	 *
	 * @return string the unique css classname
	 */
	function getUniqueClassname( string $suffix ): string {

		return str_replace( '/', '-', $suffix ) . '-' . uniqid( 'publisher-' );
	}
}


if (!function_exists('getClassname')){
	/**
	 * Retrieve classname string.
	 *
	 * @param string $namespace the namespace of class
	 * @param string $class the class full name
	 *
	 * @return string retrieve just specific name of class.
	 */
	function getClassname(string $namespace , string $class):string{

		return str_replace(
			$namespace . '\\',
			'',
			$class
		);
	}
}