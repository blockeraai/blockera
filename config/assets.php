<?php

return [
	'list'      => [
		'utils',
		'hooks',
		'blocks',
		'editor',
		'controls',
		'bootstrap',
		'core-data',
		'classnames',
		'data-editor',
		'style-engine',
		'editor-styles',
		'blockera-setup',
		'components-styles',
		'editor-extensions',
	],
	'with-deps' => [
		'blockera-setup'    => [
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
