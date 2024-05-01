<?php
/**
 * The application bootstrapper.
 *
 * @package bootstrpa/app.php
 */

global $blockera;

$blockera = new \Blockera\Setup\Blockera();

// LOADING: other bootstrap files ...
blockera_load( 'hooks', [], __DIR__ );

$blockera->bootstrap();
