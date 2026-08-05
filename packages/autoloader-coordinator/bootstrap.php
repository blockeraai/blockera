<?php
/**
 * Bootstrap the shared Blockera autoload coordinator.
 *
 * @package blockera/autoloader-coordinator
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if (! function_exists('blockera_bootstrap_shared_autoloader')) {
	/**
	 * Register a Blockera product with the shared autoload coordinator.
	 *
	 * Consumers provide identity + companion descriptors so the coordinator never
	 * hardcodes product slugs, plugin basenames, or theme stylesheets.
	 *
	 * Options keys when passing an array as $priority_or_options:
	 * - priority (int).
	 * - default (bool).
	 * - file (string) Main plugin/theme file path (__FILE__).
	 * - type (string) `plugin` or `theme`. Default: plugin.
	 * - entry_constant (string) Constant set after this product bootstraps.
	 * - plugin_file (string) active_plugins basename; derived from file when omitted.
	 * - theme_stylesheet (string) Theme stylesheet/template slug; derived from dir when type=theme.
	 * - defer_files_until (string[]) Companion slugs that must register first when active.
	 * - companions (array[]) Other products that may load in the same request.
	 *
	 * @param string    $slug                Product slug (e.g. blockera, blockera-pro).
	 * @param string    $dir                 Product root directory.
	 * @param int|array $priority_or_options Priority (legacy) or options array.
	 * @param bool      $default             Legacy default-coordinator flag used with the integer priority signature.
	 */
	function blockera_bootstrap_shared_autoloader( string $slug, string $dir, $priority_or_options = 10, bool $default = false): void {
		$options = is_array($priority_or_options)
			? $priority_or_options
			: [
				'priority' => (int) $priority_or_options,
				'default'  => $default,
			];

		$options['priority'] = (int) ( $options['priority'] ?? 10 );
		$options['default']  = (bool) ( $options['default'] ?? false );
		$options['type']     = ( 'theme' === ( $options['type'] ?? 'plugin' ) ) ? 'theme' : 'plugin';

		if (empty($options['plugin_file']) && 'plugin' === $options['type'] && ! empty($options['file']) && is_string($options['file'])) {
			$options['plugin_file'] = function_exists('plugin_basename')
				? plugin_basename($options['file'])
				: basename(dirname($options['file'])) . '/' . basename($options['file']);
		}

		if (empty($options['theme_stylesheet']) && 'theme' === $options['type']) {
			$options['theme_stylesheet'] = basename(rtrim($dir, '/\\'));
		}

		if (! isset($options['companions']) || ! is_array($options['companions'])) {
			$options['companions'] = [];
		}

		if (! isset($options['defer_files_until']) || ! is_array($options['defer_files_until'])) {
			$options['defer_files_until'] = [];
		}

		/**
		 * Filter product registration options before the coordinator stores them.
		 *
		 * @param array  $options Product options.
		 * @param string $slug    Product slug.
		 * @param string $dir     Product root directory.
		 */
		$options = apply_filters('blockera/autoloader-coordinator/product-options', $options, $slug, $dir);

		add_filter(
			'blockera/autoloader-coordinator/plugins/dependencies',
			static function ( array $repos ) use ( $slug, $dir, $options ): array {
				$repos[ $slug ] = array_merge(
					$options,
					[
						'dir' => $dir,
					]
				);

				return $repos;
			}
		);

		require_once __DIR__ . '/class-shared-autoload-coordinator.php';

		$coordinator = \Blockera\SharedAutoload\Coordinator::getInstance();
		$coordinator->registerPlugin();
		$coordinator->bootstrap();

		add_action('activated_plugin', [ $coordinator, 'invalidatePackageManifest' ]);
		add_action('deactivated_plugin', [ $coordinator, 'invalidatePackageManifest' ]);
		add_action('upgrader_process_complete', [ $coordinator, 'invalidatePackageManifest' ]);
	}
}
