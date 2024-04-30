<?php

use Blockera\Framework\Illuminate\Foundation\Http\Routes;
use Blockera\Framework\Illuminate\Foundation\Http\RestfullAPI;

/**
 * @var Routes|RestfullAPI $routes
 */

try {

	{ // Dynamic Values

		// TODO: fire up rest api controllers
	// $routes->get( 'dynamic/values/', [ \Blockera\Framework\Http\DynamicValuesController::class, 'response' ] );
	}

} catch ( Exception $exception ) {

	return $exception->getMessage();
}
