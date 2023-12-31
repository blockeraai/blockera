<?php

#Env Loading...
$dotenv = Dotenv\Dotenv::createImmutable( dirname( __DIR__ ) );
$dotenv->safeLoad();


global $publisherApp;

$publisherApp = new \Publisher\Framework\Illuminate\Foundation\Application();

pb_load( 'hooks', [], __DIR__ );

$publisherApp->bootstrap();

//  TODO: check block editor preload paths api
//add_filter('block_editor_rest_api_preload_paths' , static function(array $paths){
//
//	$paths[] = '/publisher-core/v1/dynamic/values';
//
//	return $paths;
//});