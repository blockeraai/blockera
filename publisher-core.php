<?php
/**
 * Plugin Name:       Publisher Core
 * Description:       provided all feature for creating application user interface into WordPress gutenberg editor or other 🔥
 *                    this file just for install publisher-core library as WordPress plugin into WordPress site with wp-env!
 * Requires at least: 6.2
 * Requires PHP:      7.4
 * Version:           0.1.0
 * Author:            publisherwp.com
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       publisher-core
 *
 * @package PublisherCore
 */

# loading autoloader
require __DIR__ . '/vendor/autoload.php';

define( 'PB_CORE_URI', plugin_dir_url( __FILE__ ) );
define( 'PB_CORE_PATH', plugin_dir_path( __FILE__ ) );
define( 'PB_CORE_VERSION', '1.0.0' );
define( 'PB_ENV', 'wp-env' );


# loading front controller
require __DIR__ . '/bootstrap/app.php';


add_action( 'enqueue_block_editor_assets', 'enqueue_editor_assets', 9e2 );
add_action( 'wp_enqueue_scripts', 'enqueue_editor_assets', 9e2 );


function enqueue_editor_assets(): void {

	$handle = 'publisher-core';

	$asset_file_info = PB_CORE_PATH . 'tools/wp-env-app/dist/publisher-core-app.asset.php';

	if ( ! file_exists( $asset_file_info ) ) {

		return;
	}

	$info = include $asset_file_info;

	if ( empty( $info['version'] ) || ! is_admin() ) {

		return;
	}

	/**
	 * JavaScripts
	 */
	wp_enqueue_script(
		$handle,
		PB_CORE_URI . 'tools/wp-env-app/dist/publisher-core-app.js',
		$info['dependencies'],
		$info['version']
	);
}
