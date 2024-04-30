<?php

use Composer\Autoload\ClassLoader;

if ( ! class_exists( 'ComposerLoader' ) ) {

	class ComposerLoader {
		/**
		 * @var string
		 */
		public const VERSION = '1.0.0-beta-1';

		/**
		 * @var self|null
		 */
		protected static ?ComposerLoader $instance = null;

		/**
		 * @var ClassLoader|null
		 */
		protected ?ClassLoader $loader = null;

		/**
		 * @var array
		 */
		protected array $autoload_files = [];

		/**
		 * @var string[]
		 */
		protected array $vendor_dirs = [];

		private function __construct( $vendor_dir ) {

			if ( ! class_exists( ClassLoader::class ) ) {

				require $vendor_dir . '/composer/ClassLoader.php';
			}

			if ( ! $this->loader ) {

				$this->loader = new ClassLoader();
				$this->loader->register();
			}
		}

		public static function instance( $vendor_dir ): self {

			if ( ! self::$instance instanceof self ) {

				self::$instance = new self( $vendor_dir );

				// add_action( 'plugins_loaded', [ self::$instance, 'load' ], 999 );
				add_action( 'after_setup_theme', [ self::$instance, 'load' ], 9 );
			}

			return self::$instance;
		}


		public function load(): void {

			$all_files = [];

			foreach ( $this->vendor_dirs as $vendor_dir ) {

				$psr4_file = $vendor_dir . '/composer/autoload_psr4.php';

				if ( file_exists( $psr4_file ) ) {

					$psr4      = include $psr4_file;
					$all_files = array_merge_recursive( $all_files, $psr4 );
				}
			}

			foreach ( $all_files ?? [] as $prefix => $paths ) {

				$this->loader()->addPsr4( $prefix, (array) $this->latest_version( $paths ) );
			}

			do_action( 'better-composer-loader/loaded' );
		}


		/**
		 * @param string[] $paths
		 *
		 * @return string
		 */
		public function latest_version( array $paths ): string {

			if ( count( $paths ) === 1 ) {

				return $paths[0];
			}

			foreach ( $paths as $path ) {

				[ $vendor_dir, $package_name ] = $this->parse_file_path( $path );

				if ( empty( $vendor_dir ) || empty( $package_name ) ) {

					continue;
				}

				$version_file = $vendor_dir . '/composer/installed.php';

				if ( ! file_exists( $version_file ) ) {

					continue;
				}

				$versions = include $version_file;
				$version  = $versions['versions'][ $package_name ]['version'] ?? '';

				if ( $version ) {

					$files_version[ $version ] = $path;
				}
			}

			if ( empty( $files_version ) ) {

				return $paths[0];
			}

			uksort(
				$files_version,
				static function ( $a, $b ) {

					return version_compare( $b, $a );
				}
			);

			return array_shift( $files_version );
		}


		public function parse_file_path( string $file_path ): array {

			foreach ( $this->vendor_dirs as $vendor_dir ) {

				if ( ! preg_match( "#$vendor_dir/*(.+)#", $file_path, $match ) ) {

					continue;
				}

				$rel_path     = explode( '/', self::sanitize_path( $match[1] ), 3 );
				$package_name = isset( $rel_path[0], $rel_path[1] ) ? sprintf( '%s/%s', $rel_path[0], $rel_path[1] ) : '';

				return [ $vendor_dir, $package_name ];
			}

			return [ '', '' ];
		}

		public function loader(): ClassLoader {

			if ( ! $this->loader ) {

				throw new RuntimeException( 'Loader is not defined.' );
			}

			return $this->loader;
		}

		public static function sanitize_path( string $path ): string {

			$path = preg_replace( '#[\\\/]+#', '/', $path );

			return rtrim( $path, '/' );
		}

		public static function init( $vendor_dir ): void {

			$vendor_dir = self::sanitize_path( $vendor_dir );
			$instance   = self::instance( $vendor_dir );

			if ( ! in_array( $vendor_dir, $instance->vendor_dirs, true ) ) {

				$instance->vendor_dirs[] = $vendor_dir;
			}

			$static_file = $vendor_dir . '/composer/autoload_files.php';

			if ( file_exists( $static_file ) ) {

				$static = include $static_file;

				foreach ( $static as $file_identifier => $file ) {

					if ( isset( $instance->autoload_files[ $file_identifier ] ) ) {

						continue;
					}

					$instance->autoload_files[ $file_identifier ] = true;

					require $file;
				}
			}

			$classmap_file = $vendor_dir . '/composer/autoload_classmap.php';

			if ( file_exists( $classmap_file ) ) {

				$classmap = include $classmap_file;

				$instance->loader()->addClassMap( $classmap );
			}
		}

	}
}
