<?php

namespace Blockera\Editor\Http\Controllers;

use Blockera\Http\RestController;

/**
 * Class UsersController for control users requests.
 *
 * @package UsersController
 */
class UsersController extends RestController {

    public function permission( \WP_REST_Request $request): bool {
    
		return (bool) ( current_user_can('edit_posts') && wp_verify_nonce($request->get_header('X-Blockera-Nonce'), 'blockera-editor') );
    }

    public function saveEditorSettings( \WP_REST_Request $request): \WP_REST_Response {

		if (! $request->get_param('user_id')) {
			return new \WP_REST_Response(
				[
					'success' => false,
					'errors' => [
						'user' => __('User ID is Required', 'blockera'),
					],
				],
				403
			);
		}

		$key               = 'blockera_editor_settings';
		$user_id           = $request->get_param('user_id');
		$previous_settings = get_user_meta($user_id, $key, true);
		$new_settings      = array_merge('' === $previous_settings ? [] : $previous_settings, $request->get_param('settings'));
		$updated           = update_user_meta($user_id, $key, $new_settings);

		if (! $updated) {
			return new \WP_REST_Response(
				[
					'success' => false,
					'errors' => [
						'user' => __('Failed to update user settings', 'blockera'),
					],
				],
				400
			);
		}

        return new \WP_REST_Response(
            [
                'success' => true,
				'data' => $new_settings,
            ]
        );
    }
}
