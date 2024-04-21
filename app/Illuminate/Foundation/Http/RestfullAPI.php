<?php

namespace Blockera\Framework\Illuminate\Foundation\Http;

/**
 * The RestfullAPI Interface.
 *
 * @package Blockera\Framework\Illuminate\Foundation\Http\RestfullAPI
 */
interface RestfullAPI {

	/**
	 * Retrieve readable response come from GET http method of registered route.
	 *
	 * @param \WP_REST_Request $request The instance of HTTP Request.
	 *
	 * @return \WP_REST_Response The response of GET http method.
	 */
	public function index(\WP_REST_Request $request): \WP_REST_Response;

	/**
	 * Retrieve readable response come from POST http method of registered route.
	 *
	 * @param \WP_REST_Request $request The instance of HTTP Request.
	 *
	 * @return \WP_REST_Response The response of POST http method.
	 */
	public function create(\WP_REST_Request $request): \WP_REST_Response;

	/**
	 * Retrieve readable response come from DELETE http method of registered route.
	 *
	 * @param \WP_REST_Request $request The instance of HTTP Request.
	 *
	 * @return \WP_REST_Response The response of DELETE http method.
	 */
	public function delete(\WP_REST_Request $request): \WP_REST_Response;

	/**
	 * Retrieve readable response come from POST, PUT, PATCH http methods of registered route.
	 *
	 * @param \WP_REST_Request $request The instance of HTTP Request.
	 *
	 * @return \WP_REST_Response The response of POST, PUT, PATCH http methods.
	 */
	public function update(\WP_REST_Request $request): \WP_REST_Response;
}
