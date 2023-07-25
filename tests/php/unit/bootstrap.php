<?php

$root_dir = dirname( __DIR__, 3 );

# Require Composer Autoloader
require $root_dir . '/vendor/autoload.php';

#Env Loading...
$dotenv = Dotenv\Dotenv::createImmutable( dirname(__DIR__ , 3) );
$dotenv->safeLoad();

define( 'PB_CORE_URI', '' );
define( 'PB_CORE_PATH', $root_dir );
define( 'PB_CORE_VERSION', '' );

// Give access to tests_add_filter() function.
require_once $root_dir . '/vendor/wp-phpunit/wp-phpunit/includes/functions.php';

tests_add_filter( 'muplugins_loaded', function() {
	// test set up, plugin activation, etc.
} );

// Start up the WP testing environment.
require $root_dir . '/vendor/wp-phpunit/wp-phpunit/includes/bootstrap.php';