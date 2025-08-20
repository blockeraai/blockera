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

try {

    { // Dynamic Values

        // TODO: fire up rest api controllers
        //$routes->get( 'dynamic/values/', [ \Blockera\Setup\Http\Controllers\DynamicValuesController::class, 'response' ] );
    }

    $routes->get('settings', [ Blockera\Admin\Http\Controllers\SettingsController::class, 'index' ]);
    $routes->update('settings', [ Blockera\Admin\Http\Controllers\SettingsController::class, 'response' ]);
    $routes->post('regenerate-assets', [ Blockera\Admin\Http\Controllers\SettingsController::class, 'regenerateAssets' ]);

    $routes->post('telemetry/opt-in', [ Blockera\Telemetry\Http\Controllers\OptInController::class, 'optIn' ]);
    $routes->post('telemetry/log-error', [ Blockera\Telemetry\Http\Controllers\BugDetectorAndReporterController::class, 'log' ]);
    $routes->post('telemetry/log-error/status', [ Blockera\Telemetry\Http\Controllers\BugDetectorAndReporterController::class, 'status' ]);


	$routes->get('theme-json', [ Blockera\Setup\Http\Controllers\Theme\JSONController::class, 'response' ]);

} catch (Exception $exception) {

    return $exception->getMessage();
}
