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
if ( ! defined( 'BLOCKERA_APP_MODE' ) && 'development' === BLOCKERA_APP_MODE ) {

	// Experimental filter for variables.
	blockera_load( 'hooks', __DIR__ );
}

$external_dir = dirname( __DIR__, 2 );

blockera_load( 'wordpress.php.Admin.Menu.hooks', $external_dir );
blockera_load( 'telemetry.php.hooks', $external_dir );

$blockera->bootstrap();
