<?php

namespace Blockera\SharedAutoload;

use Composer\Autoload\ClassLoader;
use Dotenv\Dotenv;

if (! \defined('ABSPATH')) {
    exit;
}

if (! \class_exists(Coordinator::class)) {
    /**
     * Autoloader coordinator for shared Blockera packages.
     * Replaces vendor/autoload.php by loading directly from Composer-generated static files.
     * Optimized for minimal overhead on every WordPress request.
     */
    final class Coordinator {
    
        /** @var Coordinator|null */
        private static $instance = null;

		/**
		 * Store the coordinator reference.
		 *
		 * @var string
		 */
		protected string $coordinator_ref = '';

        /** @var array<string,array{plugin_dir:string,vendor_dir:string}> */
        private array $plugins = [];

        /** @var bool */
        private bool $bootstrapped = false;

		/** @var bool */
		private bool $autoloader_registered = false;

		/**
		 * Combined ClassLoader instance for all plugins.
         *
		 * @var ClassLoader|null
		 */
		private $class_loader = null;

		/**
		 * Files already included (prevents double-inclusion).
		 * Keys are file identifiers, values are true.
         *
		 * @var array<string,bool>
		 */
		private array $included_files = [];

		/**
		 * Cached autoload manifest (PSR-4, classmap, files) per plugin.
         *
		 * @var array<string,array{psr4:array,classmap:array,files:array}>|null
		 */
		private $autoload_manifest = null;

        /**
         * Singleton accessor.
         */
        public static function getInstance(): Coordinator {
            if (null === self::$instance) {
                self::$instance = new Coordinator();
            }
            return self::$instance;
        }

        /**
         * Register a plugin root directory.
         * Normalizes paths once at registration time.
		 * 
		 * @return void
         */
        public function registerPlugin(): void {
			$dependencies = apply_filters('blockera/autoloader-coordinator/plugins/dependencies', []);

			foreach ($dependencies as $dependency => $config) {
				$normalized                   = rtrim($config['dir'], '/\\');
				$this->plugins[ $dependency ] = [
					'slug'         => $dependency,
					'plugin_dir'   => $normalized,
					'vendor_dir'   => $normalized . '/vendor',
					'priority' 	   => $config['priority'] ?? 10,
					'default'      => $config['default'] ?? false,
					'packages_dir' => $normalized . '/vendor/blockera',
				];
			}

			// Invalidate autoload manifest.
			$this->autoload_manifest = null;
        }

        /**
         * Bootstrap the autoloader.
         * Registers the autoloader and schedules file inclusion.
		 * 
		 * @param callable|null $callback Callback to run after the autoloader is bootstrapped.
		 * 
		 * @return void
         */
        public function bootstrap( $callback = null): void {
			// If there are less than 2 plugins, we don't need to coordinate.
			if (2 > count($this->plugins)) {
				return;
			}

			// If the autoloader is already bootstrapped, we don't need to do it again.
            if ($this->bootstrapped) {
                return;
            }
            $this->bootstrapped = true;

			$key                   = array_keys($this->plugins)[ array_search(true, array_column($this->plugins, 'default'), true) ];
			$default_ref           = $this->plugins[ $key ]['slug'];
			$this->coordinator_ref = $_ENV['AUTOLOADER_COORDINATOR_REF'] ?? $default_ref ?? 'blockera';

			// Sort plugins by priority.
            usort(
                $this->plugins,
                function ( $a, $b) {
					if ($a['plugin_dir'] === $this->coordinator_ref) {
						return -1;
					}
					if ($b['plugin_dir'] === $this->coordinator_ref) {
						return 1;
					}
					return $a['priority'] - $b['priority'];
				}
            );

			// Immediately register autoloader for this plugin.
			$this->registerAutoloader();

            // Run file inclusion after all plugins are loaded.
            $this->maybeCoordinate();

			if (is_callable($callback)) {
				$callback();
			}
        }

		/**
		 * Register the autoloader immediately.
		 * This ensures classes are available as soon as the plugin is loaded.
		 */
		private function registerAutoloader(): void {
			if ($this->autoloader_registered) {
				return;
			}

			// Ensure ClassLoader is available.
			$this->ensureClassLoaderAvailable();

			if (! \class_exists(ClassLoader::class)) {
				return;
			}

			// Get the first registered plugin's vendor dir for ClassLoader base.
			$firstPlugin = reset($this->plugins);
			if (! $firstPlugin) {
				return;
			}

			$this->class_loader = new ClassLoader($firstPlugin['vendor_dir']);

			// Load autoload data from the first plugin immediately.
			$this->loadAutoloadDataForPlugin($firstPlugin['slug'], $firstPlugin);

			// Register the class loader.
			$this->class_loader->register(true);

			$this->autoloader_registered = true;
		}

		/**
		 * Ensure Composer ClassLoader class is available.
		 */
		private function ensureClassLoaderAvailable(): void {
			if (\class_exists(ClassLoader::class)) {
				return;
			}

			// Try to load ClassLoader from any registered plugin.
			foreach ($this->plugins as $plugin) {
				$classLoaderPath = $plugin['vendor_dir'] . '/composer/ClassLoader.php';
				if (is_file($classLoaderPath)) {
					require_once $classLoaderPath;
					return;
				}
			}
		}

		/**
		 * Load autoload data for a specific plugin into the class loader.
		 *
		 * @param string                                                         $slug Plugin slug.
		 * @param array{plugin_dir:string,vendor_dir:string,packages_dir:string} $plugin Plugin data.
		 */
		private function loadAutoloadDataForPlugin( string $slug, array $plugin): void {
			if (null === $this->class_loader) {
				return;
			}

			$vendorDir   = $plugin['vendor_dir'];
			$composerDir = $vendorDir . '/composer';

			// Load PSR-4 mappings.
			$psr4File = $composerDir . '/autoload_psr4.php';
			if (is_file($psr4File)) {
				$psr4 = $this->loadAutoloadFile($psr4File, $vendorDir, dirname($vendorDir));
				if (is_array($psr4)) {
					foreach ($psr4 as $namespace => $paths) {
						if (is_array($paths)) {
							foreach ($paths as $path) {
								$this->class_loader->addPsr4($namespace, $path);
							}
						}
					}
				}
			}

			// Load classmap.
			$classmapFile = $composerDir . '/autoload_classmap.php';
			if (is_file($classmapFile)) {
				$classmap = $this->loadAutoloadFile($classmapFile, $vendorDir, dirname($vendorDir));
				if (is_array($classmap)) {
					$this->class_loader->addClassMap($classmap);
				}
			}

			// Store manifest for later file inclusion.
			$filesFile = $composerDir . '/autoload_files.php';
			if (is_file($filesFile)) {
				$files = $this->loadAutoloadFile($filesFile, $vendorDir, dirname($vendorDir));
				if (null === $this->autoload_manifest) {
					$this->autoload_manifest = [];
				}
				$this->autoload_manifest[ $slug ] = [
					'files' => is_array($files) ? $files : [],
					'vendor_dir' => $vendorDir,
				];
			}
		}

		/**
		 * Load an autoload file with proper variable scope.
		 *
		 * @param string $file File path.
		 * @param string $vendorDir Vendor directory path.
		 * @param string $baseDir Base directory path.
		 * @return array|null
		 */
		private function loadAutoloadFile( string $file, string $vendorDir, string $baseDir): ?array {
			// These variables are used by the included file.
			// phpcs:ignore WordPress.PHP.DontExtract.extract_extract
			$vendorDir = $vendorDir;
			$baseDir   = $baseDir;

			$result = include $file;
			return is_array($result) ? $result : null;
		}

		/**
		 * Coordinate autoloads if multiple plugins registered.
		 * Extracted to named method to avoid closure allocation in bootstrap.
		 * 
		 * @return void
		 */
		public function maybeCoordinate(): void {
			// If multiple plugins, coordinate their autoloads.
			$this->coordinateMultiplePlugins();
			// Include files from all registered plugins.
			$this->includeAutoloadFiles();
		}

		/**
		 * Coordinate autoloads between multiple plugins.
		 * Merges PSR-4 mappings and classmaps from additional plugins.
		 */
		private function coordinateMultiplePlugins(): void {
			if (null === $this->class_loader) {
				$this->registerAutoloader();
			}

			if (null === $this->class_loader) {
				return;
			}

			// Collect all package versions to determine winners.
			$packageVersions = $this->collectPackageVersions();

			// Apply coordinator_ref filter if set.
			$preferredPlugin = null;
			if ('' !== $this->coordinator_ref && isset($this->plugins[ $this->coordinator_ref ])) {
				$preferredPlugin = $this->coordinator_ref;
			}

			// Load autoload data from additional plugins.
			$first = true;
			foreach ($this->plugins as $slug => $plugin) {
				if ($first) {
					$first = false;
					continue; // Skip the first plugin, already loaded.
				}

				$this->loadAutoloadDataForPlugin($slug, $plugin);
			}

			// Re-register PSR-4 and classmap with version-based priority.
			$this->applyVersionBasedPriority($packageVersions, $preferredPlugin);
		}

		/**
		 * Collect package versions from all registered plugins.
		 *
		 * @return array<string,array{version:string,plugin:string,vendor_dir:string}>
		 */
		private function collectPackageVersions(): array {
			$manifest = $this->getPackageManifest();
			$versions = [];

			foreach ($manifest as $packageName => $meta) {
				if (! isset($versions[ $packageName ]) || 
					version_compare($meta['version'], $versions[ $packageName ]['version']) > 0) {
					$versions[ $packageName ] = $meta;
				}
			}

			return $versions;
		}

		/**
		 * Apply version-based priority to PSR-4 mappings.
		 * Ensures higher version packages take precedence.
		 *
		 * @param array<string,array{version:string,plugin:string,vendor_dir:string}> $packageVersions Package versions.
		 * @param string|null                                                         $preferredPlugin Preferred plugin slug if set.
		 */
		private function applyVersionBasedPriority( array $packageVersions, ?string $preferredPlugin): void {
			if (null === $this->class_loader) {
				return;
			}

			// Get current PSR-4 prefixes.
			$currentPsr4 = $this->class_loader->getPrefixesPsr4();

			// Build new PSR-4 map with version priority.
			$newPsr4 = [];
			foreach ($currentPsr4 as $prefix => $paths) {
				// For Blockera packages, use version-based selection.
				if (0 === stripos($prefix, 'Blockera\\')) {
					$selectedPath       = $this->selectBestPathForPrefix($prefix, $paths, $packageVersions, $preferredPlugin);
					$newPsr4[ $prefix ] = $selectedPath;
				} else {
					// For non-Blockera packages, keep all paths.
					$newPsr4[ $prefix ] = $paths;
				}
			}

			// Create a new ClassLoader with prioritized mappings.
			$firstPlugin = reset($this->plugins);
			$newLoader   = new ClassLoader($firstPlugin['vendor_dir']);

			foreach ($newPsr4 as $prefix => $paths) {
				if (is_array($paths)) {
					foreach ($paths as $path) {
						$newLoader->addPsr4($prefix, $path);
					}
				} else {
					$newLoader->addPsr4($prefix, $paths);
				}
			}

			// Transfer classmap.
			$classmap = $this->class_loader->getClassMap();
			if (! empty($classmap)) {
				$newLoader->addClassMap($classmap);
			}

			// Unregister old loader and register new one.
			$this->class_loader->unregister();
			$this->class_loader = $newLoader;
			$this->class_loader->register(true);
		}

		/**
		 * Select the best path for a PSR-4 prefix based on version.
		 *
		 * @param string                                                              $prefix PSR-4 prefix.
		 * @param array                                                               $paths Available paths.
		 * @param array<string,array{version:string,plugin:string,vendor_dir:string}> $packageVersions Package versions.
		 * @param string|null                                                         $preferredPlugin Preferred plugin.
		 * @return array Selected paths.
		 */
		private function selectBestPathForPrefix( string $prefix, array $paths, array $packageVersions, ?string $preferredPlugin): array {
			if (count($paths) <= 1) {
				return $paths;
			}

			// Find which package this prefix belongs to.
			$bestPath    = null;
			$bestVersion = '0.0.0';

			foreach ($paths as $path) {
				$pathStr = (string) $path;

				// Check if this path belongs to the preferred plugin.
				if (null !== $preferredPlugin && isset($this->plugins[ $preferredPlugin ])) {
					$preferredDir = $this->plugins[ $preferredPlugin ]['plugin_dir'] . '/';
					if (0 === strpos($pathStr, $preferredDir)) {
						return [ $path ];
					}
				}

				// Find version from package manifest.
				foreach ($packageVersions as $packageName => $meta) {
					if (isset($meta['vendor_dir'])) {
						$vendorPrefix = $meta['vendor_dir'] . '/';
						if (0 === strpos($pathStr, $vendorPrefix)) {
							if (version_compare($meta['version'], $bestVersion) > 0) {
								$bestVersion = $meta['version'];
								$bestPath    = $path;
							}
							break;
						}
					}
				}
			}

			return null !== $bestPath ? [ $bestPath ] : [ $paths[0] ];
		}

		/**
		 * Include autoload files from all registered plugins.
		 * Uses version-based selection for shared packages.
		 */
		private function includeAutoloadFiles(): void {
			if (null === $this->autoload_manifest) {
				return;
			}

			$allFiles = $this->preparePackagesFiles();

			foreach ($allFiles as $packageName => $files) {
				// Sort by version descending.
				usort(
					$files,
					static function( $a, $b) {
						return version_compare($a['version'], $b['version']) < 0 ? 1 : -1;
					}
				);

				// Include file from highest version.
				if (! empty($files)) {
					foreach ($files as $file) {
						$this->includeFile($file['identifier'], $file['path']);
					}
				}
			}
		}

		/**
		 * Preparing packages all files.
		 *
		 * @return array the packages files array.
		 */
		private function preparePackagesFiles(): array {
			// Request-level cache.
			static $memo = null;
			if (null !== $memo) {
				return $memo;
			}

			$cache_key = 'blockera_pkgs_files';
			$files     = get_transient($cache_key);

			if (is_array($files)) {
				$memo = $files;
				return $memo;
			}

			// Collect all files with their package info.
			$files = [];
			foreach ($this->autoload_manifest as $slug => $manifest) {
				if (! isset($manifest['files']) || ! is_array($manifest['files'])) {
					continue;
				}

				foreach ($manifest['files'] as $identifier => $filePath) {
					// Skip if already included.
					if (isset($this->included_files[ $identifier ])) {
						continue;
					}

					// Detect package for this file.
					$packageInfo = $this->detectPackageFromPath($filePath);
					$packageName = $packageInfo['name'] ?? 'unknown-' . $identifier;
					$version     = $packageInfo['version'] ?? '0.0.0';

					// Store file info grouped by package.
					if (! isset($files[ $packageName ])) {
						$files[ $packageName ] = [];
					}

					$files[ $packageName ][] = [
						'identifier' => $identifier,
						'path' => $filePath,
						'version' => $version,
						'plugin' => $slug,
					];
				}
			}

			// Cache miss: detect packages.
			set_transient($cache_key, $files, HOUR_IN_SECONDS);
			$memo = $files;

			return $memo;
		}

		/**
		 * Include a file if not already included.
		 *
		 * @param string $identifier File identifier.
		 * @param string $file File path.
		 */
		private function includeFile( string $identifier, string $file): void {
			if (isset($this->included_files[ $identifier ])) {
				return;
			}

			if (isset($GLOBALS['__composer_autoload_files'][ $identifier ])) {
				$this->included_files[ $identifier ] = true;
				return;
			}

			if (is_file($file)) {
				$this->included_files[ $identifier ]                 = true;
				$GLOBALS['__composer_autoload_files'][ $identifier ] = true;
				require $file;
			}
		}

		/**
		 * Detect package name/version from a path by searching for composer.json upwards.
		 *
		 * @param string $path File or directory path.
		 * @return array{name:string,version:string}|array{}
		 */
		private function detectPackageFromPath( string $path): array {
			// Request-level memoization: cache by path to avoid repeated file I/O.
			static $memo = [];
			if (isset($memo[ $path ])) {
				return $memo[ $path ];
			}

			$dir = is_file($path) ? dirname($path) : rtrim($path, '/\\');

			// Search upward max 4 levels.
			for ($i = 0; $i < 4; $i++) {
				$candidate = $dir . '/composer.json';

				if (is_file($candidate)) {
					$json = @file_get_contents($candidate);
					if (false === $json) {
						$memo[ $path ] = [];
						return [];
					}

					$data = json_decode($json, true, 512, JSON_BIGINT_AS_STRING);

					if (! is_array($data) || ! isset($data['name'])) {
						$memo[ $path ] = [];
						return [];
					}

					$result = [
						'name'     => (string) $data['name'],
						'version'  => isset($data['version']) ? (string) $data['version'] : '0.0.0',
					];

					$memo[ $path ] = $result;
					return $result;
				}

				$parentDir = dirname($dir);
				if ($dir === $parentDir || '/' === $parentDir || '.' === $parentDir || '' === $parentDir) {
					break;
				}
				$dir = $parentDir;
			}

			$memo[ $path ] = [];
			return [];
		}

		/**
		 * Get cached package manifest (transient + request cache).
		 * Rebuilds only when cache miss or plugin changes.
		 *
		 * @return array<string, array{version:string,plugin:string,vendor_dir:string}> Package name => meta.
		 */
		private function getPackageManifest(): array {
			// Request-level cache.
			static $memo = null;
			if (null !== $memo) {
				return $memo;
			}

			$cache_key = 'blockera_pkg_manifest';
			$manifest  = get_transient($cache_key);

			if (is_array($manifest)) {
				$memo = $manifest;
				return $memo;
			}

			// Cache miss: build manifest.
			$manifest = $this->buildPackageManifest();
			set_transient($cache_key, $manifest, HOUR_IN_SECONDS);

			$memo = $manifest;
			return $memo;
		}

		/**
		 * Build package manifest by scanning composer.json files.
		 * Called only on cache miss (~once per hour or on plugin activation).
		 *
		 * @return array<string, array{version:string,plugin:string,vendor_dir:string}> Package name => meta.
		 */
		private function buildPackageManifest(): array {
			$packages = [];

			foreach ($this->plugins as $slug => $plugin) {
				$packagesDir = $plugin['packages_dir'];
				if (! is_dir($packagesDir)) {
					continue;
				}

				foreach ($this->globRecursiveComposerJson($packagesDir) as $composerJson) {
					$json = @file_get_contents($composerJson);
					if (false === $json) {
						continue;
					}

					$data = json_decode($json, true, 512, JSON_BIGINT_AS_STRING);
					if (! is_array($data) || ! isset($data['name'])) {
						continue;
					}

					$name    = (string) $data['name'];
					$version = isset($data['version']) ? (string) $data['version'] : '0.0.0';

					// Only keep if this version is higher.
					if (isset($packages[ $name ]) && version_compare($version, $packages[ $name ]['version']) <= 0) {
						continue;
					}

					$packages[ $name ] = [
						'version'    => $version,
						'plugin'     => $slug,
						'vendor_dir' => $plugin['vendor_dir'],
					];
				}
			}

			return $packages;
		}

		/**
		 * Invalidate package manifest cache.
		 * Hook this to plugin activation/deactivation/update.
		 */
		public function invalidatePackageManifest(): void {
			delete_transient('blockera_pkg_manifest');
			delete_transient('blockera_pkgs_files');
		}

        /**
         * Recursively find composer.json files under a directory.
         * Optimized to check only known patterns.
         *
         * @param string $root Root directory to scan.
         * @return array<int,string>
         */
        private function globRecursiveComposerJson( string $root): array {
            $result = [];
            $root   = rtrim($root, '/\\');
            
            $handle = @opendir($root);
            if (false === $handle) {
                return $result;
            }

            $composerFile     = '/composer.json';
            $iconComposerFile = '/icon/composer.json';
            
            // phpcs:ignore WordPress.CodeAnalysis.AssignmentInCondition.FoundInWhileCondition
            while (false !== ( $entry = readdir($handle) )) {
                if ('.' === $entry || '..' === $entry) {
                    continue;
                }
                
                $packageDir = $root . '/' . $entry;
                if (! is_dir($packageDir)) {
                    continue;
                }

                // Check {package}/composer.json.
                $path = $packageDir . $composerFile;
                if (is_file($path)) {
                    $realpath = realpath($path);
                    $result[] = ( false !== $realpath ) ? $realpath : $path;
                }

                // Check {package}/icon/composer.json.
                $path = $packageDir . $iconComposerFile;
                if (is_file($path)) {
                    $realpath = realpath($path);
                    $result[] = ( false !== $realpath ) ? $realpath : $path;
                }
            }
            closedir($handle);

            return $result;
        }

		/**
		 * Get the class loader instance.
		 *
		 * @return ClassLoader|null
		 */
		public function getClassLoader(): ?ClassLoader {
			return $this->class_loader;
		}
    }
}
