<?php
/**
 * Plugin Name: Blockera
 * Plugin URI: https://blockera.ai/blockera-page-builder/
 * Description: Make Gutenberg a Real Page Builder!
 * Requires at least: 6.4.5
 * Tested up to: 6.5.2
 * Requires PHP: 7.4
 * Author: Blockera AI
 * Author URI: https://blockera.ai/about-us/
 * Version: 1.1.8
 * Text Domain: blockera
 * License: GPLv3 or later
 *
 * @package Blockera
 */

// direct access is not allowed.
if ( ! defined( 'ABSPATH' ) ) {

	exit;
}

// loading autoloader.
require __DIR__ . '/vendor/autoload.php';

// Env Loading ...
$dotenv = Dotenv\Dotenv::createImmutable( __DIR__ );
$dotenv->safeLoad();

define( 'BLOCKERA_CORE_FILE', __FILE__ );
define( 'BLOCKERA_CORE_URI', plugin_dir_url( __FILE__ ) );
define( 'BLOCKERA_CORE_PATH', plugin_dir_path( __FILE__ ) );

### BEGIN AUTO-GENERATED DEFINES
define( 'BLOCKERA_APP_MODE', 'development' );
// Loads current version for development in the development environment.
// this code will be replaced by string version of plugin version pulled from header
// in production build.
if ( ! function_exists( 'get_plugin_data' ) ) {
	require_once( ABSPATH . 'wp-admin/includes/plugin.php' );
}
define( 'BLOCKERA_VERSION', get_plugin_data( __FILE__ )['Version'] );
### END AUTO-GENERATED DEFINES

/**
 * This hook for extendable setup process from internal or third-party developers.
 *
 * @hook  'blockera/before/setup'
 * @since 1.0.0
 */
do_action( 'blockera/before/setup' );

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
if ( blockera_core_config( 'app.debug' ) && class_exists( \Whoops\Run::class ) ) {

	$whoops = new \Whoops\Run();
	$whoops->pushHandler( new \Whoops\Handler\PrettyPageHandler() );
	$whoops->register();
}
require BLOCKERA_CORE_PATH . 'packages/blockera/php/app.php';
### END AUTO-GENERATED FRONT CONTROLLERS

/**
 * This hook for extendable setup process from internal or third-party developers.
 *
 * @hook  'blockera/after/setup'
 * @since 1.0.0
 */
do_action( 'blockera/after/setup' );
