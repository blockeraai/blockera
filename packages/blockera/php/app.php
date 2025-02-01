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

$blockera = new \Blockera\Setup\Blockera();

// Load compatibility for third party themes and plugins.
$compatibility = new \Blockera\Setup\Compatibility\Compatibility();

$external_dir = blockera_core_config('app.vendor_path') . 'blockera/';

blockera_load('blockera-admin.php.hooks', $external_dir);
blockera_load('wordpress.php.Admin.Menu.hooks', $external_dir);
blockera_load('telemetry.php.hooks', $external_dir);

$blockera->bootstrap();
