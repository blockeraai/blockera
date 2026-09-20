<?php
/**
 * Host copy of GP DeclaredVendorPackages. Zip generators prefer this file so
 * production packing works before the product pins a GP revision with the
 * same helper.
 *
 * @package Blockera\\DevTools
 */

/**
 * Composer-required `blockera/*` slugs and production third-party vendor paths
 * for zip packing.
 *
 * Zip generators must not glob every GP package on disk. `vendor/blockera`
 * follows `composer.json` `require` only (not `require-dev`). Third-party
 * Composer dirs follow `composer.lock` `packages` (production), never
 * `packages-dev`.
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

	/**
	 * Production third-party Composer packages (`composer.lock` `packages`,
	 * excluding `blockera/*`). Falls back to `composer.json` `require`.
	 *
	 * @param string $consumer_root Product root.
	 * @return string[] Names such as `vlucas/phpdotenv`.
	 */
	public static function fromComposerLockThirdParty( $consumer_root ) {
		$lock_file = $consumer_root . '/composer.lock';

		if ( is_readable( $lock_file ) ) {
			$lock = json_decode( (string) file_get_contents( $lock_file ), true );

			if ( is_array( $lock ) ) {
				$names = array();

				foreach ( (array) ( $lock['packages'] ?? array() ) as $package ) {
					$name = (string) ( $package['name'] ?? '' );

					if ( '' === $name || 0 === strpos( $name, 'blockera/' ) ) {
						continue;
					}

					$names[] = $name;
				}

				$names = array_values( array_unique( $names ) );
				sort( $names );

				return $names;
			}
		}

		return self::fromComposerJsonThirdPartyRequire( $consumer_root );
	}

	/**
	 * Direct `composer.json` `require` names that are not PHP or `blockera/*`.
	 *
	 * @param string $consumer_root Product root.
	 * @return string[] Composer package names.
	 */
	public static function fromComposerJsonThirdPartyRequire( $consumer_root ) {
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
			$requirement = (string) $requirement;

			if ( 'php' === $requirement || 0 === strpos( $requirement, 'ext-' ) ) {
				continue;
			}

			if ( 0 === strpos( $requirement, 'blockera/' ) ) {
				continue;
			}

			$names[] = $requirement;
		}

		$names = array_values( array_unique( $names ) );
		sort( $names );

		return $names;
	}

	/**
	 * Zip path lines for Composer runtime plus production third-party vendor dirs.
	 *
	 * @param string $consumer_root Product root.
	 * @return string[] Bash `zip` continuation lines.
	 */
	public static function thirdPartyZipPathLines( $consumer_root ) {
		$lines = array(
			'	vendor/autoload.php \\',
			'	$(find ./vendor/composer -type f ! -name "*.md" 2>/dev/null) \\',
		);

		foreach ( self::fromComposerLockThirdParty( $consumer_root ) as $name ) {
			$lines[] = sprintf(
				'	$(find ./vendor/%1$s -type f ! -path "*/tests/*" ! -path "*/Tests/*" ! -path "*/test/*" ! -path "*/docs/*" ! -path "*/.github/*" ! -name "*.md" 2>/dev/null) \\',
				$name
			);
		}

		return $lines;
	}
}
