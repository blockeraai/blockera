<?php

$root_path = dirname( __DIR__, 3 );

if ( file_exists( $root_path . '/.env' ) ) {

	#Env Loading...
	$dotenv = Dotenv\Dotenv::createImmutable( $root_path );
	$dotenv->safeLoad();
}
