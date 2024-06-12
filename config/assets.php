<?php

// direct access is not allowed.
if ( ! defined( 'ABSPATH' ) ) exit;

return [
	'editor' => [
		'list'      => [
			'blockera',
			'editor-styles',
			'controls-styles',
			'components-styles',
			'value-addons-styles',
		],
		'with-deps' => [],
	],
	'admin'  => [
		'list'      => [
			'blockera-admin',
			'controls-styles',
			'wordpress-styles',
			'components-styles',
			'blockera-admin-styles',
		],
		'with-deps' => [
			'@blockera/blockera-admin' => [
				'wp-api',
				'wp-blocks',
				'wp-core-data',
			],
		],
	],
];
