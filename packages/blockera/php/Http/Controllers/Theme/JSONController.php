<?php

namespace Blockera\Setup\Http\Controllers\Theme;

use Blockera\Http\RestController;

class JSONController extends RestController {

	public function permission( \WP_REST_Request $request) :bool {

		return current_user_can('edit_theme_options');
	}
	
	public function response( \WP_REST_Request $request) : \WP_REST_Response {

		try {
			$theme_data = JSONResolver::get_theme_file_contents();
			return new \WP_REST_Response(
				array(
					'status'  => 'SUCCESS',
					'message' => __( 'Theme data retrieved.', 'blockera' ),
					'data'    => $theme_data,
				),
			);
		} catch ( \Exception $error ) {
			return new \WP_REST_Response(
				array(
					'status'  => 'FAILURE',
					'message' => $error->getMessage(),
				)
			);
		}
	}
}
