<?php

namespace Blockera\Admin\Http\Controllers;

use Blockera\Http\RestController;

/**
 * Class BlockeraSettingsController for handling requests to related endpoints.
 *
 * @package Blockera\Admin\Http\Controllers\SettingsController
 */
class SettingsController extends RestController {

	/**
	 * Store panel option key.
	 *
	 * @var string $option_key the panel option key.
	 */
	protected string $option_key = 'blockera_settings';

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
	 * Get blockera settings.
	 *
	 * @param \WP_REST_Request $request the request object.
	 *
	 * @return \WP_REST_Response the response object.
	 */
	public function index( \WP_REST_Request $request ): \WP_REST_Response {

		$settings = get_option( $this->option_key, [ 'disabledBlocks' => [] ] );

		if ( $settings ) {

			return new \WP_REST_Response(
				[
					'code'    => 200,
					'success' => true,
					'data'    => $settings,
				],
				200
			);

		}

		return new \WP_REST_Response(
			[
				'code'    => 404,
				'success' => false,
				'data'    => [
					'message' => __( 'Something went wrong, the blockera settings could not be found.', 'blockera' ),
				],
			],
			404
		);
	}

	/**
	 * Response for recieved request based on type.
	 *
	 * @param \WP_REST_Request $request the request object.
	 *
	 * @return \WP_REST_Response the response object.
	 */
	public function response( \WP_REST_Request $request ): \WP_REST_Response {

		$settings = $request->get_params();

		// The locale is often appended to the request. We don't need this.
		unset( $settings['_locale'] );

		if ( in_array( $request->get_param( 'action' ), [ 'reset-all', 'reset' ], true ) ) {

			$reset   = $request->get_param( 'reset' ) ?? $request->get_param( 'action' );
			$default = $request->get_param( 'default' );

			return $this->reset( $default, $reset );
		}

		// We are not resettings, so just update the settings and return.
		// the updated settings.
		$updated = update_option( $this->option_key, $settings );

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
					'settings' => $settings,
					'message'  => __( 'Updated settings ✅', 'blockera' ),
				],
			],
			200
		);
	}

	/**
	 * Resetting the settings based on reset type.
	 *
	 * @param mixed  $default   the default value to reset.
	 * @param string $resetType reset type is "all" or one of settings key. by default is "all".
	 *
	 * @return \WP_REST_Response the reset action response.
	 */
	protected function reset( $default, string $resetType ): \WP_REST_Response {

		if ( empty( $resetType ) ) {

			return new \WP_REST_Response(
				[
					'code'    => 400,
					'success' => false,
					'data'    => [
						'message' => __( 'Can not reset. Bad request.', 'blockera' ),
					],
				],
				400
			);
		}

		if ( 'reset-all' === $resetType ) {

			delete_option( $this->option_key );

			return new \WP_REST_Response(
				[
					'code'    => 200,
					'success' => true,
					'data'    => [
						'message' => __( 'Reset All Done', 'blockera' ),
					],
				]
			);
		}

		// Get older saved settings.
		$saved_settings = get_option( $this->option_key );
		$new_settings   = array_merge(
			$saved_settings ? $saved_settings : [],
			[
				$resetType => $default,
			]
		);

		if ( $saved_settings !== $new_settings ) {
			// Update the plugin settings.
			$updated = update_option( $this->option_key, $new_settings );

			if ( ! $updated ) {

				return new \WP_REST_Response(
					[
						'code'    => 500,
						'success' => false,
						'data'    => [
							'message' => __( 'Failed reset process.', 'blockera' ),
						],
					],
					500
				);
			}
		}

		return new \WP_REST_Response(
			[
				'code'    => 200,
				'success' => true,
				'data'    => [
					'settings' => $new_settings,
					'message'  => __( 'Reset settings ✅', 'blockera' ),
				],
			],
			200
		);
	}

}
