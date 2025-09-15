<?php

namespace Blockera\PluginCompatibility;

use Blockera\Utils\Utils;

class CompatibilityCheck {

	/**
	 * Store the status of the third party plugin installation.
	 *
	 * @var bool $is_installed_third_party_plugin the status of the third party plugin installation.
	 */
	protected bool $is_installed_third_party_plugin = false;

	/**
	 * Store the compatibility status.
	 *
	 * @var bool $is_compatible the compatibility status. Default is true.
	 */
	protected bool $is_compatible = true;

	/**
	 * Store the app mode.
	 *
	 * @var string $app_mode the app mode.
	 */
	protected string $app_mode;

	/**
	 * Store the plugin path.
	 *
	 * @var string $plugin_path the plugin path.
	 */
	protected string $plugin_path;

	/**
	 * Store the main plugin file.
	 *
	 * @var string $plugin_file the main plugin path.
	 */
	protected string $plugin_file;

    /**
     * Store the instance of the class.
     *
     * @var \Blockera\PluginCompatibility\CompatibilityCheck $instance The instance of the class.
     */
    protected static $instance = null;

	/**
	 * Store the plugin slug.
	 *
	 * @var string $plugin_slug the plugin slug.
	 */
	protected string $plugin_slug;

	/**
	 * Store the compatible plugin slug.
	 *
	 * @var string $compatible_with_slug the compatible plugin slug.
	 */
	protected string $compatible_with_slug;

	/**
	 * Store the required version.
	 *
	 * @var string $requires_at_least the required version.
	 */
	protected string $requires_at_least;

	/**
	 * Store the required plugin version.
	 *
	 * @var string $required_plugin_version the required plugin version.
	 */
	protected string $required_plugin_version;

	/**
	 * Store the plugin version.
	 *
	 * @var string $plugin_version the plugin version.
	 */
	protected string $plugin_version;

	/**
	 * Store the callback for compatibility check..
	 *
	 * @var callable|null $callback the callback.
	 */
	protected $callback;

	/**
	 * Store the instance of the utils class.
	 *
	 * @var Utils $utils the instance of the utils class.
	 */
	protected Utils $utils;

	/**
	 * Store the cache key.
	 *
	 * @var string $cache_key the cache key.
	 */
	protected string $cache_key = 'blockera-compat-redirect';

	/**
	 * Store the controller pages.
	 *
	 * @var array $specific_pages the controller pages.
	 */
	protected array $specific_pages = [];

	/**
	 * List of whitelisted pages to not redirect to compatibility page.
	 *
	 * @var array $whitelist_pages list of pages.
	 */
	protected array $whitelist_pages = [
		'plugins.php', 
		'update-core.php', 
		'update.php', 
		'plugin-install.php',
	];

	/**
	 * Compatibility checking object constructor.
	 *
	 * @param array $args
	 */
	public function __construct( array $args, Utils $utils) {

		$this->utils = $utils;

		$this->compatible_with_slug = $args['compatible_with_slug'];

		$this->setProps($args);

		if (! $this->isActivePlugin()) {
			return;
		}

		if (! function_exists('wp_safe_redirect')) {
			require_once ABSPATH . 'wp-includes/pluggable.php';
		}
	}

	/**
	 * Get the property of the class.
	 *
	 * @param string $prop the property.
	 *
	 * @return mixed the property.
	 */
	public function get( string $prop): mixed {

		return $this->$prop;
	}

	/**
	 * Set the properties of the class.
	 *
	 * @param array $plugin_args the plugin arguments.
	 *
	 * @return self
	 */
	public function setProps( array $plugin_args): self {

		$this->app_mode       = $plugin_args['mode'];
		$this->plugin_path    = $plugin_args['plugin_path'];
		$this->plugin_file    = $plugin_args['file'];
		$this->plugin_slug    = $plugin_args['slug'];
		$this->plugin_version = $plugin_args['version'];
		$this->callback       = $plugin_args['callback'] ?? null;
		$this->cache_key      = $plugin_args['transient_key'];
		$this->specific_pages = apply_filters('blockera/compatibility/specific_pages', []);

		if (! function_exists('get_plugin_data')) {
			require_once ABSPATH . 'wp-admin/includes/plugin.php';
		}

		// If the plugin is installed, read required minimum version for Blockera Pro from this file header.
		if ($this->isPluginInstalled()) {
			// Read required minimum version for Blockera Pro from this file header.
			$required_plugin_data = get_plugin_data(WP_PLUGIN_DIR . '/' . $this->compatible_with_slug . '/' . $this->compatible_with_slug . '.php', true, false);
			if (isset($required_plugin_data['Version'])) {
				$this->required_plugin_version = $required_plugin_data['Version'];
			}	
		}

		// Read required minimum version for Blockera Pro from this file header.
        if (! function_exists('get_file_data')) {
            require_once ABSPATH . 'wp-includes/functions.php';
        }

        $headers = get_file_data(
            $this->getPluginFile(),
            [ 
				'requires_at_least' => 'Requires at least ' . $this->compatible_with_slug,
			]
        );

		if (isset($headers['requires_at_least'])) {
			$this->requires_at_least = trim($headers['requires_at_least']);
		}

		return $this;
	}

	/**
	 * Get the main plugin file.
	 *
	 * @return string the main plugin path.
	 */
	public function getPluginFile(): string {

		return $this->plugin_file;
	}

	/**
	 * Load the compatibility check.
	 *
	 * @return void
	 */
    public function load(): void {

		if (! $this->is_installed_third_party_plugin || ! $this->isActivePlugin()) {
			return;
		}

        $this->checkVersions(
            function (){

				$this->is_compatible = false;

				// Disable the plugin functionality.
				add_filter(sprintf('%1$s/is-enabled', $this->compatible_with_slug), '__return_false', 9999);

				if ($this->callback && is_callable($this->callback)) {
					call_user_func($this->callback);
				}

				// Schedule one-time redirect to compatibility page.
				if (is_admin() && current_user_can('update_plugins')) {
					if (! get_transient($this->cache_key)) {
						set_transient($this->cache_key, 1, 60);
					}
				}

				// First redirect to dashboard page after redirect to blockera-compat page
				// if the request is a specific page of target plugin.
				if (in_array($_SERVER['REQUEST_URI'], $this->specific_pages, true)) {
					wp_safe_redirect(admin_url());
					exit;
				}
			}
        );
    }

	/**
	 * Check if the plugin is installed.
	 *
	 * @return bool true if plugin is installed, false otherwise.
	 */
	protected function isPluginInstalled(): bool {
		
		if (! function_exists('get_plugins')) {
			require_once ABSPATH . 'wp-admin/includes/plugin.php';
		}

		$all_plugins = get_plugins();
		$plugin_base = $this->compatible_with_slug . '/' . $this->compatible_with_slug . '.php';
		
		$this->is_installed_third_party_plugin = array_key_exists($plugin_base, $all_plugins);

		return $this->is_installed_third_party_plugin;
	}

	/**
	 * Check if the plugin is active.
	 *
	 * @return bool true on success, false on failure!
	 */
	protected function isActivePlugin(): bool {
		
		// Check if Blockera Pro plugin is active.
        if (! function_exists('is_plugin_active')) {
            require_once ABSPATH . 'wp-admin/includes/plugin.php';
        }
        
        $required_plugin_file = $this->compatible_with_slug . '/' . $this->compatible_with_slug . '.php';
        
		return is_plugin_active($required_plugin_file);
	}

	/**
	 * Check the plugin versions with the callback.
	 * 
	 * @param callable $callback the callback.
	 * @param bool     $status the status. default is false.
	 *
	 * @return void
	 */
	protected function checkVersions( callable $callback, bool $status = false): void {

		// When Current Plugin exists but is below minimum, disable it functionality via filter and set redirect.
        if ($this->requires_at_least && $this->required_plugin_version && version_compare($this->required_plugin_version, $this->requires_at_least, '<')) {
			
			if ($callback && is_callable($callback) && ! $status) {
				
				call_user_func($callback);
			}
        } elseif ($status) {

			if ($callback && is_callable($callback)) {
			
				call_user_func($callback);
			}
		}
	}

    /**
     * Admin initialization.
     *
     * @return void
     */
    public function adminInitialize(): void {

        if (! $this->is_installed_third_party_plugin || ! is_admin() || ! current_user_can('update_plugins')) {
            return;
        }

        global $pagenow;

        // Avoid running on plugins page to prevent interference.
		if (in_array($pagenow, $this->whitelist_pages, true)) {
			return;
		}

        if (! get_transient($this->cache_key)) {
            return;
        }

		if ($this->isActivePlugin()) {

			$this->checkVersions(
				function () {
					// Delete the transient.
					delete_transient($this->cache_key);

					$this->redirectToDashboard();
				},
				true
			);
		}

        // Avoid redirect loops.
        if (isset($_GET['page']) && 'blockera-compat' === $_GET['page']) {
            return;
        }

        wp_safe_redirect(admin_url('admin.php?page=blockera-compat'));
        exit;
    }

	/**
	 * Redirect to the dashboard.
	 *
	 * @return void
	 */
	private function redirectToDashboard(): void {
		
		if (! $this->is_compatible) {
			return;
		}

		if ('/wp-admin/admin.php?page=blockera-compat' !== $_SERVER['REQUEST_URI']) {
			return;
		}

		wp_safe_redirect(admin_url());
		exit;
	}

    /**
     * Add menus to the admin dashboard.
	 *
	 * @return void
	 */
    public function adminMenus(): void {

		if (! $this->is_installed_third_party_plugin) {
			return;
		}

        add_submenu_page(
            'blockera-compat',
            __('Blockera Compatibility Check', 'blockera'),
            __('Blockera Compatibility Check', 'blockera'),
            'manage_options',
            'blockera-compat',
            function () {

				if ( $this->is_compatible) {
					wp_safe_redirect(admin_url('admin.php?page=blockera-settings-dashboard'));
					return;
				}

				$plugin_name = $this->utils::pascalCaseWithSpace($this->plugin_slug);
				
				// Get update plugins transient to check for available updates.
				$update_plugins = get_site_transient('update_plugins');
				$update_url     = '';

				if ($update_plugins && isset($update_plugins->response)) {
					// Check if the required plugin has available updates.
					foreach ($update_plugins->response as $plugin_file => $plugin_data) {
						if (false !== strpos($plugin_file, $this->compatible_with_slug)) {
							$id = 'upgrade-plugin_' . $this->compatible_with_slug . '/' . $this->compatible_with_slug . '.php';

							// Standardize update URL to use WordPress core update functionality.							
							$update_url = wp_nonce_url(
								self_admin_url('update.php?action=upgrade-plugin&plugin=' . urlencode($id)),
								'upgrade-plugin_' . $id
							);

							break;
						}
					}
				}

				echo '<script>
					window.blockeraPluginUpdateUrl = "' . $update_url . '";
					window.blockeraPluginName = "' . $plugin_name . '";
					window.blockeraPluginVersion = "' . $this->plugin_version . '";
					window.blockeraIsActiveCompatiblePlugin = ' . $this->isActivePlugin() . ';
					window.blockeraPluginRequiredName = "' . $this->utils::pascalCaseWithSpace($this->compatible_with_slug) . '";
					window.blockeraPluginRequiredVersion = "' . $this->requires_at_least . '";
					window.blockeraPluginRequiredPluginVersion = "' . $this->required_plugin_version . '";
					window.blockeraPluginRequiredPluginSlug = "' . $this->compatible_with_slug . '";
				</script>';

				$base_url = str_replace(ABSPATH, home_url('/'), $this->plugin_path);

				do_action('blockera/compatibility/admin-menus', $base_url, $this);

				if ('development' === $this->app_mode) {
					$filename = 'plugin-compatibility';
				} else {
					$filename = 'plugin-compatibility.min';
				}

				if ('development' === $this->app_mode) {
					$css_filename = 'style.css';
				} else {
					$css_filename = 'style.min.css';
				}

				$asset = $this->plugin_path . '/dist/plugin-compatibility/' . $filename . '.asset.php';
				if (file_exists($asset)) {
					$asset = require $asset;
				}

				wp_enqueue_script(
					'blockera-compat',
					$base_url . '/dist/plugin-compatibility/' . $filename . '.js',
					$asset['dependencies'],
					$asset['version'],
					[
						'in_footer' => true,
					],
				);

				wp_enqueue_style(
					'blockera-compat',
					$base_url . '/dist/plugin-compatibility-styles/' . $css_filename,
					[],
					$asset['version'],
				);

				echo '<div id="root"></div>';
            }
        );
    }
}
