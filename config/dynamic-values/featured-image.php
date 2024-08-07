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
		'label'     => __( 'Image URL', 'blockera' ),
		'name'      => 'featured-image-url',
		'type'      => 'image',
		'status'    => 'core',
		'group'     => 'featured-image',
		'reference' => [
			'type' => 'core',
		],
	],
	[
		'label'     => __( 'Image ID', 'blockera' ),
		'name'      => 'featured-image-id',
		'type'      => 'id',
		'status'    => 'soon',
		'group'     => 'featured-image',
		'reference' => [
			'type' => 'core-pro',
		],
	],
	[
		'label'     => __( 'Image Title', 'blockera' ),
		'name'      => 'featured-image-title',
		'type'      => 'text',
		'status'    => 'soon',
		'group'     => 'featured-image',
		'reference' => [
			'type' => 'core-pro',
		],
	],
	[
		'label'     => __( 'Image Alt', 'blockera' ),
		'name'      => 'featured-image-alt',
		'type'      => 'text',
		'status'    => 'soon',
		'group'     => 'featured-image',
		'reference' => [
			'type' => 'core-pro',
		],
	],
	[
		'label'     => __( 'Image Caption', 'blockera' ),
		'name'      => 'featured-image-caption',
		'type'      => 'text',
		'status'    => 'soon',
		'group'     => 'featured-image',
		'reference' => [
			'type' => 'core-pro',
		],
	],
	[
		'label'     => __( 'Image Desc', 'blockera' ),
		'name'      => 'featured-image-desc',
		'type'      => 'text',
		'status'    => 'soon',
		'group'     => 'featured-image',
		'reference' => [
			'type' => 'core-pro',
		],
	],
];
