<?php

namespace Blockera\Telemetry;

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
	 * @param array  $config      the config array.
	 */
	public function __construct( Sender $sender, array $config ) {

		if ( ! blockera_telemetry_opt_in_is_off( 'blockera' ) ) {

			$this->sender = $sender;
			$this->config = $config;

			add_action( 'blockera_each_six_days', [ $this, 'doRefreshToken' ] );
			add_action( 'blockera_each_seven_days', [ $this, 'doUpdateRegisteredData' ] );
		}
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

			$response = $this->sender->post(
				Config::getServerURL( '/auth/refresh-token' ),
				[
					'headers' => [
						'Accept'        => 'application/json',
						'Authorization' => 'Bearer ' . $token,
					],
				]
			);

			if ( ! is_wp_error( $response ) ) {

				$response = $this->sender->getResponseBody( $response );

				if ( isset( $response['data']['token'] ) ) {

					// Update the token recieved from server.
					update_option( Config::getOptionKeys( 'token' ), $response['data']['token'] );
				}
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
}
