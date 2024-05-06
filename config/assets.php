<?php

return [
	'list'      => [
		'utils',
		'hooks',
		'blocks',
		'editor',
		'blockera',
		'controls',
		'bootstrap',
		'core-data',
		'classnames',
		'data-editor',
		'style-engine',
		'editor-styles',
		'components-styles',
		'editor-extensions',
	],
	'with-deps' => [
		'blockera'          => [
			'@blockera/editor-extensions',
		],
		'editor-extensions' => [
			'@blockera/controls',
			'@blockera/editor',
		],
		'editor-styles'     => [
			'@blockera/components-styles',
		]
	],
];
