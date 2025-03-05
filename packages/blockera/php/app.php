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

global $blockera;

// Initialize static cache.
$blockera_cache = wp_cache_get('blockera_instance');

if ($blockera_cache !== false) {
    $blockera = $blockera_cache;
    return;
}

// Optimize class initialization.
$blockera = new \Blockera\Setup\Blockera();

// Cache the instance.
wp_cache_set('blockera_instance', $blockera);

$external_dir = blockera_core_config('app.vendor_path') . 'blockera/';

// Conditional loading based on context.
if (is_admin()) {
    blockera_load('blockera-admin.php.hooks', $external_dir);
    blockera_load('wordpress.php.Admin.Menu.hooks', $external_dir);
}

blockera_load('telemetry.php.hooks', $external_dir);

// Initialize core components with optimized bootstrap.
$blockera->bootstrap();

// Register shutdown function for cleanup.
register_shutdown_function(function() {
    wp_cache_delete('blockera_instance');
});
