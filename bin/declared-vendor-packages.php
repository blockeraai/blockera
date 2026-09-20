<?php
/**
 * Composer-required `blockera/*` slugs for production zip packing.
 *
 * Zip generators must not glob every GP package on disk. Production archives
 * follow `composer.json` `require` only (not `require-dev`).
 *
 * Host copy of `packages/dev-tools/php/Zip/DeclaredVendorPackages.php` so zip
 * generation works before this product pins a GP revision that includes the
 * helper. Prefer the GP path when it exists.
 *
 * @package Blockera\DevTools
 */

namespace Blockera\DevTools\Zip;

/**
 * Resolve vendor/blockera package names from a consumer lockfile.
 */
class DeclaredVendorPackages {

	/**
	 * Vendor slugs from composer.json `require` (`blockera/*`).
	 *
	 * @param string $consumer_root Product root that contains composer.json.
	 * @return string[] Sorted unique names such as `editor`, `feature-icon`.
	 */
	public static function fromComposerRequire( $consumer_root ) {
		$composer_file = $consumer_root . '/composer.json';

		if ( ! is_readable( $composer_file ) ) {
			return array();
		}

		$composer = json_decode( (string) file_get_contents( $composer_file ), true );

		if ( ! is_array( $composer ) ) {
			return array();
		}

		$names = array();

		foreach ( array_keys( (array) ( $composer['require'] ?? array() ) ) as $requirement ) {
			if ( 0 !== strpos( (string) $requirement, 'blockera/' ) ) {
				continue;
			}

			$slug = substr( (string) $requirement, strlen( 'blockera/' ) );

			if ( '' === $slug || 0 === strpos( $slug, 'dev-' ) ) {
				continue;
			}

			$names[] = $slug;
		}

		$names = array_values( array_unique( $names ) );
		sort( $names );

		return $names;
	}

	/**
	 * Host `packages/<name>` dirs that ship PHP (not the GP submodule).
	 *
	 * @param string $packages_dir Absolute `packages/` directory.
	 * @return string[] Directory basenames.
	 */
	public static function fromLocalPhpPackages( $packages_dir ) {
		if ( ! is_dir( $packages_dir ) ) {
			return array();
		}

		$names = array();

		foreach ( (array) glob( $packages_dir . '/*', GLOB_ONLYDIR ) as $package_path ) {
			$package_name = basename( $package_path );

			if ( 'global-packages' === $package_name || 0 === strpos( $package_name, 'dev-' ) ) {
				continue;
			}

			if (
				! is_dir( $package_path . '/php' ) &&
				! is_dir( $package_path . '/core/php' ) &&
				! is_dir( $package_path . '/src' )
			) {
				continue;
			}

			$names[] = $package_name;
		}

		$names = array_values( array_unique( $names ) );
		sort( $names );

		return $names;
	}

	/**
	 * Split SDK packages (`-sdk` suffix) from the rest.
	 *
	 * @param string[] $names Vendor slugs.
	 * @return array{internal: string[], sdks: string[]}
	 */
	public static function partition( array $names ) {
		$internal = array();
		$sdks     = array();

		foreach ( $names as $name ) {
			if ( preg_match( '/-sdk$/', $name ) ) {
				$sdks[] = $name;
				continue;
			}

			$internal[] = $name;
		}

		return array(
			'internal' => array_values( $internal ),
			'sdks'     => array_values( $sdks ),
		);
	}
}
