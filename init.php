<?php

use Publisher\Framework\Providers\Assets\AssetsProvider;

$version = '1.0.0';

require __DIR__ . '/bootstrap/loader-library.php';

require __DIR__ . '/bootstrap/loader-composer.php';

if ( ! function_exists( 'publisherCoreLoader' ) ) {

	/**
	 * @param array $framework
	 */
	function publisherCoreLoader( array $framework ) {

		define( 'PB_CORE_URI', trailingslashit( $framework['uri'] ) );
		define( 'PB_CORE_PATH', trailingslashit( $framework['path'] ) );
		define( 'PB_CORE_VERSION', $framework['version'] );

		require $framework['path'] . '/bootstrap/app.php';

		/**
		 * Fires after PublisherCore fully loaded.
		 */
		do_action( 'publisher-core/after_setup' );
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
	// PublisherComposerLoader::init(__DIR__ . '/vendor/');

	require __DIR__ . '/vendor/autoload.php';

	$instance = PublisherLibraryLoader::instance( 'publisher-core', [ 'priority' => 90 ] );
	$instance->introduce( $version, 'publisherCoreLoader', $params );

	return $instance;
};
