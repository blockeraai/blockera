<?php

namespace Blockera\WordPress;

class Sender {

	/**
	 * External POST HTTP request through wp_remote_post api.
	 *
	 * @param string $endpoint the endpoint of server.
	 * @param array  $args     the request required arguments.
	 *
	 * @return array|\WP_Error
	 */
	public function post( string $endpoint, array $args = [] ) {

		return wp_remote_post( $endpoint, $args );
	}

	/**
	 * External GET HTTP request through wp_remote_get api.
	 *
	 * @param string $endpoint the endpoint of server.
	 * @param array  $args     the request required arguments.
	 *
	 * @return array|\WP_Error
	 */
	public function get( string $endpoint, array $args = [] ) {

		return wp_remote_get( $endpoint, $args );
	}

	/**
	 * Retrieve the remote response body as array.
	 *
	 * @param array $response the response of remote.
	 *
	 * @return array
	 */
	public function getResponseBody( array $response ): array {

		return json_decode( wp_remote_retrieve_body( $response ), true );
	}

}
