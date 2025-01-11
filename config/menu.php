<?php

/**
 * Blockera menus
 *
 * @package Blockera
 */

use Blockera\Utils\Utils;
use Blockera\Auth\Config as AuthConfig;

// direct access is not allowed.
if (! defined('ABSPATH')) {
    exit;
}

ob_start();

include BLOCKERA_CORE_PATH . 'assets/menu-logo.svg';

$logo = ob_get_clean();
$logo = base64_encode($logo);
$is_activated_pro = is_plugin_active('blockera-pro/blockera-pro.php');

$oauth_option = AuthConfig::getClientInfo();
$products_licenses = array_column($oauth_option['licenses'] ?? [], 'productName');
$license_index = array_search(blockera_core_config('auth.productName'), $products_licenses, true);
$license = $oauth_option['licenses'][$license_index] ?? [];

if (!Utils::isPluginInstalled('blockera-pro') || empty($oauth_config) || (!$is_activated_pro && (!empty($license) || 'active' !== ($license['status'] ?? 'expired')))) {
    $pro_submenu = [
        'upgrade-to-pro' => [
            'page_title' => __('Upgrade to Pro', 'blockera'),
            'menu_title' => __('Upgrade to Pro', 'blockera'),
            'capability' => 'manage_options',
            'menu_slug'  => 'blockera-settings-upgrade-to-pro',
            'callback'   => function () {
                wp_safe_redirect(blockera_core_config('app.upgrade_url'));
                exit;
            },
        ],
    ];
} elseif ($is_activated_pro && empty($oauth_option)) {
    $pro_submenu = [
        'activate-pro-license' => [
            'page_title' => __('Activate Pro License', 'blockera'),
            'menu_title' => __('Activate Pro License', 'blockera'),
            'capability' => 'manage_options',
            'menu_slug'  => 'blockera-settings-activate-pro-license',
            'callback'   => function () {
                wp_safe_redirect(admin_url('admin.php?page=blockera-settings-connect-with-account'));
                exit;
            },
        ],
    ];
}

return [
    'page_title' => __('Blockera Settings', 'blockera'),
    'menu_title' => __('Blockera', 'blockera'),
    'capability' => 'manage_options',
    'menu_slug'  => 'blockera-settings-dashboard',
    'callback'   => 'blockera_settings_page_template',
    'icon_url'   => 'data:image/svg+xml;base64,' . $logo,
    'submenus'   => array_merge(
        [
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
            'account' => [
                'page_title' => __('Account & License', 'blockera'),
                'menu_title' => __('Account & License', 'blockera'),
                'capability' => 'manage_options',
                'menu_slug'  => 'blockera-settings-account',
                'callback'   => function () {
                    global $blockera;

                    blockera_oauth_menu_callback($blockera, blockera_core_config('auth'), 'blockera_settings_page_template');
                },
            ],
        ],
        $pro_submenu ?? []
    ),
];
