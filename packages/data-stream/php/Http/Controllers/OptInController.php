<?php

namespace Blockera\DataStream\Http\Controllers;

use Blockera\DataStream\Config;
use Blockera\Http\RestController;

/**
 * Class OptInController for handling requests to related endpoints.
 *
 * @package Blockera\DataStream\Http\Controllers\SettingsController
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

		return current_user_can( 'activate_plugins' );
	}

	/**
	 * Response for recieved request based on type.
	 *
	 * @param \WP_REST_Request $request the request object.
	 *
	 * @return \WP_REST_Response the response object.
	 */
	public function optIn( \WP_REST_Request $request ): \WP_REST_Response {

		$params = $request->get_params();

		// We're not continue an action while not verified "nonce" field!
		if ( ! wp_verify_nonce( Config::getRestParams( 'nonce' ), 'blockera-data-stream-nonce' ) ) {

			return new \WP_REST_Response(
				[
					'code'    => 401,
					'success' => false,
					'data'    => [
						'message' => __( 'Unauthorized!', 'blockera' ),
					],
				],
				401
			);
		}

		$option_key = Config::getOptionKeys( 'opt_in_status' );

		// We're not attempting a data-stream action or the user did not respond to the opt-in modal.
		if ( isset( $params['action'] ) && $option_key !== $params['action'] || ! isset( $params['opt-in-agreed'] ) ) {

			return new \WP_REST_Response(
				[
					'code'    => 400,
					'success' => false,
					'data'    => [
						'message' => __( 'Bad Request!', 'blockera' ),
					],
				],
				400
			);
		}

		// We're being sure of user agreed to opt-in https://api.blockera.ai.
		if ( 'SKIP' === $params['opt-in-agreed'] ) {

			// Don't show the opt-in modal again.
			$updated = update_option( $option_key, $params['opt-in-agreed'] );

			return new \WP_REST_Response(
				[
					'code'    => $updated ? 200 : 500,
					'success' => $updated,
					'data'    => [
						'message' => $updated ? __( 'Your successfully skipped opt-in to Blockera Info!', 'blockera' ) : __( 'Server Error, please try again.', 'blockera' ),
					],
				],
				$updated ? 200 : 500
			);
		}

		// Send to https://api.blockera.ai.
		$result = $this->sender->post( Config::getServerURL(), $this->getUserDetails() );

		// Server error respond!
		if ( is_wp_error( $result ) ) {

			return new \WP_REST_Response(
				[
					'code'    => $result->get_error_code(),
					'success' => false,
					'data'    => [
						'message' => $result->get_error_message(),
					],
				],
				$result->get_error_code()
			);
		}

		// Don't show the opt-in modal again.
		$updated = update_option( $option_key, 'ALLOW' );

		if ( ! $updated ) {

			return new \WP_REST_Response(
				[
					'code'    => 500,
					'success' => false,
					'data'    => [
						'message' => __( 'Failed update process.', 'blockera' ),
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
					'message' => __( 'congratulation 🎉', 'blockera' ),
				],
			],
			200
		);
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
			'email'        => $user->user_email,
			'name'         => $user->display_name,
			'product_slug' => Config::getRestParams( 'slug' ),
		];
	}

}
