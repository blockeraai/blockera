<?php

namespace Blockera\Telemetry\Http\Controllers;

use Blockera\Telemetry\Config;
use Blockera\Http\RestController;
use Blockera\Exceptions\BaseException;

class BugDetectorAndReporterController extends RestController {

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
        $nonce = $request->get_header('X-WP-Nonce');

        if (! $nonce || ! wp_verify_nonce($nonce, 'wp_rest')) {
            return false;
        }

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
        try {
            $validated = $this->validate($request);
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

        $body = $this->prepareBody($validated);

        $this->loggedBugReporterStatus($body);

        $response = wp_remote_post(
            Config::getServerURL('/debug'),
            [
                'sslverify' => true,
				'stream_context' => [
					'ssl' => [
						'crypto_method' => STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT,
					],
				],
                'headers' => [
                    'Accept' => 'application/json',
                    'Authorization' => 'Bearer ' . get_option(Config::getOptionKeys('token')),
                ],
                'body' => $body,
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
                        'failed_debug_log' => 500 === ( $body['code'] ?? 200 ) || false === ( $body['success'] ?? true ) ? $body['errors'] : $body,
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

    /**
     * The status method.
     *
     * @param \WP_REST_Request $request The request.
     *
     * @return \WP_REST_Response
     */
    public function status( \WP_REST_Request $request): \WP_REST_Response {
        try {
            $validated = $this->validate($request);
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

        $body = $this->prepareBody($validated);

        return new \WP_REST_Response(
            [
                'success' => true,
                'data' => [
                    'isReported' => is_array($this->getBugReporterStatus($body)),
                ],
            ],
            200
        );
    }

    /**
     * Validate the request.
     *
     * @param \WP_REST_Request $request The request.
     *
     * @throws \Blockera\Exceptions\BaseException If the request is invalid.
     *
     * @return array The validated data.
     */
    protected function validate( \WP_REST_Request $request): array {
        $error      = $request->get_param('error');
        $block_code = $request->get_param('block_code');
        $error_type = $request->get_param('error_type');
        $browser    = $request->get_param('browser');
        $action     = $request->get_param('action');

        if (empty($error) || empty($block_code) || empty($error_type) || empty($browser)) {
            throw new BaseException(__('Invalid request.', 'blockera'), 400);
        }

        if (empty($action) || ! in_array($action, [ 'blockera_log_error_status', 'blockera_log_error' ], true)) {
            throw new BaseException(__('Invalid request.', 'blockera'), 400);
        }

        return compact('error', 'block_code', 'error_type', 'browser');
    }

    /**
     * Prepare the body.
     *
     * @param array $validated_params The validated data parameters.
     *
     * @return array The prepared body.
     */
    protected function prepareBody( array $validated_params): array {
        $error = json_decode($validated_params['error'], true);

        return [
            'error_type' => $validated_params['error_type'],
            'error_message' => $error['message'],
            'error_details' => [
                'block_code' => $validated_params['block_code'],
            ],
            'file_path' => $error['file'] ?? '',
            'line_number' => $error['line'] ?? -1,
            'stack_trace' => $error['stack'],
            'browser_info' => $validated_params['browser'],
            'php_version' => phpversion(),
            'wordpress_version' => get_bloginfo('version'),
            'product_slug' => Config::getConsumerConfig('name'),
            'product_version' => Config::getConsumerConfig('version'),
            'user_id' => get_option(Config::getOptionKeys('user_id')),
        ];
    }

    /**
     * Log the bug reporter status.
     *
     * @param array $body The body.
     *
     * @return void
     */
    protected function loggedBugReporterStatus( array $body): void {
        $transient_key = $this->getTransientKey($body);

		if (! defined('BLOCKERA_TELEMETRY_NOT_STORE_DATA') || ! BLOCKERA_TELEMETRY_NOT_STORE_DATA) {
			
			// Store in WordPress transients for 1 month.
			set_transient($transient_key, $body, MONTH_IN_SECONDS);
		}
    }

    /**
     * Get the bug reporter status.
     *
     * @param array $body The body.
     *
     * @return mixed The bug reporter status.
     */
    protected function getBugReporterStatus( array $body) {
        $transient_key = $this->getTransientKey($body);

        return get_transient($transient_key);
    }

    /**
     * Get the transient key.
     *
     * @param array $body The body.
     *
     * @return string The transient key.
     */
    protected function getTransientKey( array $body): string {
        $_body = $body;

        // Because the block_code has blockeraPropsId and blockeraCompatId, these are changed every time the block is serialized.
        unset($_body['error_details']['block_code']);

        // Create hash from body array for uniqueness.
        $body_hash = md5(serialize($_body));

        // Create transient key using product slug and hash.
        return $body['product_slug'] . '-error_' . $body_hash;
    }
}
