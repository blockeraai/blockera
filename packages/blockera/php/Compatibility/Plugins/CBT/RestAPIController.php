<?php

namespace Blockera\Setup\Compatibility\Plugins\CBT;

use Blockera\Setup\Compatibility\JSON;
use Blockera\Setup\Compatibility\JSONResolver;
use Blockera\Setup\Compatibility\Plugins\CBT\ThemeZip;
use Blockera\Setup\Compatibility\Plugins\CBT\ThemeStyles;
use Blockera\Setup\Compatibility\Plugins\CBT\ThemeCreate;
use Blockera\Setup\Compatibility\Plugins\CBT\ThemeTemplates;

/**
 * REST API Controller for Create Block Theme plugin compatibility.
 * 
 * This class overrides all REST API endpoints registered by the Create Block Theme plugin
 * to ensure compatibility with Blockera.
 *
 * @package Blockera\Setup\Compatibility\Plugins\CBT
 */
class RestAPIController {

	/**
	 * Initialize the class and set its properties.
	 */
	public function __construct() {
		// Filter REST API callbacks after routes are registered.
		add_filter( 'rest_pre_dispatch', array( $this, 'filter_rest_callbacks' ), 10, 3 );
	}

	/**
	 * Filter REST API callbacks to replace CBT callbacks with Blockera-compatible ones.
	 *
	 * @param mixed  $result  Response to replace the requested version with.
	 * @param object $server  Server instance.
	 * @param object $request Request used to generate the response.
	 * @return mixed Filtered response or original if not a CBT route.
	 */
	public function filter_rest_callbacks( $result, $server, $request ) {
		$route = $request->get_route();

		// Only filter CBT routes.
		if ( strpos( $route, '/create-block-theme/v1/' ) !== 0 ) {
			return $result;
		}

		// Map routes to callback methods.
		$callback_map = array(
			'/create-block-theme/v1/save'             => 'rest_save_theme',
			'/create-block-theme/v1/clone'            => 'rest_clone_theme',
			'/create-block-theme/v1/reset-theme'      => 'rest_reset_theme',
			'/create-block-theme/v1/export'           => 'rest_export_theme',
			'/create-block-theme/v1/create-variation' => 'rest_create_variation',
			'/create-block-theme/v1/create-child'     => 'rest_create_child_theme',
		);

		// Check if this route has a callback override.
		if ( isset( $callback_map[ $route ] ) && method_exists( $this, $callback_map[ $route ] ) ) {
			// Check permission.
			if ( ! current_user_can( 'edit_theme_options' ) ) {
				return new \WP_Error(
					'rest_forbidden',
					__( 'Sorry, you are not allowed to do that.', 'blockera' ),
					array( 'status' => rest_authorization_required_code() )
				);
			}

			// Get method reflection to check if it accepts request parameter.
			$method = new \ReflectionMethod( $this, $callback_map[ $route ] );
			$params = $method->getParameters();

			// Call our callback method - pass request only if method accepts it.
			if ( ! empty( $params ) ) {
				return call_user_func( array( $this, $callback_map[ $route ] ), $request );
			} else {
				return call_user_func( array( $this, $callback_map[ $route ] ) );
			}
		}

		return $result;
	}

	/**
	 * Clone theme callback.
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function rest_clone_theme( $request ) {
		$response = ThemeCreate::clone_current_theme( $this->sanitize_theme_data( $request->get_params() ) );

		wp_cache_flush();

		if ( is_wp_error( $response ) ) {
			return $response;
		}

		return new \WP_REST_Response(
			array(
				'status'  => 'SUCCESS',
				'message' => __( 'Cloned Theme Created.', 'blockera' ),
			)
		);
	}

	/**
	 * Create child theme callback.
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function rest_create_child_theme( $request ) {
		$theme                   = $this->sanitize_theme_data( $request->get_params() );
		$theme['is_child_theme'] = true;
		// TODO: Handle screenshots.
		$screenshot = null;

		$response = ThemeCreate::create_child_theme( $theme, $screenshot );

		wp_cache_flush();

		if ( is_wp_error( $response ) ) {
			return $response;
		}

		return new \WP_REST_Response(
			array(
				'status'  => 'SUCCESS',
				'message' => __( 'Child Theme Created.', 'blockera' ),
			)
		);
	}

	/**
	 * Create variation callback.
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function rest_create_variation( $request ) {
		$options = $request->get_params();

		$save_fonts = isset( $options['saveFonts'] ) && true === $options['saveFonts'];

		$response = JSON::add_theme_json_variation_to_local(
			'variation',
			$this->sanitize_theme_data( $options ),
			$save_fonts
		);

		wp_cache_flush();

		if ( is_wp_error( $response ) ) {
			return $response;
		}

		return new \WP_REST_Response(
			array(
				'status'  => 'SUCCESS',
				'message' => __( 'Theme Variation Created.', 'blockera' ),
			)
		);
	}

	/**
	 * Export theme callback.
	 *
	 * @return void|\WP_Error
	 */
	public function rest_export_theme() {
		if ( ! class_exists( 'ZipArchive' ) ) {
			return new \WP_Error(
				'missing_zip_package',
				__( 'Unable to create a zip file. ZipArchive not available.', 'blockera' ),
			);
		}
		wp_cache_flush();
		$theme_slug = wp_get_theme()->get( 'TextDomain' );

		// Create ZIP file in the temporary directory.
		$filename = tempnam( get_temp_dir(), $theme_slug );
		$zip      = ThemeZip::create_zip( $filename, $theme_slug );

		if ( is_wp_error( $zip ) ) {
			return $zip;
		}

		$zip = ThemeZip::copy_theme_to_zip( $zip, null, null );

		if ( is_child_theme() ) {
			wp_cache_flush();
			$zip        = ThemeZip::add_templates_to_zip( $zip, 'current' );
			$theme_json = JSONResolver::export_theme_data( 'current' );
		} else {
			$zip        = ThemeZip::add_templates_to_zip( $zip, 'all' );
			$theme_json = JSONResolver::export_theme_data( 'all' );
		}

		$theme_json = ThemeZip::add_activated_fonts_to_zip( $zip, $theme_json );

		// Add block style variation files for variations defined in theme.json but missing from filesystem.
		$zip = ThemeZip::add_block_style_variations_to_zip( $zip, $theme_json );

		$zip = ThemeZip::add_theme_json_to_zip( $zip, $theme_json );

		$zip->close();

		wp_cache_flush();

		header( 'Content-Type: application/zip' );
		header( 'Content-Disposition: attachment; filename=' . $theme_slug . '.zip' );
		header( 'Content-Length: ' . filesize( $filename ) );
		flush();
		echo readfile( $filename );
		exit;
	}

	/**
	 * Save theme callback.
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function rest_save_theme( $request ) {
		$options = $request->get_params();

		if ( isset( $options['saveFonts'] ) && true === $options['saveFonts'] ) {
			\CBT_Theme_Fonts::persist_font_settings();
		}

		if ( isset( $options['saveTemplates'] ) && true === $options['saveTemplates'] ) {
			if ( true === $options['processOnlySavedTemplates'] ) {
				ThemeTemplates::add_templates_to_local( 'user', null, null, $options );
			} else {
				if ( is_child_theme() ) {
					ThemeTemplates::add_templates_to_local( 'current', null, null, $options );
				} else {
					ThemeTemplates::add_templates_to_local( 'all', null, null, $options );
				}
			}
			ThemeTemplates::clear_user_templates_customizations();
			ThemeTemplates::clear_user_template_parts_customizations();
		}

		if ( isset( $options['saveStyle'] ) && true === $options['saveStyle'] ) {
			if ( is_child_theme() ) {
				JSON::add_theme_json_to_local( 'current', null, null, $options );
			} else {
				JSON::add_theme_json_to_local( 'all', null, null, $options );
			}
			ThemeStyles::clear_user_styles_customizations();
		}

		if ( isset( $options['savePatterns'] ) && true === $options['savePatterns'] ) {
			$response = \CBT_Theme_Patterns::add_patterns_to_theme( $options );

			if ( is_wp_error( $response ) ) {
				return $response;
			}
		}

		wp_get_theme()->cache_delete();

		return new \WP_REST_Response(
			array(
				'status'  => 'SUCCESS',
				'message' => __( 'Theme Saved.', 'blockera' ),
			)
		);
	}

	/**
	 * Reset theme callback.
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return \WP_REST_Response
	 */
	public function rest_reset_theme( $request ) {
		$options = $request->get_params();

		if ( isset( $options['resetStyles'] ) && true === $options['resetStyles'] ) {
			ThemeStyles::clear_user_styles_customizations();
		}

		if ( isset( $options['resetTemplates'] ) && true === $options['resetTemplates'] ) {
			ThemeTemplates::clear_user_templates_customizations();
		}

		if ( isset( $options['resetTemplateParts'] ) && true === $options['resetTemplateParts'] ) {
			ThemeTemplates::clear_user_template_parts_customizations();
		}

		wp_get_theme()->cache_delete();

		return rest_ensure_response(
			array(
				'status'  => 'SUCCESS',
				'message' => __( 'Theme Reset.', 'blockera' ),
			)
		);
	}

	/**
	 * Sanitize theme data.
	 *
	 * @param array $theme Theme data to sanitize.
	 * @return array Sanitized theme data.
	 */
	private function sanitize_theme_data( $theme ) {
		$sanitized_theme                        = array();
		$sanitized_theme['name']                = sanitize_text_field( $theme['name'] );
		$sanitized_theme['description']         = sanitize_text_field( $theme['description'] ?? '' );
		$sanitized_theme['uri']                 = sanitize_text_field( $theme['uri'] ?? '' );
		$sanitized_theme['author']              = sanitize_text_field( $theme['author'] ?? '' );
		$sanitized_theme['author_uri']          = sanitize_text_field( $theme['author_uri'] ?? '' );
		$sanitized_theme['tags_custom']         = sanitize_text_field( $theme['tags_custom'] ?? '' );
		$sanitized_theme['version']             = sanitize_text_field( $theme['version'] ?? '' );
		$sanitized_theme['screenshot']          = sanitize_text_field( $theme['screenshot'] ?? '' );
		$sanitized_theme['requires_wp']         = sanitize_text_field( $theme['requires_wp'] ?? '' );
		$sanitized_theme['recommended_plugins'] = sanitize_textarea_field( $theme['recommended_plugins'] ?? '' );
		$sanitized_theme['font_credits']        = sanitize_textarea_field( $theme['font_credits'] ?? '' );
		$sanitized_theme['image_credits']       = sanitize_textarea_field( $theme['image_credits'] ?? '' );
		$sanitized_theme['template']            = '';
		$sanitized_theme['slug']                = sanitize_title( $theme['name'] );
		$sanitized_theme['text_domain']         = $sanitized_theme['slug'];
		return $sanitized_theme;
	}
}
