<?php

return [
	[
		'type'      => 'text',
		'status'    => 'core',
		'label'     => __( 'Archive Title', 'publisher-core' ),
		'reference' => [
			'type' => 'core',
		],
		'group'     => 'archive',
		'name'      => 'archive-title',
		// TODO: please remove commented settings,
		// TODO: This is example of settings array.
//		'settings'  => [
//			[
//				'type'         => 'select',
//				'label'        => __( 'Types', 'publisher-core' ),
//				'id'           => 'type',
//				'defaultValue' => '',
//				'options'      => [
//					'user'     => 'User',
//					'post'     => 'Post',
//					'category' => 'Category',
//				],
//			],
//			[
//				'type'         => 'text',
//				'label'        => __( 'User Name', 'publisher-core' ),
//				'id'           => 'user',
//				'defaultValue' => 'User',
//				'conditions'   => ['type=user']
//			],
//			[
//				'type'         => 'text',
//				'label'        => __( 'Post', 'publisher-core' ),
//				'id'           => 'post',
//				'defaultValue' => 'Post',
//				'conditions'   => ['type=post']
//			],
//			[
//				'type'         => 'text',
//				'label'        => __( 'Category Name', 'publisher-core' ),
//				'id'           => 'category',
//				'defaultValue' => 'Category',
//				'conditions'   => ['type=category']
//			],
//		],
	],
	[
		'label'     => __( 'Archive Desc', 'publisher-core' ),
		'name'      => 'archive-desc',
		'type'      => 'text',
		'status'    => 'soon',
		'group'     => 'archive',
		'reference' => [
			'type' => 'core-pro',
		],
	],
	[
		'label'     => __( 'Archive Link', 'publisher-core' ),
		'name'      => 'archive-link',
		'type'      => 'link',
		'status'    => 'soon',
		'group'     => 'archive',
		'reference' => [
			'type' => 'core-pro',
		],
	],
	[
		'label'     => __( 'Archive ID', 'publisher-core' ),
		'name'      => 'archive-id',
		'type'      => 'id',
		'status'    => 'soon',
		'group'     => 'archive',
		'reference' => [
			'type' => 'core-pro',
		],
	],
	[
		'label'     => __( 'Archive Meta', 'publisher-core' ),
		'name'      => 'archive-meta',
		'type'      => 'meta',
		'status'    => 'soon',
		'group'     => 'archive',
		'reference' => [
			'type' => 'core-pro',
		],
	],
];
