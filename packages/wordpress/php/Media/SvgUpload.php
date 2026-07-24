<?php
/**
 * Enable and sanitize SVG uploads in the WordPress Media Library.
 *
 * @package Blockera\WordPress\Media
 */

namespace Blockera\WordPress\Media;

use enshrined\svgSanitize\Sanitizer;

/**
 * Registers WordPress upload hooks to allow SVG MIME types and sanitize file contents.
 */
class SvgUpload {

	/**
	 * SVG MIME type.
	 *
	 * @var string
	 */
	const MIME_TYPE = 'image/svg+xml';

	/**
	 * Sanitizer instance.
	 *
	 * @var Sanitizer
	 */
	protected Sanitizer $sanitizer;

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->sanitizer = new Sanitizer();
		$this->sanitizer->removeRemoteReferences( true );
	}

	/**
	 * Register upload-related hooks.
	 *
	 * Call only when SVG upload is enabled (experimental + general setting).
	 *
	 * @return void
	 */
	public function register(): void {
		add_filter( 'upload_mimes', [ $this, 'allow_svg_mime_types' ] );
		add_filter( 'wp_check_filetype_and_ext', [ $this, 'fix_mime_type_and_ext' ], 10, 5 );
		add_filter( 'wp_handle_upload_prefilter', [ $this, 'sanitize_on_upload' ] );
	}

	/**
	 * Allow SVG MIME type in WordPress uploads.
	 *
	 * @param array $mimes Allowed mime types.
	 *
	 * @return array
	 */
	public function allow_svg_mime_types( array $mimes ): array {
		$mimes['svg'] = self::MIME_TYPE;

		return $mimes;
	}

	/**
	 * Correct filetype detection for SVG (fileinfo often mis-detects).
	 *
	 * @param array         $data     File data values with extension and type.
	 * @param string        $file     Full path to the file.
	 * @param string        $filename The name of the file.
	 * @param string[]|null $mimes    Array of mime types keyed by extension.
	 * @param string        $real_mime Real MIME type if already determined.
	 *
	 * @return array
	 */
	public function fix_mime_type_and_ext( $data, $file, $filename, $mimes, $real_mime = null ): array {
		if ( ! empty( $data['ext'] ) && ! empty( $data['type'] ) ) {
			return $data;
		}

		$filetype = wp_check_filetype( $filename, $mimes );

		if ( 'svg' === ( $filetype['ext'] ?? '' ) ) {
			$data['ext']             = 'svg';
			$data['type']            = self::MIME_TYPE;
			$data['proper_filename'] = $data['proper_filename'] ?? false;
		}

		return $data;
	}

	/**
	 * Sanitize SVG files before WordPress stores them. Fail closed on invalid/unsafe content.
	 *
	 * @param array $file Upload file array from $_FILES.
	 *
	 * @return array
	 */
	public function sanitize_on_upload( array $file ): array {
		if ( ! $this->is_svg_file( $file ) ) {
			return $file;
		}

		$tmp_name = $file['tmp_name'] ?? '';

		if ( '' === $tmp_name || ! is_readable( $tmp_name ) ) {
			$file['error'] = __(
				'Sorry, this SVG file could not be read and was not uploaded.',
				'blockera'
			);

			return $file;
		}

		if ( ! $this->sanitize_file( $tmp_name ) ) {
			$file['error'] = __(
				'Sorry, this SVG file could not be sanitized so for security reasons it was not uploaded.',
				'blockera'
			);
		}

		return $file;
	}

	/**
	 * Sanitize an SVG file in place.
	 *
	 * @param string $file_path Absolute path to the temporary upload file.
	 *
	 * @return bool True when sanitized content was written; false on failure.
	 */
	public function sanitize_file( string $file_path ): bool {
		// phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents -- reading upload temp file.
		$dirty = file_get_contents( $file_path );

		if ( false === $dirty || '' === $dirty ) {
			return false;
		}

		$clean = $this->sanitize_svg_string( $dirty );

		if ( false === $clean || '' === $clean ) {
			return false;
		}

		// phpcs:ignore WordPress.WP.AlternativeFunctions.file_system_operations_file_put_contents -- writing upload temp file.
		return false !== file_put_contents( $file_path, $clean );
	}

	/**
	 * Sanitize a raw SVG string.
	 *
	 * @param string $dirty_svg Untrusted SVG markup.
	 *
	 * @return string|false Clean SVG markup, or false if sanitization failed.
	 */
	public function sanitize_svg_string( string $dirty_svg ) {
		$clean = $this->sanitizer->sanitize( $dirty_svg );

		if ( false === $clean || '' === trim( $clean ) ) {
			return false;
		}

		return $clean;
	}

	/**
	 * Whether the upload looks like an SVG file.
	 *
	 * @param array $file Upload file array.
	 *
	 * @return bool
	 */
	protected function is_svg_file( array $file ): bool {
		$type = $file['type'] ?? '';

		if ( self::MIME_TYPE === $type ) {
			return true;
		}

		$name = $file['name'] ?? '';

		return is_string( $name ) && (bool) preg_match( '/\.svg$/i', $name );
	}
}
