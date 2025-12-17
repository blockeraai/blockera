<?php

namespace Blockera\SharedAutoload;

use Composer\Autoload\ClassLoader;

if (! \defined('ABSPATH')) {
    exit;
}

if (! \class_exists(Coordinator::class)) {
    /**
     * Autoloader coordinator for shared Blockera packages.
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

        /** @var array<string,array{plugin_dir:string,packages_dir:string}> */
        private array $plugins = [];

        /** @var bool */
        private bool $bootstrapped = false;

		/**
		 * Normalized plugin roots cache (avoid repeated rtrim).
         *
		 * @var array<string>|null
		 */
		private ?array $normalized_plugin_roots = null;

		/**
		 * Preferred loader map for routing autoloader.
         *
		 * @var array<string,ClassLoader>|null
		 */
		private ?array $preferred_loader_map = null;

		/**
		 * Request-level cache for package detection by path.
         *
		 * @var array<string,array{name:string,version:string,base_dir:string}|null>
		 */
		private array $package_path_cache = [];

		/**
		 * Request-level cache for composer.json files.
         *
		 * @var array<string,array{name:string,version:string,base_dir:string}|null>
		 */
		private array $composer_file_cache = [];

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
         */
        public function registerPlugin( string $slug, string $pluginDir): void {
            $normalized             = rtrim($pluginDir, '/\\');
            $this->plugins[ $slug ] = [
                'plugin_dir'   => $normalized,
                'packages_dir' => $normalized . '/vendor/blockera',
            ];
            // Invalidate cached plugin roots.
            $this->normalized_plugin_roots = null;
        }

        /**
         * Ensure routing autoloader and files inclusion is prepared.
         * Lightweight: only registers hook, no heavy work.
         */
        public function bootstrap(): void {
            if ($this->bootstrapped) {
                return;
            }
            $this->bootstrapped = true;

            // Run as early as possible once plugins are loaded, after both autoloaders are registered.
            \add_action('after_setup_theme', [ $this, 'maybeCoordinate' ], 0);
        }

		/**
		 * Coordinate autoloads if multiple plugins registered.
		 * Extracted to named method to avoid closure allocation in bootstrap.
		 */
		public function maybeCoordinate(): void {
			// If just one plugin is registered, we don't need to coordinate.
			if (count($this->plugins) < 2) {
				return;
			}

			$this->coordinator_ref = $_ENV['AUTOLOADER_COORDINATOR_REF'] ?? $this->coordinator_ref;

			$this->coordinateAutoloads();
			$this->includePreferredFilesFromPackages();
		}

        /**
         * Decide preferred loader per PSR-4 prefix using package versions detected from paths and prepend a router.
         */
        private function coordinateAutoloads(): void {
            if (! \class_exists(ClassLoader::class)) {
                return;
            }

            $allLoaders = \method_exists(ClassLoader::class, 'getRegisteredLoaders')
                ? ClassLoader::getRegisteredLoaders()
                : $this->fallbackDiscoverRegisteredLoaders();

			// Keep only loaders coming from our two plugins by checking that they map any PSR-4 path under those plugin dirs.
            $pluginRoots = $this->getNormalizedPluginRoots();
            
            $registeredLoaders = $this->getRegisteredLoaders($allLoaders, $pluginRoots);

            /** @var array<string,ClassLoader> $candidateLoaders */
            $candidateLoaders = [];
            foreach ($registeredLoaders as $vendorDir => $loader) {
                if (! \method_exists($loader, 'getPrefixesPsr4')) {
                    continue;
                }
                $psr4 = $loader->getPrefixesPsr4();
                if (! is_array($psr4)) {
                    continue;
                }
                
                // Check if any PSR-4 path belongs to our plugins (Pattern #6: single pass).
                foreach ($psr4 as $paths) {
                    if (! is_array($paths)) {
                        continue;
                    }
                    foreach ($paths as $path) {
                        $pathStr = (string) $path;
                        foreach ($pluginRoots as $root) {
                            if (0 === strpos($pathStr, $root)) {
                                // This loader serves paths from one of our plugins.
                                $candidateLoaders[ $vendorDir ] = $loader;
                                break 3;
                            }
                        }
                    }
                }
            }

            if (count($candidateLoaders) < 2) {
                return; // nothing to coordinate.
            }

            // Build prefix candidates with their package versions and loaders.
            $prefixCandidates = $this->collectPrefixCandidates($candidateLoaders);

            // Choose preferred loader per prefix by highest version.
            $preferredLoaderByPrefix = [];
            
            // Cache coordinator plugin dir outside loop (Pattern #13).
            $coordinatorPluginDir = null;
            if ('' !== $this->coordinator_ref && isset($this->plugins[ $this->coordinator_ref ])) {
                $coordinatorPluginDir = $this->plugins[ $this->coordinator_ref ]['plugin_dir'] . '/';
            }
            
            foreach ($prefixCandidates as $prefix => $candidates) {
                // Sort by version descending (Pattern #9: use static closure).
                usort(
                    $candidates,
                    static function( $a, $b) {
						return version_compare($a['version'], $b['version']) < 0 ? 1 : -1;
					}
                );

				// Apply coordinator filter if set (Pattern #97: foreach instead of array_filter).
				if (null !== $coordinatorPluginDir) {
					$filtered = null;
					foreach ($candidates as $candidate) {
						if (str_starts_with($candidate['base_dir'], $coordinatorPluginDir)) {
							$filtered = $candidate;
							break;
						}
					}
					$preferredLoaderByPrefix[ $prefix ] = ( $filtered ?? $candidates[0] )['loader'];
				} else {
					$preferredLoaderByPrefix[ $prefix ] = $candidates[0]['loader'];
				}
            }

            // Allow overrides via WP filter.
            $preferredLoaderByPrefix = \apply_filters(
                'blockera/shared_autoload/preferred_prefix_map',
                $preferredLoaderByPrefix,
                $candidateLoaders
            );

            if (empty($preferredLoaderByPrefix)) {
                return;
            }

            // Register optimized autoloader (Pattern #3: avoid heavy closure captures).
            // Store map in class property to reduce closure capture overhead.
            $this->registerRoutingAutoloader($preferredLoaderByPrefix);
        }

		/**
		 * Register routing autoloader with optimized closure.
		 * Uses class property instead of closure capture for better performance.
		 *
		 * @param array<string,ClassLoader> $preferredLoaderByPrefix Prefix to loader map.
		 */
		private function registerRoutingAutoloader( array $preferredLoaderByPrefix): void {
			$this->preferred_loader_map = $preferredLoaderByPrefix;

			\spl_autoload_register(
				function( string $class): void {
					// Optimized: minimal work per autoload attempt.
					$ns         = ltrim($class, '\\');
					$bestPrefix = '';
					$bestLen    = 0;

					// Pattern #6: Single pass to find longest matching prefix.
					foreach ($this->preferred_loader_map as $prefix => $loader) {
						$prefixLen = strlen($prefix);
						if ('' === $prefix || 0 === strpos($ns, $prefix)) {
							if ($prefixLen > $bestLen) {
								$bestPrefix = $prefix;
								$bestLen    = $prefixLen;
							}
						}
					}

					if ('' !== $bestPrefix) {
						$this->preferred_loader_map[ $bestPrefix ]->loadClass($class);
					}
				},
				true,
				true
			);
		}

		/**
		 * Get normalized plugin roots with trailing slash (cached).
		 * Avoids repeated rtrim() calls in hot paths.
		 *
		 * @return array<string> Normalized plugin roots with trailing slash.
		 */
		private function getNormalizedPluginRoots(): array {
			if (null !== $this->normalized_plugin_roots) {
				return $this->normalized_plugin_roots;
			}

			$roots = [];
			foreach ($this->plugins as $plugin) {
				$roots[] = $plugin['plugin_dir'] . '/';
			}

			$this->normalized_plugin_roots = $roots;
			return $roots;
		}

		/**
		 * Get registered loaders from all loaders.
		 * Optimized: plugin roots already normalized, no repeated rtrim.
		 *
		 * @param array<string,ClassLoader> $allLoaders The all loaders.
		 * @param array<string>             $pluginRoots The normalized plugin roots (with trailing slash).
		 * @return array<string,ClassLoader> The registered loaders.
		 */
		private function getRegisteredLoaders( array $allLoaders, array $pluginRoots): array {
			$registeredLoaders = [];

			foreach ($allLoaders as $vendorDir => $loader) {
                if (! \method_exists($loader, 'getPrefixesPsr4')) {
                    continue;
                }
                $psr4 = $loader->getPrefixesPsr4();
                if (! is_array($psr4)) {
                    continue;
                }
                
                // Check if any PSR-4 path belongs to our plugins.
                foreach ($psr4 as $paths) {
                    if (! is_array($paths)) {
                        continue;
                    }
                    foreach ($paths as $path) {
                        $pathStr = (string) $path;
                        foreach ($pluginRoots as $root) {
                            if (0 === strpos($pathStr, $root)) {
                                $registeredLoaders[ $vendorDir ] = $loader;
                                break 3;
                            }
                        }
                    }
                }
            }

			return $registeredLoaders;
		}

		/**
		 * Collect for each PSR-4 prefix the candidate (loader, package name, version) across our plugin loaders.
		 * Optimized: request-level caching, reduced allocations, early exits, foreach instead of array_filter.
		 *
		 * @param array<string,ClassLoader> $candidateLoaders The candidate loaders.
		 * @return array<string,array<int,array{loader:ClassLoader,package:string,version:string,base_dir:string}>>
		 */
		private function collectPrefixCandidates( array $candidateLoaders): array {
			$result = [];

			foreach ($candidateLoaders as $loader) {
				if (! method_exists($loader, 'getPrefixesPsr4')) {
					continue;
				}

				$allPsr4 = $loader->getPrefixesPsr4();
				if (! is_array($allPsr4)) {
					continue;
				}

				// Pattern #97: Use foreach instead of array_filter (avoid callback overhead).
				// Filter to Blockera\\ prefixes only.
				foreach ($allPsr4 as $prefix => $paths) {
					// Skip non-Blockera prefixes (case-insensitive check).
					if (0 !== stripos( (string) $prefix, 'Blockera\\')) {
						continue;
					}

					if (! is_array($paths) || empty($paths)) {
						continue;
					}

					// Take first path only (original code breaks after first anyway).
					$path = (string) reset($paths);
					$info = $this->detectPackageFromPath($path);

					if (null !== $info) {
						$result[ $prefix ][] = [
							'loader'   => $loader,
							'package'  => $info['name'],
							'version'  => $info['version'],
							'base_dir' => $info['base_dir'],
						];
					}
				}
			}

			return $result;
		}

		/**
		 * Detect package name/version and base_dir from a PSR-4 directory path by searching for composer.json upwards.
		 * Optimized: class-level cache (better than method-level static), cached path operations, normalized JSON parsing.
		 *
		 * @param string $path PSR-4 directory path.
		 * @return array{name:string,version:string,base_dir:string}|null
		 */
		private function detectPackageFromPath( string $path): ?array {
			// Normalize path once for cache key (Pattern #13, #100).
			$cacheKey = rtrim($path, '/\\');
			
			// Class-level cache: more efficient than method-level static (Pattern #23, #73, Class Guide).
			if (isset($this->package_path_cache[ $cacheKey ])) {
				return $this->package_path_cache[ $cacheKey ];
			}

			$result                                = $this->detectPackageFromPathUncached($cacheKey);
			$this->package_path_cache[ $cacheKey ] = $result;

			return $result;
		}

		/**
		 * Internal: Detect package from path without caching (called only on cache miss).
		 *
		 * @param string $dir Already normalized directory path.
		 * @return array{name:string,version:string,base_dir:string}|null
		 */
		private function detectPackageFromPathUncached( string $dir): ?array {
			// Search upward max 3 levels (Pattern #31: minimize filesystem checks).
			for ($i = 0; $i < 3; $i++) {
				$candidate = $dir . '/composer.json';

				// Check if we've already parsed this exact composer.json file (class-level cache).
				if (isset($this->composer_file_cache[ $candidate ])) {
					return $this->composer_file_cache[ $candidate ];
				}

				if (is_file($candidate)) {
					$json = @file_get_contents($candidate);
					if (false === $json) {
						$this->composer_file_cache[ $candidate ] = null;
						return null;
					}

					// Pattern #33: json_decode with explicit flags for performance + error handling.
					$data = json_decode($json, true, 512, JSON_BIGINT_AS_STRING);

					// Pattern #2: isset is faster than empty for non-null checks.
					if (! is_array($data) || ! isset($data['name'])) {
						$this->composer_file_cache[ $candidate ] = null;
						return null;
					}

					$result = [
						'name'     => (string) $data['name'],
						'version'  => isset($data['version']) ? (string) $data['version'] : '0.0.0',
						'base_dir' => dirname($candidate),
					];

					$this->composer_file_cache[ $candidate ] = $result;
					return $result;
				}

				// Move up one directory (Pattern #100: cache dirname results).
				$parentDir = dirname($dir);
				
				// Stop at filesystem root (Pattern #2: strict comparisons).
				if ($dir === $parentDir || '/' === $parentDir || '.' === $parentDir || '' === $parentDir) {
					break;
				}

				$dir = $parentDir;
			}

			return null;
		}

		/**
		 * Include preferred package files (highest version wins).
		 * Optimized: builds manifest once per hour (or on plugin change), cached in-memory per request.
		 */
		private function includePreferredFilesFromPackages(): void {
			// Request-level cache: zero overhead for repeat calls in same request.
			static $included = false;
			if ($included) {
				return;
			}

			$manifest = $this->getPackageManifest();

			// Include files from winning packages (Pattern #6: single pass, minimal checks).
			// Note: file_exists() is redundant if manifest was built correctly, but kept for safety.
			foreach ($manifest as $files) {
				foreach ($files as $file) {
					require_once $file;
				}
			}

			$included = true;
		}

		/**
		 * Get cached package manifest (transient + request cache).
		 * Rebuilds only when cache miss or plugin changes.
		 *
		 * @return array<string, array<int, string>> Package name => file paths.
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

			// Cache miss: build manifest (expensive, happens ~once per hour or on plugin change).
			$manifest = $this->buildPackageManifest();
			set_transient($cache_key, $manifest, HOUR_IN_SECONDS);

			$memo = $manifest;
			return $memo;
		}

		/**
		 * Build package manifest by scanning composer.json files.
		 * Called only on cache miss (~once per hour or on plugin activation).
		 *
		 * @return array<string, array<int, string>> Package name => file paths.
		 */
		private function buildPackageManifest(): array {
			$packages = [];

			// Apply coordinator_ref filter early (Pattern #13: normalize once).
			if (isset($this->coordinator_ref, $this->plugins[ $this->coordinator_ref ])) {
				$this->plugins = [ $this->coordinator_ref => $this->plugins[ $this->coordinator_ref ] ];
			}

			// Single-pass collection: avoid intermediate arrays (Pattern #6, #37).
			foreach ($this->plugins as $plugin) {
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

					// Only parse files if this version might win (early exit, Pattern #2).
					if (isset($packages[ $name ]) && version_compare($version, $packages[ $name ]['version']) <= 0) {
						continue;
					}

					// Build file paths once (Pattern #13: normalize once, not in inner loops).
					$files = [];
					if (isset($data['autoload']['files']) && is_array($data['autoload']['files'])) {
						$baseDir = dirname($composerJson);
						foreach ($data['autoload']['files'] as $file) {
							$path = $baseDir . '/' . ltrim($file, '/');
							if (is_file($path)) {
								$files[] = $path;
							}
						}
					}

					$packages[ $name ] = [
						'version' => $version,
						'files'   => $files,
					];
				}
			}

			// Extract only file lists (reduce memory footprint, Pattern #34).
			$manifest = [];
			foreach ($packages as $name => $meta) {
				if (! empty($meta['files'])) {
					$manifest[ $name ] = $meta['files'];
				}
			}

			return $manifest;
		}

		/**
		 * Invalidate package manifest cache.
		 * Hook this to plugin activation/deactivation/update.
		 */
		public function invalidatePackageManifest(): void {
			delete_transient('blockera_pkg_manifest');
		}

        /**
         * Recursively find composer.json files under a directory.
         * Optimized to check only known patterns: {package}/composer.json and {package}/icon/composer.json.
         * Pattern #31: Minimize filesystem checks, cache string constants.
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

            // Pattern #13: Cache constants outside loop.
            $composerFile     = '/composer.json';
            $iconComposerFile = '/icon/composer.json';
            
            // phpcs:ignore WordPress.CodeAnalysis.AssignmentInCondition.FoundInWhileCondition -- Intentional assignment in while condition for readdir loop.
            while (false !== ( $entry = readdir($handle) )) {
                // Pattern #89: Strict comparisons.
                if ('.' === $entry || '..' === $entry) {
                    continue;
                }
                
                $packageDir = $root . '/' . $entry;
                if (! is_dir($packageDir)) {
                    continue;
                }

                // Check {package}/composer.json (Pattern #16: build strings efficiently).
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
         * Fallback discovery of registered loaders if getRegisteredLoaders is not available.
         *
         * @return array<string,ClassLoader>
         */
        private function fallbackDiscoverRegisteredLoaders(): array {
            $result = [];
            $funcs  = \spl_autoload_functions();
            if (! is_array($funcs)) {
                return $result;
            }
            foreach ($funcs as $entry) {
                if (is_array($entry) && isset($entry[0]) && $entry[0] instanceof ClassLoader) {
                    $loader                              = $entry[0];
                    $result[ \spl_object_hash($loader) ] = $loader;
                }
            }
            return $result;
        }
    }
}
