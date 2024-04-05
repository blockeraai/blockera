<?php


$theme = wp_get_theme();

return [
	'theme' => [
		'name'        => [
			'raw'      => $theme->template,
			'rendered' => $theme->get( 'Name' )
		],
		'version'     => $theme->get( 'Version' ),
		'block_theme' => $theme->is_block_theme(),
		'parent'      => $theme->get( 'parent' ),
	],
	'site'  => [
		'url' => home_url(),
	],
];
