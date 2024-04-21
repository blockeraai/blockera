<?php

use Illuminate\Contracts\Container\BindingResolutionException;
use Publisher\Framework\Illuminate\Foundation\Application;
use Publisher\Framework\Illuminate\StyleEngine\StyleEngine;
use Publisher\Framework\Illuminate\Support\Env;

if ( ! function_exists( 'pb_core_config' ) ) {

	/**
	 * Retrieve the config with key param or return all config as array
	 *
	 * @param string $key the key of config.
	 *
	 * @return mixed config value.
	 */
	function pb_core_config( string $key ) {

		if ( ! $key ) {

			return false;
		}

		$keyNodes = explode( '.', $key );

		$configIncludes = array(
			'app'         => PB_CORE_PATH . '/config/app.php',
			'entities'    => PB_CORE_PATH . '/config/entities.php',
			'breakpoints' => PB_CORE_PATH . '/config/breakpoints.php',
			'valueAddon'  => PB_CORE_PATH . '/config/value-addon.php',
		);

		$firstNode = array_shift( $keyNodes );

		if ( ! $configIncludes[ $firstNode ] ) {

			return false;
		}

		$config = require $configIncludes[ $firstNode ];

		foreach ( $keyNodes as $node ) {

			if ( ! isset( $config[ $node ] ) ) {

				return $config;
			}

			$config = $config[$node];
		}

		return $config;
	}
}

if ( ! function_exists( 'pb_core_env' ) ) {

	/**
	 * Gets the value of an environment variable.
	 *
	 * @param string $key     the key of config.
	 * @param mixed  $default the default value.
	 *
	 * @return mixed
	 */
	function pb_core_env( string $key, $default = null ) {

		return Env::get( $key, $default );
	}
}

if ( ! function_exists( 'pb_load' ) ) {

	/**
	 * Loading file by path and params.
	 *
	 * @param string $path    the path of file to load.
	 * @param array  $params  the required params to load file data.
	 * @param string $baseDir the path current base directory.
	 *
	 * @return mixed file data on success, false on otherwise!
	 */
	function pb_load( string $path, array $params = [], string $baseDir = '' ) {

		$file = str_replace( '.', DIRECTORY_SEPARATOR, $path ) . '.php';

		$filename = ( empty( $baseDir ) ? __DIR__ : $baseDir ) . '/' . $file;

		if ( ! file_exists( $filename ) ) {

			return false;
		}

		extract( $params );

		return include $filename;
	}
}

if ( ! function_exists( 'pb_get_value_addon_real_value' ) ) {
	/**
	 * Gets the real value that can be used (Final Value)
	 *
	 * @param mixed $value value
	 *
	 * @return mixed
	 */
	function pb_get_value_addon_real_value( $value ) {

		global $publisherApp;

		if ( is_numeric( $value ) ) {
			return $value;
		}

		if ( is_string( $value ) ) {
			return substr( $value, -4 ) === 'func' ? substr( $value, 0, -4 ) : $value;
		}

		if ( is_array( $value ) && ! empty( $value['isValueAddon'] ) && ! empty( $value['valueType'] ) ) {

			if ( 'dynamic-value' === $value['valueType'] ) {

				$valueAddons = $publisherApp->getRegisteredValueAddons( $value['valueType'] );

				if ( empty( $valueAddons ) ) {

					return '';
				}

				$groupName = $value['settings']['group'];

				$groupItems = $valueAddons[ $groupName ]['items'];

				foreach ( $groupItems as $name => $item ) {

					if ( $name !== $value['name'] ) {

						continue;
					}

					$callback = $item['properties']['callback'];

					if ( is_callable( $callback ) ) {

						return $callback( $item['instance'] );
					}
				}
			}

			// todo validate that variable is currently available or not
			if ( 'variable' === $value['valueType'] && isset( $value['settings']['var'] ) ) {
				return "var(" . $value['settings']['var'] . ")";
			}
		}

		return $value;
	}
}

if ( ! function_exists( 'pb_get_filter_empty_array_item' ) ) {

	/**
	 * Get filter empty array item.
	 *
	 * @param mixed $item The any array item.
	 *
	 * @return bool true on success, false otherwise.
	 */
	function pb_get_filter_empty_array_item( $item ): bool {

		if ( is_string( $item ) ) {

			return ! empty( trim( $item ) );
		}

		return ! empty( $item );
	}
}

if ( ! function_exists( 'pb_array_flat' ) ) {

	/**
	 * Convert nested array (in two-level dimensions) to flat array.
	 *
	 * @param array $nestedArray
	 *
	 * @return array
	 */
	function pb_array_flat( array $nestedArray ): array {

		return array_merge( ...$nestedArray );
	}
}

if ( ! function_exists( 'pb_get_sorted_repeater' ) ) {

	/**
	 * Sorting repeater items.
	 *
	 * @param array $items the repeater items.
	 *
	 * @return array
	 */
	function pb_get_sorted_repeater( array $items ): array {

		$dataArray = [];

		foreach ( $items as $key => $value ) {
			$dataArray[] = $value;
		}

		usort( $dataArray, function ( $a, $b ) {

			return ( $a['order'] ?? 0 ) - ( $b['order'] ?? 0 );
		} );

		return $dataArray;
	}
}

if ( ! function_exists( 'pb_camel_case_join' ) ) {

	/**
	 * Joining text items in camelCase format.
	 *
	 * @param string $string the target string.
	 *
	 * @return string The camelCase string.
	 */
	function pb_camel_case_join( string $string ): string {

		$items = explode( '-', $string );

		if ( 1 === count( $items ) ) {

			return strtolower( $items[0] );
		}

		$firstPart     = strtolower( array_shift( $items ) );
		$secondaryPart = '';

		foreach ( $items as $item ) {

			$secondaryPart .= ucfirst( $item );
		}

		return $firstPart . $secondaryPart;
	}
}
