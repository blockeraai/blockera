<?php
/**
 * The application bootstrapper.
 *
 * @package bootstrpa/app.php
 */

// phpcs:disable
// direct access is not allowed.
if (! defined('ABSPATH')) {
    exit;
}

// Blockera should be loaded only on frontend, editor and admin requests.
if (! blockera_is_frontend_request() && ! blockera_is_editor_request() && ! blockera_is_admin_request()) {
    return;
}

global $blockera;

$external_dir = blockera_core_config('app.vendor_path') . 'blockera/';

blockera_load('feature-icon.src.hooks', $external_dir);

// Add blockera object cache to non persistent group to compatible with third party cache plugins.
$cache_group = 'plugins';
$cache_key = 'blockera_instance' . BLOCKERA_SB_VERSION;

// Initialize static cache.
$blockera_cache = wp_cache_get($cache_key, $cache_group);

if ($blockera_cache !== false) {
    $blockera = $blockera_cache;
} else {
    // Optimize class initialization.
    $blockera = \Blockera\Setup\Blockera::getInstance();
    // Cache the instance.
    wp_cache_set($cache_key, $blockera, $cache_group);
}

// Conditional loading based on context.
if (is_admin()) {
    blockera_load('editor.php.hooks', $external_dir);
    blockera_load('blockera-admin.php.hooks', $external_dir);
    blockera_load('wordpress.php.Admin.Menu.hooks', $external_dir);
}

blockera_load('telemetry.php.hooks', $external_dir);

// Initialize core components with optimized bootstrap.
$blockera->bootstrap();

// Register shutdown function for cleanup.
function blockera_cleanup_cache() {
    global $blockera;
    wp_cache_delete('blockera_instance' . BLOCKERA_SB_VERSION, 'plugins');
}
add_action('shutdown', 'blockera_cleanup_cache');
