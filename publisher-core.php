<?php
/**
 * Plugin Name:       Publisher Core
 * Description:       provided all feature for creating application user interface into WordPress gutenberg editor or other 🔥
 * 					  this file just for install publisher-core library as WordPress plugin into WordPress site with wp-env!
 * Requires at least: 6.2
 * Requires PHP:      7.4
 * Version:           0.1.0
 * Author:            publisherwp.com
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       publisher-core
 */

# loading autoloader
require __DIR__ . '/vendor/autoload.php';

define( 'PB_CORE_URI', plugin_dir_url(__FILE__) );
define( 'PB_CORE_PATH', plugin_dir_path(__FILE__) );
define( 'PB_CORE_VERSION', '1.0.0' );

# loading front controller
require __DIR__ . '/bootstrap/app.php';
