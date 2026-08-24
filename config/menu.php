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


/**
 * Get the Blockera logo as a base64 encoded string.
 * Because the logo is a SVG file, and base64 to make sure it inherits color in the menu.
 * 
 * @return string
 */
ob_start();
require BLOCKERA_SB_PATH . 'assets/menu-logo.base64.svg';
$blockera_logo = 'data:image/svg+xml;base64,' . ob_get_clean();

return apply_filters(
    'blockera.config.menu',
    [
        'page_title' => __('Blockera Settings', 'blockera'),
        'menu_title' => __('Blockera', 'blockera'),
        'capability' => 'manage_options',
        'menu_slug'  => 'blockera-settings-dashboard',
        'callback'   => 'blockera_settings_page_template',
        'icon_url'   => $blockera_logo,
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
            'experimental-lab' => [
                'page_title' => __('Early Access Lab', 'blockera'),
                'menu_title' => __('Early Access Lab', 'blockera'),
                'capability' => 'manage_options',
                'menu_slug'  => 'blockera-settings-experimental-lab',
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
