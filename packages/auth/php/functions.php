<?php

use Blockera\Auth\Client;
use Blockera\Bootstrap\Application;

if ( ! function_exists( 'blockera_connect_with_account' ) ) {
	/**
	 * Connect with account.
	 *
	 * @param callable|array $callback The callback function to be executed.
	 * @param callable|array $authorization_callback The callback function to be executed.
	 * @return void
	 */
	function blockera_connect_with_account( $callback, $authorization_callback ): void {
		if ( method_exists( $authorization_callback[0], $authorization_callback[1] ) ) {
			call_user_func( $authorization_callback );
		}

		if ( is_callable( $callback ) ) {
			$callback();

			return;
		}

		wp_die( 'Invalid callback provided for connect with account page.' );
	}
}

if ( ! function_exists( 'blockera_is_connected' ) ) {

	/**
	 * Check if the user is connected to Blockera.
	 *
	 * @return bool true if connected, false otherwise.
	 */
	function blockera_is_connected(): bool {
		$clientInfo = get_option( 'blockera-client-info', [ 'is_connected' => false ] );

		return $clientInfo['is_connected'] ?? false;
	}
}

if ( ! function_exists( 'blockera_oauth_menu_callback' ) ) {
	/**
	 * Callback function for OAuth menu.
	 *
	 * @param Application    $app The application instance.
	 * @param array          $config Configuration array for OAuth settings.
	 * @param callable|array $callback The callback function to be executed.
	 *
	 * @return void
	 */
	function blockera_oauth_menu_callback( Application $app, array $config, $callback ): void {
		if ( empty( $config ) ) {
			return;
		}

		$client_info = get_option( $config['optionKey'], [] );

		$client = $app->make(
			Client::class,
			[
				'clientId'                => $client_info['client_id'] ?? $_GET['client_id'] ?? '',
				'clientSecret'            => $client_info['client_secret'] ?? $_GET['client_secret'] ?? '',
				'urlAuthorize'            => $config['authorizeUrl'],
				'urlAccessToken'          => $config['getAccessToken'],
				'urlResourceOwnerDetails' => $config['resourceOwnerDetailsUrl'],
				'redirectUri'             => admin_url( 'admin.php?page=blockera-settings-connect-with-account' ),
			]
		);

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

		echo '<script>
					window.blockeraIsConnectedWithAccount = ' . ( blockera_is_connected() ? 'true' : 'false' ) . ';
					window.blockeraConnectActionNonce = "' . wp_create_nonce( 'blockera-connect-with-your-account' ) . '";
					window.blockeraCreateAccountLink = "' . $config['createAccount'] . '";
					window.blockeraConnectAccountLink = "' . $client->getProvider()->getAuthorizationUrl() . '";
					window.blockeraAIAccount = ' . wp_json_encode( $account_info ) . ';
				</script>';

		$authorization_callback = [ $client, 'auth' ];

		blockera_connect_with_account( $callback, $authorization_callback );
	}
}
