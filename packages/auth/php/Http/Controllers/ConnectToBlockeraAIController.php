<?php

namespace Blockera\Auth\Http\Controllers;

use Blockera\Http\RestController;

class ConnectToBlockeraAIController extends RestController {

	/**
	 * Store validation errors.
	 *
	 * @var array
	 */
	protected $errors = [];

	/**
	 * Check if the user has permission to access the resource.
	 *
	 * @param \WP_REST_Request $request The request object.
	 * @return bool Whether the user has permission.
	 */
	public function permission( \WP_REST_Request $request ): bool {
		if ( ! current_user_can( 'manage_options' ) ) {
			return false;
		}

		return wp_verify_nonce( $request->get_header( 'X-Blockera-Nonce' ), 'blockera-connect-with-your-account' );
	}

	/**
	 * Connect to Blockera AI.
	 *
	 * @param \WP_REST_Request $request The request object.
	 * @return \WP_REST_Response The response object.
	 */
	public function connectAccount( \WP_REST_Request $request ): \WP_REST_Response {
		$this->validate( $request->get_params(), true );

		if ( count( $this->errors ) > 0 ) {
			return new \WP_REST_Response(
				[
					'code'    => 400,
					'success' => false,
					'errors'  => $this->errors,
				],
				400
			);
		}

		$updated_expires              = update_option( 'blockera-expires', $request->get_param( 'expires' ) );
		$updated_access_token         = update_option( 'blockera-access-token', $request->get_param( 'access_token' ) );
		$updated_has_expired          = update_option( 'blockera-has-expired', $request->get_param( 'has_expired' ) );
		$updated_refresh_access_token = update_option( 'blockera-refresh-access-token', $request->get_param( 'refresh_token' ) );

		if ( ! $updated_expires || ! $updated_access_token || ! $updated_has_expired || ! $updated_refresh_access_token ) {
			return new \WP_REST_Response(
				[
					'code'    => 500,
					'success' => false,
					'errors'  => [
						'failed_to_update_expires'      => __( 'Failed to update expires.', 'blockera' ),
						'failed_to_update_access_token' => __( 'Failed to update access token.', 'blockera' ),
						'failed_to_update_has_expired'  => __( 'Failed to update has expired.', 'blockera' ),
						'failed_to_update_refresh_access_token' => __( 'Failed to update refresh access token.', 'blockera' ),
					],
				],
				500
			);
		}

		return new \WP_REST_Response(
			[
				'code'    => 200,
				'success' => true,
				'data'    => [
					'message' => __( 'Connected to Blockera AI successfully.', 'blockera' ),
				],
			]
		);
	}

	/**
	 * Create an account.
	 *
	 * @param \WP_REST_Request $request The request object.
	 * @return \WP_REST_Response The response object.
	 */
	public function createAccount( \WP_REST_Request $request ): \WP_REST_Response {
		$this->validate( $request->get_params(), true );

		if ( count( $this->errors ) > 0 ) {
			return new \WP_REST_Response(
				[
					'code'    => 400,
					'success' => false,
					'errors'  => $this->errors,
				],
				400
			);
		}

		$updated_auth_code     = update_option( 'blockera-auth-code', $request->get_param( 'code' ) );
		$updated_client_id     = update_option( 'blockera-client-id', $request->get_param( 'client_id' ) );
		$updated_client_secret = update_option( 'blockera-client-secret', $request->get_param( 'client_secret' ) );

		if ( ! $updated_auth_code || ! $updated_client_id || ! $updated_client_secret ) {
			return new \WP_REST_Response(
				[
					'code'    => 500,
					'success' => false,
					'errors'  => [
						'failed_to_update_client_id'     => __( 'Failed to update client ID.', 'blockera' ),
						'failed_to_update_auth_code'     => __( 'Failed to update authorization code.', 'blockera' ),
						'failed_to_update_client_secret' => __( 'Failed to update client secret.', 'blockera' ),
					],
				],
				500
			);
		}

		return new \WP_REST_Response(
			[
				'code'    => 200,
				'success' => true,
				'data'    => [
					'message' => __( 'Account created successfully.', 'blockera' ),
				],
			]
		);
	}

	/**
	 * Check if the user is connected to https://blockera.ai bought subscription.
	 *
	 * @param \WP_REST_Request $request The request object.
	 * @return \WP_REST_Response The response object.
	 */
	public function isConnected( \WP_REST_Request $request ): \WP_REST_Response {
		$this->validate( $request->get_params(), false );

		if ( count( $this->errors ) > 0 ) {
			return new \WP_REST_Response(
				[
					'code'    => 400,
					'success' => false,
					'errors'  => $this->errors,
				],
				400
			);
		}

		$is_connected = sanitize_text_field( $request->get_param( 'is-connected' ) );
		$connected    = update_option( 'blockera-is-connected-with-subscription', $is_connected );

		if ( ! $connected ) {
			$this->errors['update_failed'] = __( 'Failed to update connection status.', 'blockera' );

			return new \WP_REST_Response(
				[
					'code'    => 500,
					'success' => false,
					'errors'  => $this->errors,
				],
				500
			);
		}

		return new \WP_REST_Response(
			[
				'code'    => 200,
				'success' => true,
				'data'    => [
					'is-connected' => $is_connected,
				],
			]
		);
	}

	/**
	 * Validate the request parameters.
	 *
	 * @param array  $params The request parameters.
	 * @param string $action The action to be performed.
	 * @return void
	 */
	protected function validate( array $params, string $action = 'create_account' ): void {
		$required_params = [
			'action' => __( 'Action Field is required.', 'blockera' ),
		];

		if ( 'create_account' === $action ) {
			$required_params['client_id']     = __( 'Client ID Field is required.', 'blockera' );
			$required_params['code']          = __( 'Authorization Code Field is required.', 'blockera' );
			$required_params['client_secret'] = __( 'Client Secret Field is required.', 'blockera' );
		} elseif ( 'connect_account' === $action ) {
			$required_params['token'] = __( 'Access Token Field is required.', 'blockera' );
		} elseif ( 'is_connected' === $action ) {
			$required_params['is-connected'] = __( 'Connection Status Field is required.', 'blockera' );
		}

		$available_actions = [
			'is_connected',
			'create_account',
			'connect_account',
		];

		foreach ( $required_params as $param => $message ) {
			if ( empty( $params[ $param ] ) ) {
				$this->errors[ $param ] = $message;
			}
			if ( 'action' === $param && ! in_array( $params[ $param ], $available_actions, true ) ) {
				$this->errors['invalid_action'] = __( 'Invalid action.', 'blockera' );
			}
		}
	}
}
