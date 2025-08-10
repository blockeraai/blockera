<?php

namespace Blockera\PluginCompatibility;

use Blockera\Utils\Utils;

class CompatibilityCheck {

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
	 * Store the cache key.
	 *
	 * @var string $cache_key the cache key.
	 */
	protected string $cache_key = 'blockera-compat-redirect';

    /**
     * Static access to the instance of the class.
     *
     * @return static
     */
    public static function getInstance(): static {

        if (null === static::$instance) {
            static::$instance = new static();
        }

        return static::$instance;
    }

    /**
     * Checkup version compatibility between Blockera and Blockera Pro.
	 * 
	 * @param array $plugin_args the plugin arguments.
     *
     * @return void
     */
    public function run( array $plugin_args): void {

		$this->setProps($plugin_args);

        add_action('plugins_loaded', [ $this, 'load' ], 1);

        add_action('admin_init', [ $this, 'adminInitialize' ]);

        add_action('admin_menu', [ $this, 'adminMenus' ]);
    }

	/**
	 * Set the properties of the class.
	 *
	 * @param array $plugin_args the plugin arguments.
	 *
	 * @return void
	 */
	public function setProps( array $plugin_args): void {

		$this->app_mode             = $plugin_args['mode'];
		$this->plugin_path          = $plugin_args['plugin_path'];
		$this->plugin_file          = $plugin_args['file'];
		$this->plugin_slug          = $plugin_args['slug'];
		$this->plugin_version       = $plugin_args['version'];
		$this->callback             = $plugin_args['callback'] ?? null;
		$this->compatible_with_slug = $plugin_args['compatible_with_slug'];

		if (! function_exists('get_plugin_data')) {
			require_once ABSPATH . 'wp-admin/includes/plugin.php';
		}

		$required_plugin_data = get_plugin_data(WP_PLUGIN_DIR . '/' . $this->compatible_with_slug . '/' . $this->compatible_with_slug . '.php');
		if (isset($required_plugin_data['Version'])) {
			$this->required_plugin_version = $required_plugin_data['Version'];
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

        $this->checkVersions(
            function (){
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
			}
        );
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

        if (! is_admin() || ! current_user_can('update_plugins')) {
            return;
        }
        if (! get_transient($this->cache_key)) {
            return;
        }
        
		$this->checkVersions(
            function (){
				// Delete the transient.
				delete_transient($this->cache_key);
			},
            true
        );

        // Avoid redirect loops.
        if (isset($_GET['page']) && 'blockera-compat' === $_GET['page']) {
            return;
        }

        wp_safe_redirect(admin_url('admin.php?page=blockera-compat'));
        exit;
    }

    /**
     * Add menus to the admin dashboard.
	 *
	 * @return void
	 */
    public function adminMenus(): void {

        add_submenu_page(
            'blockera-compat',
            __('Blockera Compatibility Check', 'blockera'),
            __('Blockera Compatibility Check', 'blockera'),
            'manage_options',
            'blockera-compat',
            function () {

				$plugin_name = Utils::pascalCaseWithSpace($this->plugin_slug);

				echo '<script>
					window.blockeraPluginName = "' . $plugin_name . '";
					window.blockeraPluginVersion = "' . $this->plugin_version . '";
					window.blockeraPluginRequiredVersion = "' . $this->requires_at_least . '";
					window.blockeraPluginRequiredPluginVersion = "' . $this->required_plugin_version . '";
					window.blockeraPluginRequiredPluginSlug = "' . $this->compatible_with_slug . '";
				</script>';

				$base_url = str_replace(ABSPATH, home_url('/'), $this->plugin_path);

				if ('development' === $this->app_mode) {
					$filename = 'plugin-compatibility.js';
				} else {
					$filename = 'plugin-compatibility.min.js';
				}

				if ('development' === $this->app_mode) {
					$css_filename = 'style.css';
				} else {
					$css_filename = 'style.min.css';
				}

				$asset = $this->plugin_path . '/dist/plugin-compatibility/plugin-compatibility.asset.php';
				if (file_exists($asset)) {
					$asset = require $asset;
				}

				wp_enqueue_script(
					'blockera-compat',
					$base_url . '/dist/plugin-compatibility/' . $filename,
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
