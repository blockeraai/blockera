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
			'storage',
			'controls',
			'editor',
			'blocks-core',
			'bootstrap',
			'blockera',
			'editor-styles',
			'controls-styles',
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
			'data-stream',
			'bootstrap',
			'wordpress',
			'blockera-admin',
			'controls-styles',
			'wordpress-styles',
			'data-stream-styles',
			'blockera-admin-styles',
		],
		'with-deps' => [],
	],
];
