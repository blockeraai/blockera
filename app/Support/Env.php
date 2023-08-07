<?php

namespace Publisher\Core\Support;

/**
 * Env class to handle access .env file of project variables
 *
 * @since 1.0.0
 */
class Env {
	/**
	 * Retrieve the env variable, if was not exists return {$default} value.
	 *
	 * @param string $key the key of variable.
	 * @param mixed  $default the default value.
	 *
	 * @return mixed
	 */
	public static function get( string $key, $default ) {

		if ( ! isset( $_ENV[ $key ] ) ) {

			return $default;
		}

		return in_array( $_ENV[ $key ], array( 'true', 'false' ), true ) ? (bool) $_ENV[ $key ] : $_ENV[ $key ];
	}
}
