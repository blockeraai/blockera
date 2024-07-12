<?php
/**
 * Configuration of available breakpoints on blockera editor.
 *
 * @package config/breakpoints.php
 */

/**
 * Direct access is not allowed.
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

return [
	// We use of "base" index to the fastest accessibility to base breakpoint.
	// It's recommended to set it; otherwise, we could find the base breakpoint with the process "list" index in the loop :/ .
	'base' => 'desktop',
	'list' => [
		'2xl-desktop'      => [
			'type'       => '2xl-desktop',
			'base'       => false,
			'status'     => false,
			'label'      => __( 'Widescreens and TVs', 'blockera' ),
			'settings'   => [
				'min' => '1920px',
				'max' => '',
			],
			'attributes' => [],
		],
		'xl-desktop'       => [
			'type'       => 'xl-desktop',
			'base'       => false,
			'status'     => false,
			'label'      => __( 'Extra Large Desktop', 'blockera' ),
			'settings'   => [
				'min' => '1440px',
				'max' => '',
			],
			'attributes' => [],
		],
		'l-desktop'        => [
			'type'       => 'l-desktop',
			'base'       => false,
			'status'     => false,
			'label'      => __( 'Large Desktop', 'blockera' ),
			'settings'   => [
				'min' => '1280px',
				'max' => '',
			],
			'attributes' => [],
		],
		'desktop'          => [
			'type'       => 'desktop',
			'base'       => true,
			'status'     => true,
			'label'      => __( 'Desktop', 'blockera' ),
			'settings'   => [
				'min' => '',
				'max' => '',
			],
			'attributes' => [],
		],
		'tablet'           => [
			'type'       => 'tablet',
			'base'       => false,
			'status'     => true,
			'label'      => __( 'Tablet', 'blockera' ),
			'settings'   => [
				'min' => '',
				'max' => '991px',
			],
			'attributes' => [],
		],
		'mobile-landscape' => [
			'type'       => 'mobile-landscape',
			'base'       => false,
			'status'     => false,
			'label'      => __( 'Mobile Landscape', 'blockera' ),
			'settings'   => [
				'min' => '',
				'max' => '767px',
			],
			'attributes' => [],
		],
		'mobile'           => [
			'type'       => 'mobile',
			'base'       => false,
			'status'     => true,
			'label'      => __( 'Mobile Portrait', 'blockera' ),
			'settings'   => [
				'min' => '',
				'max' => '478px',
			],
			'attributes' => [],
		],
	],
];
