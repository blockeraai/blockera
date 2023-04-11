<?php

use Publisher\Core\Providers\Assets\AssetsProvider;

require_once dirname(__DIR__) . '/vendor/autoload.php';


define('PUBLISHER_DIST_DIR' , dirname(__DIR__) . '/dist/');

function convertToURL(string $path):string{

	return str_replace(
		rtrim(ABSPATH,'/'),
		home_url(),
		$path
	);
}

define('PUBLISHER_DIST_URL' , convertToURL(PUBLISHER_DIST_DIR));


$provider = new AssetsProvider();

$provider->register();
