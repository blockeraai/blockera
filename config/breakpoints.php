<?php

return [
	[
		'type'       => 'extra-large',
		'force'      => false,
		'label'      => __( 'Extra Large Screen', 'blockera-core' ),
		'settings'   => [
			'min' => '2561px',
			'max' => '',
		],
		'attributes' => [],
	],
	[
		'type'       => 'large',
		'force'      => false,
		'label'      => __( 'Large Screen', 'blockera-core' ),
		'settings'   => [
			'min' => '1921px',
			'max' => '2560px',
		],
		'attributes' => [],
	],
	[
		'type'       => 'desktop',
		'force'      => false,
		'label'      => __( 'Desktop', 'blockera-core' ),
		'settings'   => [
			'min' => '1441px',
			'max' => '1920px',
		],
		'attributes' => [],
	],
	[
		'type'       => 'laptop',
		'force'      => true,
		'label'      => __( 'Laptop', 'blockera-core' ),
		'settings'   => [
			'min' => '1025px',
			'max' => '1440px',
		],
		'attributes' => [],
	],
	[
		'type'       => 'tablet',
		'force'      => false,
		'label'      => __( 'Tablet', 'blockera-core' ),
		'settings'   => [
			'min' => '768px',
			'max' => '1024px',
		],
		'attributes' => [],
	],
	[
		'type'       => 'mobile-landscape',
		'force'      => false,
		'label'      => __( 'Mobile Landscape', 'blockera-core' ),
		'settings'   => [
			'min' => '481px',
			'max' => '767px',
		],
		'attributes' => [],
	],
	[
		'type'       => 'mobile',
		'force'      => false,
		'label'      => __( 'Mobile', 'blockera-core' ),
		'settings'   => [
			'min' => '',
			'max' => '480px',
		],
		'attributes' => [],
	],
];
