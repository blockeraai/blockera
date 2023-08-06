<?php

use Publisher\Core\Support\Env;

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
			'app' => PB_CORE_PATH . '/config/app.php',
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
	 * @param string $key the key of config.
	 * @param mixed  $default the default value.
	 *
	 * @return mixed
	 */
	function pb_core_env( string $key, $default = null ) {

		return Env::get( $key, $default );
	}
}
