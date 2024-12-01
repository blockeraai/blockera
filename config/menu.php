<?php
/**
 * Blockera menus
 *
 * @package Blockera
 */

use Blockera\Auth\Client;

// direct access is not allowed.
if (! defined('ABSPATH')) {
	exit;
}

ob_start();

include BLOCKERA_CORE_PATH . 'assets/menu-logo.svg';

$logo = ob_get_clean();
$logo = base64_encode($logo);

return [
	'page_title' => __('Blockera Settings', 'blockera'),
	'menu_title' => __('Blockera', 'blockera'),
	'capability' => 'manage_options',
	'menu_slug'  => 'blockera-settings-dashboard',
	'callback'   => 'blockera_settings_page_template',
	'icon_url'   => 'data:image/svg+xml;base64,' . $logo,
	'submenus'   => [
		'dashboard'        => [
			'page_title' => __('Blockera Dashboard', 'blockera'),
			'menu_title' => __('Dashboard', 'blockera'),
			'capability' => 'manage_options',
			'menu_slug'  => 'blockera-settings-dashboard',
			'callback'   => 'blockera_settings_page_template',
		],
		'general-settings' => [
			'page_title' => __('Blockera General Settings', 'blockera'),
			'menu_title' => __('General Settings', 'blockera'),
			'capability' => 'manage_options',
			'menu_slug'  => 'blockera-settings-general-settings',
			'callback'   => 'blockera_settings_page_template',
		],
		'block-manager'    => [
			'page_title' => __('Blockera Block Manager', 'blockera'),
			'menu_title' => __('Block Manager', 'blockera'),
			'capability' => 'manage_options',
			'menu_slug'  => 'blockera-settings-block-manager',
			'callback'   => 'blockera_settings_page_template',
		],
		'connect-with-account' => [
			'page_title' => __('Connect with account', 'blockera'),
			'menu_title' => __('Connect with account', 'blockera'),
			'capability' => 'manage_options',
			'menu_slug'  => 'blockera-settings-connect-with-account',
			'callback'   => function () {
				global $blockera;

				$client = $blockera->make(Client::class, [
					'clientId' => get_option('blockera-client-id', ''),
					'clientSecret' => get_option('blockera-client-secret', ''),
					'urlAuthorize' => blockera_core_config('auth.connectAccount'),
					'urlAccessToken' => blockera_core_config('auth.getAccessToken'),
					'urlResourceOwnerDetails' => blockera_core_config('auth.getSubscription'),
					'redirectUri' => admin_url('admin.php?page=blockera-settings-connect-with-account'),
				]);

				echo '<script>
					window.blockeraIsConnectedWithAccount = ' . (blockera_is_connected() ? 'true' : 'false') . ';
					window.blockeraConnectActionNonce = "' . wp_create_nonce('blockera-connect-with-your-account') . '";
					window.blockeraCreateAccountLink = "' . blockera_core_config('auth.createAccount') . '";
					window.blockeraConnectAccountLink = "' . $client->getProvider()->getAuthorizationUrl() . '";
				</script>';

				$authorization_callback = [$client, 'auth'];

				blockera_connect_with_account('blockera_settings_page_template', $authorization_callback);
			},
		],
	],
];
