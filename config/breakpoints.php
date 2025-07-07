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
				'icon' => [
					'icon' => 'device-2xl-desktop',
					'library' => 'ui',
					'uploadSVG' => '',
				],
			],
			'attributes' => [],
			'native' => true,
		],
		'xl-desktop'       => [
			'type'       => 'xl-desktop',
			'base'       => false,
			'status'     => false,
			'label'      => __( 'Extra Large Desktop', 'blockera' ),
			'settings'   => [
				'min' => '1440px',
				'max' => '',
				'icon' => [
					'icon' => 'device-xl-desktop',
					'library' => 'ui',
					'uploadSVG' => '',
				],
			],
			'attributes' => [],
			'native' => true,
		],
		'l-desktop'        => [
			'type'       => 'l-desktop',
			'base'       => false,
			'status'     => false,
			'label'      => __( 'Large Desktop', 'blockera' ),
			'settings'   => [
				'min' => '1280px',
				'max' => '',
				'icon' => [
					'icon' => 'device-l-desktop',
					'library' => 'ui',
					'uploadSVG' => '',
				],
			],
			'attributes' => [],
			'native' => true,
		],
		'desktop'          => [
			'type'       => 'desktop',
			'base'       => true,
			'status'     => true,
			'label'      => __( 'Desktop', 'blockera' ),
			'settings'   => [
				'min' => '',
				'max' => '',
				'picked' => true,
				'icon' => [
					'icon' => 'device-desktop',
					'library' => 'ui',
					'uploadSVG' => '',
				],
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
				'picked' => true,
				'icon' => [
					'icon' => 'device-tablet',
					'library' => 'ui',
					'uploadSVG' => '',
				],
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
				'icon' => [
					'icon' => 'device-mobile-landscape',
					'library' => 'ui',
					'uploadSVG' => '',
				],
			],
			'attributes' => [],
			'native' => true,
		],
		'mobile'           => [
			'type'       => 'mobile',
			'base'       => false,
			'status'     => true,
			'label'      => __( 'Mobile Portrait', 'blockera' ),
			'settings'   => [
				'min' => '',
				'max' => '478px',
				'picked' => true,
				'icon' => [
					'icon' => 'device-mobile',
					'library' => 'ui',
					'uploadSVG' => '',
				],
			],
			'attributes' => [],
		],
	],
];
