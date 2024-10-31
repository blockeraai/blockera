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
		'nonce' => wp_create_nonce( 'blockera-data-stream-nonce' ),
	],
	/**
	 * Declare option keys to store data in your database.
	 */
	'options'                 => [
		/**
		 * The option name to save opt_in_status
		 */
		'opt_in_status' => 'data-stream-opt-in-status',
		/**
		 * The option name to save recieved token after opt-in.
		 */
		'token'         => 'data-stream-token',
		/**
		 * The option name to save user_id after opt-in.
		 */
		'user_id'       => 'data-stream-user-id',
		/**
		 * The option name to save site_id after opt-in.
		 */
		'site_id'       => 'data-stream-site-id',
	],
	'opt_in_description'      => __(
		"We have introduced this opt-in so you never miss an important update and help us make the plugin more compatible with your site and better at doing what you need it to. Opt in to get email notifications for security & feature updates, and to share some basic WordPress environment info. If you skip this, that's okay! Blockera will still work just fine. What permission are being granted?",
		'blockera'
	),
	/**
	 * The terms of services link
	 */
	'terms_of_services_link'  => '#',
	/**
	 * The privacy and policy link.
	 */
	'privacy_and_policy_link' => '#',
	/**
	 * Prefix for hook names.
	 */
	'hook_prefix'             => 'blockera',
	/**
	 * The url of the Blockera API server.
	 */
	'server_url'              => blockera_core_env( 'DATA_STREAM_SERVER_URL', 'https://api.blockera.ai/v1' ),
];
