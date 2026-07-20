<?php

namespace Blockera\Editor\Tests;

/**
 * Input/output contract for blockera_get_available_block_supports().
 *
 * Locks every branch so a performance refactor can prove identical results.
 *
 * @covers ::blockera_get_available_block_supports
 */
class GetAvailableBlockSupportsTest extends \Blockera\Dev\PHPUnit\AppTestCase {

	/**
	 * Temp schema file used to exercise the empty-title skip branch.
	 *
	 * @var string|null
	 */
	private $temp_schema_file = null;

	public function set_up(): void {
		parent::set_up();
		$this->reset_cache();
	}

	public function tear_down(): void {
		$this->cleanup_temp_schema();
		$this->reset_cache();
		parent::tear_down();
	}

	/**
	 * Force cold path on the next call.
	 */
	private function reset_cache(): void {
		$GLOBALS['__blockera_reset_available_block_supports'] = true;
	}

	/**
	 * Remove any temp schema written for empty-title coverage.
	 */
	private function cleanup_temp_schema(): void {
		if ( null !== $this->temp_schema_file && file_exists( $this->temp_schema_file ) ) {
			unlink( $this->temp_schema_file );
		}
		$this->temp_schema_file = null;
	}

	/**
	 * Rebuild the expected payload the same way production does (glob + decode + icon).
	 *
	 * @return array<string, array>
	 */
	private function build_expected_supports(): array {
		$supports = [];
		$pattern  = blockera_core_config( 'app.vendor_path' ) . 'blockera/editor/js/schemas/block-supports/*-block-supports-list.json';
		$files    = glob( $pattern );

		if ( $files ) {
			foreach ( $files as $support_file ) {
				$raw = file_get_contents( $support_file );
				if ( false === $raw ) {
					continue;
				}

				$support = json_decode( $raw, true );

				if ( ! is_array( $support ) || empty( $support['title'] ) ) {
					continue;
				}

				$supports[ $support['title'] ] = $support;
			}
		}

		return blockera_add_icon_block_supports( $supports );
	}

	/**
	 * Schema directory used by the function under test.
	 */
	private function schemas_dir(): string {
		return blockera_core_config( 'app.vendor_path' ) . 'blockera/editor/js/schemas/block-supports';
	}

	public function testColdPathReturnsAllSchemaCategoriesPlusIcon(): void {
		$expected = $this->build_expected_supports();
		$actual   = blockera_get_available_block_supports();

		$this->assertIsArray( $actual );
		$this->assertSame( $expected, $actual );
		$this->assertArrayHasKey( 'icon', $actual );
		$this->assertCount( 14, $actual );

		$expected_titles = [
			'background',
			'border',
			'box-shadow',
			'divider',
			'effects',
			'layout',
			'mouse',
			'outline',
			'position',
			'size',
			'spacing',
			'state',
			'typography',
			'icon',
		];
		sort( $expected_titles );
		$actual_keys = array_keys( $actual );
		sort( $actual_keys );
		$this->assertSame( $expected_titles, $actual_keys );
	}

	public function testEachCategoryHasSupportsPayload(): void {
		$result = blockera_get_available_block_supports();

		foreach ( $result as $title => $support ) {
			$this->assertIsArray( $support, "Support for {$title} must be an array" );
			$this->assertArrayHasKey( 'supports', $support, "Support for {$title} must include supports" );
			$this->assertNotEmpty( $support['supports'], "Support for {$title} must not have empty supports" );
		}
	}

	public function testWarmPathReturnsIdenticalCachedArrayIncludingIcon(): void {
		$cold = blockera_get_available_block_supports();
		$warm = blockera_get_available_block_supports();

		$this->assertSame( $cold, $warm );
		$this->assertTrue( $cold === $warm, 'Warm hit must return the same array instance' );
		$this->assertArrayHasKey( 'icon', $warm );
		$this->assertSame( $this->build_expected_supports(), $warm );
	}

	public function testSkipsSchemaFilesWithEmptyTitle(): void {
		$this->temp_schema_file = $this->schemas_dir() . '/zzz-empty-title-block-supports-list.json';
		file_put_contents(
			$this->temp_schema_file,
			wp_json_encode(
				[
					'$schema'  => '../block.supports.schema.json',
					'title'    => '',
					'type'     => 'multiple',
					'supports' => [
						'blockeraShouldSkip' => [ 'status' => true ],
					],
				]
			)
		);

		$this->reset_cache();
		$result = blockera_get_available_block_supports();

		$this->assertArrayNotHasKey( '', $result );
		$this->assertArrayNotHasKey( 'blockeraShouldSkip', $result );
		foreach ( $result as $support ) {
			$this->assertArrayNotHasKey( 'blockeraShouldSkip', $support['supports'] ?? [] );
		}
		$this->assertSame( $this->build_expected_supports(), $result );
	}

	public function testSkipsSchemaFilesWithMissingTitle(): void {
		$this->temp_schema_file = $this->schemas_dir() . '/zzz-missing-title-block-supports-list.json';
		file_put_contents(
			$this->temp_schema_file,
			wp_json_encode(
				[
					'$schema'  => '../block.supports.schema.json',
					'type'     => 'multiple',
					'supports' => [
						'blockeraMissingTitle' => [ 'status' => true ],
					],
				]
			)
		);

		$this->reset_cache();
		$result = blockera_get_available_block_supports();

		foreach ( $result as $support ) {
			$this->assertArrayNotHasKey( 'blockeraMissingTitle', $support['supports'] ?? [] );
		}
		$this->assertSame( $this->build_expected_supports(), $result );
	}

	public function testSkipsInvalidJsonSchemaFiles(): void {
		$this->temp_schema_file = $this->schemas_dir() . '/zzz-invalid-json-block-supports-list.json';
		file_put_contents( $this->temp_schema_file, '{not-valid-json' );

		$this->reset_cache();
		$result = blockera_get_available_block_supports();

		$this->assertSame( $this->build_expected_supports(), $result );
		$this->assertCount( 14, $result );
	}

	public function testIconCategoryMatchesIconBlockSupportsHelper(): void {
		$result = blockera_get_available_block_supports();
		$icon   = blockera_add_icon_block_supports( [] );

		$this->assertSame( $icon['icon'], $result['icon'] );
		$this->assertSame( 'Blockera Icon Style Supports', $result['icon']['title'] );
	}

	public function testSpacingCategoryMatchesSourceJson(): void {
		$result   = blockera_get_available_block_supports();
		$filepath = $this->schemas_dir() . '/spacing-block-supports-list.json';
		$source   = json_decode( file_get_contents( $filepath ), true );

		$this->assertSame( $source, $result['spacing'] );
		$this->assertArrayHasKey( 'blockeraPadding', $result['spacing']['supports'] );
		$this->assertArrayHasKey( 'blockeraMargin', $result['spacing']['supports'] );
	}

	public function testReturnTypeIsArrayOnEveryPath(): void {
		$cold = blockera_get_available_block_supports();
		$warm = blockera_get_available_block_supports();

		$this->assertIsArray( $cold );
		$this->assertIsArray( $warm );
	}
}
