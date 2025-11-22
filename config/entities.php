<?php
/**
 * Blockera data entities
 *
 * @package Blockera
 */

// direct access is not allowed.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$blockera_current_theme = wp_get_theme();

return apply_filters(
	'blockera/config/entities',
	[
		'wp'       => [
			'version' => get_bloginfo( 'version' ),
		],
		'theme'    => [
			'name'        => [
				'raw'      => $blockera_current_theme->template,
				'rendered' => $blockera_current_theme->get( 'Name' ),
			],
			'version'     => $blockera_current_theme->get( 'Version' ),
			'block_theme' => $blockera_current_theme->is_block_theme(),
			'parent'      => $blockera_current_theme->get( 'parent' ),
		],
		'site'     => [
			'url' => home_url(),
		],
		'blockera' => [
			'settings' => get_option( 'blockera_settings', blockera_core_config( 'panel.std' ) ),
			'name'     => blockera_core_config( 'app.name' ),
			'version'  => blockera_core_config( 'app.version' ),
		],
	]
);
