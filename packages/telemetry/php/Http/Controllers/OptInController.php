<?php

namespace Blockera\Telemetry\Http\Controllers;

use Blockera\Telemetry\Config;
use Blockera\Http\RestController;
use Blockera\Exceptions\BaseException;
use Blockera\Telemetry\DataProviders\DebugDataProvider;
use Illuminate\Contracts\Container\BindingResolutionException;

/**
 * Class OptInController for handling requests to related endpoints.
 *
 * @package Blockera\Telemetry\Http\Controllers\SettingsController
 */
class OptInController extends RestController {

	/**
	 * Checking user permission.
	 *
	 * @param \WP_REST_Request $request the request object.
	 *
	 * @return bool true on success, false on otherwise.
	 */
	public function permission( \WP_REST_Request $request ): bool {

		return current_user_can( 'manage_options' );
	}

	/**
	 * Response for recieved request based on type.
	 *
	 * @param \WP_REST_Request $request the request object.
	 *
	 * @throws BaseException | BindingResolutionException The exception fired by validation.
	 *
	 * @return \WP_REST_Response the response object.
	 */
	public function optIn( \WP_REST_Request $request ): \WP_REST_Response {

		$params     = $request->get_params();
		$option_key = Config::getOptionKeys( 'opt_in_status' );
		try {

			$this->validate( $params, $option_key );

			// We're being sure of user agreed to opt-in https://api.blockera.ai.
			if ( 'SKIP' === $params['opt-in-agreed'] ) {

				// Don't show the opt-in modal again.
				$updated = update_option( $option_key, $params['opt-in-agreed'] );

				if ( ! $updated ) {

					throw new BaseException( __( 'Server Error, please try again.', 'blockera' ), 500 );
				}

				throw new BaseException( __( 'Your successfully skipped opt-in to Blockera Info!', 'blockera' ), 200 );
			}

			return $this->register( $option_key );

		} catch ( BaseException $exception ) {

			return new \WP_REST_Response(
				[
					'code'    => $exception->getCode(),
					'success' => false,
					'data'    => [
						'message' => $exception->getMessage(),
					],
				],
				$exception->getCode()
			);
		}
	}

	/**
	 * Gets the current user's details.
	 *
	 * @since 1.0.0
	 * @since 2.0.0 - Add support for passing stellar_slug directly.
	 *
	 * @return array
	 */
	protected function getUserDetails(): array {

		$user = wp_get_current_user();

		return [
			'email' => $user->user_email,
			'name'  => $user->display_name,
		];
	}

	/**
	 * Validate request.
	 *
	 * @param array  $params     the request params.
	 * @param string $option_key the opt-in status option key.
	 *
	 * @throws BaseException The exception fired on validation.
	 * @return void
	 */
	protected function validate( array $params, string $option_key ): void {

		// We're not continue an action while not verified "nonce" field!
		if ( ! wp_verify_nonce( Config::getRestParams( 'nonce' ), 'blockera-telemetry-nonce' ) ) {

			throw new BaseException( __( 'Unauthorized!', 'blockera' ), 401 );
		}

		// We're not attempting a telemetry action or the user did not respond to the opt-in modal.
		if ( isset( $params['action'] ) && 'telemetry-opt-in-status' !== $params['action'] || ! isset( $params['opt-in-agreed'] ) ) {

			throw new BaseException( __( 'Bad Request!', 'blockera' ), 400 );
		}

		if ( in_array( get_option( $option_key ), [ 'ALLOW', 'SKIP' ], true ) ) {

			throw new BaseException( __( "You're already opted in! Thanks for staying with us. If there's anything you need, feel free to reach out!", 'blockera' ), 200 );
		}
	}

	/**
	 * Registration user and site data.
	 *
	 * @param string $option_key the opt-in status option key.
	 *
	 * @throws BindingResolutionException|BaseException The exception fired on binding resolution or invalid response.
	 *
	 * @return \WP_REST_Response the instance of \WP_REST_Response.
	 */
	protected function register( string $option_key ): \WP_REST_Response {

		$user_id = get_option( Config::getOptionKeys( 'user_id' ) );
		$token   = get_option( Config::getOptionKeys( 'token' ) );

		if ( $user_id && $token ) {

			return $this->updateOptIn();
		}

		// Send to https://api.blockera.ai.
		$result = $this->sender->post(
			Config::getServerURL( '/user/register' ),
			[
				'headers' => [
					'Accept' => 'application/json',
				],
				'body'    => $this->getUserDetails(),
			]
		);

		// Server error respond!
		if ( is_wp_error( $result ) ) {

			throw new BaseException( $result->get_error_message(), 500 );
		}

		$response = $this->sender->getResponseBody( $result );

		$this->handleServerError( $response );

		$token   = $response['data']['token'];
		$user_id = $response['data']['user_id'];

		// Store ...
		update_option( Config::getOptionKeys( 'token' ), $token );
		update_option( Config::getOptionKeys( 'user_id' ), $user_id );

		$name        = get_bloginfo( 'name', 'display' );
		$description = get_bloginfo( 'description', 'display' );

		/**
		 * @var DebugDataProvider $debug_data_provider the instance of DebugDataProvider class.
		 */
		$debug_data_provider = $this->app->make( DebugDataProvider::class );
		$metadata            = $debug_data_provider->getSiteData();

		$metadata['product-slugs'][] = Config::getRestParams( 'slug' );

		$fields = $metadata['wp-core']['fields'];
		$url    = $fields['site_url']['value'];

		$result = $this->sender->post(
			Config::getServerURL( '/sites' ),
			[
				'headers' => [
					'Accept'        => 'application/json',
					'Authorization' => 'Bearer ' . $token,
				],
				'body'    => compact( 'user_id', 'metadata', 'url', 'name', 'description' ),
			]
		);

		// Server error respond!
		if ( is_wp_error( $result ) ) {

			throw new BaseException( $result->get_error_message(), 500 );
		}

		$response = $this->sender->getResponseBody( $result );

		$this->handleServerError( $response );

		$site_id = $response['data']['site_id'];

		$updated_site_id       = update_option( Config::getOptionKeys( 'site_id' ), $site_id );
		$updated_opt_in_status = update_option( $option_key, 'ALLOW' ); // Don't show the opt-in modal again.

		if ( ! $updated_site_id ) {

			throw new BaseException( __( 'Not registered site information.', 'blockera' ), 500 );
		}

		if ( ! $updated_opt_in_status ) {

			throw new BaseException( __( 'Failed update opt-in status.', 'blockera' ), 500 );
		}

		return new \WP_REST_Response(
			[
				'code'    => 200,
				'success' => true,
				'data'    => [
					'message' => __( 'Congratulation 🎉', 'blockera' ),
				],
			],
			200
		);
	}

	/**
	 * Handling server error.
	 *
	 * @param array $response the server response.
	 *
	 * @throws BaseException The exception fired while recieved the server errors.
	 * @return void
	 */
	protected function handleServerError( array $response ): void {

		if ( isset( $response['errors'] ) ) {

			$last_error = array_key_last( $response['errors'] );

			throw new BaseException(
				$response['errors']['message'] ?? implode(
					', ',
					array_map(
						static function ( array $item, $key ) use ( $last_error ): string {

							return $last_error === $key ? $item[0] : str_replace( '.', '', $item[0] );
						},
						$response['errors'],
						array_keys( $response['errors'] )
					)
				),
				$response['code']
			);

		} elseif ( isset( $response['message'] ) && 'Unauthenticated.' === $response['message'] ) {

			throw new BaseException( $response['message'], 401 );
		}
	}

	/**
	 *
	 * @throws BindingResolutionException|BaseException The exception fired while occurred errors or update process fails.
	 * @return \WP_REST_Response the instance of WP_REST_Response.
	 */
	protected function updateOptIn(): \WP_REST_Response {

		$token   = get_option( Config::getOptionKeys( 'token' ) );
		$user_id = get_option( Config::getOptionKeys( 'user_id' ) );
		$site_id = get_option( Config::getOptionKeys( 'site_id' ) );

		if ( $token && $user_id ) {

			$name        = get_bloginfo( 'name', 'display' );
			$description = get_bloginfo( 'description', 'display' );

			/**
			 * @var DebugDataProvider $debug_data_provider the instance of DebugDataProvider class.
			 */
			$data_provider = $this->app->make( DebugDataProvider::class );
			$metadata      = $data_provider->getSiteData();

			$metadata['product-slugs'][] = Config::getRestParams( 'slug' );

			$url = $metadata['wp-core']['fields']['site_url']['value'];

			$result = $this->sender->post(
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

			// Server error respond!
			if ( is_wp_error( $result ) ) {

				throw new BaseException( $result->get_error_message(), 500 );
			}

			$response = $this->sender->getResponseBody( $result );

			$this->handleServerError( $response );

			// User opted-in.
			update_option( Config::getOptionKeys( 'opt_in_status' ), 'ALLOW' );

			return new \WP_REST_Response(
				[
					'code'    => 200,
					'success' => true,
					'data'    => [
						'message' => __( 'Congratulation 🎉', 'blockera' ),
					],
				],
				200
			);
		}

		throw new BaseException( __( 'Token or User ID was not exists!', 'blockera' ), 500 );
	}

}
