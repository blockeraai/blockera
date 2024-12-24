<?php

namespace Blockera\Auth\Upgrade;

use Blockera\Auth\Config as AuthConfig;

class Upgrade {

	/**
	 * The plugin installer instance.
	 *
	 * @var PluginInstaller $plugin_installer The plugin installer instance.
	 */
	private PluginInstaller $plugin_installer;

	/**
	 * The subscription name.
	 *
	 * @var string $subscription The subscription name.
	 */
	private string $subscription;

	/**
	 * The allowed plans.
	 *
	 * @var array $allowed_plans The allowed plans.
	 */
	private array $allowed_plans;

	/**
	 * The auth config instance.
	 *
	 * @var AuthConfig $config The auth config instance.
	 */
	private AuthConfig $config;

	/**
	 * Construct the Upgrade class.
	 *
	 * @param PluginInstaller $plugin_installer The plugin installer instance.
	 * @param array           $args The arguments.
	 */
	public function __construct( PluginInstaller $plugin_installer, array $args = [] ) {
		$this->plugin_installer = $plugin_installer;
		$this->config = $args['authConfig'];
		$this->subscription = $args['subscription'] ?? '';
		$this->allowed_plans = $args['allowed_plans'] ?? [];

		if ( isset( $_GET['install_plugin'] ) ) {
			$this->installRequiredPlugins();
		}

		if ( ! empty( $this->subscription ) && in_array( $this->subscription, $this->allowed_plans, true ) ) {
			add_action( 'admin_notices', [ $this, 'addInstallAndActivateNotice' ] );
		}
	}

	/**
	 * Add a notice in WordPress admin to install and activate the pro plugin suitable for the current subscription.
	 *
	 * @return void
	 */
	public function addInstallAndActivateNotice(): void {
		ob_start();

		include __DIR__ . '/notices/install-notice.php';

		$notice = ob_get_clean();

		echo $notice;
	}

	/**
	 * Install required plugins.
	 *
	 * @return void
	 */
	public function installRequiredPlugins(): void {
		$this->plugin_installer->installPlugin( $_GET['install_plugin'] );

		wp_redirect( admin_url( 'plugins.php' ) );
		exit;
	}

	/**
	 * Validate the plugin zip file.
	 *
	 * @param string $slug The slug of the plugin.
	 *
	 * @return bool True if the plugin zip file is valid, false otherwise.
	 */
	public function validatePluginZipFile( string $slug ): bool {
		$response = wp_remote_post(
			$this->config::getZipFileURL(),
			[
				'timeout'     => 30,
				'redirection' => 5,
				'httpversion' => '1.1',
				// Disable SSL verification.
				'sslverify'   => false,
				'headers'     => [
					'Content-Type'     => 'application/json',
					'Referer'          => admin_url( '/update-core.php' ),
					'Authorization'    => 'Bearer ' . $this->config::getToken(),
					'X-Blockera-Nonce' => wp_create_nonce( 'blockera-site-toolkit' ),
				],
				'body'        => [
					'slug' => $slug,
				],
			]
		);

		if ( is_wp_error( $response ) ) {
			return false;
		}

		$responseBody = json_decode( wp_remote_retrieve_body( $response ), true );

		return ! empty( $responseBody['data']['success'] ) && true === $responseBody['data']['success'];
	}
}
