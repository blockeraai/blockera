<?php
/**
 * Plugin Name: Blockera
 * Plugin URI: https://blockera.ai
 * Description: Make Gutenberg a Real Page Builder!
 * Requires at least: 6.5.2
 * Requires PHP:      7.4
 * Author: Blockera AI
 * Author URI: https://blockera.ai
 * Version: 1.0
 * Text Domain: blockera
 * License: GPLv3 or later
 *
 * @package Blockera
 */

// security code.
if ( ! defined( 'ABSPATH' ) ) {

	die( 'Access Denied!' );
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
if ( blockera_core_config( 'app.mode' ) ) {

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
