<?php

namespace Blockera\Data\Tests;

use Blockera\Data\Cache\Version;
use Blockera\Dev\PHPUnit\AppTestCase;

/**
 * Test class for Version cache manager.
 *
 * @covers \Blockera\Data\Cache\Version
 */
class VersionTest extends AppTestCase {

	/**
	 * Version instance for testing.
	 *
	 * @var Version
	 */
	protected Version $version;

	/**
	 * Product ID used for testing.
	 *
	 * @var string
	 */
	protected string $product_id = 'test_product';

	/**
	 * Set up test environment before each test.
	 *
	 * @return void
	 */
	public function set_up(): void {
		parent::set_up();

		$this->version = new Version( [ 'product_id' => $this->product_id ] );

		// Ensure clean state before each test.
		$this->version->deleteVersion();
	}

	/**
	 * Tear down test environment after each test.
	 *
	 * @return void
	 */
	public function tear_down(): void {
		// Clean up version data.
		$this->version->deleteVersion();
		$this->version->clear();

		parent::tear_down();
	}

	// =========================================================================
	// CONSTRUCTOR TESTS
	// =========================================================================

	/**
	 * @test
	 */
	public function itShouldCreateVersionInstanceWithValidProductId(): void {
		$version = new Version( [ 'product_id' => 'valid_id' ] );

		$this->assertInstanceOf( Version::class, $version );
	}

	/**
	 * @test
	 */
	public function itShouldThrowExceptionWhenProductIdIsMissing(): void {
		$this->expectException( \Exception::class );
		$this->expectExceptionMessage( 'Product ID is required on Cache class constructor' );

		new Version( [] );
	}

	/**
	 * @test
	 */
	public function itShouldThrowExceptionWhenProductIdIsNotString(): void {
		$this->expectException( \Exception::class );
		$this->expectExceptionMessage( 'Invalid product ID format: expected string value on Cache class constructor' );

		new Version( [ 'product_id' => 123 ] );
	}

	// =========================================================================
	// VERSION CACHE KEY TESTS
	// =========================================================================

	/**
	 * @test
	 */
	public function itShouldGenerateCorrectVersionCacheKey(): void {
		$expected = 'blockera_' . $this->product_id . '_current_version';

		$this->assertEquals( $expected, $this->version->getVersionCacheKey() );
	}

	/**
	 * @test
	 */
	public function itShouldGenerateDifferentKeysForDifferentProducts(): void {
		$version_a = new Version( [ 'product_id' => 'product_a' ] );
		$version_b = new Version( [ 'product_id' => 'product_b' ] );

		$this->assertNotEquals(
			$version_a->getVersionCacheKey(),
			$version_b->getVersionCacheKey()
		);

		// Cleanup.
		$version_a->deleteVersion();
		$version_b->deleteVersion();
	}

	// =========================================================================
	// STORE VERSION TESTS
	// =========================================================================

	/**
	 * @test
	 */
	public function itShouldStoreVersion(): void {
		$result = $this->version->store( '1.0.0' );

		$this->assertTrue( $result );
	}

	/**
	 * @test
	 */
	public function itShouldGetStoredVersion(): void {
		$this->version->store( '1.2.3' );

		$result = $this->version->getStoredVersion();

		$this->assertEquals( '1.2.3', $result );
	}

	/**
	 * @test
	 */
	public function itShouldReturnEmptyStringWhenNoVersionStored(): void {
		$result = $this->version->getStoredVersion();

		$this->assertEquals( '', $result );
	}

	/**
	 * @test
	 */
	public function itShouldUpdateExistingVersion(): void {
		$this->version->store( '1.0.0' );
		$this->version->store( '2.0.0' );

		$result = $this->version->getStoredVersion();

		$this->assertEquals( '2.0.0', $result );
	}

	/**
	 * @test
	 */
	public function itShouldDeleteVersion(): void {
		$this->version->store( '1.0.0' );

		$deleted = $this->version->deleteVersion();

		$this->assertTrue( $deleted );
		$this->assertEquals( '', $this->version->getStoredVersion() );
	}

	/**
	 * @test
	 */
	public function itShouldReturnFalseWhenDeletingNonExistentVersion(): void {
		$result = $this->version->deleteVersion();

		$this->assertFalse( $result );
	}

	// =========================================================================
	// VALIDATE TESTS
	// =========================================================================

	/**
	 * @test
	 */
	public function itShouldReturnTrueOnFirstValidation(): void {
		// No version stored yet.
		$result = $this->version->validate( '1.0.0' );

		$this->assertTrue( $result );
	}

	/**
	 * @test
	 */
	public function itShouldStoreVersionOnFirstValidation(): void {
		$this->version->validate( '1.0.0' );

		$stored = $this->version->getStoredVersion();

		$this->assertEquals( '1.0.0', $stored );
	}

	/**
	 * @test
	 */
	public function itShouldReturnTrueWhenVersionsMatch(): void {
		$this->version->store( '1.0.0' );

		$result = $this->version->validate( '1.0.0' );

		$this->assertTrue( $result );
	}

	/**
	 * @test
	 */
	public function itShouldReturnFalseWhenVersionsDontMatch(): void {
		$this->version->store( '1.0.0' );

		$result = $this->version->validate( '2.0.0' );

		$this->assertFalse( $result );
	}

	/**
	 * @test
	 */
	public function itShouldHandleMajorVersionChange(): void {
		$this->version->store( '1.0.0' );

		$this->assertFalse( $this->version->validate( '2.0.0' ) );
	}

	/**
	 * @test
	 */
	public function itShouldHandleMinorVersionChange(): void {
		$this->version->store( '1.0.0' );

		$this->assertFalse( $this->version->validate( '1.1.0' ) );
	}

	/**
	 * @test
	 */
	public function itShouldHandlePatchVersionChange(): void {
		$this->version->store( '1.0.0' );

		$this->assertFalse( $this->version->validate( '1.0.1' ) );
	}

	/**
	 * @test
	 * @dataProvider versionComparisonProvider
	 *
	 * @param string $stored_version   The stored version.
	 * @param string $current_version  The current version to validate.
	 * @param bool   $expected_result  Expected validation result.
	 */
	public function itShouldValidateVersionsCorrectly(
		string $stored_version,
		string $current_version,
		bool $expected_result
	): void {
		$this->version->store( $stored_version );

		$result = $this->version->validate( $current_version );

		$this->assertEquals( $expected_result, $result );
	}

	/**
	 * Data provider for version comparison tests.
	 *
	 * @return array
	 */
	public function versionComparisonProvider(): array {
		return [
			'exact match'               => [ '1.0.0', '1.0.0', true ],
			'major upgrade'             => [ '1.0.0', '2.0.0', false ],
			'major downgrade'           => [ '2.0.0', '1.0.0', false ],
			'minor upgrade'             => [ '1.0.0', '1.1.0', false ],
			'minor downgrade'           => [ '1.1.0', '1.0.0', false ],
			'patch upgrade'             => [ '1.0.0', '1.0.1', false ],
			'patch downgrade'           => [ '1.0.1', '1.0.0', false ],
			'with v prefix match'       => [ 'v1.0.0', 'v1.0.0', true ],
			'with pre-release'          => [ '1.0.0-beta', '1.0.0', false ],
			'complex version match'     => [ '1.12.1', '1.12.1', true ],
			'complex version mismatch'  => [ '1.12.0', '1.12.1', false ],
		];
	}

	// =========================================================================
	// INVALIDATE IF VERSION CHANGED TESTS
	// =========================================================================

	/**
	 * @test
	 */
	public function itShouldNotInvalidateCacheWhenVersionMatches(): void {
		$this->version->store( '1.0.0' );
		$this->version->setOptionCache( 'test_key', 'test_value' );

		$invalidated = $this->version->invalidateIfVersionChanged( '1.0.0' );

		$this->assertFalse( $invalidated );
		// Cache should still exist.
		$this->assertEquals( 'test_value', $this->version->getOptionCache( 'test_key' ) );
	}

	/**
	 * @test
	 */
	public function itShouldInvalidateCacheWhenVersionChanges(): void {
		$this->version->store( '1.0.0' );
		$this->version->setOptionCache( 'test_key', 'test_value' );

		$invalidated = $this->version->invalidateIfVersionChanged( '2.0.0' );

		$this->assertTrue( $invalidated );
		// Cache should be cleared.
		$this->assertFalse( $this->version->getOptionCache( 'test_key' ) );
	}

	/**
	 * @test
	 */
	public function itShouldUpdateVersionAfterInvalidation(): void {
		$this->version->store( '1.0.0' );

		$this->version->invalidateIfVersionChanged( '2.0.0' );

		$this->assertEquals( '2.0.0', $this->version->getStoredVersion() );
	}

	/**
	 * @test
	 */
	public function itShouldNotInvalidateOnFirstRun(): void {
		// No version stored yet.
		$invalidated = $this->version->invalidateIfVersionChanged( '1.0.0' );

		$this->assertFalse( $invalidated );
		$this->assertEquals( '1.0.0', $this->version->getStoredVersion() );
	}

	/**
	 * @test
	 */
	public function itShouldClearAllCacheTypesOnInvalidation(): void {
		// Create a post for meta cache testing.
		$post_id = self::factory()->post->create();

		$this->version->store( '1.0.0' );
		$this->version->setMetaCache( $post_id, 'meta_key', 'meta_value' );
		$this->version->setOptionCache( 'option_key', 'option_value' );
		$this->version->setTransientCache( 'transient_key', 'transient_value' );

		$this->version->invalidateIfVersionChanged( '2.0.0' );

		$this->assertEmpty( $this->version->getMetaCache( $post_id, 'meta_key' ) );
		$this->assertFalse( $this->version->getOptionCache( 'option_key' ) );
		$this->assertFalse( $this->version->getTransientCache( 'transient_key' ) );

		// Cleanup.
		wp_delete_post( $post_id, true );
	}

	// =========================================================================
	// ISOLATION TESTS
	// =========================================================================

	/**
	 * @test
	 */
	public function itShouldIsolateVersionsByProductId(): void {
		$version_a = new Version( [ 'product_id' => 'product_a' ] );
		$version_b = new Version( [ 'product_id' => 'product_b' ] );

		$version_a->store( '1.0.0' );
		$version_b->store( '2.0.0' );

		$this->assertEquals( '1.0.0', $version_a->getStoredVersion() );
		$this->assertEquals( '2.0.0', $version_b->getStoredVersion() );

		// Cleanup.
		$version_a->deleteVersion();
		$version_b->deleteVersion();
	}

	/**
	 * @test
	 */
	public function itShouldNotAffectOtherProductWhenInvalidating(): void {
		$version_a = new Version( [ 'product_id' => 'product_a' ] );
		$version_b = new Version( [ 'product_id' => 'product_b' ] );

		$version_a->store( '1.0.0' );
		$version_a->setOptionCache( 'key', 'value_a' );

		$version_b->store( '1.0.0' );
		$version_b->setOptionCache( 'key', 'value_b' );

		// Invalidate only product_a.
		$version_a->invalidateIfVersionChanged( '2.0.0' );

		// Product B cache should still exist.
		$this->assertEquals( 'value_b', $version_b->getOptionCache( 'key' ) );
		$this->assertEquals( '1.0.0', $version_b->getStoredVersion() );

		// Cleanup.
		$version_a->deleteVersion();
		$version_a->clear();
		$version_b->deleteVersion();
		$version_b->clear();
	}

	// =========================================================================
	// INHERITANCE TESTS
	// =========================================================================

	/**
	 * @test
	 */
	public function itShouldInheritCacheMethodsFromParent(): void {
		// Test that Version still has access to parent Cache methods.
		$this->version->setOptionCache( 'inherited_key', 'inherited_value' );

		$result = $this->version->getOptionCache( 'inherited_key' );

		$this->assertEquals( 'inherited_value', $result );
	}

	/**
	 * @test
	 */
	public function itShouldHaveSeparateCacheKeyFromVersionKey(): void {
		$cache_key   = $this->version->getCacheKey( 'test' );
		$version_key = $this->version->getVersionCacheKey();

		$this->assertNotEquals( $cache_key, $version_key );
		$this->assertStringContainsString( 'product_data', $cache_key );
		$this->assertStringContainsString( 'current_version', $version_key );
	}
}

