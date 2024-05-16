<?php

$wp_debug = defined( 'WP_DEBUG' ) && WP_DEBUG;
$env_mode = 'development' === blockera_core_env( 'APP_MODE', 'production' );

return [
	'root_url'      => BLOCKERA_CORE_URI,
	'root_path'     => BLOCKERA_CORE_PATH,
	'url'           => BLOCKERA_CORE_URI . 'app/',
	'path'          => BLOCKERA_CORE_PATH . 'app/',
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
	'debug'         => defined( 'BLOCKERA_APP_MODE' ) && 'development' === BLOCKERA_APP_MODE ? BLOCKERA_APP_MODE : ( $env_mode || $wp_debug ),
	'providers'     => [
		\Blockera\Admin\Providers\AdminProvider::class,
		\Blockera\Setup\Providers\AssetsProvider::class,
		\Blockera\Setup\Providers\RestAPIProvider::class,
		\Blockera\Setup\Providers\AppServiceProvider::class,
		\Blockera\Admin\Providers\AdminAssetsProvider::class,
		\Blockera\StyleEngine\Providers\StyleProviders::class,
	],
];
