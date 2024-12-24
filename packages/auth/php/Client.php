<?php

namespace Blockera\Auth;

use Blockera\Exceptions\BaseException;
use League\OAuth2\Client\Provider\GenericProvider;

class Client {

	/**
	 * OAuth2 provider instance for handling authentication.
	 *
	 * @var GenericProvider
	 */
	private GenericProvider $provider;

	public function __construct( array $args = [] ) {
		if ( ! empty( $args ) ) {
			$this->provider = new GenericProvider( $args );
		}
	}

	/**
	 * Process authorization information from OAuth callback.
	 * Handles authorization code exchange for access token and validates state parameter.
	 *
	 * @return void
	 */
	public function auth(): void {
		if ( ! isset( $_GET['client_id'], $_GET['client_secret'], $_GET['redirect_to'] ) || blockera_is_connected() ) {
			return;
		}

		$client_info         = get_option( 'blockera-client-info' );
		$allowed_redirect_to = false;

		try {
			if ( empty( $client_info['access_token'] ) ) {
				// Prevent to duplicate create account request.
				$this->createClientInfo();
				$this->connectToClientAccount();

				// phpcs:disable
				// Using the access token, we may look up details about the
				// resource owner.
				// $resourceOwner = $this->provider->getResourceOwner($access_token);

				// dd($resourceOwner->toArray());

				// // The provider provides a way to get an authenticated API request for
				// // the service, using the access token; it returns an object conforming
				// // to Psr\Http\Message\RequestInterface.
				// $request = $this->provider->getAuthenticatedRequest(
				// 'GET',
				// 'https://service.example.com/resource',
				// $access_token
				// );	
			}

			$allowed_redirect_to = true;
		} catch (\League\OAuth2\Client\Provider\Exception\IdentityProviderException $e) {
			// Failed to get the access token or user details.
			exit($e->getMessage());
		}

		if ($allowed_redirect_to) {
			$parsed_url   = parse_url($_GET['redirect_to']);
			$parsed_query = [];
			parse_str($parsed_url['query'] ?? '', $parsed_query);

			$parsed_query['client_id']     = $_GET['client_id'];
			$parsed_query['client_secret'] = $_GET['client_secret'];

			$parsed_url['query'] = http_build_query($parsed_query);
			$_GET['redirect_to'] = $parsed_url['scheme'] . '://' . $parsed_url['host'] . $parsed_url['path'] . '?' . $parsed_url['query'];

			echo '<script>window.location.href = "' . $_GET['redirect_to'] . '"</script>';
			exit;
		}
	}

	/**
	 * Get the OAuth2 provider instance.
	 *
	 * @return GenericProvider
	 */
	public function getProvider(): GenericProvider
	{
		return $this->provider;
	}

	/**
	 * Creates client information by making a REST API request to create an account.
	 *
	 * @return void
	 */
	protected function createClientInfo(): void
	{
		$create_account_request = new \WP_REST_Request('POST', '/blockera/v1/auth/create-account');
		$create_account_request->set_body_params(
			[
				'code' => $_GET['code'],
				'action' => 'create_account',
				'client_id'     => $_GET['client_id'],
				'client_secret' => $_GET['client_secret'],
			]
		);
		$create_account_request->set_header('X-Blockera-Nonce', wp_create_nonce('blockera-connect-with-your-account'));

		$response_object = rest_do_request($create_account_request);

		if ($response_object->is_error()) {

			$data = $response_object->get_data();

			throw new BaseException(implode(', ', $data['errors']), $data['code']);
		}
	}

	/**
	 * Connects to a client account by exchanging an authorization code for an access token and making a REST API request.
	 *
	 * @return void
	 */
	protected function connectToClientAccount(): void
	{
		// Try to get an access token using the authorization code grant.
		$access_token = $this->getProvider()->getAccessToken(
			'authorization_code',
			[
				'code' => $_GET['code'],
			]
		);

		$connect_account_request = new \WP_REST_Request('POST', '/blockera/v1/auth/connect-account');
		$connect_account_request->set_body_params([
			'action' => 'connect_account',
			'expires' => $access_token->getExpires(),
			'token' => $access_token->getToken(),
			'has_expired' => $access_token->hasExpired(),
			'refresh_token' => $access_token->getRefreshToken(),
		]);
		$connect_account_request->set_header('X-Blockera-Nonce', wp_create_nonce('blockera-connect-with-your-account'));

		$response_object = rest_do_request($connect_account_request);

		if ($response_object->is_error()) {

			$data = $response_object->get_data();

			throw new BaseException(implode(', ', $data['errors']), $data['code']);
		}
	}
}
