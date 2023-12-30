<?php

return [
	'variable-groups' => [],
	//
	'dynamic-value-groups'   => [
		'post'           => [
			'label' => __( 'Posts and Pages', 'publisher-core' ),
			'items' => pb_load( 'dynamic-values.post', [], __DIR__ ),
		],
		'archive'        => [
			'label' => __( 'Archive', 'publisher-core' ),
			'items' => pb_load( 'dynamic-values.archive', [], __DIR__ ),
		],
		'featured-image' => [
			'label' => __( 'Featured Image', 'publisher-core' ),
			'items' => pb_load( 'dynamic-values.featured-image', [], __DIR__ ),
		],
		'other'          => [
			'label' => __( 'Other', 'publisher-core' ),
			'items' => pb_load( 'dynamic-values.other', [], __DIR__ ),
		],
		'user'           => [
			'label' => __( 'User', 'publisher-core' ),
			'items' => pb_load( 'dynamic-values.user', [], __DIR__ ),
		],
		'site'           => [
			'label' => __( 'Site', 'publisher-core' ),
			'items' => pb_load( 'dynamic-values.site', [], __DIR__ ),
		],
	],
];