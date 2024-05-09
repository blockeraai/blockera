<?php

return [
	'list'      => [
		'data',
		'utils',
		'blocks',
		'editor',
		'blockera',
		'controls',
		'bootstrap',
		'classnames',
		'components',
		'data-editor',
		'style-engine',
		'editor-styles',
		'components-styles',
		'editor-extensions',
	],
	'with-deps' => [
		'blockera'          => [
			'@blockera/bootstrap',
			'@blockera/editor-extensions',
		],
		'editor-extensions' => [
			'@blockera/data',
			'@blockera/editor',
			'@blockera/controls',
		],
		'editor-styles'     => [
			'@blockera/components-styles',
		],
	],
];
