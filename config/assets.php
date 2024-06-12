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
			'icons',
			'data',
			'controls',
			'editor',
			'blocks',
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
