<?php

namespace Blockera\SharedAutoload;

use Composer\Autoload\ClassLoader;

if (! \defined('ABSPATH')) {
    exit;
}

if (! \class_exists(Coordinator::class)) {
    class Coordinator {
    
        /** @var Coordinator|null */
        private static $instance = null;

		/**
		 * Store the coordinator reference.
		 *
		 * @var string $coordinator_ref the coordinator reference.
		 */
		protected $coordinator_ref = '';

        /** @var array<string,array{plugin_dir:string,packages_dir:string}> */
        private $plugins = [];

        /** @var bool */
        private $bootstrapped = false;

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
         */
        public function registerPlugin( string $slug, string $pluginDir): void {
            $this->plugins[ $slug ] = [
                'plugin_dir'   => rtrim($pluginDir, '/\\'),
                'packages_dir' => rtrim($pluginDir, '/\\') . '/vendor/blockera',
            ];
        }

        /**
         * Ensure routing autoloader and files inclusion is prepared.
         */
        public function bootstrap(): void {
            if ($this->bootstrapped) {
                return;
            }
            $this->bootstrapped = true;

            // Run as early as possible once plugins are loaded, after both autoloaders are registered.
            \add_action(
                'init',
                function (): void {
					$this->coordinator_ref = $_ENV['AUTOLOADER_COORDINATOR_REF'] ?? $this->coordinator_ref;

					$this->coordinateAutoloads();
					$this->includePreferredFilesFromPackages();
				},
                1
            );
        }

        /**
         * Decide preferred loader per PSR-4 prefix using package versions detected from paths and prepend a router.
         */
        private function coordinateAutoloads(): void {
            if (! \class_exists(ClassLoader::class)) {
                return;
            }

            $registeredLoaders = \method_exists(ClassLoader::class, 'getRegisteredLoaders')
                ? ClassLoader::getRegisteredLoaders()
                : $this->fallbackDiscoverRegisteredLoaders();

            // Keep only loaders coming from our two plugins by checking that they map any PSR-4 path under those plugin dirs.
            $pluginRoots = array_column($this->plugins, 'plugin_dir');

            /** @var array<string,ClassLoader> $candidateLoaders */
            $candidateLoaders = [];
            foreach ($registeredLoaders as $vendorDir => $loader) {
                if (! \method_exists($loader, 'getPrefixesPsr4')) {
                    continue;
                }
                $psr4 = $loader->getPrefixesPsr4();
                foreach ($psr4 as $prefix => $paths) {
                    foreach ($paths as $path) {
                        foreach ($pluginRoots as $root) {
                            if (strpos( (string) $path, rtrim($root, '/\\') . '/') === 0) {
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
            foreach ($prefixCandidates as $prefix => $candidates) {
                usort(
                    $candidates,
                    function ( $a, $b) {
						return version_compare($a['version'], $b['version']) < 0 ? 1 : -1; // desc.
					}
                );

				if (! empty($this->coordinator_ref) && isset($this->plugins[ $this->coordinator_ref ])) {
					$filtered_candidates = array_filter(
                        $candidates,
                        function( $candidate) {
							return str_starts_with($candidate['base_dir'], $this->plugins[ $this->coordinator_ref ]['plugin_dir'] . '/');
						}
                    );

					$preferredLoaderByPrefix[ $prefix ] = ( $filtered_candidates[0] ?? $candidates[0] )['loader'];
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

            \spl_autoload_register(
                function ( string $class) use ( $preferredLoaderByPrefix): void {
					$ns         = ltrim($class, '\\');
					$bestPrefix = '';
					foreach ($preferredLoaderByPrefix as $prefix => $loader) {
						if ('' === $prefix || 0 === strpos($ns, $prefix)) {
							if (strlen($prefix) > strlen($bestPrefix)) {
								$bestPrefix = $prefix;
							}
						}
					}
					if ('' !== $bestPrefix) {
						/** @var ClassLoader $loader */
						$loader = $preferredLoaderByPrefix[ $bestPrefix ];
						$loader->loadClass($class);
					}
				},
                true,
                true
            );
        }

        /**
         * Collect for each PSR-4 prefix the candidate (loader, package name, version) across our plugin loaders.
         *
         * @param array<string,ClassLoader> $candidateLoaders The candidate loaders.
         * @return array<string,array<int,array{loader:ClassLoader,package:string,version:string,base_dir:string}>>
         */
        private function collectPrefixCandidates( array $candidateLoaders): array {
            $result = [];
            foreach ($candidateLoaders as $loader) {
                if (! \method_exists($loader, 'getPrefixesPsr4')) {
                    continue;
                }
                $psr4 = $loader->getPrefixesPsr4();
                foreach ($psr4 as $prefix => $paths) {
                    foreach ($paths as $path) {
                        $info = $this->detectPackageFromPath( (string) $path);
                        if (null === $info) {
                            continue;
                        }
                        $result[ $prefix ][] = [
                            'loader'   => $loader,
                            'package'  => $info['name'],
                            'version'  => $info['version'],
                            'base_dir' => $info['base_dir'],
                        ];
                        // one path per prefix is enough for our comparison.
                        break;
                    }
                }
            }
            return $result;
        }

        /**
         * Detect package name/version and base_dir from a PSR-4 directory path by searching for composer.json upwards.
         *
         * @return array{name:string,version:string,base_dir:string}|null
         */
        private function detectPackageFromPath( string $path): ?array {
            $dir = rtrim($path, '/\\');
            // common subdirs: php, src.
            for ($i = 0; $i < 3; $i++) {
                $candidate = $dir . '/composer.json';
                if (is_file($candidate)) {
                    $data = json_decode( (string) file_get_contents($candidate), true);
                    if (is_array($data) && ! empty($data['name'])) {
                        $version = (string) ( $data['version'] ?? '0.0.0' );
                        return [
                            'name'     => (string) $data['name'],
                            'version'  => $version,
                            'base_dir' => dirname($candidate),
                        ];
                    }
                    return null;
                }
                $dir = dirname($dir);
                if ('' === $dir || '/' === $dir || '.' === $dir) {
                    break;
                }
            }
            return null;
        }

        /**
         * Include autoloaded "files" (like helpers.php) from the latest versions of packages found under both plugins' packages directories.
         */
        private function includePreferredFilesFromPackages(): void {
            // Collect packages by name across plugins.
            $packages = [];

			if (! empty($this->coordinator_ref) && isset($this->plugins[ $this->coordinator_ref ])) {
				$this->plugins = [ $this->coordinator_ref => $this->plugins[ $this->coordinator_ref ] ];
			}

            foreach ($this->plugins as $plugin) {
                $packagesDir = $plugin['packages_dir'];
                if (! is_dir($packagesDir)) {
                    continue;
                }
                foreach ($this->globRecursiveComposerJson($packagesDir) as $composerJson) {
                    $data = json_decode( (string) file_get_contents($composerJson), true);
                    if (! is_array($data) || empty($data['name'])) {
                        continue;
                    }
                    $name    = (string) $data['name'];
                    $version = (string) ( $data['version'] ?? '0.0.0' );
                    $baseDir = dirname($composerJson);
                    $files   = [];
                    if (isset($data['autoload']['files']) && is_array($data['autoload']['files'])) {
                        foreach ($data['autoload']['files'] as $file) {
                            $files[] = $baseDir . '/' . ltrim($file, '/');
                        }
                    }
                    if (empty($packages[ $name ]) || version_compare($version, $packages[ $name ]['version']) > 0) {
                        $packages[ $name ] = [
                            'version' => $version,
                            'files'   => $files,
                        ];
                    }
                }
            }

            foreach ($packages as $pkg => $meta) {
                foreach ($meta['files'] as $file) {
                    if (is_file($file)) {
                        require_once $file;
                    }
                }
            }
        }

        /**
         * Recursively find composer.json files under a directory.
         *
         * @return array<int,string>
         */
        private function globRecursiveComposerJson( string $root): array {
            $result   = [];
            $iterator = new \RecursiveIteratorIterator(
                new \RecursiveDirectoryIterator($root, \FilesystemIterator::SKIP_DOTS)
            );
            foreach ($iterator as $file) {
                if ($file->isFile() && $file->getFilename() === 'composer.json') {
                    $result[] = $file->getPathname();
                }
            }
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
