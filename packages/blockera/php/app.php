<?php
/**
 * The application bootstrapper.
 *
 * @package bootstrpa/app.php
 */

// phpcs:disable
// direct access is not allowed.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

global $blockera;

$blockera = new \Blockera\Setup\Blockera();

// LOADING: other bootstrap files ...
if ( defined( 'BLOCKERA_APP_MODE' ) && 'development' === BLOCKERA_APP_MODE && blockera_get_experimental(['data', 'variable', 'registryHooks']) ) {

	// Experimental filter for variables.
	blockera_load( 'hooks', __DIR__ );
}

$external_dir = blockera_core_config( 'app.vendor_path' ) . 'blockera/';

blockera_load('blockera-admin.php.hooks', $external_dir);
blockera_load( 'wordpress.php.Admin.Menu.hooks', $external_dir );
blockera_load( 'telemetry.php.hooks', $external_dir );

$blockera->bootstrap();
