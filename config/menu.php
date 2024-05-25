<?php

return [
	'page_title' => __( 'Blockera Settings', 'blockera' ),
	'menu_title' => __( 'Blockera', 'blockera' ),
	'capability' => 'manage_options',
	'menu_slug'  => 'blockera-settings',
	'callback'   => 'blockera_settings_page_template',
	'icon_url'   => 'data:image/svg+xml;base64,' . base64_encode( file_get_contents( BLOCKERA_CORE_PATH . 'config/menu-logo.svg' ) ),
	'submenus'   => [
		'general-settings' => [
			'page_title' => __( 'Blockera General Settings', 'blockera' ),
			'menu_title' => __( 'General Settings', 'blockera' ),
			'capability' => 'manage_options',
			'menu_slug'  => 'blockera-settings-general-settings',
			'callback'   => 'blockera_settings_page_template',
		],
		'block-manager' => [
			'page_title' => __( 'Blockera Block Manager', 'blockera' ),
			'menu_title' => __( 'Block Manager', 'blockera' ),
			'capability' => 'manage_options',
			'menu_slug'  => 'blockera-settings-block-manager',
			'callback'   => 'blockera_settings_page_template',
		],
		'license-manager' => [
			'page_title' => __( 'Blockera License Manager', 'blockera' ),
			'menu_title' => __( 'License Manager', 'blockera' ),
			'capability' => 'manage_options',
			'menu_slug'  => 'blockera-settings-license-manager',
			'callback'   => 'blockera_settings_page_template',
		],
	],
];
