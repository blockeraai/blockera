<?php

$root_path = dirname( __DIR__, 3 );

require $root_path . '/vendor/autoload.php';

if ( file_exists( $root_path . '/.env' ) ) {

	// Env Loading...
	$dotenv = Dotenv\Dotenv::createImmutable( $root_path );
	$dotenv->safeLoad();
}
