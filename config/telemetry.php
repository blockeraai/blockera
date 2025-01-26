<?php
/**
 * Direct access is not allowed.
 *
 * @package config/optin.php
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'wp_create_nonce' ) ) {

	require ABSPATH . '/wp-includes/pluggable.php';
}

return [
	/**
	 * The params for rest requests to server_url.
	 */
	'rest_params'             => [
		/**
		 * Unique ID for the product slug.
		 */
		'slug'  => 'blockera',
		/**
		 * The main script file absolute path of product.
		 */
		'main'  => BLOCKERA_CORE_FILE,
		/**
		 * The nonce security field.
		 */
		'nonce' => wp_create_nonce( 'blockera-telemetry-nonce' ),
	],
	/**
	 * Declare option keys to store data in your database.
	 */
	'options'                 => [
		/**
		 * The option name to save opt_in_status
		 */
		'opt_in_status' => 'blockera-opt-in-status',
	],
	'opt_in_description'      => __(
		"We have introduced this opt-in so you never miss an important update and help us make the plugin more compatible with your site and better at doing what you need it to. Opt in to get email notifications for security & feature updates, and to share some basic WordPress environment info. If you skip this, that's okay! Blockera will still work just fine.",
		'blockera'
	),
	/**
	 * The terms of services link
	 */
	'terms_of_services_link'  => 'https://blockera.ai/terms-and-conditions-of-use/',
	/**
	 * The privacy and policy link.
	 */
	'privacy_and_policy_link' => 'https://blockera.ai/privacy-policy/',
	/**
	 * The permissions use link.
	 */
	'permissions_link'        => 'https://blockera.ai/telemetry/',
	/**
	 * The community url.
	 */
	'community_url'           => 'https://community.blockera.ai/',
	/**
	 * Prefix for hook names.
	 */
	'hook_prefix'             => 'blockera',
	/**
	 * The url of the Blockera API server.
	 */
	'server_url'              => blockera_core_env( 'TELEMETRY_SERVER_URL', 'https://api.blockera.ai/v1/telemetry' ),
	/**
	 * The url of the Blockera API server for debug logger.
	 */
	'debug_logger_url'        => blockera_core_env( 'TELEMETRY_DEBUG_LOGGER_URL', 'https://api.blockera.ai/v1/telemetry/log-error' ),
];
