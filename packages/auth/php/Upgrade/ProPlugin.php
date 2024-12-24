<?php

namespace Blockera\Auth\Upgrade;

class ProPlugin {

	/**
	 * The slug of the pro plugin.
	 *
	 * @var string $slug The slug of the plugin.
	 */
	private string $slug;

	/**
	 * The name of the pro plugin.
	 *
	 * @var string $name The name of the plugin.
	 */
	private string $name;

	/**
	 * The download URL of the pro plugin.
	 *
	 * @var string $link The download URL of the plugin.
	 */
	private string $link;

	/**
	 * The version of the pro plugin.
	 *
	 * @var string $version The version of the plugin.
	 */
	private string $version;

	/**
	 * The upgrade instance.
	 *
	 * @var Upgrade $upgrade The upgrade instance.
	 */
	private Upgrade $upgrade;

	/**
	 * ProPlugin constructor.
	 *
	 * @param array $args The arguments.
	 */
	public function __construct( array $args = [] ) {
		array_map(
			function ( $key, $value ) {
				if ( property_exists( $this, $key ) ) {
					$this->{$key} = $value;
				}
			},
			array_keys( $args ),
			$args
		);
	}

	/**
	 * Set the download link.
	 *
	 * @param string $downloadLink The download link.
	 *
	 * @return void
	 */
	public function setLink( string $downloadLink ): void {
		$this->link = $downloadLink;
	}

	/**
	 * Set the upgrade instance.
	 *
	 * @param Upgrade $upgrade The upgrade instance.
	 *
	 * @return void
	 */
	public function setUpgrade( Upgrade $upgrade ): void {
		$this->upgrade = $upgrade;
	}

	/**
	 * Check for plugin update.
	 *
	 * @param \stdClass $transient The transient object.
	 *
	 * @return \stdClass The transient object.
	 */
	public function checkForPluginUpdate( \stdClass $transient ): \stdClass {
		if ( empty( $transient->checked ) ) {
			return $transient;
		}

		// Check if pro version is already installed.
		if ( is_plugin_active( $this->slug . '/blockera-pro.php' ) ) {
			return $transient;
		}

		// Validate the plugin zip file.
		if ( ! $this->upgrade->validatePluginZipFile( $this->slug ) ) {
			return $transient;
		}

		$plugin_info              = new \stdClass();
		$plugin_info->slug        = $this->slug;
		$plugin_info->plugin      = $this->slug . '/' . $this->slug . '.php';
		$plugin_info->new_version = $this->version;
		$plugin_info->url         = 'https://blockera.ai';
		$plugin_info->package     = $this->link;

		// Add our plugin to the transient.
		$transient->response[ $plugin_info->plugin ] = $plugin_info;

		return $transient;
	}

	/**
	 * Plugin API call.
	 *
	 * @param object $result The result object.
	 * @param string $action The action.
	 * @param object $args The arguments.
	 *
	 * @return mixed The result object.
	 */
	public function pluginApiCall( $result, $action, $args ) {
		if ( 'plugin_information' !== $action ) {
			return $result;
		}

		if ( $args->slug !== $this->slug ) {
			return $result;
		}

		$plugin_info          = new \stdClass();
		$plugin_info->name    = $this->name;
		$plugin_info->slug    = $this->slug;
		$plugin_info->version = $this->version;
		$plugin_info->author  = 'blockera.ai';
		// Minimum WP version.
		$plugin_info->requires = '6.6';
		// WP version tested up to.
		$plugin_info->tested        = '6.7';
		$plugin_info->last_updated  = gmdate( 'Y-m-d' );
		// phpcs:disable
		$plugin_info->sections      = array(
			'description' => sprintf( __( '%s Plugin - Includes advanced features', 'blockera' ), $this->name ),
			'changelog'   => __( 'View the changelog at our website', 'blockera' ),
		);
		$plugin_info->download_link = $this->link;

		return $plugin_info;
	}
}
