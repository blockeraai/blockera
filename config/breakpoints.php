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
				'iconType' => 'library',
				'icon' => [
					'icon' => 'device-2xl-desktop',
					'library' => 'ui',
					'uploadSVG' => '',
				],
				'picked' => false,
			],
			'attributes' => [],
			'native' => true,
			'deletable' => false,
			'isDefault' => true,
		],
		'xl-desktop'       => [
			'type'       => 'xl-desktop',
			'base'       => false,
			'status'     => false,
			'label'      => __( 'Extra Large Desktop', 'blockera' ),
			'settings'   => [
				'min' => '1440px',
				'max' => '',
				'iconType' => 'library',
				'icon' => [
					'icon' => 'device-xl-desktop',
					'library' => 'ui',
					'uploadSVG' => '',
				],
				'picked' => false,
			],
			'attributes' => [],
			'native' => true,
			'deletable' => false,
			'isDefault' => true,
		],
		'l-desktop'        => [
			'type'       => 'l-desktop',
			'base'       => false,
			'status'     => false,
			'label'      => __( 'Large Desktop', 'blockera' ),
			'settings'   => [
				'min' => '1280px',
				'max' => '',
				'iconType' => 'library',
				'icon' => [
					'icon' => 'device-l-desktop',
					'library' => 'ui',
					'uploadSVG' => '',
				],
				'picked' => false,
			],
			'attributes' => [],
			'native' => true,
			'deletable' => false,
			'isDefault' => true,
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
				'iconType' => 'library',
				'icon' => [
					'icon' => 'device-desktop',
					'library' => 'ui',
					'uploadSVG' => '',
				],
			],
			'attributes' => [],
			'deletable' => false,
			'isDefault' => true,
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
				'iconType' => 'library',
				'icon' => [
					'icon' => 'device-tablet',
					'library' => 'ui',
					'uploadSVG' => '',
				],
			],
			'attributes' => [],
			'deletable' => false,
			'isDefault' => true,
		],
		'mobile-landscape' => [
			'type'       => 'mobile-landscape',
			'base'       => false,
			'status'     => false,
			'label'      => __( 'Mobile Landscape', 'blockera' ),
			'settings'   => [
				'min' => '',
				'max' => '767px',
				'iconType' => 'library',
				'icon' => [
					'icon' => 'device-mobile-landscape',
					'library' => 'ui',
					'uploadSVG' => '',
				],
				'picked' => false,
			],
			'attributes' => [],
			'native' => true,
			'deletable' => false,
			'isDefault' => true,
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
				'iconType' => 'library',
				'icon' => [
					'icon' => 'device-mobile',
					'library' => 'ui',
					'uploadSVG' => '',
				],
			],
			'attributes' => [],
			'deletable' => false,
			'isDefault' => true,
		],
	],
];
