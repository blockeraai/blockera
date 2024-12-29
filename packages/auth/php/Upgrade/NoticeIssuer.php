<?php

namespace Blockera\Auth\Upgrade;

use Blockera\Auth\Config;
use Blockera\Auth\Validator;
use Blockera\Bootstrap\Application;

class NoticeIssuer {

	/**
	 * The plugins to install.
	 *
	 * @var array
	 */
	private $plugin = [];

	/**
	 * The subscription.
	 *
	 * @var string
	 */
	private string $subscription;

	/**
	 * The application instance.
	 *
	 * @var Application $app The application instance.
	 */
	private Application $app;

	/**
	 * The config.
	 *
	 * @var Config
	 */
	private Config $config;

	/**
	 * The validator instance.
	 *
	 * @var Validator $validator The validator instance.
	 */
	private Validator $validator;

	/**
	 * PluginInstaller constructor.
	 *
	 * @param Application $app The application instance.
	 * @param array       $args The args.
	 */
	public function __construct( Application $app, array $args = []) {
		$this->app = $app;
		$this->subscription = $args['subscription'] ?? [];
		$this->config = $app->make(Config::class);
		$this->validator = $app->make(Validator::class);

		$parsed_subscription = explode(' - ', $this->subscription);
		$plan = $parsed_subscription[ array_key_last($parsed_subscription) ];

		if ($this->validator->isAllowedPlan($plan)) {
			// Initialize required plugins.
			$this->plugin = $args['plugin'] ?? [];

			add_action('admin_notices', array( $this, 'addInstallNotice' ));
		}
	}

	/**
	 * Check if plugin is installed.
	 *
	 * @param string $plugin_slug The slug of the plugin.
	 *
	 * @return bool true if the plugin is installed, false otherwise.
	 */
	public static function isPluginInstalled( string $plugin_slug): bool {
		$installed_plugins = get_plugins();

		return isset($installed_plugins[ $plugin_slug . '/' . $plugin_slug . '.php' ]);
	}

	/**
	 * Display admin notice for plugin installation.
	 *
	 * @return void
	 */
	public function addInstallNotice(): void {
		if (! current_user_can('install_plugins')) {
			return;
		}

		$plugin = $this->plugin;

		if ($this->config::isDev() || ! self::isPluginInstalled($plugin['slug'])) {
			ob_start();

			include __DIR__ . '/notices/install-notice.php';

			echo ob_get_clean();
		}
	}
}
