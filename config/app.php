<?php

return [
	'url'       => PB_CORE_URI,
	'path'      => PB_CORE_PATH,
	'name'      => 'publisher-core',
	'version'   => PB_CORE_VERSION,
	'dist_url'  => PB_CORE_URI . '/dist/',
	'dist_path' => PB_CORE_PATH . '/dist/',
	'debug'     => pb_core_env( 'APP_MODE' ) && 'development' === pb_core_env( 'APP_MODE' ) || ( ( defined( 'WP_DEBUG' ) && WP_DEBUG ) ),
];
