<?php

return [
	[
		'type'      => 'text',
		'status'    => 'core',
		'label'     => __( 'Archive Title', 'blockera' ),
		'reference' => [
			'type' => 'core',
		],
		'group'     => 'archive',
		'name'      => 'archive-title',
		// TODO: please remove commented settings
		// TODO: This is example of settings array.
		//		'settings'  => [
		//			[
		//				'type'         => 'select',
		//				'label'        => __( 'Types', 'blockera' ),
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
		//				'label'        => __( 'User Name', 'blockera' ),
		//				'id'           => 'user',
		//				'defaultValue' => 'User',
		//				'conditions'   => ['type=user']
		//			],
		//			[
		//				'type'         => 'text',
		//				'label'        => __( 'Post', 'blockera' ),
		//				'id'           => 'post',
		//				'defaultValue' => 'Post',
		//				'conditions'   => ['type=post']
		//			],
		//			[
		//				'type'         => 'text',
		//				'label'        => __( 'Category Name', 'blockera' ),
		//				'id'           => 'category',
		//				'defaultValue' => 'Category',
		//				'conditions'   => ['type=category']
		//			],
		//		],
		'callback'  => static function ( \Blockera\Framework\Illuminate\Foundation\ValueAddon\DynamicValue\DynamicValueType $instance ) {

			$handler = $instance->getHandler( 'archive-title' );

			if ( ! $handler instanceof \Blockera\Framework\Illuminate\Foundation\ValueAddon\DynamicValue\Fields\ArchiveTitle ) {

				return '';
			}

			return $handler->theValue();
		},
	],
	[
		'label'     => __( 'Archive Desc', 'blockera' ),
		'name'      => 'archive-desc',
		'type'      => 'text',
		'status'    => 'soon',
		'group'     => 'archive',
		'reference' => [
			'type' => 'core-pro',
		],
		'callback'  => static function ( \Blockera\Framework\Illuminate\Foundation\ValueAddon\DynamicValue\DynamicValueType $instance ) {

			$handler = $instance->getHandler( 'archive-desc' );

			if ( ! $handler instanceof \Blockera\Framework\Illuminate\Foundation\ValueAddon\DynamicValue\Fields\ArchiveDescription ) {

				return '';
			}

			return $handler->theValue();
		},
	],
	[
		'label'     => __( 'Archive Link', 'blockera' ),
		'name'      => 'archive-link',
		'type'      => 'link',
		'status'    => 'soon',
		'group'     => 'archive',
		'reference' => [
			'type' => 'core-pro',
		],
		'callback'  => static function ( \Blockera\Framework\Illuminate\Foundation\ValueAddon\DynamicValue\DynamicValueType $instance ) {

			$handler = $instance->getHandler( 'archive-link' );

			if ( ! $handler instanceof \Blockera\Framework\Illuminate\Foundation\ValueAddon\DynamicValue\Fields\ArchiveLink ) {

				return '';
			}

			return $handler->theValue();
		},
	],
	[
		'label'     => __( 'Archive ID', 'blockera' ),
		'name'      => 'archive-id',
		'type'      => 'id',
		'status'    => 'soon',
		'group'     => 'archive',
		'reference' => [
			'type' => 'core-pro',
		],
	],
	[
		'label'     => __( 'Archive Meta', 'blockera' ),
		'name'      => 'archive-meta',
		'type'      => 'meta',
		'status'    => 'soon',
		'group'     => 'archive',
		'reference' => [
			'type' => 'core-pro',
		],
	],
];
