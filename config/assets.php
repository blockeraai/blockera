<?php

/**
 * Direct access is not allowed.
 *
 * @package config/assets.php
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

return [
	'editor' => [
		'list'      => [
			'utils',
			'classnames',
			'data-editor',
			'env',
			'icons',
			'data',
			'controls',
			'editor',
			'blocks-core',
			'bootstrap',
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
			'utils',
			'classnames',
			'data-editor',
			'env',
			'data',
			'icons',
			'controls',
			'bootstrap',
			'wordpress',
			'blockera-admin',
			'controls-styles',
			'wordpress-styles',
			'components-styles',
			'blockera-admin-styles',
		],
		'with-deps' => [],
	],
];
