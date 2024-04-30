<?php
/**
 * Plugin Name:       Blockera
 * Description:       provided all feature for creating application user interface into WordPress gutenberg editor or other 🔥.
 * Requires at least: 6.2
 * Requires PHP:      7.4
 * Version:           0.1.0
 * Author:            blockeraai.com
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       blockera
 *
 * @package Core
 */

// security code.
if ( ! defined( 'ABSPATH' ) ) {

	die( 'Access Denied!' );
}

define( 'BLOCKERA_CORE_URI', plugin_dir_url( __FILE__ ) );
define( 'BLOCKERA_CORE_PATH', plugin_dir_path( __FILE__ ) );
define( 'BLOCKERA_CORE_VERSION', '1.0.0' );
define( 'BLOCKERA_ENV', 'wp-env' );

// loading autoloader.
require __DIR__ . '/vendor/autoload.php';

// loading front controller.
require BLOCKERA_CORE_PATH . 'packages/bootstrap/app.php';

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
