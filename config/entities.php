<?php
/**
 * Blockera data entities
 *
 * @package Blockera
 */

use Blockera\Auth\Config as AuthConfig;

// direct access is not allowed.
if (! defined('ABSPATH')) {
    exit;
}

$theme = wp_get_theme();

$oauth_option = get_option(AuthConfig::getOptionKey(), []);
$products_licenses = array_column($oauth_option['licenses'] ?? [], 'productName');
$license_index = array_search(blockera_core_config('auth.productName'), $products_licenses, true);
$license = $oauth_option['licenses'][$license_index] ?? [];

// unset the all licenses from the oauth option because it's not needed in the account info.
unset($oauth_option['licenses']);

$account = array_merge($oauth_option, compact('license'));

return apply_filters(
    'blockera/config/entities',
    [
        'wp'       => [
            'version' => get_bloginfo('version'),
        ],
        'theme'    => [
            'name'        => [
                'raw'      => $theme->template,
                'rendered' => $theme->get('Name'),
            ],
            'version'     => $theme->get('Version'),
            'block_theme' => $theme->is_block_theme(),
            'parent'      => $theme->get('parent'),
        ],
        'site'     => [
            'url' => home_url(),
        ],
        'blockera' => [
            'settings' => get_option('blockera_settings', blockera_core_config('panel.std')),
            'name'     => blockera_core_config('app.name'),
            'version'  => blockera_core_config('app.version'),
            'account'  => $account,
        ],
    ]
);
