<?php

namespace Blockera\Auth;

use Blockera\Utils\Utils;

class Config
{

	/**
	 * The option key.
	 *
	 * @var string $option_key The option key.
	 */
	protected static string $option_key = 'blockera-oauth-credentials';

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
	 * @var string $product_name The product name.
	 */
	protected static string $product_name;

	/**
	 * The API base URL.
	 *
	 * @var string $api_base_url The API base URL.
	 */
	protected static string $api_base_url;

	/**
	 * The allowed plans link.
	 *
	 * @var string $get_allowed_plans_link The allowed plans link.
	 */
	protected static string $get_allowed_plans_link;

	/**
	 * The product identifier.
	 *
	 * @var string $product_identifier The product identifier.
	 */
	protected static string $product_identifier;

	/**
	 * The is dev flag.
	 *
	 * @var bool $is_dev The is dev flag.
	 */
	protected static bool $is_dev;

	/**
	 * The plugin URL.
	 *
	 * @var string $plugin_url The plugin URL.
	 */
	protected static string $plugin_url;

	/**
	 * The plugin icons.
	 *
	 * @var array $plugin_icons The plugin icons.
	 */
	protected static array $plugin_icons;

	/**
	 * The resource owner details URL.
	 *
	 * @var string $resource_owner_details_url The resource owner details URL.
	 */
	protected static string $resource_owner_details_url;

	/**
	 * The prefix transient key.
	 *
	 * @var string $prefix_transient_key The prefix transient key.
	 */
	protected static string $prefix_transient_key = 'blockera-oauth-subscription__';

	/**
	 * The app config.
	 *
	 * @var array $app_config The app config.
	 */
	protected static array $app_config;

	/**
	 * The plugin slug.
	 *
	 * @var string $plugin_slug The plugin slug.
	 */
	protected static string $plugin_slug;

	/**
	 * The plugin name.
	 *
	 * @var string $plugin_name The plugin name.
	 */
	protected static string $plugin_name;

	/**
	 * The constructor.
	 *
	 * @param array $config The config.
	 */
	public function __construct(array $config)
	{
		self::$api_base_url = $_ENV['API_BASE_URL'] ?? 'https://api.blockera.ai';
		self::$unsubscribe_url = $_ENV['UNSUBSCRIBE_URL'] ?? 'https://api.blockera.ai/license-manager/v1/domains';
		self::$get_account_info_link = $_ENV['ACCOUNT_INFO_URL'] ?? 'https://blockera.ai/wp-json/auth/v1/licenses';
		self::$get_allowed_plans_link = $_ENV['ALLOWED_PLANS_URL'] ?? 'https://blockera.ai/wp-json/auth/v1/products/allowed-plans';

		array_map([$this, 'setProperties'], array_keys($config), $config);
	}

	/**
	 * Get the app config.
	 *
	 * @param string $key The key.
	 * 
	 * @return mixed The value.
	 */
	public static function get(string $key = '')
	{
		if (empty($key)) {
			return self::$app_config;
		}

		return self::$app_config[$key];
	}

	/**
	 * Set the properties.
	 *
	 * @param string $key The key.
	 * @param string $value The value.
	 */
	private function setProperties(string $key, string $value): void
	{
		$snake_case_key = Utils::snakeCase($key);

		if (property_exists($this, $snake_case_key)) {
			self::$$snake_case_key = $value;
		}
	}

	/**
	 * Get the prefix transient key.
	 *
	 * @return string The prefix transient key.
	 */
	public static function getPrefixTransientKey(): string
	{
		return self::$prefix_transient_key;
	}

	/**
	 * Get the allowed plans link.
	 *
	 * @return string The allowed plans link.
	 */
	public static function getAllowedPlansLink(): string
	{
		return self::$get_allowed_plans_link;
	}

	/**
	 * Set the product identifier.
	 *
	 * @param string $product_identifier The product identifier.
	 */
	public function setProductIdentifier(string $product_identifier): void
	{
		self::$product_identifier = $product_identifier;
	}

	/**
	 * Get the product identifier.
	 *
	 * @return string The product identifier.
	 */
	public static function getProductIdentifier(): string
	{
		return self::$product_identifier;
	}

	/**
	 * Get the API base URL.
	 *
	 * @return string The API base URL.
	 */
	public static function getApiBaseUrl(): string
	{
		return self::$api_base_url;
	}

	/**
	 * Get the product name.
	 *
	 * @return string The product name.
	 */
	public static function getProductName(): string
	{
		return self::$product_name;
	}

	/**
	 * Get the option key.
	 *
	 * @return string The option key.
	 */
	public static function getOptionKey(): string
	{
		return self::$option_key;
	}

	/**
	 * Get the account info link.
	 *
	 * @return string The account info link.
	 */
	public static function getAccountInfoLink(): string
	{
		return self::$get_account_info_link;
	}

	/**
	 * Set the account info link.
	 *
	 * @param string $link The account info link.
	 */
	public static function setAccountInfoLink(string $link): void
	{
		self::$get_account_info_link = $link;
	}

	/**
	 * Set the unsubscribe URL.
	 *
	 * @param string $link The unsubscribe URL.
	 */
	public static function setUnsubscribeURL(string $link): void
	{
		self::$unsubscribe_url = $link;
	}

	/**
	 * Get the unsubscribe URL.
	 *
	 * @return string The unsubscribe URL.
	 */
	public static function getUnsubscribeURL(): string
	{
		return self::$unsubscribe_url;
	}

	/**
	 * Get the subscription.
	 *
	 * @return array The subscription.
	 */
	public static function getSubscriptions(): array
	{
		$client_info = get_option(self::$option_key);

		return $client_info['subscriptions'] ?? [];
	}

	/**
	 * Get the client info.
	 *
	 * @return array The client info.
	 */
	public static function getClientInfo(): array
	{
		$client_info = get_option(self::$option_key);

		return empty($client_info) ? [] : $client_info;
	}

	/**
	 * Get the token.
	 *
	 * @return string The token.
	 */
	public static function getToken(): string
	{
		return self::getClientInfo()['access_token'] ?? '';
	}

	/**
	 * Get the get zip file URL.
	 *
	 * @return string The get zip file URL.
	 */
	public static function getZipFileURL(): string
	{
		return self::$get_zip_file_url;
	}

	/**
	 * Set the is dev flag.
	 *
	 * @param bool $is_dev The is dev flag.
	 */
	public static function setIsDev(bool $is_dev): void
	{
		self::$is_dev = $is_dev;
	}

	/**
	 * Check if the plugin is in development mode.
	 *
	 * @return bool True if the plugin is in development mode, false otherwise.
	 */
	public static function isDev(): bool
	{
		return static::$is_dev;
	}

	/**
	 * Get the plugin URL.
	 *
	 * @return string The plugin URL.
	 */
	public static function getPluginUrl(): string
	{
		return self::$plugin_url;
	}

	/**
	 * Set the plugin icons.
	 *
	 * @param array $icons The plugin icons.
	 */
	public static function setIcons(array $icons): void
	{
		self::$plugin_icons = $icons;
	}

	/**
	 * Get the plugin icons.
	 *
	 * @return array The plugin icons.
	 */
	public static function getIcons(): array
	{
		return self::$plugin_icons;
	}

	/**
	 * Get the resource owner details URL.
	 *
	 * @return string The resource owner details URL.
	 */
	public static function getResourceOwnerDetailsUrl(): string
	{
		return self::$resource_owner_details_url;
	}

	/**
	 * Get the plugin slug.
	 *
	 * @return string The plugin slug.
	 */
	public static function getPluginSlug(): string
	{
		return self::$plugin_slug;
	}

	/**
	 * Get the plugin name.
	 *
	 * @return string The plugin name.
	 */
	public static function getPluginName(): string
	{
		return self::$plugin_name;
	}
}
