<?php

// phpcs:disable

/**
 * direct access is not allowed.
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

return [
	[
		'label'     => __( 'Site Title', 'blockera' ),
		'name'      => 'site-title',
		'type'      => 'text',
		'status'    => 'core',
		'group'     => 'site',
		'reference' => [
			'type' => 'core',
		],
	],
	[
		'label'     => __( 'Site Tagline', 'blockera' ),
		'name'      => 'site-desc',
		'type'      => 'text',
		'status'    => 'core',
		'group'     => 'site',
		'reference' => [
			'type' => 'core',
		],
	],
	[
		'label'     => __( 'Home URL', 'blockera' ),
		'name'      => 'home-url',
		'type'      => 'link',
		'status'    => 'core',
		'group'     => 'site',
		'reference' => [
			'type' => 'core',
		],
	],
	[
		'label'     => __( 'Site URL', 'blockera' ),
		'name'      => 'site-url',
		'type'      => 'link',
		'status'    => 'core',
		'group'     => 'site',
		'reference' => [
			'type' => 'core',
		],
	],
	[
		'label'     => __( 'Site Logo URL', 'blockera' ),
		'name'      => 'site-logo',
		'type'      => 'image',
		'status'    => 'soon',
		'group'     => 'site',
		'reference' => [
			'type' => 'core-pro',
		],
	],
	[
		'label'     => __( 'Admin Email', 'blockera' ),
		'name'      => 'site-admin-email',
		'type'      => 'email',
		'status'    => 'soon',
		'group'     => 'site',
		'reference' => [
			'type' => 'core-pro',
		],
	],
	[
		'label'     => __( 'RSS URL', 'blockera' ),
		'name'      => 'site-rss',
		'type'      => 'link',
		'status'    => 'soon',
		'group'     => 'site',
		'reference' => [
			'type' => 'core-pro',
		],
	],
	[
		'label'     => __( 'Login URL', 'blockera' ),
		'name'      => 'site-login',
		'type'      => 'link',
		'status'    => 'soon',
		'group'     => 'site',
		'reference' => [
			'type' => 'core-pro',
		],
	],
	[
		'label'     => __( 'Logout URL', 'blockera' ),
		'name'      => 'site-logout',
		'type'      => 'link',
		'status'    => 'soon',
		'group'     => 'site',
		'reference' => [
			'type' => 'core-pro',
		],
	],
	[
		'label'     => __( 'Site Meta', 'blockera' ),
		'name'      => 'site-meta',
		'type'      => 'meta',
		'status'    => 'soon',
		'group'     => 'site',
		'reference' => [
			'type' => 'core-pro',
		],
	],
];
