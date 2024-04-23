<?php

return [
	'variable-groups'      => [],
	'dynamic-value-groups' => [
		'post'           => [
			'label' => __( 'Posts and Pages', 'blockera-core' ),
			'items' => blockera_load( 'dynamic-values.post', [], __DIR__ ),
		],
		'archive'        => [
			'label' => __( 'Archive', 'blockera-core' ),
			'items' => blockera_load( 'dynamic-values.archive', [], __DIR__ ),
		],
		'featured-image' => [
			'label' => __( 'Featured Image', 'blockera-core' ),
			'items' => blockera_load( 'dynamic-values.featured-image', [], __DIR__ ),
		],
		'other'          => [
			'label' => __( 'Other', 'blockera-core' ),
			'items' => blockera_load( 'dynamic-values.other', [], __DIR__ ),
		],
		'user'           => [
			'label' => __( 'User', 'blockera-core' ),
			'items' => blockera_load( 'dynamic-values.user', [], __DIR__ ),
		],
		'site'           => [
			'label' => __( 'Site', 'blockera-core' ),
			'items' => blockera_load( 'dynamic-values.site', [], __DIR__ ),
		],
	],
];
