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
    $routes->post('users', [ Blockera\Editor\Http\Controllers\UsersController::class, 'saveEditorSettings' ]);
} catch (Exception $exception) {

    return $exception->getMessage();
}
