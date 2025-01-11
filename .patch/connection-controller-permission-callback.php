<?php 

use Blockera\Auth\Config;

class ConnectionControllerPermissionCallback {

	protected $errors = [];

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
	}

	/**
	 * Unsubscribe from Blockera AI.
	 *
	 * @param \WP_REST_Request $request The request object.
	 *
	 * @return \WP_REST_Response The response object.
	 */
	public function unsubscribe(\WP_REST_Request $request): \WP_REST_Response
	{
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
				'sslverify'   => Config::isDev(),
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
}