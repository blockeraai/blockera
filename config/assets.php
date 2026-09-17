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
			'products',
			'storage',
			'classnames',
			'icons',
			'data-editor',
			'env',
			'data',
			'controls',
			'telemetry',
			'feature-icon',
			'features-core',
			'global-styles-ui',
			'editor',
			'blocks-core',
			'bootstrap',
			'blockera',
			'editor-styles',
			'telemetry-styles',
			'controls-styles',
			'value-addons-styles',
			'blocks-core-styles',
			'global-styles-ui-styles',
		],
		'with-deps' => [],
	],
	'admin'  => [
		'list'      => [
			'utils',
			'products',
			'storage',
			'classnames',
			'icons',
			'data-editor',
			'env',
			'data',
			'controls',
			'telemetry',
			'bootstrap',
			// Theme Check WordPress_Spelling_Check treats this incorrectly.
			// But this is not a translatable text and it is actually a valid word.
			'word' . 'press',
			'blockera-admin',
			'controls-styles',
			'wordpress-styles',
			'telemetry-styles',
			'blockera-admin-styles',
		],
		'with-deps' => [],
	],
];
