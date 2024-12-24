<?php
// phpcs:disable
use Blockera\Http\RestfullAPI;
use Blockera\Http\Routes;

// direct access is not allowed.
if (! defined('ABSPATH')) {
	exit;
}


/**
 * @var Routes|RestfullAPI $routes
 */

try { { // Dynamic Values

		// TODO: fire up rest api controllers
		//$routes->get( 'dynamic/values/', [ \Blockera\Setup\Http\Controllers\DynamicValuesController::class, 'response' ] );
	}

	$routes->get('settings', [Blockera\Admin\Http\Controllers\SettingsController::class, 'index']);
	$routes->update('settings', [Blockera\Admin\Http\Controllers\SettingsController::class, 'response']);

	if (! blockera_telemetry_opt_in_is_off('blockera')) {

		$routes->post('telemetry/opt-in', [Blockera\Telemetry\Http\Controllers\OptInController::class, 'optIn']);
	}

	$routes->post('auth/unsubscribe', [Blockera\Auth\Http\Controllers\ConnectionController::class, 'unsubscribe']);
	$routes->post('auth/is-connected', [Blockera\Auth\Http\Controllers\ConnectionController::class, 'isConnected']);
	$routes->post('auth/create-account', [Blockera\Auth\Http\Controllers\ConnectionController::class, 'createAccount']);
	$routes->post('auth/subscriptions', [Blockera\Auth\Http\Controllers\ConnectionController::class, 'getSubscriptions']);
	$routes->post('auth/connect-account', [Blockera\Auth\Http\Controllers\ConnectionController::class, 'connectAccount']);
	
} catch (Exception $exception) {

	return $exception->getMessage();
}
