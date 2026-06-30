<?php
/**
 * Blockera features config.
 *
 * @package Blockera
 */

use Blockera\Feature\Icon\Icon;

// direct access is not allowed.
if (! defined('ABSPATH')) {
    exit;
}

return [
    'icon' => Icon::getInstance(),
];
