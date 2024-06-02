<?php

use Blockera\Http\RestfullAPI;
use Blockera\Http\Routes;

// direct access is not allowed.
if ( ! defined( 'ABSPATH' ) ) exit;


/**
 * @var Routes|RestfullAPI $routes
 */

try {

	$routes->get( 'settings', [ Blockera\Admin\Http\Controllers\SettingsController::class, 'index' ] );
	$routes->update( 'settings', [ Blockera\Admin\Http\Controllers\SettingsController::class, 'response' ] );

} catch ( Exception $exception ) {

	return $exception->getMessage();
}
