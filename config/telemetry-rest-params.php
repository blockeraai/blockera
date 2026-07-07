<?php
/**
 * Blockera telemetry REST params config.
 *
 * @package Blockera
 */

// direct access is not allowed.
if (! defined('ABSPATH')) {
    exit;
}

return [
	/**
	 * Unique ID for the product slug.
	 */
	'slug'  => 'blockera',
	/**
	 * The main script file absolute path of product.
	 */
	'main'  => BLOCKERA_SB_FILE,
	/**
	 * The nonce security field.
	 */
	'nonce' => wp_create_nonce( 'blockera-telemetry-nonce' ),
];
