<?php

#Env Loading...
$dotenv = Dotenv\Dotenv::createImmutable( dirname( __DIR__ ) );
$dotenv->safeLoad();


global $blockeraApp;

$blockeraApp = new \Blockera\Framework\Illuminate\Foundation\Application();

blockera_load( 'hooks', [], __DIR__ );

$blockeraApp->bootstrap();

//  TODO: check block editor preload paths api
//add_filter('block_editor_rest_api_preload_paths' , static function(array $paths){
//
//	$paths[] = '/blockera-core/v1/dynamic/values';
//
//	return $paths;
//});