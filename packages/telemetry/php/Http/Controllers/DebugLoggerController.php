<?php

namespace Blockera\Telemetry\Http\Controllers;

use Blockera\Telemetry\Config;
use Blockera\Http\RestController;
use Blockera\Exceptions\BaseException;

class DebugLoggerController extends RestController {

    /**
     * The errors array.
     *
     * @var array
     */
    protected array $errors = [];

    /**
     * The permission check.
     *
     * @param \WP_REST_Request $request The request.
     *
     * @return bool true on success, false otherwise.
     */
    public function permission( \WP_REST_Request $request): bool {
        return current_user_can('manage_options');
    }

    /**
     * The log method.
     *
     * @param \WP_REST_Request $request The request.
     *
	 * @throws \Blockera\Exceptions\BaseException If the request is invalid.
	 * 
     * @return \WP_REST_Response
     */
    public function log( \WP_REST_Request $request): \WP_REST_Response {
        $error      = $request->get_param('error');
        $block_code = $request->get_param('block_code');
		$error_type = $request->get_param('error_type');
		$browser    = $request->get_param('browser');

        try {

            if (empty($error) || empty($block_code) || empty($error_type) || empty($browser)) {
                throw new BaseException(__('Invalid request.', 'blockera'), 400);
            }        
		} catch (\Throwable $th) {
            return new \WP_REST_Response(
                [
                    'code'    => $th->getCode(),
                    'success' => false,
                    'data'    => [
                        'message' => $th->getMessage(),
                    ],
                ],
                $th->getCode()
            );
        }

		$error = json_decode($error, true);

		$response = wp_remote_post(
            Config::getServerURL('/debug'),
            [
				'sslverify' => false,
				'headers' => [
					'Accept' => 'application/json',
					'Authorization' => 'Bearer ' . get_option(Config::getOptionKeys('token')),
				],
				'body' => [
					'error_type' => $error_type,
					'error_message' => $error['message'],
					'error_details' => [
						'block_code' => $block_code,
					],
					'file_path' => $error['file'] ?? '',
					'line_number' => $error['line'] ?? -1,
					'stack_trace' => $error['stack'],
					'browser_info' => $browser,
					'php_version' => phpversion(),
					'wordpress_version' => get_bloginfo('version'),
					'product_slug' => Config::getConsumerConfig('name'),
					'product_version' => Config::getConsumerConfig('version'),
					'user_id' => get_option(Config::getOptionKeys('user_id')),
				],
			]
        );

		if (is_wp_error($response)) {
			return new \WP_REST_Response(
				[
					'code'    => $response->get_error_code(),
					'success' => false,
					'data'    => [
						'message' => $response->get_error_message(),
					],
				],
				$response->get_error_code()
			);
		}

		$body = json_decode(wp_remote_retrieve_body($response), true);

		if (empty($body['success'])) {
			return new \WP_REST_Response(
				[
					'code'    => 500,
					'success' => false,
					'errors'    => [
						'failed_debug_log' => $body,
					],
				],
				500
			);
		}

        return new \WP_REST_Response(
            $body,
            200
        );
    }
}
