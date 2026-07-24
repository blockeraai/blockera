<?php

namespace Blockera\WordPress\Tests\Media;

use Blockera\WordPress\Media\SvgUpload;

/**
 * Tests for SVG upload gate helper and sanitization.
 */
class SvgUploadTest extends \WP_UnitTestCase {

	/**
	 * @var SvgUpload
	 */
	protected $svg_upload;

	/**
	 * Set up each test.
	 *
	 * @return void
	 */
	public function set_up(): void {
		parent::set_up();

		$this->svg_upload = new SvgUpload();

		// Ensure a clean settings option between tests.
		delete_option( 'blockera_settings' );
		remove_all_filters( 'blockera_is_svg_upload_enabled' );
	}

	/**
	 * Tear down each test.
	 *
	 * @return void
	 */
	public function tear_down(): void {
		delete_option( 'blockera_settings' );
		remove_all_filters( 'blockera_is_svg_upload_enabled' );

		parent::tear_down();
	}

	/**
	 * Defaults: experimental + general both on → enabled.
	 */
	public function test_is_svg_upload_enabled_defaults_to_true(): void {
		$this->assertTrue( blockera_is_svg_upload_enabled() );
	}

	/**
	 * Disabling the general setting turns the feature off.
	 */
	public function test_is_svg_upload_enabled_false_when_general_setting_off(): void {
		update_option(
			'blockera_settings',
			[
				'general' => [
					'enableSvgUpload' => false,
				],
			]
		);

		$this->assertFalse( blockera_is_svg_upload_enabled() );
	}

	/**
	 * Filter can force-disable regardless of defaults.
	 */
	public function test_is_svg_upload_enabled_respects_filter(): void {
		add_filter( 'blockera_is_svg_upload_enabled', '__return_false' );

		$this->assertFalse( blockera_is_svg_upload_enabled() );
	}

	/**
	 * MIME filter adds SVG.
	 */
	public function test_allow_svg_mime_types_adds_svg(): void {
		$mimes = $this->svg_upload->allow_svg_mime_types( [ 'jpg|jpeg|jpe' => 'image/jpeg' ] );

		$this->assertArrayHasKey( 'svg', $mimes );
		$this->assertSame( 'image/svg+xml', $mimes['svg'] );
		$this->assertSame( 'image/jpeg', $mimes['jpg|jpeg|jpe'] );
	}

	/**
	 * Filetype fix sets svg + mime when detection is empty.
	 */
	public function test_fix_mime_type_and_ext_for_svg(): void {
		$mimes = [ 'svg' => 'image/svg+xml' ];

		$data = $this->svg_upload->fix_mime_type_and_ext(
			[
				'ext'  => false,
				'type' => false,
			],
			'/tmp/icon.svg',
			'icon.svg',
			$mimes
		);

		$this->assertSame( 'svg', $data['ext'] );
		$this->assertSame( 'image/svg+xml', $data['type'] );
	}

	/**
	 * Filetype fix leaves non-empty detection alone.
	 */
	public function test_fix_mime_type_and_ext_preserves_existing(): void {
		$data = $this->svg_upload->fix_mime_type_and_ext(
			[
				'ext'  => 'png',
				'type' => 'image/png',
			],
			'/tmp/icon.png',
			'icon.png',
			[]
		);

		$this->assertSame( 'png', $data['ext'] );
		$this->assertSame( 'image/png', $data['type'] );
	}

	/**
	 * Clean SVG passes sanitization.
	 */
	public function test_sanitize_svg_string_keeps_clean_svg(): void {
		$clean_svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z"/></svg>';

		$result = $this->svg_upload->sanitize_svg_string( $clean_svg );

		$this->assertIsString( $result );
		$this->assertStringContainsString( '<svg', $result );
		$this->assertStringContainsString( '<path', $result );
	}

	/**
	 * Script tags are stripped / rejected from malicious SVG.
	 */
	public function test_sanitize_svg_string_removes_script(): void {
		$dirty_svg = '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script><circle cx="10" cy="10" r="5"/></svg>';

		$result = $this->svg_upload->sanitize_svg_string( $dirty_svg );

		$this->assertIsString( $result );
		$this->assertStringNotContainsString( '<script', strtolower( $result ) );
		$this->assertStringNotContainsString( 'alert(1)', $result );
		$this->assertStringContainsString( '<circle', $result );
	}

	/**
	 * Empty / invalid markup fails closed.
	 */
	public function test_sanitize_svg_string_rejects_invalid(): void {
		$this->assertFalse( $this->svg_upload->sanitize_svg_string( '' ) );
		$this->assertFalse( $this->svg_upload->sanitize_svg_string( 'not-an-svg' ) );
	}

	/**
	 * Prefilter rejects unsanitizable SVG uploads.
	 */
	public function test_sanitize_on_upload_rejects_empty_svg_file(): void {
		$tmp = wp_tempnam( 'blockera-empty.svg' );
		// phpcs:ignore WordPress.WP.AlternativeFunctions.file_system_operations_file_put_contents
		file_put_contents( $tmp, '' );

		$file = $this->svg_upload->sanitize_on_upload(
			[
				'name'     => 'empty.svg',
				'type'     => 'image/svg+xml',
				'tmp_name' => $tmp,
				'error'    => 0,
				'size'     => 0,
			]
		);

		$this->assertIsString( $file['error'] );
		$this->assertNotSame( '', $file['error'] );
		$this->assertNotSame( 0, $file['error'] );

		// phpcs:ignore WordPress.WP.AlternativeFunctions.unlink_unlink
		unlink( $tmp );
	}

	/**
	 * Prefilter rewrites temp file with sanitized content.
	 */
	public function test_sanitize_on_upload_writes_clean_svg(): void {
		$tmp = wp_tempnam( 'blockera-clean.svg' );
		$dirty = '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script><rect width="10" height="10"/></svg>';
		// phpcs:ignore WordPress.WP.AlternativeFunctions.file_system_operations_file_put_contents
		file_put_contents( $tmp, $dirty );

		$file = $this->svg_upload->sanitize_on_upload(
			[
				'name'     => 'icon.svg',
				'type'     => 'image/svg+xml',
				'tmp_name' => $tmp,
				'error'    => 0,
				'size'     => strlen( $dirty ),
			]
		);

		$this->assertSame( 0, $file['error'] );
		// phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents
		$stored = file_get_contents( $tmp );
		$this->assertStringNotContainsString( '<script', strtolower( $stored ) );
		$this->assertStringContainsString( '<rect', $stored );

		// phpcs:ignore WordPress.WP.AlternativeFunctions.unlink_unlink
		unlink( $tmp );
	}

	/**
	 * Non-SVG uploads are left untouched.
	 */
	public function test_sanitize_on_upload_ignores_non_svg(): void {
		$file = [
			'name'     => 'photo.jpg',
			'type'     => 'image/jpeg',
			'tmp_name' => '/tmp/photo.jpg',
			'error'    => 0,
			'size'     => 100,
		];

		$result = $this->svg_upload->sanitize_on_upload( $file );

		$this->assertSame( $file, $result );
	}
}
