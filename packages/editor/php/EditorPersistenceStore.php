<?php

namespace Blockera\Editor;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Class to handle editor persistence user meta registration and data preloading.
 *
 * @package Blockera
 * @since 2.0.0
 */
class EditorPersistenceStore {

	/**
	 * Meta key for persisted editor preferences.
	 * Includes blog prefix for multisite compatibility.
	 *
	 * @var string
	 */
	private $meta_key;

	/**
	 * Cached defaults decoded from the shared JSON file (per request).
	 *
	 * @var array|null
	 */
	private static $defaults_from_file;

	/**
	 * Default values for editor persistence store.
	 * Loaded from packages/editor/php/data/editor-persistence-defaults.json (single source of truth; also bundled in JS).
	 *
	 * @return array<string, mixed> Default values for the store.
	 */
	public function get_defaults() {
		if ( null !== self::$defaults_from_file ) {
			return self::$defaults_from_file;
		}

		$path = __DIR__ . '/data/editor-persistence-defaults.json';
		if ( ! is_readable( $path ) ) {
			self::$defaults_from_file = array();
			return self::$defaults_from_file;
		}

		$json = file_get_contents( $path );
		if ( false === $json ) {
			self::$defaults_from_file = array();
			return self::$defaults_from_file;
		}

		$decoded                  = json_decode( $json, true );
		self::$defaults_from_file = is_array( $decoded ) ? $decoded : array();

		return self::$defaults_from_file;
	}

	/**
	 * Constructor.
	 */
	public function __construct() {
		global $wpdb;
		$this->meta_key = $wpdb->get_blog_prefix() . 'blockera_editor_persistence';

		// Register user meta field on init (before REST API).
		add_action( 'init', array( $this, 'register_meta' ), 20 );

		// Register custom REST API endpoint for our persistence field.
		// Must use 'rest_api_init' as WordPress requires REST routes to be registered on this hook.
		add_action( 'rest_api_init', array( $this, 'register_rest_endpoint' ) );

		// Preload data and inject into JavaScript.
		add_action( 'enqueue_block_editor_assets', array( $this, 'preload_data' ), 20 );
	}

	/**
	 * Registers a custom REST API endpoint for our persistence field.
	 * This bypasses WordPress's meta field restrictions.
	 */
	public function register_rest_endpoint() {
		register_rest_route(
			'blockera/v1',
			'/editor-persistence',
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'get_persistence_endpoint' ),
				'permission_callback' => array( $this, 'permission_callback' ),
			)
		);

		register_rest_route(
			'blockera/v1',
			'/editor-persistence',
			array(
				'methods'             => 'POST',
				'callback'            => array( $this, 'update_persistence_endpoint' ),
				'permission_callback' => array( $this, 'permission_callback' ),
				'args'                => array(
					'data' => array(
						'required' => true,
						'type'     => 'object',
					),
				),
			)
		);
	}

	/**
	 * Permission callback for REST API endpoints.
	 * Ensures only authenticated users with edit_posts capability can access.
	 *
	 * @return bool Whether the current user can access the endpoint.
	 */
	public function permission_callback() {
		// Require user to be logged in.
		if ( ! is_user_logged_in() ) {
			return false;
		}

		// Require edit_posts capability.
		return current_user_can( 'edit_posts' );
	}

	/**
	 * Gets persistence data via custom REST endpoint.
	 * Only returns data for the current user.
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return \WP_REST_Response|\WP_Error Response object.
	 */
	public function get_persistence_endpoint( $request ) {
		try {
			$user_id = get_current_user_id();

			// Ensure user is logged in (double-check authorization).
			if ( ! $user_id ) {
				return new \WP_Error( 'unauthorized', __( 'Authentication required.', 'blockera' ), array( 'status' => 401 ) );
			}

			$meta_value = get_user_meta( $user_id, $this->meta_key, true );

			// Ensure we have a valid array/object for JSON serialization.
			if ( empty( $meta_value ) ) {
				$response_data = array();
			} elseif ( is_array( $meta_value ) ) {
				$response_data = $meta_value;
			} elseif ( is_object( $meta_value ) ) {
				$response_data = (array) $meta_value;
			} else {
				// If it's a string, try to decode it (might be JSON-encoded).
				$decoded       = json_decode( $meta_value, true );
				$response_data = ( null !== $decoded ) ? $decoded : array();
			}

			return new \WP_REST_Response( $response_data, 200 );
		} catch ( \Exception $e ) {
			// Don't expose internal error messages to prevent information leakage.
			return new \WP_Error( 'server_error', __( 'An error occurred while retrieving data.', 'blockera' ), array( 'status' => 500 ) );
		}
	}

	/**
	 * Updates persistence data via custom REST endpoint.
	 * Validates and sanitizes data before storage to prevent security issues.
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return \WP_REST_Response|\WP_Error Response object.
	 */
	public function update_persistence_endpoint( $request ) {
		$user_id = get_current_user_id();

		// Ensure user is logged in (double-check authorization).
		if ( ! $user_id ) {
			return new \WP_Error( 'unauthorized', __( 'Authentication required.', 'blockera' ), array( 'status' => 401 ) );
		}

		$data = $request->get_param( 'data' );

		if ( ! $data ) {
			return new \WP_Error( 'missing_data', __( 'Data parameter is required.', 'blockera' ), array( 'status' => 400 ) );
		}

		// Validate data type (must be array/object).
		if ( ! is_array( $data ) && ! is_object( $data ) ) {
			return new \WP_Error( 'invalid_data_type', __( 'Data must be an object.', 'blockera' ), array( 'status' => 400 ) );
		}

		// Convert object to array for consistent handling.
		if ( is_object( $data ) ) {
			$data = (array) $data;
		}

		// Prevent DoS attacks by limiting data size (10KB max).
		$data_size = strlen( wp_json_encode( $data ) );
		if ( $data_size > 10240 ) {
			return new \WP_Error( 'data_too_large', __( 'Data size exceeds maximum allowed size.', 'blockera' ), array( 'status' => 400 ) );
		}

		// Sanitize data: ensure only scalar values and arrays are stored.
		// This prevents storing complex objects that could cause issues.
		$sanitized_data = $this->sanitize_persistence_data( $data );

		update_user_meta( $user_id, $this->meta_key, $sanitized_data );

		$response = new \WP_REST_Response( array( 'success' => true ), 200 );
		$response->set_headers( array( 'Content-Type' => 'application/json' ) );

		return $response;
	}

	/**
	 * Sanitizes persistence data recursively.
	 * Ensures only safe data types are stored (scalars, arrays).
	 * Prevents storing objects or other complex types that could cause security issues.
	 * Preserves camelCase keys (doesn't convert to lowercase) to match JavaScript expectations.
	 *
	 * @param mixed $data Data to sanitize.
	 * @return array Sanitized data.
	 */
	private function sanitize_persistence_data( $data ) {
		if ( ! is_array( $data ) ) {
			// For non-arrays, return empty array (shouldn't happen, but safety check).
			return array();
		}

		$sanitized = array();

		foreach ( $data as $key => $value ) {
			// Sanitize key: preserve camelCase for JavaScript compatibility.
			// Only allow alphanumeric characters and underscores (no spaces, special chars).
			// This preserves camelCase like "secondarySidebarOpen" instead of converting to lowercase.
			$sanitized_key = preg_replace( '/[^a-zA-Z0-9_]/', '', $key );

			// Sanitize value based on type.
			if ( is_scalar( $value ) ) {
				// Preserve scalar values as-is (they're safe).
				// WordPress will handle serialization safely.
				$sanitized[ $sanitized_key ] = $value;
			} elseif ( is_array( $value ) ) {
				// Recurse for nested arrays.
				$sanitized[ $sanitized_key ] = $this->sanitize_persistence_data( $value );
			} elseif ( is_null( $value ) ) {
				// Allow null values.
				$sanitized[ $sanitized_key ] = null;
			}
			// Skip objects and other complex types for security.
		}

		return $sanitized;
	}

	/**
	 * Registers the user meta field for REST API access.
	 * Similar to WordPress core persisted_preferences registration.
	 */
	public function register_meta() {
		register_meta(
			'user',
			$this->meta_key,
			array(
				'type'          => 'object',
				'single'        => true,
				'auth_callback' => array( $this, 'auth_callback' ),
				'show_in_rest'  => array(
					'name'   => 'blockera_editor_persistence',
					'type'   => 'object',
					'schema' => array(
						'type'                 => 'object',
						'context'              => array( 'edit' ),
						'properties'           => array(
							'_modified' => array(
								'description' => __( 'The date and time the preferences were updated.', 'blockera' ),
								'type'        => 'string',
								'format'      => 'date-time',
								'readonly'    => false,
							),
						),
						'additionalProperties' => true,
					),
				),
			)
		);
	}

	/**
	 * Auth callback for meta field updates.
	 * Allows users to update their own meta field.
	 *
	 * @param bool   $allowed Whether the user can add the meta.
	 * @param string $meta_key The meta key.
	 * @param int    $user_id The user ID.
	 * @return bool Whether the user can update the meta.
	 */
	public function auth_callback( $allowed, $meta_key, $user_id ) {
		// Allow users to update their own meta field.
		return (int) get_current_user_id() === (int) $user_id;
	}

	/**
	 * Preloads persisted data and injects it into JavaScript.
	 * This allows the persistence layer to initialize with server data immediately.
	 * Data is JSON-encoded with proper escaping to prevent XSS.
	 */
	public function preload_data() {
		// Only preload for logged-in users.
		if ( ! is_user_logged_in() ) {
			return;
		}

		$user_id      = get_current_user_id();
		$preload_data = get_user_meta( $user_id, $this->meta_key, true );

		// Ensure data is an array before encoding (safety check).
		if ( $preload_data && ! is_array( $preload_data ) ) {
			if ( is_object( $preload_data ) ) {
				$preload_data = (array) $preload_data;
			} else {
				// Invalid data type, don't preload.
				$preload_data = null;
			}
		}

		// Get default values.
		$defaults = $this->get_defaults();

		$handle  = 'blockera-editor-persistence';
		$version = wp_generate_uuid4();
		wp_register_script( $handle, false, array(), $version, array( 'in_footer' => false ) );
		wp_enqueue_script( $handle );

		// wp_json_encode with JSON_HEX_TAG prevents XSS by escaping < and > characters.
		wp_add_inline_script(
			$handle,
			sprintf(
				'( function() {
					window.blockeraStorageSiteKey = %s;
					window.blockeraStorageUserId = %d;
					window.blockeraEditorPersistenceDefaults = %s;
					window.blockeraEditorPersistenceData = %s;
					window.blockeraEditorPersistenceUserId = %d;
				} )();',
				wp_json_encode( blockera_get_storage_site_key(), JSON_HEX_TAG | JSON_UNESCAPED_SLASHES ),
				$user_id,
				wp_json_encode( $defaults, JSON_HEX_TAG | JSON_UNESCAPED_SLASHES ),
				wp_json_encode( $preload_data ? $preload_data : null, JSON_HEX_TAG | JSON_UNESCAPED_SLASHES ),
				$user_id
			)
		);
	}
}