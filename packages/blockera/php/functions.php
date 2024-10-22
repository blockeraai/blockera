<?php
/**
 * The functions blockera app.
 *
 * @package functions.php
 */

use Blockera\Utils\Env;

if ( ! function_exists( 'blockera_core_config' ) ) {

	/**
	 * Retrieve the config with key param or return all config as array
	 *
	 * @param string $key  the key of config.
	 * @param array  $args the extra arguments.
	 *
	 * @return mixed config value.
	 */
	function blockera_core_config( string $key, array $args = [] ) {

		if ( ! $key ) {

			return false;
		}

		$keyNodes = explode( '.', $key );

		$config_dir = ! empty( $args['root'] ) && file_exists( $args['root'] ) ? $args['root'] : BLOCKERA_CORE_PATH;

		$configIncludes = array(
			'app'         => $config_dir . '/config/app.php',
			'menu'        => $config_dir . '/config/menu.php',
			'panel'       => $config_dir . '/config/panel.php',
			'assets'      => $config_dir . '/config/assets.php',
			'entities'    => $config_dir . '/config/entities.php',
			'breakpoints' => $config_dir . '/config/breakpoints.php',
			'valueAddon'  => $config_dir . '/config/value-addon.php',
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

			$config = $config[ $node ];
		}

		/**
		 * Filterable blockera core configuration with key string.
		 *
		 * @since 1.0.0
		 */
		return apply_filters( __FUNCTION__ . '.' . $key, $config, $args );
	}
}

if ( ! function_exists( 'blockera_core_env' ) ) {

	/**
	 * Gets the value of an environment variable.
	 *
	 * @param string $key     the key of config.
	 * @param mixed  $default the default value.
	 *
	 * @return mixed
	 */
	function blockera_core_env( string $key, $default = null ) {

		return Env::get( $key, $default );
	}
}

if ( ! function_exists( 'blockera_load' ) ) {

	/**
	 * Loading file by path and params.
	 *
	 * @param string $path    the path of file to load.
	 * @param string $baseDir the path current base directory.
	 * @param array  $params  the required params to load file data.
	 *
	 * @return mixed file data on success, false on otherwise!
	 */
	function blockera_load( string $path, string $baseDir = '', array $params = [] ) {

		$file = str_replace( '.', DIRECTORY_SEPARATOR, $path ) . '.php';

		$filename = ( empty( $baseDir ) ? __DIR__ : $baseDir ) . '/' . $file;

		if ( ! file_exists( $filename ) ) {

			return false;
		}

		// phpcs:ignore
		extract( $params );

		return include $filename;
	}
}

if ( ! function_exists( 'blockera_get_value_addon_real_value' ) ) {
	/**
	 * Gets the real value that can be used (Final Value)
	 *
	 * @param mixed $value The addon value.
	 *
	 * @return mixed
	 */
	function blockera_get_value_addon_real_value( $value ) {

		global $blockeraApp;

		if ( is_numeric( $value ) ) {
			return $value;
		}

		if ( is_string( $value ) ) {
			return substr( $value, -4 ) === 'func' ? substr( $value, 0, -4 ) : $value;
		}

		if ( is_array( $value ) && ! empty( $value['isValueAddon'] ) && ! empty( $value['valueType'] ) ) {

			if ( 'dynamic-value' === $value['valueType'] && blockera_get_experimental( [ 'data', 'dynamicValue' ] ) ) {

				$valueAddons = $blockeraApp->getRegisteredValueAddons( $value['valueType'] );

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

			// todo validate that variable is currently available or not.
			if ( 'variable' === $value['valueType'] && isset( $value['settings']['var'] ) ) {
				return 'var(' . $value['settings']['var'] . ')';
			}
		}

		return $value;
	}
}

if ( ! function_exists( 'blockera_get_filter_empty_array_item' ) ) {

	/**
	 * Get filter empty array item.
	 *
	 * @param mixed $item The any array item.
	 *
	 * @return bool true on success, false otherwise.
	 */
	function blockera_get_filter_empty_array_item( $item ): bool {

		if ( is_string( $item ) ) {

			return ! empty( trim( $item ) );
		}

		return ! empty( $item );
	}
}

if ( ! function_exists( 'blockera_array_flat' ) ) {

	/**
	 * Convert nested array (in two-level dimensions) to flat array.
	 *
	 * @param array $nestedArray The recieved nested array.
	 *
	 * @return array
	 */
	function blockera_array_flat( array $nestedArray ): array {

		return array_merge( ...$nestedArray );
	}
}

if ( ! function_exists( 'blockera_get_sorted_repeater' ) ) {

	/**
	 * Sorting repeater items.
	 *
	 * @param array $items the repeater items.
	 *
	 * @return array
	 */
	function blockera_get_sorted_repeater( array $items ): array {

		$dataArray = [];

		foreach ( $items as $key => $value ) {
			$dataArray[] = $value;
		}

		usort(
			$dataArray,
			function ( $a, $b ) {

				return ( $a['order'] ?? 0 ) - ( $b['order'] ?? 0 );
			}
		);

		return $dataArray;
	}
}

if ( ! function_exists( 'blockera_camel_case_join' ) ) {

	/**
	 * Joining text items in camelCase format.
	 *
	 * @param string $string the target string.
	 *
	 * @return string The camelCase string.
	 */
	function blockera_camel_case_join( string $string ): string {

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

if ( ! function_exists( 'blockera_get_array_deep_merge' ) ) {

	/**
	 * Get resulting of array deeply merge.
	 *
	 * @param array $array1 the source array.
	 * @param array $array2 the array to merge with source array.
	 *
	 * @return array the merged array.
	 */
	function blockera_get_array_deep_merge( array $array1, array $array2 ): array {

		$merged = $array1;

		foreach ( $array2 as $key => $value ) {

			if ( is_array( $value ) && isset( $merged[ $key ] ) && is_array( $merged[ $key ] ) ) {

				$merged[ $key ] = blockera_get_array_deep_merge( $merged[ $key ], $value );

			} else {

				$merged[ $key ] = $value;
			}
		}

		return $merged;
	}
}

if ( ! function_exists( 'blockera_get_dist_assets' ) ) {

	/**
	 * Get dist directory assets array.
	 *
	 * @return array the dist directory assets list.
	 */
	function blockera_get_dist_assets(): array {

		return array_map(
			function ( string $asset_dir ): string {

				return basename( $asset_dir );

			},
			glob( blockera_core_config( 'app.dist_path' ) . '*' )
		);
	}
}
