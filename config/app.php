<?php

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
	'version'       => defined( 'BLOCKERA_VERSION' ) ? BLOCKERA_VERSION : blockera_core_env( 'VERSION' ),
	'namespaces'    => [
		'controllers' => '\Blockera\Setup\Http\Controllers\\',
	],
	'debug'         => blockera_core_env( 'APP_MODE' ) && 'development' === blockera_core_env( 'APP_MODE' ) || ( ( defined( 'WP_DEBUG' ) && WP_DEBUG ) ),
	'providers'     => [
		\Blockera\Setup\Providers\AssetsProvider::class,
		\Blockera\Setup\Providers\RestAPIProvider::class,
		\Blockera\Setup\Providers\AppServiceProvider::class,
		\Blockera\StyleEngine\Providers\StyleProviders::class,
	],
];
