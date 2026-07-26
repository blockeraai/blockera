<?php
/**
 * Bootstrap the shared Blockera autoload coordinator.
 *
 * @package blockera/autoloader-coordinator
 */

if (! function_exists('blockera_bootstrap_shared_autoloader')) {
	/**
	 * Register a Blockera product with the shared autoload coordinator.
	 *
	 * @param string $slug     Product slug (e.g. blockera, blockera-one).
	 * @param string $dir      Product root directory.
	 * @param int    $priority Coordinator priority.
	 * @param bool   $default  Whether this product is the default coordinator reference.
	 */
	function blockera_bootstrap_shared_autoloader( string $slug, string $dir, int $priority = 10, bool $default = false): void {
		add_filter(
			'blockera/autoloader-coordinator/plugins/dependencies',
			static function ( array $repos ) use ( $slug, $dir, $priority, $default ): array {
				$repos[ $slug ] = [
					'dir'      => $dir,
					'priority' => $priority,
					'default'  => $default,
				];

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
