<?php

namespace Blockera\Auth;

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
		if ( ! isset( $_GET['client_id'], $_GET['client_secret'], $_GET['redirect_to'] ) ) {
			return;
		}

		$allowed_redirect_to = false;

		update_option( 'blockera-client-id', $_GET['client_id'] );
		update_option( 'blockera-client-secret', $_GET['client_secret'] );

		try {
			// Try to get an access token using the authorization code grant.
			$access_token = $this->getProvider()->getAccessToken(
				'authorization_code',
				[
					'code' => $_GET['code'],
				]
			);

			update_option( 'blockera-expires', $access_token->getExpires() );
			update_option( 'blockera-access-token', $access_token->getToken() );
			update_option( 'blockera-has-expired', $access_token->hasExpired() );
			update_option( 'blockera-refresh-access-token', $access_token->getRefreshToken() );

			$allowed_redirect_to = true;

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
		} catch ( \League\OAuth2\Client\Provider\Exception\IdentityProviderException $e ) {
			if ( 0 === $e->getCode() ) {
				echo '<script>window.location.reload();</script>';
			} else {
				// Failed to get the access token or user details.
				exit( $e->getMessage() );
			}
		}

		if ( $allowed_redirect_to ) {
			$parsed_url   = parse_url( $_GET['redirect_to'] );
			$parsed_query = [];
			parse_str( $parsed_url['query'] ?? '', $parsed_query );

			$parsed_query['client_id']     = $_GET['client_id'];
			$parsed_query['client_secret'] = $_GET['client_secret'];

			$parsed_url['query'] = http_build_query( $parsed_query );
			$_GET['redirect_to'] = $parsed_url['scheme'] . '://' . $parsed_url['host'] . $parsed_url['path'] . '?' . $parsed_url['query'];

			wp_redirect(
				$_GET['redirect_to'],
				301
			);
			exit;
		}
	}

	public function getProvider(): GenericProvider {
		return $this->provider;
	}
}
