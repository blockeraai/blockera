<?php

namespace Blockera\Auth;

use Blockera\Utils\Utils;

class Config {

	/**
	 * The option key.
	 *
	 * @var string $option_key The option key.
	 */
	protected static string $option_key;

	/**
	 * The account info link.
	 *
	 * @var string $get_account_info_link The account info link.
	 */
	protected static string $get_account_info_link;

	/**
	 * The unsubscribe URL.
	 *
	 * @var string $unsubscribe_url The unsubscribe URL.
	 */
	protected static string $unsubscribe_url;

	/**
	 * The get zip file URL.
	 *
	 * @var string $get_zip_file_url The get zip file URL.
	 */
	protected static string $get_zip_file_url;

	/**
	 * The product ID.
	 *
	 * @var string $product_id The product ID.
	 */
	protected static string $product_id;

	/**
	 * The API base URL.
	 *
	 * @var string $api_base_url The API base URL.
	 */
	protected static string $api_base_url;

	/**
	 * The constructor.
	 *
	 * @param array $config The config.
	 */
	public function __construct( array $config ) {
		array_map( [ $this, 'setProperties' ], array_keys( $config ), $config );
	}

	/**
	 * Set the properties.
	 *
	 * @param string $key The key.
	 * @param string $value The value.
	 */
	private function setProperties( string $key, string $value ): void {
		$snake_case_key = Utils::snakeCase( $key );

		if ( property_exists( $this, $snake_case_key ) ) {
			self::$$snake_case_key = $value;
		}
	}

	/**
	 * Get the API base URL.
	 *
	 * @return string The API base URL.
	 */
	public static function getApiBaseUrl(): string {
		return self::$api_base_url;
	}

	/**
	 * Get the product ID.
	 *
	 * @return string The product ID.
	 */
	public static function getProductId(): string {
		return self::$product_id;
	}

	/**
	 * Get the option key.
	 *
	 * @return string The option key.
	 */
	public static function getOptionKey(): string {
		return self::$option_key;
	}

	/**
	 * Get the account info link.
	 *
	 * @return string The account info link.
	 */
	public static function getAccountInfoLink(): string {
		return self::$get_account_info_link;
	}

	/**
	 * Set the account info link.
	 *
	 * @param string $link The account info link.
	 */
	public static function setAccountInfoLink( string $link ): void {
		self::$get_account_info_link = $link;
	}

	/**
	 * Set the unsubscribe URL.
	 *
	 * @param string $link The unsubscribe URL.
	 */
	public static function setUnsubscribeURL( string $link ): void {
		self::$unsubscribe_url = $link;
	}

	/**
	 * Get the unsubscribe URL.
	 *
	 * @return string The unsubscribe URL.
	 */
	public static function getUnsubscribeURL(): string {
		return self::$unsubscribe_url;
	}

	/**
	 * Get the subscription.
	 *
	 * @return array The subscription.
	 */
	public static function getSubscription(): array {
		$client_info = get_option( self::$option_key );

		return $client_info['subscription'] ?? [];
	}

	/**
	 * Get the client info.
	 *
	 * @return array The client info.
	 */
	public static function getClientInfo(): array {
		$client_info = get_option( self::$option_key );

		return empty( $client_info ) ? [] : $client_info;
	}

	/**
	 * Get the token.
	 *
	 * @return string The token.
	 */
	public static function getToken(): string {
		return self::getClientInfo()['access_token'] ?? '';
	}

	/**
	 * Get the get zip file URL.
	 *
	 * @return string The get zip file URL.
	 */
	public static function getZipFileURL(): string {
		return self::$get_zip_file_url;
	}
}
