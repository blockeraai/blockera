<?php


$theme = wp_get_theme();

return apply_filters(
	'blockera/config/entities',
	[
		'theme'    => [
			'name'        => [
				'raw'      => $theme->template,
				'rendered' => $theme->get( 'Name' )
			],
			'version'     => $theme->get( 'Version' ),
			'block_theme' => $theme->is_block_theme(),
			'parent'      => $theme->get( 'parent' ),
		],
		'site'     => [
			'url' => home_url(),
		],
		'blockera' => [
			'settings' => get_option( 'blockera_settings', blockera_core_config( 'panel.std' )),
			'name'     => blockera_core_config( 'app.name' ),
			'version'  => blockera_core_config( 'app.version' ),
		],
	]
);
