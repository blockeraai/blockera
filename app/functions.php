<?php

use Publisher\Framework\Illuminate\Foundation\ValueAddon\DynamicValue\DynamicValueType;
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

		$key_parts       = explode( '.', $key );
		$config_includes = array(
			'app'        => PB_CORE_PATH . '/config/app.php',
			'valueAddon' => PB_CORE_PATH . '/config/value-addon.php',
		);

		if ( ! $config_includes[ $key_parts[0] ] ) {

			return false;
		}

		$app_config = require $config_includes[ $key_parts[0] ];

		if ( ! $key_parts[1] ) {

			return $app_config;
		}

		return $app_config[ $key_parts[1] ];
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
	 * @param string $value value
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
