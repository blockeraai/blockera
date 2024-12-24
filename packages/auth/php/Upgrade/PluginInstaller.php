<?php

namespace Blockera\Auth\Upgrade;

use Blockera\Auth\Config as AuthConfig;

class PluginInstaller {

	/**
	 * The plugins to install.
	 *
	 * @var array
	 */
	private $plugin = [];

	/**
	 * The subscription.
	 *
	 * @var array
	 */
	private $subscription = [];

	/**
	 * PluginInstaller constructor.
	 *
	 * @param array $plugin The plugin.
	 * @param array $allowedPlans The allowed plans.
	 */
	public function __construct( array $plugin, array $allowedPlans = [] ) {
		$this->subscription = AuthConfig::getSubscription();

		if ( in_array( $subscription['subscription_name'] ?? '', $allowedPlans, true ) ) {
			// Initialize required plugins.
			$this->plugin = $plugin;

			// Add hooks.
			add_action( 'tgmpa_register', array( $this, 'registerRequiredPlugins' ) );
			add_action( 'admin_notices', array( $this, 'installPluginsNotice' ) );
		}
	}

	/**
	 * Register required plugins
	 */
	public function registerRequiredPlugins(): void {
		// TGM Plugin Activation.
		$config = array(
			'id'           => 'blockera',
			'default_path' => '',
			'menu'         => 'install-required-plugins',
			'parent_slug'  => 'plugins.php',
			'capability'   => 'manage_options',
			'has_notices'  => true,
			'dismissable'  => false,
		);

		tgmpa( [ $this->plugin ], $config );
	}

	/**
	 * Install plugin programmatically.
	 *
	 * @param string $plugin_slug The slug of the plugin.
	 *
	 * @throws \Exception If the plugin is not installed.
	 *
	 * @return bool true if the plugin is installed, false otherwise.
	 */
	public function installPlugin( string $plugin_slug ): bool {
		include_once ABSPATH . 'wp-admin/includes/class-wp-upgrader.php';
		include_once ABSPATH . 'wp-admin/includes/plugin-install.php';

		// Check if plugin is installed.
		if ( self::isPluginInstalled( $plugin_slug ) ) {
			return true;
		}

		$request = new \WP_REST_Request( 'POST', AuthConfig::getZipFileURL() );
		$request->set_body_params(
			[
				'domain'          => home_url(),
				'client_id'       => $this->subscription['client_id'],
				'subscription_id' => $this->subscription['subscription_id'],
			]
		);
		$response = rest_do_request( $request );

		if ( is_wp_error( $response ) ) {
			return false;
		}

		$body = $response->get_data();

		if ( 200 !== $body['code'] ) {
			return false;
		}

		// Get plugin info from WordPress.org.
		$api = plugins_api(
			'plugin_information',
			array(
				'slug'   => $plugin_slug,
				'fields' => array(
					'short_description' => false,
					'sections'          => false,
					'requires'          => false,
					'rating'            => false,
					'ratings'           => false,
					'downloaded'        => false,
					'last_updated'      => false,
					'added'             => false,
					'tags'              => false,
					'compatibility'     => false,
					'homepage'          => false,
					'donate_link'       => false,
					'download_link'     => $body['data']['download_link'],
				),
			)
		);

		if ( is_wp_error( $api ) ) {
			return false;
		}

		if ( ! function_exists( 'request_filesystem_credentials' ) ) {
			require_once ABSPATH . 'wp-admin/includes/file.php';
		}

		// Install the plugin.
		$upgrader = new \Plugin_Upgrader( new \WP_Ajax_Upgrader_Skin() );
		$install  = $upgrader->install( $api->download_link );

		if ( is_wp_error( $install ) ) {
			return false;
		}

		// Activate the plugin.
		$activatedPlugin = activate_plugin( $plugin_slug . '/' . $plugin_slug . 'php' );

		if ( is_wp_error( $activatedPlugin ) ) {
			throw new \Exception( $activatedPlugin->get_error_message() );
		}

		return true;
	}

	/**
	 * Check if plugin is installed.
	 *
	 * @param string $plugin_slug The slug of the plugin.
	 *
	 * @return bool true if the plugin is installed, false otherwise.
	 */
	public static function isPluginInstalled( string $plugin_slug ): bool {
		$installed_plugins = get_plugins();

		return isset( $installed_plugins[ $plugin_slug . '/' . $plugin_slug . '.php' ] );
	}

	/**
	 * Display admin notice for plugin installation.
	 *
	 * @return void
	 */
	public function installPluginsNotice(): void {
		if ( ! current_user_can( 'install_plugins' ) ) {
			return;
		}

		if ( ! self::isPluginInstalled( $this->plugin['slug'] ) ) {
			?>
			<div class="notice notice-warning is-dismissible">
				<p>
					<?php
					// phpcs:disable
					/* translators: %s: Plugin name */
					printf(
						__( 'The %s plugin is required. Please install and activate it.', 'blockera' ),
						'<strong>' . esc_html( $this->plugin['name'] ) . '</strong>'
					);
					?>
				</p>
				<p>
					<a href="
					<?php
					echo esc_url(
						wp_nonce_url(
							add_query_arg(
								array(
									'action' => 'install-plugin',
									'plugin' => $this->plugin['slug'],
								),
								admin_url( 'update.php' )
							),
							'install-plugin_' . $this->plugin['slug']
						)
					);
					?>
								" class="button button-primary">
						<?php _e( 'Install Now', 'blockera' ); ?>
					</a>
				</p>
			</div>
			<?php
		}
	}
}
