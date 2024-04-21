<?php

namespace Blockera\Framework\Http\Controllers;

use Blockera\Framework\Illuminate\Foundation\Http\RestController;

class DynamicValuesController extends RestController {

	public function permission( \WP_REST_Request $request ): bool {

		return current_user_can( 'edit_posts' );
	}

	public function response( \WP_REST_Request $request ): \WP_REST_Response {

		//TODO: implements response.
		
		return parent::response( $request ); // TODO: Change the autogenerated stub
	}

}