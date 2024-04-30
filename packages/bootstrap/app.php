<?php
/**
 * The application bootstrapper.
 *
 * @package bootstrpa/app.php
 */

global $blockera;

$blockera = new \Blockera\Framework\Illuminate\Foundation\Application();

// LOADING: other bootstrap files ...
blockera_load( 'hooks', [], __DIR__ );

$blockera->bootstrap();
