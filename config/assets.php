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
		'list'      => apply_filters(
			'blockera.config.editor.assets',
			[
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
				'value-addons-styles',
			]
		),
		'with-deps' => [],
	],
	'admin'  => [
		'list'      => apply_filters(
			'blockera.config.admin.assets',
			[
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
				'blockera-admin-styles',
			]
		),
		'with-deps' => [],
	],
];
