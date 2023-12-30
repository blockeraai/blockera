<?php

return [
	[
		'name'      => 'date',
		'label'     => __( 'Current Date', 'publisher-core' ),
		'type'      => 'date',
		'status'    => 'core',
		'group'     => 'other',
		'reference' => [
			'type' => 'core',
		],
	],
	[
		'name'      => 'shortcode',
		'label'     => __( 'Shortcode', 'publisher-core' ),
		'type'      => 'shortcode',
		'status'    => 'soon',
		'group'     => 'other',
		'reference' => [
			'type' => 'core',
		],
	],
	[
		'name'      => 'request',
		'label'     => __( 'Request Parameter', 'publisher-core' ),
		'type'      => 'text',
		'status'    => 'soon',
		'group'     => 'other',
		'reference' => [
			'type' => 'core',
		],
	],
];
