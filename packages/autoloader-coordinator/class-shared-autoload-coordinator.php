<?php

namespace Blockera\SharedAutoload;

use Composer\Autoload\ClassLoader;

// direct access is not allowed.
if (! defined('ABSPATH')) {
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
		 * Normalized autoload file paths already included (prevents duplicate requires).
		 *
		 * @var array<string,bool>
		 */
		private array $included_file_paths = [];

		/**
		 * Cached prepared package files for the current request.
		 *
		 * @var array<string,array<int,array{identifier:string,path:string,version:string,plugin:string}>>|null
		 */
		private ?array $prepared_packages_files_cache = null;

		/**
		 * Cached package manifest for the current request.
		 *
		 * @var array<string,array{version:string,plugin:string,vendor_dir:string}>|null
		 */
		private ?array $package_manifest_cache = null;

		/**
		 * Cached autoload manifest (PSR-4, classmap, files) per plugin.
         *
		 * @var array<string,array{psr4:array,classmap:array,files:array,vendor_dir:string}>|null
		 */
		private $autoload_manifest = null;

		/**
		 * Cached dev-mode flag per vendor directory (mirrors Composer installed.php root.dev).
		 *
		 * @var array<string,bool>
		 */
		private array $include_dev_dependencies_by_vendor = [];

		/**
		 * Cached installed package metadata per vendor directory.
		 *
		 * @var array<string,array{include_dev:bool,packages:array<string,array{dev_requirement?:bool,install_path?:string}>}|null>
		 */
		private array $installed_packages_context_by_vendor = [];

		/**
		 * Cached autoload policy per vendor/plugin pair (computed once per request).
		 *
		 * @var array<string,array{include_dev:bool,skip_vendor_dev_filter:bool,allowed_packages:?array<string,bool>,dev_dir_prefixes:array<int,string>,dev_exact_paths:array<string,bool>,runtime_excluded_files:array<string,bool>,runtime_excluded_dirs:array<int,string>}>
		 */
		private array $autoload_policy_by_key = [];

		/**
		 * Request-level memoization for realpath() during dev-path checks.
		 *
		 * @var array<string,string>
		 */
		private array $normalized_path_cache = [];

		/**
		 * Build a cache key based on currently registered plugins.
		 *
		 * @return string
		 */
		private function getPluginsCacheKey(): string {
			$slugs = array_keys($this->plugins);
			sort($slugs);

			$parts = [ serialize($slugs) ];

			foreach ($this->plugins as $plugin) {
				$parts[] = $this->shouldIncludeDevDependencies($plugin['vendor_dir']) ? 'dev' : 'prod';
			}

			return md5(implode('|', $parts));
		}

		/**
		 * Build a cache key for vendor/plugin autoload policy.
		 *
		 * @param string $vendorDir Vendor directory path.
		 * @param string $pluginDir Plugin root directory path.
		 */
		private function getAutoloadPolicyCacheKey( string $vendorDir, string $pluginDir): string {
			return $vendorDir . "\0" . $pluginDir;
		}

		/**
		 * Normalize a filesystem path once per request.
		 *
		 * @param string $path File or directory path.
		 */
		private function normalizePath( string $path): string {
			if (isset($this->normalized_path_cache[ $path ])) {
				return $this->normalized_path_cache[ $path ];
			}

			$realpath = realpath($path);

			$this->normalized_path_cache[ $path ] = ( false !== $realpath ) ? $realpath : $path;

			return $this->normalized_path_cache[ $path ];
		}

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
			$this->autoload_manifest             = null;
			$this->prepared_packages_files_cache = null;
			$this->package_manifest_cache        = null;
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
			$plugin_count = count($this->plugins);

			if (1 > $plugin_count) {
				return;
			}

			if (2 <= $plugin_count && ! $this->bootstrapped) {
				$this->bootstrapped = true;

				// Find default plugin reference.
				$defaultKey  = array_search(true, array_column($this->plugins, 'default'), true);
				$default_ref = ( false !== $defaultKey && isset($this->plugins[ $defaultKey ]) )
					? $this->plugins[ $defaultKey ]['slug']
					: 'blockera';
				// Get the coordinator reference from the environment variable.
				$env_ref = isset($_ENV['AUTOLOADER_COORDINATOR_REF']) ? sanitize_text_field($_ENV['AUTOLOADER_COORDINATOR_REF']) : null;
				// Set the coordinator reference.
				$this->coordinator_ref = $env_ref ?? $default_ref;

				// Sort plugins by priority and preferred coordinator reference.
				usort(
					$this->plugins,
					function ( $a, $b) {
						if ($a['slug'] === $this->coordinator_ref) {
							return -1;
						}
						if ($b['slug'] === $this->coordinator_ref) {
							return 1;
						}
						return $a['priority'] - $b['priority'];
					}
				);
			}

			$this->registerAutoloader();

			if (2 <= $plugin_count && $this->bootstrapped) {
				$this->maybeCoordinate();
			} else {
				$this->ensureAutoloadManifestIsBuilt();

				if (! $this->shouldDeferFileInclusionUntilCompanionRegisters()) {
					$this->includeAutoloadFiles();
				}
			}

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

			$this->configureClassLoaderPerformance( $this->class_loader );

			// Register the class loader.
			$this->class_loader->register(true);

			$this->autoloader_registered = true;
		}

		/**
		 * Enable ClassLoader caches that cut findFileWithExtension filesystem work.
		 *
		 * Mirrors Composer's APCu gate so findFile() results persist across requests.
		 *
		 * @param ClassLoader $loader Composer class loader.
		 */
		private function configureClassLoaderPerformance( ClassLoader $loader ): void {
			$apcu_enabled = function_exists( 'apcu_fetch' )
				&& filter_var( ini_get( 'apc.enabled' ), FILTER_VALIDATE_BOOLEAN )
				&& ( PHP_SAPI !== 'cli' || filter_var( ini_get( 'apc.enable_cli' ), FILTER_VALIDATE_BOOLEAN ) );

			if ( $apcu_enabled ) {
				$loader->setApcuPrefix( 'blockera_' . $this->getPluginsCacheKey() );
			}
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
		 * Whether Blockera is running in an explicit development runtime.
		 * Defaults to production-safe behavior during WordPress bootstrap.
		 */
		private function isBlockeraDevelopmentRuntime(): bool {
			if (defined('BLOCKERA_SB_MODE') && 'production' === BLOCKERA_SB_MODE) {
				return false;
			}

			if (defined('BLOCKERA_PRO_APP_MODE') && 'production' === BLOCKERA_PRO_APP_MODE) {
				return false;
			}

			$app_mode = $_ENV['APP_MODE'] ?? $_SERVER['APP_MODE'] ?? getenv('APP_MODE');

			if (is_string($app_mode) && 'development' === $app_mode) {
				return true;
			}

			if (defined('BLOCKERA_SB_MODE') && 'development' === BLOCKERA_SB_MODE) {
				return true;
			}

			if (defined('BLOCKERA_PRO_APP_MODE') && 'development' === BLOCKERA_PRO_APP_MODE) {
				return true;
			}

			return false;
		}

		/**
		 * Resolve autoload policy for a plugin vendor tree (computed once, cached per request).
		 *
		 * Production installs (`composer install --no-dev`) already omit dev autoload entries
		 * from vendor/composer/autoload_*.php. When Composer was installed with dev dependencies
		 * but Blockera is running in production mode, dev paths are filtered at runtime.
		 *
		 * @param string $vendorDir Vendor directory path.
		 * @param string $pluginDir Plugin root directory path.
		 * @return array{include_dev:bool,skip_vendor_dev_filter:bool,allowed_packages:?array<string,bool>,dev_dir_prefixes:array<int,string>,dev_exact_paths:array<string,bool>,runtime_excluded_files:array<string,bool>,runtime_excluded_dirs:array<int,string>}
		 */
		private function getAutoloadPolicy( string $vendorDir, string $pluginDir): array {
			$cacheKey = $this->getAutoloadPolicyCacheKey($vendorDir, $pluginDir);

			if (isset($this->autoload_policy_by_key[ $cacheKey ])) {
				return $this->autoload_policy_by_key[ $cacheKey ];
			}

			$context             = $this->getInstalledPackagesContext($vendorDir);
			$composerIncludesDev = $context['include_dev'] ?? false;
			$includeDev          = $composerIncludesDev && $this->isBlockeraDevelopmentRuntime();

			$allowedPackages = null;
			$devDirPrefixes  = [];
			$devExactPaths   = [];
			$runtimeExcluded = $this->getRootAutoloadDevPathRules($pluginDir);

			if (null !== $context) {
				if ($includeDev) {
					$allowedPackages = array_fill_keys(array_keys($context['packages']), true);
				} else {
					$allowedPackages = [];

					foreach ($context['packages'] as $name => $package) {
						if (empty($package['dev_requirement'])) {
							$allowedPackages[ $name ] = true;
							continue;
						}

						if (empty($package['install_path'])) {
							continue;
						}

						$prefix = $this->normalizePath(rtrim($package['install_path'], '/\\'));

						$devDirPrefixes[] = $prefix . '/';
					}
				}
			}

			$policy = [
				'include_dev'              => $includeDev,
				'skip_vendor_dev_filter'   => ! $composerIncludesDev && is_file($vendorDir . '/composer/autoload_psr4.php'),
				'allowed_packages'         => $allowedPackages,
				'dev_dir_prefixes'         => $devDirPrefixes,
				'dev_exact_paths'          => $devExactPaths,
				'runtime_excluded_files'   => $runtimeExcluded['files'],
				'runtime_excluded_dirs'    => $runtimeExcluded['dirs'],
			];

			$this->autoload_policy_by_key[ $cacheKey ]              = $policy;
			$this->include_dev_dependencies_by_vendor[ $vendorDir ] = $includeDev;

			return $policy;
		}

		/**
		 * Whether Composer was installed with dev dependencies for the given vendor tree.
		 *
		 * @param string $vendorDir Vendor directory path.
		 */
		private function shouldIncludeDevDependencies( string $vendorDir): bool {
			if (array_key_exists($vendorDir, $this->include_dev_dependencies_by_vendor)) {
				return $this->include_dev_dependencies_by_vendor[ $vendorDir ];
			}

			foreach ($this->plugins as $plugin) {
				if ($plugin['vendor_dir'] !== $vendorDir) {
					continue;
				}

				$policy = $this->getAutoloadPolicy($vendorDir, $plugin['plugin_dir']);

				return $policy['include_dev'];
			}

			$context = $this->getInstalledPackagesContext($vendorDir);

			if (null === $context) {
				$this->include_dev_dependencies_by_vendor[ $vendorDir ] = false;
				return false;
			}

			$includeDev = $context['include_dev'] && $this->isBlockeraDevelopmentRuntime();

			$this->include_dev_dependencies_by_vendor[ $vendorDir ] = $includeDev;

			return $includeDev;
		}

		/**
		 * Load installed package metadata generated by Composer.
		 *
		 * @param string $vendorDir Vendor directory path.
		 * @return array{include_dev:bool,packages:array<string,array{dev_requirement?:bool,install_path?:string}>}|null
		 */
		private function getInstalledPackagesContext( string $vendorDir): ?array {
			if (array_key_exists($vendorDir, $this->installed_packages_context_by_vendor)) {
				return $this->installed_packages_context_by_vendor[ $vendorDir ];
			}

			$installedFile = $vendorDir . '/composer/installed.php';

			if (! is_file($installedFile)) {
				$this->installed_packages_context_by_vendor[ $vendorDir ] = null;
				return null;
			}

			/** @var array{root:array{dev?:bool},versions:array<string,array{dev_requirement?:bool,install_path?:string}>} $installed */
			$installed = require $installedFile;

			$context = [
				'include_dev' => ! empty($installed['root']['dev']),
				'packages'    => $installed['versions'] ?? [],
			];

			$this->installed_packages_context_by_vendor[ $vendorDir ] = $context;
			$this->include_dev_dependencies_by_vendor[ $vendorDir ]   = $context['include_dev'];

			return $context;
		}

		/**
		 * Determine whether a package should participate in autoload discovery.
		 *
		 * @param string $packageName Package name from composer.json.
		 * @param string $vendorDir   Vendor directory path.
		 * @param string $pluginDir   Plugin root directory path.
		 */
		private function isPackageInstalledForAutoload( string $packageName, string $vendorDir, string $pluginDir = ''): bool {
			if ('' === $pluginDir) {
				foreach ($this->plugins as $plugin) {
					if ($plugin['vendor_dir'] === $vendorDir) {
						$pluginDir = $plugin['plugin_dir'];
						break;
					}
				}
			}

			$policy = $this->getAutoloadPolicy($vendorDir, $pluginDir);

			if (null === $policy['allowed_packages']) {
				return true;
			}

			return isset($policy['allowed_packages'][ $packageName ]);
		}

		/**
		 * Resolve root-project autoload-dev path rules from composer.json.
		 * These paths are excluded from WordPress runtime autoloading in all modes.
		 * PHPUnit bootstraps load them explicitly.
		 *
		 * @param string $pluginDir Plugin root directory path.
		 * @return array{files:array<string,bool>,dirs:array<int,string>}
		 */
		private function getRootAutoloadDevPathRules( string $pluginDir): array {
			static $cache = [];

			if (isset($cache[ $pluginDir ])) {
				return $cache[ $pluginDir ];
			}

			$result = [
				'files' => [],
				'dirs'  => [],
			];

			$composerJson = $pluginDir . '/composer.json';

			if (! is_file($composerJson)) {
				$cache[ $pluginDir ] = $result;
				return $result;
			}

			$json = @file_get_contents($composerJson);

			if (false === $json) {
				$cache[ $pluginDir ] = $result;
				return $result;
			}

			$data = json_decode($json, true, 512, JSON_BIGINT_AS_STRING);

			if (! is_array($data)) {
				$cache[ $pluginDir ] = $result;
				return $result;
			}

			foreach ($data['autoload-dev']['files'] ?? [] as $file) {
				$path = $pluginDir . '/' . ltrim( (string) $file, './' );

				if (is_file($path)) {
					$result['files'][ $this->normalizePath($path) ] = true;
				}
			}

			foreach ($data['autoload-dev']['psr-4'] ?? [] as $dir) {
				$path = $pluginDir . '/' . trim( (string) $dir, './' );

				if (is_dir($path)) {
					$result['dirs'][] = $this->normalizePath($path) . '/';
				}
			}

			$cache[ $pluginDir ] = $result;

			return $result;
		}

		/**
		 * Check whether an autoload path belongs to a dev dependency.
		 *
		 * @param string $path   File or directory path.
		 * @param array  $policy Autoload policy.
		 */
		private function isDevAutoloadPathForPolicy( string $path, array $policy): bool {
			if (empty($policy['dev_dir_prefixes']) && empty($policy['dev_exact_paths'])) {
				return false;
			}

			$normalized = $this->normalizePath($path);

			if (! empty($policy['dev_exact_paths'][ $normalized ])) {
				return true;
			}

			foreach ($policy['dev_dir_prefixes'] as $prefix) {
				if (rtrim($prefix, '/\\') === $normalized || 0 === strpos($normalized, $prefix)) {
					return true;
				}
			}

			return false;
		}

		/**
		 * Check whether an autoload path is excluded from WordPress runtime loading.
		 *
		 * @param string $path   File or directory path.
		 * @param array  $policy Autoload policy.
		 */
		private function isRuntimeExcludedAutoloadPath( string $path, array $policy): bool {
			$normalized = $this->normalizePath($path);

			if (! empty($policy['runtime_excluded_files'][ $normalized ])) {
				return true;
			}

			foreach ($policy['runtime_excluded_dirs'] ?? [] as $prefix) {
				if (rtrim($prefix, '/\\') === $normalized || 0 === strpos($normalized, $prefix)) {
					return true;
				}
			}

			return false;
		}

		/**
		 * Decide whether an autoload path should be skipped for the current request.
		 *
		 * @param string $path   File or directory path.
		 * @param array  $policy Autoload policy.
		 */
		private function shouldSkipAutoloadPath( string $path, array $policy): bool {
			if ($this->isRuntimeExcludedAutoloadPath($path, $policy)) {
				return true;
			}

			if (! empty($policy['skip_vendor_dev_filter'])) {
				return false;
			}

			return $this->isDevAutoloadPathForPolicy($path, $policy);
		}

		/**
		 * Remove dev dependency entries from a Composer classmap.
		 *
		 * @param array<string,string> $classmap Composer classmap.
		 * @param array                $policy   Autoload policy.
		 * @return array<string,string>
		 */
		private function filterDevAutoloadClassmapForPolicy( array $classmap, array $policy): array {
			$filtered = [];

			foreach ($classmap as $className => $filePath) {
				if ($this->shouldSkipAutoloadPath( (string) $filePath, $policy)) {
					continue;
				}

				$filtered[ $className ] = $filePath;
			}

			return $filtered;
		}

		/**
		 * Remove dev dependency entries from Composer autoload files.
		 *
		 * @param array<string,string> $files  Composer autoload files map.
		 * @param array                $policy Autoload policy.
		 * @return array<string,string>
		 */
		private function filterDevAutoloadFilesForPolicy( array $files, array $policy): array {
			$filtered = [];

			foreach ($files as $identifier => $filePath) {
				if ($this->shouldSkipAutoloadPath( (string) $filePath, $policy)) {
					continue;
				}

				$filtered[ $identifier ] = $filePath;
			}

			return $filtered;
		}

		/**
		 * Append Composer autoload sections to a result set.
		 *
		 * @param array  $sections     Composer autoload section.
		 * @param string $package_dir  Package root directory.
		 * @param string $package_name Package name.
		 * @param array  $result       Existing result set.
		 * @param string $section_name Section name for identifier hashing.
		 * @return array{files:array<string,string>,psr4:array<string,array<int,string>>}
		 */
		private function appendComposerAutoloadSections(
			array $sections,
			string $package_dir,
			string $package_name,
			array $result,
			string $section_name
		): array {
			foreach ($sections['files'] ?? [] as $file) {
				$file_path = $package_dir . '/' . ltrim( (string) $file, './' );

				if (! is_file($file_path)) {
					continue;
				}

				$identifier                     = md5('blockera-package-file:' . $section_name . ':' . $package_name . ':' . $file);
				$result['files'][ $identifier ] = $file_path;
			}

			foreach ($sections['psr-4'] ?? [] as $namespace => $dir) {
				$path = $package_dir . '/' . trim( (string) $dir, './' );

				if (! is_dir($path)) {
					continue;
				}

				$result['psr4'][ (string) $namespace ][] = $path;
			}

			return $result;
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
			$pluginDir   = $plugin['plugin_dir'];
			$composerDir = $vendorDir . '/composer';
			$policy      = $this->getAutoloadPolicy($vendorDir, $pluginDir);

			// Load PSR-4 mappings.
			$psr4File = $composerDir . '/autoload_psr4.php';
			if (is_file($psr4File)) {
				$psr4 = $this->loadAutoloadFile($psr4File, $vendorDir, dirname($vendorDir));
				if (is_array($psr4)) {
					foreach ($psr4 as $namespace => $paths) {
						if (! is_array($paths)) {
							continue;
						}

						foreach ($paths as $path) {
							if ($this->shouldSkipAutoloadPath( (string) $path, $policy)) {
								continue;
							}

							$this->class_loader->addPsr4($namespace, $path);
						}
					}
				}
			}

			// Load classmap.
			$classmapFile = $composerDir . '/autoload_classmap.php';
			$classmap     = null;
			if (is_file($classmapFile)) {
				$classmap = $this->loadAutoloadFile($classmapFile, $vendorDir, dirname($vendorDir));
				if (is_array($classmap)) {
					$classmap = $this->filterDevAutoloadClassmapForPolicy($classmap, $policy);
					$this->class_loader->addClassMap($classmap);
				}
			}

			// Store manifest for later file inclusion and classmap coordination.
			$filesFile = $composerDir . '/autoload_files.php';
			$files     = null;
			if (is_file($filesFile)) {
				$files = $this->loadAutoloadFile($filesFile, $vendorDir, dirname($vendorDir));
				if (is_array($files)) {
					$files = $this->filterDevAutoloadFilesForPolicy($files, $policy);
				}
			}

			$needs_vendor_files = ! is_array($files) || empty($files);
			$needs_vendor_psr4  = ! is_file($psr4File);

			if ($needs_vendor_files || $needs_vendor_psr4) {
				$fallback = $this->collectAutoloadFromPackages($plugin);

				if ($needs_vendor_files && ! empty($fallback['files'])) {
					$files = array_merge(is_array($files) ? $files : [], $fallback['files']);
				}

				if ($needs_vendor_psr4 && ! empty($fallback['psr4'])) {
					foreach ($fallback['psr4'] as $namespace => $paths) {
						foreach ($paths as $path) {
							if ($this->shouldSkipAutoloadPath( (string) $path, $policy)) {
								continue;
							}

							$this->class_loader->addPsr4($namespace, $path);
						}
					}
				}
			}
			
			if (null === $this->autoload_manifest) {
				$this->autoload_manifest = [];
			}
			$this->autoload_manifest[ $slug ] = [
				'files' => is_array($files) ? $this->filterDevAutoloadFilesForPolicy($files, $policy) : [],
				'classmap' => is_array($classmap) ? $classmap : [],
				'vendor_dir' => $vendorDir,
			];
		}

		/**
		 * Collect autoload metadata from local package directories.
		 * Used when vendor/composer autoload files are unavailable (e.g. local dev).
		 *
		 * @param array{plugin_dir:string,vendor_dir:string,packages_dir:string} $plugin Plugin data.
		 * @return array{files:array<string,string>,psr4:array<string,array<int,string>>}
		 */
		private function collectAutoloadFromPackages( array $plugin): array {
			$result = [
				'files' => [],
				'psr4'  => [],
			];

			$policy      = $this->getAutoloadPolicy($plugin['vendor_dir'], $plugin['plugin_dir']);
			$include_dev = $policy['include_dev'];

			$roots = array_filter(
				[
					$plugin['packages_dir'],
					$plugin['plugin_dir'] . '/packages',
				],
				'is_dir'
			);

			foreach ($roots as $root) {
				foreach ($this->globPackageComposerJsonInRoot($root) as $composer_json) {
					$package_dir = dirname($composer_json);
					$json        = @file_get_contents($composer_json);

					if (false === $json) {
						continue;
					}

					$data = json_decode($json, true, 512, JSON_BIGINT_AS_STRING);

					if (! is_array($data)) {
						continue;
					}

					$package_name = isset($data['name']) ? (string) $data['name'] : $composer_json;

					if (null !== $policy['allowed_packages'] && ! isset($policy['allowed_packages'][ $package_name ])) {
						continue;
					}

					$result = $this->appendComposerAutoloadSections(
						$data['autoload'] ?? [],
						$package_dir,
						$package_name,
						$result,
						'autoload'
					);

					if ($include_dev) {
						$result = $this->appendComposerAutoloadSections(
							$data['autoload-dev'] ?? [],
							$package_dir,
							$package_name,
							$result,
							'autoload-dev'
						);
					}
				}
			}

			return $result;
		}

		/**
		 * Find package composer.json files in a packages root directory.
		 *
		 * @param string $root Packages root directory.
		 * @return array<int,string>
		 */
		private function globPackageComposerJsonInRoot( string $root): array {
			$result = [];
			$root   = rtrim($root, '/\\');
			$handle = @opendir($root);

			if (false === $handle) {
				return $result;
			}

			// phpcs:ignore WordPress.CodeAnalysis.AssignmentInCondition.FoundInWhileCondition
			while (false !== ( $entry = readdir($handle) )) {
				if ('.' === $entry || '..' === $entry) {
					continue;
				}

				$package_dir = $root . '/' . $entry;

				if (! is_dir($package_dir)) {
					continue;
				}

				$composer_json = $package_dir . '/composer.json';

				if (is_file($composer_json)) {
					$realpath = realpath($composer_json);
					$result[] = ( false !== $realpath ) ? $realpath : $composer_json;
				}
			}

			closedir($handle);

			return $result;
		}

		/**
		 * Ensure every registered plugin has autoload manifest data loaded.
		 *
		 * @return void
		 */
		private function ensureAutoloadManifestIsBuilt(): void {
			if (null === $this->class_loader) {
				$this->registerAutoloader();
			}

			if (null === $this->class_loader) {
				return;
			}

			if (null === $this->autoload_manifest) {
				$this->autoload_manifest = [];
			}

			foreach ($this->plugins as $slug => $plugin) {
				if (! isset($this->autoload_manifest[ $slug ])) {
					$this->loadAutoloadDataForPlugin($slug, $plugin);
				}
			}
		}

		/**
		 * Get the preferred plugin slug for package conflict resolution.
		 *
		 * @return string|null
		 */
		private function getPreferredPluginSlug(): ?string {
			if ('' !== $this->coordinator_ref && isset($this->plugins[ $this->coordinator_ref ])) {
				return $this->coordinator_ref;
			}

			return null;
		}

		/**
		 * Defer autoload file inclusion when Pro bootstraps alone but Free is active.
		 * Free must bootstrap immediately because it calls shared helpers at load time.
		 *
		 * @return bool
		 */
		private function shouldDeferFileInclusionUntilCompanionRegisters(): bool {
			if (2 <= count($this->plugins)) {
				return false;
			}

			$slug = array_key_first($this->plugins);

			if ( 'blockera-pro' !== $slug ) {
				return false;
			}

			// Free plugin already bootstrapped if its entry constant exists.
			return defined( 'BLOCKERA_SB_FILE' );
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
			$this->ensureAutoloadManifestIsBuilt();
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

			$this->ensureAutoloadManifestIsBuilt();

			// Collect all package versions to determine winners.
			$packageVersions = $this->collectPackageVersions();

			// Re-register PSR-4 and classmap with version-based priority.
			$this->applyVersionBasedPriority($packageVersions, $this->getPreferredPluginSlug());
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
		 * Apply version-based priority to PSR-4 mappings and classmaps.
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

			// Build deduplicated classmap with version priority.
			$deduplicatedClassmap = $this->buildDeduplicatedClassmap($packageVersions, $preferredPlugin);

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

			// Add deduplicated classmap.
			if (! empty($deduplicatedClassmap)) {
				$newLoader->addClassMap($deduplicatedClassmap);
			}

			// Unregister old loader and register new one.
			$this->class_loader->unregister();
			$this->class_loader = $newLoader;
			$this->configureClassLoaderPerformance( $this->class_loader );
			$this->class_loader->register(true);
		}

		/**
		 * Select the best path for a PSR-4 prefix based on version.
		 * Optimized with request-level realpath caching to reduce filesystem calls.
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

			// Request-level cache for realpath() calls to reduce filesystem overhead.
			static $realpathCache = [];

			// Find which package this prefix belongs to.
			$bestPath    = null;
			$bestVersion = '0.0.0';

			// Cache preferred plugin real path if needed.
			$preferredRealDir = null;
			if (null !== $preferredPlugin && isset($this->plugins[ $preferredPlugin ])) {
				$preferredDir = $this->plugins[ $preferredPlugin ]['plugin_dir'] . '/';
				if (! isset($realpathCache[ $preferredDir ])) {
					$realpathCache[ $preferredDir ] = realpath($preferredDir);
				}
				$preferredRealDir = ( false !== $realpathCache[ $preferredDir ] ) 
					? $realpathCache[ $preferredDir ] . '/' 
					: $preferredDir;
			}

			foreach ($paths as $path) {
				$pathStr = (string) $path;
				// Resolve symlinks to real path for comparison (cached).
				if (! isset($realpathCache[ $pathStr ])) {
					$realpathCache[ $pathStr ] = realpath($pathStr);
				}
				if (false !== $realpathCache[ $pathStr ]) {
					$pathStr = $realpathCache[ $pathStr ];
				}

				// Check if this path belongs to the preferred plugin.
				if (null !== $preferredRealDir && 0 === strpos($pathStr, $preferredRealDir)) {
					return [ $path ];
				}

				// Find version from package manifest.
				foreach ($packageVersions as $packageName => $meta) {
					if (isset($meta['vendor_dir'])) {
						$vendorPrefix = $meta['vendor_dir'] . '/';
						// Cache vendor prefix realpath.
						if (! isset($realpathCache[ $vendorPrefix ])) {
							$realpathCache[ $vendorPrefix ] = realpath($vendorPrefix);
						}
						$vendorRealPrefix = ( false !== $realpathCache[ $vendorPrefix ] ) 
							? $realpathCache[ $vendorPrefix ] . '/' 
							: $vendorPrefix;
						
						if (0 === strpos($pathStr, $vendorRealPrefix)) {
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
		 * Build deduplicated classmap with version-based priority.
		 * Handles symlinked packages by resolving real paths.
		 * Uses request-level memoization and transient cache for performance.
		 * 
		 * Performance notes:
		 * - realpath() calls are cached per request to reduce filesystem overhead
		 * - Package detection uses memoization (via detectPackageFromPath)
		 * - Full deduplication result is cached in transients (1 hour TTL)
		 *
		 * @param array<string,array{version:string,plugin:string,vendor_dir:string}> $packageVersions Package versions.
		 * @param string|null                                                         $preferredPlugin Preferred plugin slug if set.
		 * @return array<string,string> Deduplicated classmap (class => file path).
		 */
		private function buildDeduplicatedClassmap( array $packageVersions, ?string $preferredPlugin): array {
			if (null === $this->autoload_manifest) {
				return [];
			}

			// Generate cache key based on configuration.
			// Include coordinator_ref, preferred plugin, and plugin keys for uniqueness.
			$cacheKeySuffix = md5(
				( $this->coordinator_ref ?? '' ) . '|' . 
				( $preferredPlugin ?? '' ) . '|' . 
				serialize(array_keys($this->plugins)) . '|' .
				serialize(array_column($this->autoload_manifest, 'vendor_dir'))
			);
			$transientKey   = 'blockera_classmap_' . $cacheKeySuffix;

			// Request-level cache.
			static $memo = [];
			if (isset($memo[ $transientKey ])) {
				return $memo[ $transientKey ];
			}

			// Try transient cache.
			$deduplicated = get_transient($transientKey);

			if (is_array($deduplicated)) {
				$memo[ $transientKey ] = $deduplicated;
				return $deduplicated;
			}

			// Request-level cache for realpath() calls to reduce filesystem overhead.
			static $realpathCache = [];

			// Cache preferred plugin real path if needed (calculated once per method call).
			$preferredDirForComparison = null;
			if (null !== $preferredPlugin && isset($this->plugins[ $preferredPlugin ])) {
				$preferredDir = $this->plugins[ $preferredPlugin ]['plugin_dir'] . '/';
				if (! isset($realpathCache[ $preferredDir ])) {
					$realpathCache[ $preferredDir ] = realpath($preferredDir);
				}
				$preferredDirForComparison = ( false !== $realpathCache[ $preferredDir ] ) 
					? $realpathCache[ $preferredDir ] . '/' 
					: $preferredDir;
			}

			// Collect all classmap entries with their package info.
			$classmapEntries = [];
			foreach ($this->autoload_manifest as $slug => $manifest) {
				if (! isset($manifest['classmap']) || ! is_array($manifest['classmap'])) {
					continue;
				}

				foreach ($manifest['classmap'] as $className => $filePath) {
					// Resolve symlinks to real path for comparison (cached).
					if (! isset($realpathCache[ $filePath ])) {
						$realpathCache[ $filePath ] = realpath($filePath);
					}
					$pathForComparison = ( false !== $realpathCache[ $filePath ] ) 
						? $realpathCache[ $filePath ] 
						: $filePath;

					// Detect package for this class file (uses internal memoization).
					$packageInfo = $this->detectPackageFromPath($filePath);
					$packageName = $packageInfo['name'] ?? 'unknown';
					$version     = $packageInfo['version'] ?? '0.0.0';

					// Check if this is a Blockera package.
					$isBlockeraPackage = 0 === stripos($packageName, 'blockera/');

					if (! isset($classmapEntries[ $className ])) {
						$classmapEntries[ $className ] = [];
					}

					$classmapEntries[ $className ][] = [
						'file' => $filePath,
						'real_path' => $pathForComparison,
						'package' => $packageName,
						'version' => $version,
						'plugin' => $slug,
						'is_blockera' => $isBlockeraPackage,
					];
				}
			}

			// Deduplicate: select best version for each class.
			$deduplicated = [];
			foreach ($classmapEntries as $className => $entries) {
				// If only one entry, use it.
				if (count($entries) === 1) {
					$deduplicated[ $className ] = $entries[0]['file'];
					continue;
				}

				// For Blockera packages, use version-based selection.
				$blockeraEntries = array_filter(
                    $entries,
                    static function( $entry) {
						return $entry['is_blockera'];
					}
                );

				if (! empty($blockeraEntries)) {
					// Prefer preferred plugin if set.
					if (null !== $preferredDirForComparison) {
						foreach ($blockeraEntries as $entry) {
							if (0 === strpos($entry['real_path'], $preferredDirForComparison)) {
								$deduplicated[ $className ] = $entry['file'];
								continue 2;
							}
						}
					}

					// Select best version.
					$bestEntry   = null;
					$bestVersion = '0.0.0';
					foreach ($blockeraEntries as $entry) {
						if (version_compare($entry['version'], $bestVersion) > 0) {
							$bestVersion = $entry['version'];
							$bestEntry   = $entry;
						}
					}

					if (null !== $bestEntry) {
						$deduplicated[ $className ] = $bestEntry['file'];
						continue;
					}
				}

				// For non-Blockera packages or if no Blockera entries, use first entry.
				// Also handle case where same file appears multiple times (symlinks).
				$uniquePaths = [];
				foreach ($entries as $entry) {
					$pathKey = $entry['real_path'];
					if (! isset($uniquePaths[ $pathKey ])) {
						$uniquePaths[ $pathKey ] = $entry;
					}
				}

				// Use first unique path.
				$firstEntry                 = reset($uniquePaths);
				$deduplicated[ $className ] = $firstEntry['file'];
			}

			// Cache the result.
			set_transient($transientKey, $deduplicated, HOUR_IN_SECONDS);
			$memo[ $transientKey ] = $deduplicated;

			return $deduplicated;
		}

		/**
		 * Include autoload files from all registered plugins.
		 * Exclusive packages load from both plugins; shared packages load from the winner only.
		 */
		private function includeAutoloadFiles(): void {
			if (null === $this->autoload_manifest) {
				return;
			}

			$allFiles        = $this->preparePackagesFiles();
			$preferredPlugin = $this->getPreferredPluginSlug();
			$package_groups  = $this->partitionExclusiveAndSharedPackages($allFiles);
			$exclusive       = $package_groups[0];
			$shared          = $package_groups[1];

			// Always load plugin-exclusive dependencies (e.g. blockera/blockera on free, blockera/blockera-pro on pro).
			foreach ($exclusive as $files) {
				foreach ($files as $file) {
					$this->includeFile($file['identifier'], $file['path']);
				}
			}

			// Load shared packages from the winning plugin only.
			foreach ($shared as $packageName => $files) {
				foreach ($this->selectWinningAutoloadFiles($packageName, $files, $preferredPlugin) as $file) {
					$this->includeFile($file['identifier'], $file['path']);
				}
			}
		}

		/**
		 * Split package autoload files into exclusive and shared groups.
		 *
		 * @param array<string,array<int,array{identifier:string,path:string,version:string,plugin:string}>> $allFiles Package files grouped by package name.
		 * @return array{0:array<string,array<int,array{identifier:string,path:string,version:string,plugin:string}>>,1:array<string,array<int,array{identifier:string,path:string,version:string,plugin:string}>>}
		 */
		private function partitionExclusiveAndSharedPackages( array $allFiles): array {
			$exclusive = [];
			$shared    = [];

			foreach ($allFiles as $packageName => $files) {
				$plugin_slugs = array_unique(array_column($files, 'plugin'));

				if (1 === count($plugin_slugs)) {
					$exclusive[ $packageName ] = $files;
					continue;
				}

				$shared[ $packageName ] = $files;
			}

			return [ $exclusive, $shared ];
		}

		/**
		 * Select autoload files for a shared package based on version and preferred plugin.
		 *
		 * @param string      $packageName Package name.
		 * @param array       $files Candidate files.
		 * @param string|null $preferredPlugin Preferred plugin slug.
		 * @return array
		 */
		private function selectWinningAutoloadFiles( string $packageName, array $files, ?string $preferredPlugin): array {
			if (empty($files)) {
				return [];
			}

			if (1 === count($files)) {
				return $files;
			}

			usort(
				$files,
				function ( $a, $b) use ( $preferredPlugin) {
					$version_compare = version_compare($a['version'], $b['version']);

					if (0 !== $version_compare) {
						return $version_compare < 0 ? 1 : -1;
					}

					if (null !== $preferredPlugin) {
						if ($a['plugin'] === $preferredPlugin) {
							return -1;
						}
						if ($b['plugin'] === $preferredPlugin) {
							return 1;
						}
					}

					return 0;
				}
			);

			$winning_plugin = $files[0]['plugin'];

			return array_values(
				array_filter(
					$files,
					static function ( array $file) use ( $winning_plugin) {
						return $file['plugin'] === $winning_plugin;
					}
				)
			);
		}

		/**
		 * Preparing packages all files.
		 *
		 * @return array the packages files array.
		 */
		private function preparePackagesFiles(): array {
			if (null !== $this->prepared_packages_files_cache) {
				return $this->prepared_packages_files_cache;
			}

			$cache_key = 'blockera_pkgs_files_' . $this->getPluginsCacheKey();
			$files     = get_transient($cache_key);

			if (is_array($files)) {
				$this->prepared_packages_files_cache = $files;
				return $this->prepared_packages_files_cache;
			}

			// Collect all files with their package info.
			$files = [];
			foreach ($this->autoload_manifest as $slug => $manifest) {
				if (! isset($manifest['files']) || ! is_array($manifest['files'])) {
					continue;
				}

				foreach ($manifest['files'] as $identifier => $filePath) {
					$pluginDir = $this->plugins[ $slug ]['plugin_dir'] ?? '';
					$vendorDir = $manifest['vendor_dir'] ?? ( $this->plugins[ $slug ]['vendor_dir'] ?? '' );

					if ('' !== $pluginDir && '' !== $vendorDir) {
						$policy = $this->getAutoloadPolicy($vendorDir, $pluginDir);

						if ($this->shouldSkipAutoloadPath( (string) $filePath, $policy)) {
							continue;
						}
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

			set_transient($cache_key, $files, HOUR_IN_SECONDS);
			$this->prepared_packages_files_cache = $files;

			return $this->prepared_packages_files_cache;
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

			if (isset($GLOBALS['blockera_autoload_files'][ $identifier ])) {
				$this->included_files[ $identifier ] = true;
				return;
			}

			if (! is_file($file)) {
				return;
			}

			$normalized = $this->normalizePath($file);

			if (isset($this->included_file_paths[ $normalized ])) {
				$this->included_files[ $identifier ]               = true;
				$GLOBALS['blockera_autoload_files'][ $identifier ] = true;
				return;
			}

			if (isset($GLOBALS['blockera_autoload_file_paths'][ $normalized ])) {
				$this->included_files[ $identifier ]               = true;
				$this->included_file_paths[ $normalized ]          = true;
				$GLOBALS['blockera_autoload_files'][ $identifier ] = true;
				return;
			}

			$this->included_files[ $identifier ]                    = true;
			$this->included_file_paths[ $normalized ]               = true;
			$GLOBALS['blockera_autoload_files'][ $identifier ]      = true;
			$GLOBALS['blockera_autoload_file_paths'][ $normalized ] = true;
			require $file;
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
			if (null !== $this->package_manifest_cache) {
				return $this->package_manifest_cache;
			}

			$cache_key = 'blockera_pkg_manifest_' . $this->getPluginsCacheKey();
			$manifest  = get_transient($cache_key);

			if (is_array($manifest)) {
				$this->package_manifest_cache = $manifest;
				return $this->package_manifest_cache;
			}

			$manifest = $this->buildPackageManifest();
			set_transient($cache_key, $manifest, HOUR_IN_SECONDS);

			$this->package_manifest_cache = $manifest;

			return $this->package_manifest_cache;
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
				$policy = $this->getAutoloadPolicy($plugin['vendor_dir'], $plugin['plugin_dir']);

				foreach ($this->getPackageScanRoots($plugin) as $packagesDir) {
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

						if (null !== $policy['allowed_packages'] && ! isset($policy['allowed_packages'][ $name ])) {
							continue;
						}

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
			}

			return $packages;
		}

		/**
		 * Resolve package scan roots for a plugin.
		 *
		 * @param array{plugin_dir:string,vendor_dir:string,packages_dir:string} $plugin Plugin data.
		 * @return array<int,string>
		 */
		private function getPackageScanRoots( array $plugin): array {
			$roots = [];

			if (is_dir($plugin['packages_dir'])) {
				$roots[] = $plugin['packages_dir'];
			}

			$local_packages_dir = $plugin['plugin_dir'] . '/packages';

			if (is_dir($local_packages_dir)) {
				$roots[] = $local_packages_dir;
			}

			return $roots;
		}

		/**
		 * Invalidate package manifest cache.
		 * Hook this to plugin activation/deactivation/update.
		 */
		public function invalidatePackageManifest(): void {
			delete_transient('blockera_pkg_manifest');
			delete_transient('blockera_pkgs_files');

			$this->prepared_packages_files_cache = null;
			$this->package_manifest_cache        = null;

			global $wpdb;

			$patterns = [
				$wpdb->esc_like('_transient_blockera_pkg_manifest_') . '%',
				$wpdb->esc_like('_transient_timeout_blockera_pkg_manifest_') . '%',
				$wpdb->esc_like('_transient_blockera_pkgs_files_') . '%',
				$wpdb->esc_like('_transient_timeout_blockera_pkgs_files_') . '%',
				$wpdb->esc_like('_transient_blockera_classmap_') . '%',
				$wpdb->esc_like('_transient_timeout_blockera_classmap_') . '%',
			];

			foreach ($patterns as $pattern) {
				// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
				$wpdb->query(
					$wpdb->prepare(
						"DELETE FROM {$wpdb->options} WHERE option_name LIKE %s",
						$pattern
					)
				);
			}
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
