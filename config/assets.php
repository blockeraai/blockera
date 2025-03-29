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
			'icons',
			'data-editor',
			'env',
			'data',
			'storage',
			'controls',
			'telemetry',
			'editor',
			'blocks-core',
			'bootstrap',
			'blockera',
			'editor-styles',
			'telemetry-styles',
			'controls-styles',
			'value-addons-styles',
			'blocks-styles',
		],
		'with-deps' => [],
	],
	'admin'  => [
		'list'      => [
			'utils',
			'classnames',
			'icons',
			'data-editor',
			'env',
			'data',
			'controls',
			'telemetry',
			'bootstrap',
			'wordpress',
			'blockera-admin',
			'controls-styles',
			'wordpress-styles',
			'telemetry-styles',
			'blockera-admin-styles',
		],
		'with-deps' => [],
	],
];
