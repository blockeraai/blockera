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

// loading autoloader.
require __DIR__ . '/vendor/autoload.php';

// loading front controller.
require __DIR__ . 'packages/bootstrap/app.php';

define( 'BLOCKERA_CORE_URI', plugin_dir_url( __FILE__ ) );
define( 'BLOCKERA_CORE_PATH', plugin_dir_path( __FILE__ ) );
define( 'BLOCKERA_CORE_VERSION', '1.0.0' );
define( 'BLOCKERA_ENV', 'wp-env' );

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

add_action( 'enqueue_block_editor_assets', 'enqueue_editor_assets', 9e2 );
add_action( 'wp_enqueue_scripts', 'enqueue_editor_assets', 9e2 );

/**
 * Enqueue gutenberg editor assets to load.
 *
 * @return void
 */
function enqueue_editor_assets() {

	$handle = 'blockera';

	$asset_file_info = BLOCKERA_CORE_PATH . 'tools/wp-env-app/dist/blockera-app.asset.php';

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
		BLOCKERA_CORE_URI . 'tools/wp-env-app/dist/blockera-app.js',
		$info['dependencies'],
		$info['version'],
		true
	);
}
