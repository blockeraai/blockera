<?php

use Blockera\Auth\Client;
use Blockera\Auth\Config;
use Blockera\Bootstrap\Application;

if (! function_exists('blockera_connect_with_account')) {
    /**
     * Connect with account.
     *
     * @param callable|array $callback The callback function to be executed.
     * @param callable|array $authorization_callback The callback function to be executed.
     * @return void
     */
    function blockera_connect_with_account($callback, $authorization_callback): void
    {
        if (method_exists($authorization_callback[0], $authorization_callback[1])) {
            call_user_func($authorization_callback);
        }

        if (is_callable($callback)) {
            $callback();

            return;
        }

        wp_die('Invalid callback provided for connect with account page.');
    }
}

if (! function_exists('blockera_is_connected')) {

    /**
     * Check if the user is connected to Blockera.
     *
     * @return bool true if connected, false otherwise.
     */
    function blockera_is_connected(): bool
    {
        $clientInfo = get_option('blockera-client-info', ['is_connected' => false]);

        return $clientInfo['is_connected'] ?? false;
    }
}

if (! function_exists('blockera_oauth_menu_callback')) {
    /**
     * Callback function for OAuth menu.
     *
     * @param Application    $app The application instance.
     * @param array          $config Configuration array for OAuth settings.
     * @param callable|array $callback The callback function to be executed.
     *
     * @return void
     */
    function blockera_oauth_menu_callback(Application $app, array $config, $callback): void
    {
        if (empty($config)) {
            return;
        }

        $client_info = Config::getClientInfo();

        $client = $app->make(
            Client::class,
            [
                /*
                |--------------------------------------------------------------------------
                | Client ID
                |--------------------------------------------------------------------------
                |
                | The client ID is the unique identifier for the application.
                |
                */
                'clientId'                => $client_info['client_id'] ?? $_GET['client_id'] ?? '',

                /*
                |--------------------------------------------------------------------------
                | Client Secret
                |--------------------------------------------------------------------------
                |
                | The client secret is the secret key for the application.
                |
                */
                'clientSecret'            => $client_info['client_secret'] ?? $_GET['client_secret'] ?? '',

                /*
                |--------------------------------------------------------------------------
                | Authorize
                |--------------------------------------------------------------------------
                |
                | The authorize endpoint is used to initiate the OAuth2 authorization flow.
                | When users connect their Blockera account, they are redirected to this URL
                | to authenticate and grant access permissions to the application.
                |
                */
                'urlAuthorize'            => $_ENV['CONNECT_ACCOUNT_URL'] ?? 'https://api.blockera.ai/authorize',

                /*
                |--------------------------------------------------------------------------
                | Get Access Token
                |--------------------------------------------------------------------------
                |
                | The get access token endpoint is used to retrieve the access token for the user.
                |
                */
                'urlAccessToken'          => $_ENV['ACCESS_TOKEN_URL'] ?? 'https://api.blockera.ai/auth/v1/access-token',

                /*
                |--------------------------------------------------------------------------
                | Resource Owner Details
                |--------------------------------------------------------------------------
                |
                | The resource owner details endpoint is used to retrieve detailed information
                | about the user's account, including subscription status and other relevant data.
                |
                */
                'urlResourceOwnerDetails' => $_ENV['RESOURCE_OWNER_DETAILS_URL'] ?? 'https://api.blockera.ai/files/v1/download',

                /*
                |--------------------------------------------------------------------------
                | Redirect URI
                |--------------------------------------------------------------------------
                |
                | The redirect URI is the URL where the user will be redirected after
                | the OAuth2 authorization flow is complete.
                |
                */
                'redirectUri'             => admin_url('admin.php?page=blockera-settings-account'),
            ]
        );


        $account_info = array_merge(
            ['product_id' => $config['productName']],
            $client_info,
        );

        $create_account_link = $_ENV['CREATE_ACCOUNT_URL'] ?? 'https://blockera.ai/my-account';

        echo '<script>
					window.blockeraIsConnectedWithAccount = ' . (blockera_is_connected() ? 'true' : 'false') . ';
					window.blockeraConnectActionNonce = "' . wp_create_nonce('blockera-connect-with-your-account') . '";
					window.blockeraCreateAccountLink = "' . $create_account_link . '";
					window.blockeraConnectAccountLink = "' . $client->getProvider()->getAuthorizationUrl() . '";
					window.blockeraAIAccount = ' . wp_json_encode($account_info) . ';
				</script>';

        $authorization_callback = [$client, 'auth'];

        blockera_connect_with_account($callback, $authorization_callback);
    }
}
