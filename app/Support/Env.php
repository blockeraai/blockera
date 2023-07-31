<?php

namespace Publisher\Core\Support;

class Env {
	/**
	 * Retrieve the env variable, if was not exists return {$default} value.
	 *
	 * @param string $key
	 * @param mixed  $default
	 *
	 * @return mixed
	 */
	public static function get( string $key, $default ) {

		if ( ! isset( $_ENV[ $key ] ) ) {

			return $default;
		}

		return in_array( $_ENV[ $key ], [ 'true', 'false' ], true ) ? (bool) $_ENV[ $key ] : $_ENV[ $key ];
	}
}
