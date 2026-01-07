<?php

namespace Blockera\Setup\Http\Controllers\Theme;

use Blockera\Setup\Compatibility\JSON;
use Blockera\Setup\Compatibility\JSONResolver;

/**
 * Base Global Styles REST API Controller.
 */
class GlobalStylesController extends \WP_REST_Global_Styles_Controller {

	/**
	 * Whether the controller supports batching.
	 *
	 * @since 6.6.0
	 * @var array
	 */
	protected $allow_batch = array( 'v1' => false );

	/**
	 * Constructor.
	 *
	 * @since 5.9.0
	 */
	/**
	 * Constructor.
	 *
	 * @since 6.6.0
	 *
	 * @param string $post_type Post type.
	 */
	public function __construct( $post_type = 'wp_global_styles' ) {
		parent::__construct( $post_type );
	}

	/**
	 * Registers the controllers routes.
	 *
	 * @since 5.9.0
	 */
	public function register_routes() {
		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base . '/themes/(?P<stylesheet>[\/\s%\w\.\(\)\[\]\@_\-]+)/variations',
			array(
				array(
					'methods'             => \WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_theme_items' ),
					'permission_callback' => array( $this, 'get_theme_items_permissions_check' ),
					'args'                => array(
						'stylesheet' => array(
							'description' => __( 'The theme identifier', 'blockera' ),
							'type'        => 'string',
						),
					),
					'allow_batch'         => $this->allow_batch,
				),
			),
			// phpcs:disable
			/*
			 * $override is set to true to avoid conflicts with the core endpoint.
			 * Do not sync to WordPress core.
			 */
			// phpcs:enable
			true
		);

		// List themes global styles.
		register_rest_route(
			$this->namespace,
			// The route.
			sprintf(
				'/%s/themes/(?P<stylesheet>%s)',
				$this->rest_base,
				// phpcs:disable
				/*
				 * Matches theme's directory: `/themes/<subdirectory>/<theme>/` or `/themes/<theme>/`.
				 * Excludes invalid directory name characters: `/:<>*?"|`.
				 */
				// phpcs:enable
				'[^\/:<>\*\?"\|]+(?:\/[^\/:<>\*\?"\|]+)?'
			),
			array(
				array(
					'methods'             => \WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_theme_item' ),
					'permission_callback' => array( $this, 'get_theme_item_permissions_check' ),
					'args'                => array(
						'stylesheet' => array(
							'description'       => __( 'The theme identifier', 'blockera' ),
							'type'              => 'string',
							'sanitize_callback' => array( $this, '_sanitize_global_styles_callback' ),
						),
					),
					'allow_batch'         => $this->allow_batch,
				),
			),
			// phpcs:disable
			/*
			 * $override is set to true to avoid conflicts with the core endpoint.
			 * Do not sync to WordPress core.
			 */
			// phpcs:enable
			true
		);

		// Lists/updates a single global style variation based on the given id.
		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base . '/(?P<id>[\/\w-]+)',
			array(
				array(
					'methods'             => \WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_item' ),
					'permission_callback' => array( $this, 'get_item_permissions_check' ),
					'args'                => array(
						'id' => array(
							'description'       => __( 'The id of a template', 'blockera' ),
							'type'              => 'string',
							'sanitize_callback' => array( $this, '_sanitize_global_styles_callback' ),
						),
					),
				),
				array(
					'methods'             => \WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'update_item' ),
					'permission_callback' => array( $this, 'update_item_permissions_check' ),
					'args'                => $this->get_endpoint_args_for_item_schema( \WP_REST_Server::EDITABLE ),
				),
				'schema'      => array( $this, 'get_public_item_schema' ),
				'allow_batch' => $this->allow_batch,
			),
			// phpcs:disable
			/*
			 * $override is set to true to avoid conflicts with the core endpoint.
			 * Do not sync to WordPress core.
			 */
			// phpcs:enable
			true
		);
	}

	/**
	 * Prepares a single global styles config for update.
	 *
	 * @since 5.9.0
	 * @since 6.2.0 Added validation of styles.css property.
	 * @since 6.6.0 Added registration of block style variations from theme.json sources (theme.json, user theme.json, partials).
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return \stdClass|\WP_Error Prepared item on success. \WP_Error on when the custom CSS is not valid.
	 */
	protected function prepare_item_for_database( $request ) {
		$changes     = new \stdClass();
		$changes->ID = $request['id'];

		$post            = get_post( $request['id'] );
		$existing_config = array();
		if ( $post ) {
			$existing_config     = json_decode( $post->post_content, true );
			$json_decoding_error = json_last_error();
			if ( JSON_ERROR_NONE !== $json_decoding_error || ! isset( $existing_config['isGlobalStylesUserThemeJSON'] ) ||
				! $existing_config['isGlobalStylesUserThemeJSON'] ) {
				$existing_config = array();
			}
		}

		if ( isset( $request['styles'] ) || isset( $request['settings'] ) ) {
			$config = array();
			if ( isset( $request['styles'] ) ) {
				if ( isset( $request['styles']['css'] ) ) {
					$css_validation_result = $this->validate_custom_css( $request['styles']['css'] );
					if ( is_wp_error( $css_validation_result ) ) {
						return $css_validation_result;
					}
				}
				$config['styles'] = $request['styles'];
			} elseif ( isset( $existing_config['styles'] ) ) {
				$config['styles'] = $existing_config['styles'];
			}

			// Register theme-defined variations e.g. from block style variation partials under `/styles`.
			$variations = JSONResolver::get_style_variations( 'block' );
			blockera_register_block_style_variations_from_theme_json_partials( $variations );

			if ( isset( $request['settings'] ) ) {
				$config['settings'] = $request['settings'];
			} elseif ( isset( $existing_config['settings'] ) ) {
				$config['settings'] = $existing_config['settings'];
			}
			$config['isGlobalStylesUserThemeJSON'] = true;
			$config['version']                     = JSON::LATEST_SCHEMA;
			$changes->post_content                 = wp_json_encode( $config );
		}

		// Post title.
		if ( isset( $request['title'] ) ) {
			if ( is_string( $request['title'] ) ) {
				$changes->post_title = $request['title'];
			} elseif ( ! empty( $request['title']['raw'] ) ) {
				$changes->post_title = $request['title']['raw'];
			}
		}

		return $changes;
	}

	/**
	 * Prepare a global styles config output for response.
	 *
	 * @since 5.9.0
	 * @since 6.2.0 Handling of style.css was added to \WP_Theme_JSON.
	 * @since 6.6.0 Added custom relative theme file URIs to `_links`.
	 *
	 * @param \WP_Post         $post    Global Styles post object.
	 * @param \WP_REST_Request $request Request object.
	 * @return \WP_REST_Response Response object.
	 */
	public function prepare_item_for_response( $post, $request ) { // phpcs:ignore VariableAnalysis.CodeAnalysis.VariableAnalysis.UnusedVariable
		$raw_config                       = json_decode( $post->post_content, true );
		$is_global_styles_user_theme_json = isset( $raw_config['isGlobalStylesUserThemeJSON'] ) && true === $raw_config['isGlobalStylesUserThemeJSON'];
		$config                           = array();
		$theme_json                       = null;
		if ( $is_global_styles_user_theme_json ) {
			$theme_json = new JSON( $raw_config, 'custom' );
			$config     = $theme_json->get_raw_data();
		}

		// Base fields for every post.
		$data   = array();
		$fields = $this->get_fields_for_response( $request );

		if ( rest_is_field_included( 'id', $fields ) ) {
			$data['id'] = $post->ID;
		}

		if ( rest_is_field_included( 'title', $fields ) ) {
			$data['title'] = array();
		}
		if ( rest_is_field_included( 'title.raw', $fields ) ) {
			$data['title']['raw'] = $post->post_title;
		}
		if ( rest_is_field_included( 'title.rendered', $fields ) ) {
			add_filter( 'protected_title_format', array( $this, 'protected_title_format' ) );
			add_filter( 'private_title_format', array( $this, 'protected_title_format' ) );

			$data['title']['rendered'] = get_the_title( $post->ID );

			remove_filter( 'protected_title_format', array( $this, 'protected_title_format' ) );
			remove_filter( 'private_title_format', array( $this, 'protected_title_format' ) );
		}

		if ( rest_is_field_included( 'settings', $fields ) ) {
			$data['settings'] = ! empty( $config['settings'] ) && $is_global_styles_user_theme_json ? $config['settings'] : new \stdClass();
		}

		if ( rest_is_field_included( 'styles', $fields ) ) {
			$data['styles'] = ! empty( $config['styles'] ) && $is_global_styles_user_theme_json ? $config['styles'] : new \stdClass();
		}

		$context = ! empty( $request['context'] ) ? $request['context'] : 'view';
		$data    = $this->add_additional_fields_to_object( $data, $request );
		$data    = $this->filter_response_by_context( $data, $context );

		// Wrap the data in a response object.
		$response = rest_ensure_response( $data );

		if ( rest_is_field_included( '_links', $fields ) || rest_is_field_included( '_embedded', $fields ) ) {
			$links = $this->prepare_links( $post->ID );
			// Only return resolved URIs for get requests to user theme JSON.
			if ( $theme_json ) {
				$resolved_theme_uris = JSONResolver::get_resolved_theme_uris( $theme_json );
				if ( ! empty( $resolved_theme_uris ) ) {
					$links['https://api.w.org/theme-file'] = $resolved_theme_uris;
				}
			}
			$response->add_links( $links );
			if ( ! empty( $links['self']['href'] ) ) {
				$actions = $this->get_available_actions( $post, $request );
				$self    = $links['self']['href'];
				foreach ( $actions as $rel ) {
					$response->add_link( $rel, $self );
				}
			}
		}

		return $response;
	}

	/**
	 * Returns the given theme global styles config.
	 *
	 * @since 5.9.0
	 *
	 * @param \WP_REST_Request $request The request instance.
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function get_theme_item( $request ) {
		if ( get_stylesheet() !== $request['stylesheet'] ) {
			// This endpoint only supports the active theme for now.
			return new \WP_Error(
				'rest_theme_not_found',
				__( 'Theme not found.', 'blockera' ),
				array( 'status' => 404 )
			);
		}

		$theme  = JSONResolver::get_merged_data( 'theme' );
		$fields = $this->get_fields_for_response( $request );
		$data   = array();

		if ( rest_is_field_included( 'settings', $fields ) ) {
			$data['settings'] = $theme->get_settings();
		}

		if ( rest_is_field_included( 'styles', $fields ) ) {
			$raw_data       = $theme->get_raw_data();
			$data['styles'] = isset( $raw_data['styles'] ) ? $raw_data['styles'] : array();
		}

		$context  = ! empty( $request['context'] ) ? $request['context'] : 'view';
		$data     = $this->add_additional_fields_to_object( $data, $request );
		$data     = $this->filter_response_by_context( $data, $context );
		$response = rest_ensure_response( $data );

		if ( rest_is_field_included( '_links', $fields ) || rest_is_field_included( '_embedded', $fields ) ) {
			$links               = array(
				'self' => array(
					'href' => rest_url( sprintf( '%s/%s/themes/%s', $this->namespace, $this->rest_base, $request['stylesheet'] ) ),
				),
			);
			$resolved_theme_uris = JSONResolver::get_resolved_theme_uris( $theme );
			if ( ! empty( $resolved_theme_uris ) ) {
				$links['https://api.w.org/theme-file'] = $resolved_theme_uris;
			}

			$response->add_links( $links );
		}

		return $response;
	}

	/**
	 * Returns the given theme global styles variations.
	 *
	 * @since 6.0.0
	 * @since 6.2.0 Returns parent theme variations, if they exist.
	 * @since 6.4.0 Removed unnecessary local variable.
	 * @since 6.6.0 Added custom relative theme file URIs to `_links` for each item.
	 *
	 * @param \WP_REST_Request $request The request instance.
	 *
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function get_theme_items( $request ) {

		if ( get_stylesheet() !== $request['stylesheet'] ) {
			// This endpoint only supports the active theme for now.
			return new \WP_Error(
				'rest_theme_not_found',
				__( 'Theme not found.', 'blockera' ),
				array( 'status' => 404 )
			);
		}

		$response = array();

		// Register theme-defined variations e.g. from block style variation partials under `/styles`.
		$partials = JSONResolver::get_style_variations( 'block' );
		blockera_register_block_style_variations_from_theme_json_partials( $partials );

		$variations = JSONResolver::get_style_variations();

		// Add resolved theme asset links.
		foreach ( $variations as $variation ) {
			$variation_theme_json = new JSON( $variation );
			$resolved_theme_uris  = JSONResolver::get_resolved_theme_uris( $variation_theme_json );
			$data                 = rest_ensure_response( $variation );
			if ( ! empty( $resolved_theme_uris ) ) {
				$data->add_links(
					array(
						'https://api.w.org/theme-file' => $resolved_theme_uris,
					)
				);
			}
			$response[] = $this->prepare_response_for_collection( $data );
		}

		return rest_ensure_response( $response );
	}
}
