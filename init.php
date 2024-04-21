<?php

use Blockera\Framework\Providers\Assets\AssetsProvider;

$version = '1.0.0';

require __DIR__ . '/bootstrap/loader-library.php';

require __DIR__ . '/bootstrap/loader-composer.php';

if ( ! function_exists( 'blockeraCoreLoader' ) ) {

	/**
	 * @param array $framework
	 */
	function blockeraCoreLoader( array $framework ) {

		define( 'BLOCKERA_CORE_URI', trailingslashit( $framework['uri'] ) );
		define( 'BLOCKERA_CORE_PATH', trailingslashit( $framework['path'] ) );
		define( 'BLOCKERA_CORE_VERSION', $framework['version'] );

		require $framework['path'] . '/bootstrap/app.php';

		/**
		 * Fires after Core fully loaded.
		 */
		do_action( 'blockera-core/after_setup' );
	}
}

/**
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
	// ComposerLoader::init(__DIR__ . '/vendor/');

	require __DIR__ . '/vendor/autoload.php';

	$instance = LibraryLoader::instance( 'blockera-core', [ 'priority' => 90 ] );
	$instance->introduce( $version, 'blockeraCoreLoader', $params );

	return $instance;
};
