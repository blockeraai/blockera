<?php
/**
 * Direct access is not allowed.
 *
 * @package config/optin.php
 */

if (! defined('ABSPATH')) {
    exit;
}

if (! function_exists('wp_create_nonce')) {

    require ABSPATH . '/wp-includes/pluggable.php';
}

return [
	/**
	 * The params for rest requests to server_url.
	 */
	'rest_params'             => blockera_core_config('telemetryRestParams'),
	/**
	 * Declare option keys to store data in your database.
	 */
	'options'                 => [
		/**
		 * The option name to save opt_in_status
		 */
		'opt_in_status' => 'blockera-opt-in-status',
	],
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
	'server_url'              => blockera_core_env( 'TELEMETRY_SERVER_URL', 'https://api.blockera.ai/telemetry/v1' ),
	/**
	 * The url of the Blockera API server for debug logger.
	 */
	'debug_logger_url'        => blockera_core_env( 'TELEMETRY_DEBUG_LOGGER_URL', 'https://api.blockera.ai/v1/telemetry/log-error' ),
];
