<?php
/**
 * Blockera menus
 *
 * @package Blockera
 */

// direct access is not allowed.
if (! defined('ABSPATH')) {
    exit;
}

ob_start();

include BLOCKERA_SB_PATH . 'assets/menu-logo.svg';

$logo = ob_get_clean();
$logo = base64_encode($logo);

return apply_filters(
    'blockera.config.menu',
    [
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
            'experimental-settings' => [
                'page_title' => __('Blockera Beta Tester', 'blockera'),
                'menu_title' => __('Beta Tester', 'blockera'),
                'capability' => 'manage_options',
                'menu_slug'  => 'blockera-settings-beta-tester',
                'callback'   => 'blockera_settings_page_template',
            ],
            'upgrade-to-pro' => [
                'page_title' => __('Upgrade to Pro', 'blockera'),
                'menu_title' => __('Upgrade to Pro', 'blockera'),
                'capability' => 'manage_options',
                'menu_slug'  => blockera_core_config('app.upgrade_url'),
            ],
        ],
    ]
);
