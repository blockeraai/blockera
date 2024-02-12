<?php

use Publisher\Framework\Illuminate\StyleEngine\StyleEngine;

if ( ! function_exists( 'pb_get_styles' ) ) {
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
	function pb_get_styles( array $styles, array $options = [] ): array {

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

if ( ! function_exists( 'pb_get_unique_classname' ) ) {
	/**
	 * Retrieve css classname with suffix string.
	 *
	 * @param string $suffix suffix for use in create css classname
	 *
	 * @return string the unique css classname
	 */
	function pb_get_unique_classname( string $suffix ): string {

		return str_replace( '/', '-', $suffix ) . '-' . uniqid( 'publisher-' );
	}
}

if ( ! function_exists( 'pb_get_classname' ) ) {
	/**
	 * Retrieve classname string.
	 *
	 * @param string $namespace the namespace of class
	 * @param string $class     the class full name
	 *
	 * @return string retrieve just specific name of class.
	 */
	function pb_get_classname( string $namespace, string $class ): string {

		return str_replace(
			$namespace . '\\',
			'',
			$class
		);
	}
}

if ( ! function_exists( 'pb_get_css_media_queries' ) ) {

	/**
	 * Get css media queries from configured breakpoints.
	 *
	 * @return array
	 */
	function pb_get_css_media_queries(): array {

		$queries = [];

		foreach ( pb_core_config( 'breakpoints' ) as $breakpoint ) {

			// skip invalid breakpoint.
			if ( empty( $breakpoint['type'] ) ) {

				continue;
			}

			[ 'min' => $min, 'max' => $max ] = $breakpoint['settings'];

			$media = '';

			if ( $min && $max ) {

				$media = "@media screen and (max-width: $max) and (min-width: $min)";

			} elseif ( $min ) {

				$media = "@media screen and (min-width: $min)";

			} elseif ( $max ) {

				$media = "@media screen and (max-width: $max)";
			}

			$queries[ $breakpoint['type'] ] = $media;
		}

		return $queries;
	}
}

if ( ! function_exists( 'pb_get_block_state' ) ) {

	/**
	 * Get block state from block states with state name.
	 *
	 * @param array  $states The block states.
	 * @param string $state  The state name.
	 *
	 * @return array The block state.
	 */
	function pb_get_block_state( array $states, string $state ): array {

		if ( ! $state ) {

			return [];
		}

		if ( empty( $states ) ) {

			return [];
		}

//		// no state found.
		if ( empty( $states[ $state ] ) ) {

			return [];
		}

		return $states[ $state ];
	}
}

if ( ! function_exists( 'pb_get_state_breakpoint' ) ) {

	/**
	 * Get state breakpoint with breakpoint name.
	 *
	 * @param array  $breakpoints The breakpoints cluster.
	 * @param string $breakpoint  The breakpoint name.
	 *
	 * @return array The breakpoint founded in state cluster on success, empty array when no breakpoint found.
	 */
	function pb_get_state_breakpoint( array $breakpoints, string $breakpoint ): array {

		// no has breakpoints.
		if ( empty( $breakpoints ) ) {

			return [];
		}

		// no breakpoint found.
		if ( empty( $breakpoints[ $breakpoint ] ) ) {

			return [];
		}

		return $breakpoints[ $breakpoint ];
	}
}

if ( ! function_exists( 'pb_get_inner_blocks_css' ) ) {

	/**
	 * Get inner blocks css.
	 *
	 * @param array       $innerBlocks The innerBlocks.
	 * @param StyleEngine $instance    The instance of StyleEngine.
	 * @param array       $args        The scope arguments.
	 *                                 array(
	 *
	 * @type string       $selector    The parent selector.
	 * @type string       $pseudoClass The current pseudo class (current block state).
	 * @type string       $breakpoint  The current breakpoint (device type).
	 * )
	 *
	 * @return array The css styles generated of inner blocks.
	 */
	function pb_get_inner_blocks_css( array $innerBlocks, StyleEngine $instance, array $args ): array {

		$styles    = [];
		$_settings = [];
		[
			'breakpoint'      => $breakpoint,
			'pseudo-class'    => $pseudoClass,
			'parent-selector' => $selector,
		] = $args;

		foreach ( $innerBlocks as $key => $innerBlock ) {

			if ( empty( $innerBlock['attributes'] ) ) {

				continue;
			}

			$settings = $innerBlock['attributes'];

			$_selector = $selector . ' ' . ( $innerBlock['selectors']['root'] ?? '' );

			$instance->setSettings( $settings );
			$instance->setSelector( $_selector );
			$_settings[] = $instance->getRequestSettings( $pseudoClass, $breakpoint );
		}

		return $_settings;
	}
}
