<?php

namespace Blockera\Auth\Http\Controllers;

use Blockera\Auth\Config;
use Blockera\Http\RestController;
use Blockera\Utils\Utils;

class ConnectionController extends RestController {


	/**
	 * Store validation errors.
	 *
	 * @var array
	 */
	protected $errors = [];

	/**
	 * Store the option key.
	 *
	 * @var string
	 */
	protected $option_key;

	/**
	 * The constructor.
	 */
	public function __construct() {
         $this->option_key = Config::getOptionKey();
	}

	/**
	 * Check if the user has permission to access the resource.
	 *
	 * @param \WP_REST_Request $request The request object.
	 * @return bool Whether the user has permission.
	 */
	public function permission( \WP_REST_Request $request): bool {
		$referer = $request->get_header('Referer');

		// Validate URLs if present.
		if (! empty($referer) && ! str_starts_with($referer, home_url())) {
			if (! filter_var($referer, FILTER_VALIDATE_URL)) {
				$this->errors['invalid_referer'] = __('Invalid Referer URL.', 'blockera');
			}
			// Only allow redirects to allowed domains.
			$allowed_domains = [ parse_url(Config::getApiBaseUrl(), PHP_URL_HOST) ];
			$referer_host    = parse_url($referer, PHP_URL_HOST);

			if (! in_array($referer_host, $allowed_domains, true)) {
				return false;
			}

			return true;
		}

		if (! current_user_can('manage_options')) {
			return false;
		}

		return wp_verify_nonce($request->get_header('X-Blockera-Nonce'), 'blockera-connect-with-your-account');
	}

	/**
	 * Connect to Blockera AI.
	 *
	 * @param \WP_REST_Request $request The request object.
	 * @return \WP_REST_Response The response object.
	 */
	public function connectAccount( \WP_REST_Request $request): \WP_REST_Response {
		$this->validate($request->get_params());

		if (count($this->errors) > 0) {
			return new \WP_REST_Response(
				[
					'code'    => 400,
					'success' => false,
					'errors'  => $this->errors,
				],
				400
			);
		}

		$client_info = get_option($this->option_key);

		if (! $client_info) {

			$info = [
				'expires'       => $request->get_param('expires'),
				'access_token'  => $request->get_param('token'),
				'has_expired'   => $request->get_param('has_expired'),
				'refresh_token' => $request->get_param('refresh_token'),
			];
		} else {

			$info = array_merge(
				$client_info,
				[
					'expires'       => $request->get_param('expires'),
					'access_token'  => $request->get_param('token'),
					'has_expired'   => $request->get_param('has_expired'),
					'refresh_token' => $request->get_param('refresh_token'),
				]
			);
		}

		$updated = update_option($this->option_key, $info);

		if (! $updated && $info === $client_info) {
			return new \WP_REST_Response(
				[
					'code'    => 500,
					'success' => false,
					'errors'  => [
						__('Failed to connect to Blockera AI.', 'blockera'),
					],
				],
				500
			);
		}

		return new \WP_REST_Response(
			[
				'code'    => 200,
				'success' => true,
				'data'    => [
					'message' => __('Connected to Blockera AI successfully.', 'blockera'),
				],
			]
		);
	}

	/**
	 * Create an account.
	 *
	 * @param \WP_REST_Request $request The request object.
	 * @return \WP_REST_Response The response object.
	 */
	public function createAccount( \WP_REST_Request $request): \WP_REST_Response {
		$this->validate($request->get_params());

		if (count($this->errors) > 0) {
			return new \WP_REST_Response(
				[
					'code'    => 400,
					'success' => false,
					'errors'  => $this->errors,
				],
				400
			);
		}

		$client_info = get_option($this->option_key);

		if (! $client_info) {

			$info = [
				'authorization_code' => $request->get_param('code'),
				'client_id'          => $request->get_param('client_id'),
				'client_secret'      => $request->get_param('client_secret'),
			];
		} else {

			$info = array_merge(
				$client_info,
				[
					'authorization_code' => $request->get_param('code'),
					'client_id'          => $request->get_param('client_id'),
					'client_secret'      => $request->get_param('client_secret'),
				]
			);
		}

		$updated = update_option($this->option_key, $info);

		if (! $updated && $client_info !== $info) {
			return new \WP_REST_Response(
				[
					'code'    => 500,
					'success' => false,
					'errors'  => [
						__('Failed to create client info.', 'blockera'),
					],
				],
				500
			);
		}

		return new \WP_REST_Response(
			[
				'code'    => 201,
				'success' => true,
				'data'    => [
					'message' => __('Client info created successfully.', 'blockera'),
				],
			],
			201
		);
	}

	/**
	 * Check if the user is connected to https://blockera.ai bought subscription.
	 *
	 * @param \WP_REST_Request $request The request object.
	 * @return \WP_REST_Response The response object.
	 */
	public function isConnected( \WP_REST_Request $request): \WP_REST_Response {
		$this->validate($request->get_params());

		$client_info = get_option($this->option_key);

		if (empty($client_info['access_token'])) {

			$this->errors['access_token'] = __('Access token is required.', 'blockera');
		} elseif (time() > $client_info['expires']) {

			$this->errors['access_token'] = __('Access token has expired.', 'blockera');
		}

		if (count($this->errors) > 0) {
			return new \WP_REST_Response(
				[
					'code'    => 400,
					'success' => false,
					'errors'  => $this->errors,
				],
				400
			);
		}

		if (! $client_info) {

			$info = [
				'is_connected' => (bool) $request->get_param('is_connected'),
			];
		} else {

			$info = array_merge(
				$client_info,
				[
					'is_connected' => (bool) $request->get_param('is_connected'),
				]
			);
		}

		$updated = update_option($this->option_key, $info);

		if (! $updated && $client_info !== $info) {
			$this->errors['update_failed'] = __('Failed to update connection status.', 'blockera');

			return new \WP_REST_Response(
				[
					'code'    => 500,
					'success' => false,
					'errors'  => $this->errors,
				],
				500
			);
		}

		return new \WP_REST_Response(
			[
				'code'    => 200,
				'success' => true,
				'data'    => [
					'is-connected' => $info['is_connected'],
				],
			]
		);
	}

	/**
	 * Get the subscription information.
	 *
	 * @param \WP_REST_Request $request The request object.
	 *
	 * @return \WP_REST_Response The response object.
	 */
	public function getSubscriptions( \WP_REST_Request $request): \WP_REST_Response {
		if ('subscriptions' !== $request->get_param('action')) {
			$this->errors['invalid_action'] = __('Invalid action.', 'blockera');
		}

		$this->validate($request->get_params());

		if (count($this->errors) > 0) {
			return new \WP_REST_Response(
				[
					'code'    => 400,
					'success' => false,
					'errors'  => $this->errors,
				],
				400
			);
		}

		$client_info = get_option($this->option_key);

		if (! empty($client_info['subscriptions']) && empty($request->get_param('force'))) {
			$account_info = array_merge(
				[
					'subscriptions' => $client_info['subscriptions'] ?? [],
				],
				[
					'name'   => $client_info['name'] ?? '',
					'email'  => $client_info['email'] ?? '',
					'avatar' => $client_info['avatar'] ?? '',
				]
			);

			return new \WP_REST_Response(
				[
					'code'    => 200,
					'success' => true,
					'data'    => $account_info,
				]
			);
		}

		if (empty($client_info['access_token'])) {
			return new \WP_REST_Response(
				[
					'code'    => 400,
					'success' => false,
					'errors'  => [
						'access_token' => __('Access token is required.', 'blockera'),
					],
				],
				400
			);
		}

		$args = [
			'timeout'     => 30,
			'redirection' => 5,
			'httpversion' => '1.1',
			// Disable SSL verification.
			'sslverify'   => false,
			'headers'     => [
				'Content-Type'  => 'application/json',
				'Authorization' => 'Bearer ' . $client_info['access_token'],
			],
			'body'        => [
				'domain'     => home_url(),
				'client_id'  => $client_info['client_id'],
				'user_email' => wp_get_current_user()->user_email,
			],
		];

		$response = wp_remote_get(Config::getAccountInfoLink(), $args);

		if (is_wp_error($response)) {
			return new \WP_REST_Response(
				[
					'code'    => 500,
					'success' => false,
					'errors'  => [
						'subscription_not_found' => $response->get_error_message(),
					],
				],
				500
			);
		}

		$response_body = json_decode(wp_remote_retrieve_body($response), true);

		if (! empty($response_body['data']['success']) && false === $response_body['data']['success']) {
			return new \WP_REST_Response(
				[
					'code'    => 500,
					'success' => false,
					'errors'  => $response_body['data']['errors'],
				],
				500
			);
		}

		// Create a transient key to store the subscription temporary data.
		$prefix_transient_key = Config::getPrefixTransientKey();

		$subscriptions = array_map(
			function ( $subscription) use ( $prefix_transient_key) {
				$transient_key = $prefix_transient_key . Utils::snakeCase(explode('- ', $subscription['subscription_name'])[2]);

				set_transient($transient_key, $subscription['versionId'], 60 * 60 * 3); // Available for 3 hours.

				unset($subscription['versionId']);

				return $subscription;
			},
			$response_body['data']['subscriptions']
		);

		unset($response_body['data']['subscriptions']);

		if (! $client_info) {

			$info                  = $response_body['data'];
			$info['subscriptions'] = $subscriptions;
		} else {

			$info                  = array_merge($client_info, $response_body['data']);
			$info['subscriptions'] = $subscriptions;
		}

		$updated = update_option($this->option_key, $info);

		if (! $updated && $client_info !== $info) {
			return new \WP_REST_Response(
				[
					'code'    => 500,
					'success' => false,
					'errors'  => [
						'subscription_not_found' => __('Failed to updating or creating subscription info proccess.', 'blockera'),
					],
				],
				500
			);
		}

		$response_body['data']['subscriptions'] = $subscriptions;

		return new \WP_REST_Response($response_body);
	}

	/**
	 * Unsubscribe from Blockera AI.
	 *
	 * @param \WP_REST_Request $request The request object.
	 *
	 * @return \WP_REST_Response The response object.
	 */
	public function unsubscribe( \WP_REST_Request $request): \WP_REST_Response {
		$this->validate($request->get_params());

		if (count($this->errors) > 0) {
			return new \WP_REST_Response(
				[
					'code'    => 400,
					'success' => false,
					'errors'  => $this->errors,
				],
				400
			);
		}

		$client_info = get_option($this->option_key);

		if (empty($client_info['subscriptions'])) {
			return new \WP_REST_Response(
				[
					'code'    => 400,
					'success' => false,
					'errors'  => [
						'subscription_not_exists' => __('Subscription not found.', 'blockera'),
					],
				],
				400
			);
		}

		$response = wp_remote_post(
			Config::getUnsubscribeURL(),
			[
				'timeout'     => 30,
				'redirection' => 5,
				'httpversion' => '1.1',
				'sslverify'   => false,
				'headers'     => [
					'Referer'          => home_url(),
					'Authorization'    => 'Bearer ' . $client_info['access_token'],
					'X-Blockera-Nonce' => wp_create_nonce('blockera-site-toolkit'),
				],
				'body'        => [
					'client_id' => $client_info['client_id'],
				],
			]
		);

		if (is_wp_error($response)) {
			return new \WP_REST_Response(
				[
					'code'    => 500,
					'success' => false,
					'errors'  => [
						'unsubscribe_failed' => $response->get_error_message(),
					],
				],
				500
			);
		}

		unset($client_info['subscriptions']);

		$isUpdated = update_option($this->option_key, $client_info);

		if (! $isUpdated) {
			return new \WP_REST_Response(
				[
					'code'    => 500,
					'success' => false,
					'errors'  => [
						'unsubscribe_failed' => __('Failed to unsubscribe from Blockera AI.', 'blockera'),
					],
				],
				500
			);
		}

		return new \WP_REST_Response(
			[
				'code'    => 200,
				'success' => true,
				'data'    => [
					'message' => __('Unsubscribed from Blockera AI successfully.', 'blockera'),
				],
			]
		);
	}

	/**
	 * Validate the request parameters.
	 *
	 * @param array $params The request parameters.
	 *
	 * @return void
	 */
	protected function validate( array $params): void {
		if (empty($params['action'])) {
			$this->errors['action'] = __('Action Field is required.', 'blockera');

			return;
		}

		$action = sanitize_text_field($params['action']);

		$required_params = [
			'action' => __('Action Field is required.', 'blockera'),
		];

		if ('create_account' === $action) {
			$required_params['client_id']     = __('Client ID Field is required.', 'blockera');
			$required_params['code']          = __('Authorization Code Field is required.', 'blockera');
			$required_params['client_secret'] = __('Client Secret Field is required.', 'blockera');
		} elseif ('connect_account' === $action) {
			$required_params['token']         = __('Access Token Field is required.', 'blockera');
			$required_params['expires']       = __('Expires Field is required.', 'blockera');
			$required_params['has_expired']   = __('Has Expired Field is required.', 'blockera');
			$required_params['refresh_token'] = __('Refresh Access Token Field is required.', 'blockera');
		}

		$available_actions = [
			'unsubscribe',
			'is_connected',
			'subscriptions',
			'create_account',
			'connect_account',
		];

		if (! in_array($action, $available_actions, true)) {
			$this->errors['invalid_action'] = __('Invalid action.', 'blockera');
		}

		// Validate and sanitize parameters.
		foreach ($params as $key => $value) {
			if (is_string($value)) {
				$params[ $key ] = sanitize_text_field($value);
			}
		}

		array_map(
			function ( $message, $param) use ( $params) {
				if ('has_expired' === $param && false === $params[ $param ]) {
					return;
				}
				if (empty($params[ $param ])) {
					$this->errors[ $param ] = $message;
				}
			},
			$required_params,
			array_keys($required_params)
		);
	}
}
