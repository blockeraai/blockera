<?php

return [
	'editor' => [
		'list'      => [
			'blockera',
			'editor-styles',
			'controls-styles',
			'components-styles',
			'editor-extensions-styles',
		],
		'with-deps' => [],
	],
	'admin'  => [
		'list'      => [
			'blockera-admin',
			'wordpress-styles',
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
