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

global $blockera_one, $blockera_one_cache_key, $blockera_one_cache_group, $blockera_one_block_supports;

$external_dir = blockera_core_config('app.vendor_path') . 'blockera/';

blockera_add_icon_style_definitions();
blockera_register_core_icon_navigation_hooks();

// Add blockera object cache to non persistent group to compatible with third party cache plugins.
$blockera_one_cache_group = 'plugins';
$blockera_one_cache_key = 'blockera_instance' . BLOCKERA_ONE_VERSION;

// Initialize static cache.
$blockera_one_cache = wp_cache_get($blockera_one_cache_key, $blockera_one_cache_group);

if ($blockera_one_cache !== false) {
    $blockera_one = $blockera_one_cache;
} else {
    // Optimize class initialization.
    $blockera_one = \Blockera\Setup\Blockera::getInstance();
    // Cache the instance.
    wp_cache_set($blockera_one_cache_key, $blockera_one, $blockera_one_cache_group);
}

// Conditional loading based on context.
if (blockera_is_admin()) {
    blockera_load('editor.php.hooks', $external_dir);
    blockera_load('blockera-admin.php.hooks', $external_dir);
    blockera_load('wordpress.php.Admin.Menu.hooks', $external_dir);
}

blockera_load('telemetry.php.hooks', $external_dir);

// Set the block supports.
$blockera_one->setBlockSupports($blockera_one_block_supports);
// Initialize core components with optimized bootstrap.
$blockera_one->bootstrap();

// Register shutdown function for cleanup.
function blockera_cleanup_cache() {
    global $blockera_one_cache_key, $blockera_one_cache_group;

    wp_cache_delete($blockera_one_cache_key, $blockera_one_cache_group);
}
add_action('shutdown', 'blockera_cleanup_cache');
