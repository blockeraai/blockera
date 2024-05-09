<?php
/**
 * The application bootstrapper.
 *
 * @package bootstrpa/app.php
 */

global $blockera;

$blockera = new \Blockera\Setup\Blockera();

// LOADING: other bootstrap files ...
if ( ! defined( 'BLOCKERA_APP_MODE' ) && 'development' === BLOCKERA_APP_MODE ) {

	// Experimental filter for variables.
	blockera_load( 'hooks', [], __DIR__ );
}

$blockera->bootstrap();
