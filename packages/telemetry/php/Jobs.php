<?php

namespace Blockera\Telemetry;

use Blockera\Telemetry\DataProviders\DataProvider;
use Blockera\WordPress\Sender;
use Blockera\Telemetry\DataProviders\DebugDataProvider;

class Jobs {

	/**
	 * @var array $config the config array.
	 */
	protected array $config = [];

	/**
	 * @var Sender $sender the sender instance.
	 */
	protected Sender $sender;

	/**
	 * @param Sender $sender      the sender instance.
	 * @param string $plugin_file the plugin main file path.
	 * @param array  $config      the config array.
	 */
	public function __construct( Sender $sender, string $plugin_file, array $config ) {

		if ( ! blockera_telemetry_is_off() ) {

			$this->sender = $sender;
			$this->config = $config;

			add_filter( 'cron_schedules', [ $this, 'addCronInterval' ] );
			add_action( 'blockera_each_six_days', [ $this, 'doRefreshToken' ] );
			add_action( 'blockera_each_seven_days', [ $this, 'doUpdateRegisteredData' ] );

			register_activation_hook( $plugin_file, [ $this, 'activationHook' ] );
			register_deactivation_hook( $plugin_file, [ $this, 'deactivationHook' ] );
		}
	}

	/**
	 * Add the 6 days schedule on stack.
	 *
	 * @param array $schedules The schedules array.
	 *
	 * @return array the new schedules array.
	 */
	public function addCronInterval( array $schedules ): array {

		$schedules['blockera_6_days'] = array(
			'interval' => 60 * 60 * 24 * 6,
			'display'  => esc_html__( 'Every 6 Days', 'blockera' ),
		);
		$schedules['blockera_7_days'] = array(
			'interval' => 60 * 60 * 24 * 7,
			'display'  => esc_html__( 'Every 7 Days', 'blockera' ),
		);

		return $schedules;
	}

	/**
	 * @return string the stored option or empty from database.
	 */
	protected function getOption( string $key ): string {

		$built_in_key = Config::getOptionKeys( $key );

		if ( is_string( $built_in_key ) && ! empty( $built_in_key ) ) {

			$value = get_option( $built_in_key );

			if ( ! $value ) {

				return '';
			}

			return $value;
		}

		if ( empty( $this->config['options'][ $key ] ) ) {

			return '';
		}

		$value = get_option( $this->config['options'][ $key ] );

		if ( ! $value ) {

			return '';
		}

		return $value;
	}

	/**
	 * Doing refresh token request of server after each 6 days.
	 *
	 * @return void
	 */
	public function doRefreshToken(): void {

		$token = $this->getOption( 'token' );

		if ( $token ) {

			$response = $this->sender->get(
				Config::getServerURL( '/refresh-token' ),
				[
					'headers' => [
						'Accept'        => 'application/json',
						'Authorization' => 'Bearer ' . $token,
					],
				]
			);

			if ( ! is_wp_error( $response ) ) {

				$response = $this->sender->getResponseBody( $response );

				// Update the token recieved from server.
				echo update_option( $this->config['options']['token'], $response['data']['token'] );
			}
		}
	}

	/**
	 * Doing update registered data by connecting with data providers to fetch new data and ,
	 * send them to the server after each 7 days.
	 *
	 * @return void
	 */
	public function doUpdateRegisteredData(): void {

		$token   = $this->getOption( 'token' );
		$user_id = $this->getOption( 'user_id' );
		$site_id = $this->getOption( 'site_id' );

		if ( $token && $user_id ) {

			$name        = $this->config['rest_params']['slug'];
			$description = get_bloginfo( 'description', 'display' );

			$data_provider = new DebugDataProvider();
			$metadata      = $data_provider->getSiteData();
			$fields        = $metadata['wp-core']['fields'];
			$url           = $fields['site_url']['value'];

			$this->sender->post(
				Config::getServerURL( '/sites/' . $site_id ),
				[
					'method'  => 'PUT',
					'headers' => [
						'Accept'        => 'application/json',
						'Authorization' => 'Bearer ' . $token,
					],
					'body'    => compact( 'user_id', 'metadata', 'url', 'name', 'description' ),
				]
			);
		}
	}

	/**
	 * Activation plugin hook.
	 *
	 * @return void
	 */
	public function activationHook(): void {

		if ( ! wp_next_scheduled( 'blockera_each_six_days' ) ) {

			wp_schedule_event( time(), 'blockera_6_days', 'blockera_each_six_days' );
		}
		if ( ! wp_next_scheduled( 'blockera_each_seven_days' ) ) {

			wp_schedule_event( time(), 'blockera_7_days', 'blockera_each_seven_days' );
		}

		add_option( $this->config['rest_params']['slug'] . '_do_activation_redirect', true );
	}

	/**
	 * Deactivation plugin hook.
	 *
	 * @return void
	 */
	public function deactivationHook(): void {

		wp_clear_scheduled_hook( 'blockera_each_six_days' );
		wp_clear_scheduled_hook( 'blockera_each_seven_days' );
	}

	/**
	 * Redirecting your WordPress admin to your plugin dashboard page after activation it.
	 *
	 * @return void
	 */
	public function redirectToDashboard(): void {

		$option = $this->config['rest_params']['slug'] . '_do_activation_redirect';

		// Check if the redirect flag is set and the user has sufficient permissions.
		if ( get_option( $option, false ) ) {

			delete_option( $option );

			if ( is_admin() && current_user_can( 'activate_plugins' ) ) {

				// Redirect to plugin dashboard or settings page.
				wp_redirect( admin_url( 'admin.php?page=' . $this->config['dashboard_page'] ) );
				exit;
			}
		}
	}

}
