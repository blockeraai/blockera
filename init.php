<?php

$version = '1.0.0';

require __DIR__ . '/bootstrap/loader-library.php';

require __DIR__ . '/bootstrap/loader-composer.php';

if ( ! function_exists( 'blockera_core_loader' ) ) {

	/**
	 * Loading blockera core functionalities.
	 *
	 * @param array $framework the framework name.
	 */
	function blockera_core_loader( array $framework ) {

		define( 'BLOCKERA_CORE_URI', trailingslashit( $framework['uri'] ) );
		define( 'BLOCKERA_CORE_PATH', trailingslashit( $framework['path'] ) );
		define( 'BLOCKERA_CORE_VERSION', $framework['version'] );

		require $framework['path'] . '/bootstrap/app.php';

		/**
		 * Fires after Core fully loaded.
		 */
		// phpcs:ignore WordPress.NamingConventions.ValidHookName.UseUnderscores
		do_action( 'blockera/core/after_setup' );
	}
}

/**
 * Library loading.
 *
 * @param array $params {
 *
 * @type string $uri
 * @type string $path
 * }
 */
return static function ( array $params ) use ( $version ) {

	if ( empty( $params['path'] ) ) {

		$params['path'] = __DIR__;
	}

	if ( empty( $params['uri'] ) ) {

		$params['uri'] = site_url(
			str_replace(
				[ rtrim( ABSPATH, '/' ), '\\' ],
				[ '', '/' ],
				$params['path']
			)
		);
	}

	$params['version'] = $version;

	require __DIR__ . '/vendor/autoload.php';

	$instance = LibraryLoader::instance( 'blockera-core', [ 'priority' => 90 ] );
	$instance->introduce( $version, 'blockera_core_loader', $params );

	return $instance;
};
