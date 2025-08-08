<?php
/**
 * Plugin Name: Blockera Site Builder – Responsive blocks, block states, and more...
 * Plugin URI: https://blockera.ai/products/site-builder/
 * Description: Blockera Site Builder is transforming the block editor into a powerful page builder by adding responsive blocks, block states, and more.
 * Requires at least: 6.6
 * Tested up to: 6.8
 * Requires PHP: 7.4
 * Author: Blockera AI
 * Author URI: https://blockera.ai/about/
 * Version: 1.12.2
 * Text Domain: blockera
 * Domain Path: /languages
 * License: GPLv3 or later
 *
 * @package Blockera
 */

// direct access is not allowed.
if (! defined('ABSPATH')) {

    exit;
}

// loading autoloader.
require __DIR__ . '/vendor/autoload.php';

// Register into shared autoload coordinator.
require_once __DIR__ . '/class-shared-autoload-coordinator.php';
\Blockera\SharedAutoload\Coordinator::getInstance()->registerPlugin('blockera', __DIR__);
\Blockera\SharedAutoload\Coordinator::getInstance()->bootstrap();

if (file_exists(__DIR__ . '/.env')) {

    // Env Loading ...
    $dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
    $dotenv->safeLoad();
}

if (! defined('BLOCKERA_SB_FILE')) {
    define('BLOCKERA_SB_FILE', __FILE__);
}

if (! defined('BLOCKERA_SB_URI')) {
    define('BLOCKERA_SB_URI', plugin_dir_url(__FILE__));
}

if (! defined('BLOCKERA_SB_PATH')) {
    define('BLOCKERA_SB_PATH', plugin_dir_path(__FILE__));
}

### BEGIN AUTO-GENERATED DEFINES
if (! defined('BLOCKERA_SB_MODE')) {
    define('BLOCKERA_SB_MODE', 'development');
}

if (! defined('BLOCKERA_SB_VERSION')) {
    // Loads current version for development in the development environment.
    // this code will be replaced by string version of plugin version pulled from header
    // in production build.
    if (! function_exists('get_plugin_data')) {
        require_once(ABSPATH . 'wp-admin/includes/plugin.php');
    }
    define('BLOCKERA_SB_VERSION', get_plugin_data(__FILE__, false, false)['Version']);
}
### END AUTO-GENERATED DEFINES

// Initialize hooks on Front Controller.
blockera_load('bootstrap.hooks', __DIR__);

add_action('init', 'blockera_init', 10);

function blockera_init(): void {

    /**
     * This hook for extendable setup process from internal or third-party developers.
     *
     * @hook  'blockera/before/setup'
     * @since 1.3.0
     */
    do_action('blockera/before/setup');

    new \Blockera\Telemetry\Jobs(
        new \Blockera\WordPress\Sender(),
        blockera_core_config('telemetry')
    );

    ### BEGIN AUTO-GENERATED FRONT CONTROLLERS
    /**
     * For developers: Blockera debugging mode.
     *
     * Change this to true to enable the display of notices during development.
     * It is strongly recommended that internal developers use of "APP_MODE" env variable with "development" value
     * in their development environments.
     *
     * For information on other constants that can be used for debugging,
     * visit the documentation.
     *
     * @link TODO: please insert link of docs.
     */
    if (blockera_core_config('app.debug') && class_exists(\Whoops\Run::class)) {

        $whoops = new \Whoops\Run();
        $whoops->pushHandler(new \Whoops\Handler\PrettyPageHandler());
        $whoops->register();
    }
    require BLOCKERA_SB_PATH . 'packages/blockera/php/app.php';
    ### END AUTO-GENERATED FRONT CONTROLLERS

    /**
     * This hook for extendable setup process from internal or third-party developers.
     *
     * @hook  'blockera/after/setup'
     * @since 1.3.0
     */
    do_action('blockera/after/setup');
}
