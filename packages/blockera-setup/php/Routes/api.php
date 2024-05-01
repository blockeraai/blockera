<?php

use Blockera\Http\Routes;
use Blockera\Http\RestfullAPI;

/**
 * @var Routes|RestfullAPI $routes
 */

try {

	{ // Dynamic Values

		// TODO: fire up rest api controllers
//		$routes->get( 'dynamic/values/', [ \Blockera\Setup\Http\Controllers\DynamicValuesController::class, 'response' ] );
	}

} catch ( Exception $exception ) {

	return $exception->getMessage();
}
