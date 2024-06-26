<?php
/**
 * Direct access is not allowed.
 *
 * @package config/app.php
 */

if ( ! defined( 'ABSPATH' ) ) {

	exit;
}

$env_mode = 'development' === blockera_core_env( 'APP_MODE', 'production' );

return [
	'root_url'      => BLOCKERA_CORE_URI,
	'root_path'     => BLOCKERA_CORE_PATH,
	'name'          => 'blockera',
	'dist_url'      => BLOCKERA_CORE_URI . 'dist/',
	'dist_path'     => BLOCKERA_CORE_PATH . 'dist/',
	'packages_url'  => BLOCKERA_CORE_URI . 'packages/',
	'packages_path' => BLOCKERA_CORE_PATH . 'packages/',
	'vendor_path'   => BLOCKERA_CORE_PATH . 'vendor/',
	'version'       => defined( 'BLOCKERA_VERSION' ) ? BLOCKERA_VERSION : blockera_core_env( 'VERSION' ),
	'namespaces'    => [
		'controllers' => '\Blockera\Setup\Http\Controllers\\',
	],
	'debug'         => defined( 'BLOCKERA_APP_MODE' ) && 'development' === BLOCKERA_APP_MODE && $env_mode,
	'providers'     => [
		\Blockera\Admin\Providers\AdminProvider::class,
		\Blockera\Setup\Providers\AssetsProvider::class,
		\Blockera\Setup\Providers\RestAPIProvider::class,
		\Blockera\Editor\Providers\StyleProviders::class,
		\Blockera\Setup\Providers\AppServiceProvider::class,
		\Blockera\Admin\Providers\AdminAssetsProvider::class,
	],
];
