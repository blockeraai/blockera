<?php

namespace Blockera\DataStream;

class Config {

	/**
	 * @var string $server_url the server base url to connect it.
	 */
	public static string $server_url;

	/**
	 * @var string $hook_prefix the hook prefix to create customize WordPress filter hooks.
	 */
	public static string $hook_prefix;

	/**
	 * @var array $rest_params the rest request required params.
	 */
	public static array $rest_params;

	/**
	 * @var array $option_keys the option keys to store data in db.
	 */
	public static array $option_keys;

	/**
	 * Retrieve hook prefix.
	 *
	 * @return string the hook prefix.
	 */
	public static function getHookPrefix(): string {

		return self::$hook_prefix;
	}

	/**
	 * @param string $hook_prefix the hook prefix.
	 */
	public static function setHookPrefix( string $hook_prefix ): void {

		self::$hook_prefix = $hook_prefix;
	}

	/**
	 * @return string the server base url to connect it.
	 */
	public static function getServerURL(): string {

		return self::$server_url;
	}

	/**
	 * @param string $server_url the server base url to connect it.
	 */
	public static function setServerURL( string $server_url ): void {

		self::$server_url = $server_url;
	}

	/**
	 * @return mixed
	 */
	public static function getRestParams( string $key = '' ) {

		if ( empty( self::$rest_params[ $key ] ) ) {

			return self::$rest_params;
		}

		return self::$rest_params[ $key ];
	}

	/**
	 * @param array $rest_params the rest request required params.
	 */
	public static function setRestParams( array $rest_params ): void {

		self::$rest_params = $rest_params;
	}

	public static function getOptionKeys( string $key = '' ) {

		if ( empty( self::$option_keys[ $key ] ) ) {

			return self::$option_keys;
		}

		return self::$option_keys[ $key ];
	}

	/**
	 * @param array $option_keys the option keys to store data in db.
	 *
	 * @return void
	 */
	public static function setOptionKeys( array $option_keys ): void {

		self::$option_keys = $option_keys;
	}

}
