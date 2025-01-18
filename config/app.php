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
	'root_url'       => BLOCKERA_CORE_URI,
	'root_path'      => BLOCKERA_CORE_PATH,
	'name'           => 'blockera',
	'dashboard_page' => 'blockera-settings-dashboard',
	'dist_url'       => BLOCKERA_CORE_URI . 'dist/',
	'dist_path'      => BLOCKERA_CORE_PATH . 'dist/',
	'packages_url'   => BLOCKERA_CORE_URI . 'packages/',
	'packages_path'  => blockera_core_env( 'APP_MODE', 'production' ) === 'development' ? BLOCKERA_CORE_PATH . 'packages/' : BLOCKERA_CORE_PATH . 'vendor/',
	'vendor_path'    => BLOCKERA_CORE_PATH . 'vendor/',
	'version'        => defined( 'BLOCKERA_VERSION' ) ? BLOCKERA_VERSION : blockera_core_env( 'VERSION' ),
	'namespaces'     => [
		'controllers' => '\Blockera\Setup\Http\Controllers\\',
	],
	'debug'          => defined( 'BLOCKERA_APP_MODE' ) && 'development' === BLOCKERA_APP_MODE && $env_mode,
	'upgrade_url' 	 => 'https://blockera.ai/products/site-builder/upgrade/?utm_source=blockera-admin&utm_medium=referral&utm_campaign=upgrade-page&utm_content=cta-link',
	/**
	 * Extendable blockera application providers by external developers.
	 *
	 * @since 1.0.0
	 */
	'providers'      => apply_filters(
		'blockera.application.providers',
		[
			\Blockera\Admin\Providers\AdminProvider::class,
			\Blockera\Setup\Providers\EditorAssetsProvider::class,
			\Blockera\Setup\Providers\RestAPIProvider::class,
			\Blockera\Editor\Providers\StyleProviders::class,
			\Blockera\Setup\Providers\AppServiceProvider::class,
			\Blockera\Admin\Providers\AdminAssetsProvider::class,
		]
	),
];
