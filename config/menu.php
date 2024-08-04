<?php
/**
 * Blockera menus
 *
 * @package Blockera
 */

// direct access is not allowed.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

ob_start();

include BLOCKERA_CORE_PATH . 'assets/menu-logo.svg';

$logo = ob_get_clean();
$logo = base64_encode( $logo );

return [
	'page_title' => __( 'Blockera Settings', 'blockera' ),
	'menu_title' => __( 'Blockera', 'blockera' ),
	'capability' => 'manage_options',
	'menu_slug'  => 'blockera-settings',
	'callback'   => 'blockera_settings_page_template',
	'icon_url'   => 'data:image/svg+xml;base64,' . $logo,
	'submenus'   => [
		'general-settings' => [
			'page_title' => __( 'Blockera General Settings', 'blockera' ),
			'menu_title' => __( 'General Settings', 'blockera' ),
			'capability' => 'manage_options',
			'menu_slug'  => 'blockera-settings-general-settings',
			'callback'   => 'blockera_settings_page_template',
		],
		'block-manager'    => [
			'page_title' => __( 'Blockera Block Manager', 'blockera' ),
			'menu_title' => __( 'Block Manager', 'blockera' ),
			'capability' => 'manage_options',
			'menu_slug'  => 'blockera-settings-block-manager',
			'callback'   => 'blockera_settings_page_template',
		],
	],
];
