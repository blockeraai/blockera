<?php

namespace Blockera\Data\Tests;

use Blockera\Data\Cache\Cache;
use Blockera\Dev\PHPUnit\AppTestCase;

/**
 * Test class for Cache.
 *
 * @covers \Blockera\Data\Cache\Cache
 */
class CacheTest extends AppTestCase {

	/**
	 * Cache instance for testing.
	 *
	 * @var Cache
	 */
	protected Cache $cache;

	/**
	 * Test post ID.
	 *
	 * @var int
	 */
	protected int $post_id;

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

		$this->cache = new Cache( [ 'product_id' => $this->product_id ] );

		// Create a test post.
		$this->post_id = self::factory()->post->create(
			[
				'post_title'  => 'Test Post',
				'post_status' => 'publish',
			]
		);
	}

	/**
	 * Tear down test environment after each test.
	 *
	 * @return void
	 */
	public function tear_down(): void {
		// Clean up all cache data.
		$this->cache->clear();

		// Delete test post.
		wp_delete_post( $this->post_id, true );

		parent::tear_down();
	}

	// =========================================================================
	// CONSTRUCTOR TESTS
	// =========================================================================

	/**
	 * @test
	 */
	public function itShouldThrowExceptionWhenProductIdIsMissing(): void {
		$this->expectException( \Exception::class );
		$this->expectExceptionMessage( 'Product ID is required on Cache class constructor' );

		new Cache( [] );
	}

	/**
	 * @test
	 */
	public function itShouldThrowExceptionWhenProductIdIsNotString(): void {
		$this->expectException( \Exception::class );
		$this->expectExceptionMessage( 'Invalid product ID format: expected string value on Cache class constructor' );

		new Cache( [ 'product_id' => 123 ] );
	}

	/**
	 * @test
	 */
	public function itShouldCreateCacheInstanceWithValidProductId(): void {
		$cache = new Cache( [ 'product_id' => 'valid_id' ] );

		$this->assertInstanceOf( Cache::class, $cache );
	}

	// =========================================================================
	// CACHE KEY TESTS
	// =========================================================================

	/**
	 * @test
	 */
	public function itShouldGenerateCorrectCacheKey(): void {
		$key      = 'my_key';
		$expected = 'blockera_' . $this->product_id . '_product_data_' . $key;

		$this->assertEquals( $expected, $this->cache->getCacheKey( $key ) );
	}

	/**
	 * @test
	 */
	public function itShouldGenerateCacheKeyWithEmptyInput(): void {
		$expected = 'blockera_' . $this->product_id . '_product_data_';

		$this->assertEquals( $expected, $this->cache->getCacheKey( '' ) );
	}

	// =========================================================================
	// POST META CACHE TESTS
	// =========================================================================

	/**
	 * @test
	 */
	public function itShouldSetMetaCache(): void {
		$result = $this->cache->setMetaCache( $this->post_id, 'test_key', 'test_value' );

		$this->assertTrue( $result );
	}

	/**
	 * @test
	 */
	public function itShouldGetMetaCache(): void {
		$this->cache->setMetaCache( $this->post_id, 'test_key', 'test_value' );

		$result = $this->cache->getMetaCache( $this->post_id, 'test_key' );

		$this->assertEquals( 'test_value', $result );
	}

	/**
	 * @test
	 */
	public function itShouldDeleteMetaCache(): void {
		$this->cache->setMetaCache( $this->post_id, 'test_key', 'test_value' );

		$deleted = $this->cache->deleteMetaCache( $this->post_id, 'test_key' );

		$this->assertTrue( $deleted );
		$this->assertEmpty( $this->cache->getMetaCache( $this->post_id, 'test_key' ) );
	}

	/**
	 * @test
	 */
	public function itShouldThrowExceptionForInvalidPostIdInSetMetaCache(): void {
		$this->expectException( \Exception::class );
		$this->expectExceptionMessage( 'Valid post ID is required for meta cache' );

		$this->cache->setMetaCache( 0, 'test_key', 'test_value' );
	}

	/**
	 * @test
	 */
	public function itShouldThrowExceptionForNegativePostIdInSetMetaCache(): void {
		$this->expectException( \Exception::class );
		$this->expectExceptionMessage( 'Valid post ID is required for meta cache' );

		$this->cache->setMetaCache( -1, 'test_key', 'test_value' );
	}

	/**
	 * @test
	 */
	public function itShouldThrowExceptionForEmptyKeyInSetMetaCache(): void {
		$this->expectException( \Exception::class );
		$this->expectExceptionMessage( 'Key is required on setMetaCache method' );

		$this->cache->setMetaCache( $this->post_id, '', 'test_value' );
	}

	/**
	 * @test
	 */
	public function itShouldReturnEmptyStringForInvalidPostIdInGetMetaCache(): void {
		$result = $this->cache->getMetaCache( 0, 'test_key' );

		$this->assertEquals( '', $result );
	}

	/**
	 * @test
	 */
	public function itShouldReturnFalseForInvalidPostIdInDeleteMetaCache(): void {
		$result = $this->cache->deleteMetaCache( 0, 'test_key' );

		$this->assertFalse( $result );
	}

	/**
	 * @test
	 */
	public function itShouldStoreArrayInMetaCache(): void {
		$data = [
			'key1' => 'value1',
			'key2' => [ 'nested' => 'data' ],
		];

		$this->cache->setMetaCache( $this->post_id, 'array_key', $data );

		$result = $this->cache->getMetaCache( $this->post_id, 'array_key' );

		$this->assertEquals( $data, $result );
	}

	// =========================================================================
	// OPTIONS CACHE TESTS
	// =========================================================================

	/**
	 * @test
	 */
	public function itShouldSetOptionCache(): void {
		$result = $this->cache->setOptionCache( 'test_key', 'test_value' );

		$this->assertTrue( $result );
	}

	/**
	 * @test
	 */
	public function itShouldGetOptionCache(): void {
		$this->cache->setOptionCache( 'test_key', 'test_value' );

		$result = $this->cache->getOptionCache( 'test_key' );

		$this->assertEquals( 'test_value', $result );
	}

	/**
	 * @test
	 */
	public function itShouldDeleteOptionCache(): void {
		$this->cache->setOptionCache( 'test_key', 'test_value' );

		$deleted = $this->cache->deleteOptionCache( 'test_key' );

		$this->assertTrue( $deleted );
		$this->assertFalse( $this->cache->getOptionCache( 'test_key' ) );
	}

	/**
	 * @test
	 */
	public function itShouldThrowExceptionForEmptyKeyInSetOptionCache(): void {
		$this->expectException( \Exception::class );
		$this->expectExceptionMessage( 'Key is required on setOptionCache method' );

		$this->cache->setOptionCache( '', 'test_value' );
	}

	/**
	 * @test
	 */
	public function itShouldReturnDefaultValueWhenOptionNotFound(): void {
		$result = $this->cache->getOptionCache( 'nonexistent_key', 'default_value' );

		$this->assertEquals( 'default_value', $result );
	}

	/**
	 * @test
	 */
	public function itShouldAppendHashToKeyWhenCacheHasHash(): void {
		$data = [
			'value' => 'test',
			'hash'  => 'abc123',
		];

		$this->cache->setOptionCache( 'test_key', $data );

		// The option should be stored with hash appended to key.
		$expected_key = $this->cache->getCacheKey( 'test_key' ) . '_abc123';
		$result       = get_option( $expected_key );

		$this->assertEquals( $data, $result );
	}

	/**
	 * @test
	 */
	public function itShouldStoreArrayInOptionCache(): void {
		$data = [
			'key1' => 'value1',
			'key2' => [ 'nested' => 'data' ],
		];

		$this->cache->setOptionCache( 'array_key', $data );

		$result = $this->cache->getOptionCache( 'array_key' );

		$this->assertEquals( $data, $result );
	}

	// =========================================================================
	// TRANSIENT CACHE TESTS
	// =========================================================================

	/**
	 * @test
	 */
	public function itShouldSetTransientCache(): void {
		$result = $this->cache->setTransientCache( 'test_key', 'test_value' );

		$this->assertTrue( $result );
	}

	/**
	 * @test
	 */
	public function itShouldGetTransientCache(): void {
		$this->cache->setTransientCache( 'test_key', 'test_value' );

		$result = $this->cache->getTransientCache( 'test_key' );

		$this->assertEquals( 'test_value', $result );
	}

	/**
	 * @test
	 */
	public function itShouldDeleteTransientCache(): void {
		$this->cache->setTransientCache( 'test_key', 'test_value' );

		$deleted = $this->cache->deleteTransientCache( 'test_key' );

		$this->assertTrue( $deleted );
		$this->assertFalse( $this->cache->getTransientCache( 'test_key' ) );
	}

	/**
	 * @test
	 */
	public function itShouldThrowExceptionForEmptyKeyInSetTransientCache(): void {
		$this->expectException( \Exception::class );
		$this->expectExceptionMessage( 'Key is required on setTransientCache method' );

		$this->cache->setTransientCache( '', 'test_value' );
	}

	/**
	 * @test
	 */
	public function itShouldReturnFalseWhenTransientNotFound(): void {
		$result = $this->cache->getTransientCache( 'nonexistent_key' );

		$this->assertFalse( $result );
	}

	/**
	 * @test
	 */
	public function itShouldStoreArrayInTransientCache(): void {
		$data = [
			'key1' => 'value1',
			'key2' => [ 'nested' => 'data' ],
		];

		$this->cache->setTransientCache( 'array_key', $data );

		$result = $this->cache->getTransientCache( 'array_key' );

		$this->assertEquals( $data, $result );
	}

	/**
	 * @test
	 */
	public function itShouldSetTransientWithCustomExpiration(): void {
		$this->cache->setTransientCache( 'test_key', 'test_value', 300 );

		$result = $this->cache->getTransientCache( 'test_key' );

		$this->assertEquals( 'test_value', $result );
	}

	// =========================================================================
	// LEGACY/BACKWARD COMPATIBLE METHOD TESTS
	// =========================================================================

	/**
	 * @test
	 */
	public function itShouldRouteToCacheMetaWhenPostIdProvided(): void {
		$this->cache->setCache( $this->post_id, 'test_key', 'test_value' );

		$result = $this->cache->getMetaCache( $this->post_id, 'test_key' );

		$this->assertEquals( 'test_value', $result );
	}

	/**
	 * @test
	 */
	public function itShouldRouteToCacheOptionWhenPostIdIsZero(): void {
		$this->cache->setCache( 0, 'test_key', 'test_value' );

		$result = $this->cache->getOptionCache( 'test_key' );

		$this->assertEquals( 'test_value', $result );
	}

	/**
	 * @test
	 */
	public function itShouldGetCacheFromMetaWhenPostIdProvided(): void {
		$this->cache->setMetaCache( $this->post_id, 'test_key', 'meta_value' );

		$result = $this->cache->getCache( $this->post_id, 'test_key' );

		$this->assertEquals( 'meta_value', $result );
	}

	/**
	 * @test
	 */
	public function itShouldGetCacheFromOptionWhenPostIdIsZero(): void {
		$this->cache->setOptionCache( 'test_key', 'option_value' );

		$result = $this->cache->getCache( 0, 'test_key' );

		$this->assertEquals( 'option_value', $result );
	}

	/**
	 * @test
	 */
	public function itShouldDeleteCacheFromMetaAndOption(): void {
		$this->cache->setMetaCache( $this->post_id, 'test_key', 'meta_value' );
		$this->cache->setOptionCache( 'test_key', 'option_value' );

		$this->cache->deleteCache( 'test_key', $this->post_id );

		$this->assertEmpty( $this->cache->getMetaCache( $this->post_id, 'test_key' ) );
		$this->assertFalse( $this->cache->getOptionCache( 'test_key' ) );
	}

	/**
	 * @test
	 */
	public function itShouldThrowExceptionForEmptyKeyInSetCache(): void {
		$this->expectException( \Exception::class );
		$this->expectExceptionMessage( 'Key #2 Argument is required on setCache method of Cache class' );

		$this->cache->setCache( 0, '', 'test_value' );
	}

	/**
	 * @test
	 */
	public function itShouldThrowExceptionForEmptyCacheInSetCache(): void {
		$this->expectException( \Exception::class );
		$this->expectExceptionMessage( 'Cache #3 Argument is required on setCache method of Cache class' );

		$this->cache->setCache( 0, 'test_key', '' );
	}

	// =========================================================================
	// BULK CLEAR METHOD TESTS
	// =========================================================================

	/**
	 * @test
	 */
	public function itShouldClearMetaCache(): void {
		$this->cache->setMetaCache( $this->post_id, 'key1', 'value1' );
		$this->cache->setMetaCache( $this->post_id, 'key2', 'value2' );

		$result = $this->cache->clearMetaCache();

		$this->assertTrue( $result );
		$this->assertEmpty( $this->cache->getMetaCache( $this->post_id, 'key1' ) );
		$this->assertEmpty( $this->cache->getMetaCache( $this->post_id, 'key2' ) );
	}

	/**
	 * @test
	 */
	public function itShouldClearOptionCache(): void {
		$this->cache->setOptionCache( 'key1', 'value1' );
		$this->cache->setOptionCache( 'key2', 'value2' );

		$result = $this->cache->clearOptionCache();

		$this->assertTrue( $result );
		$this->assertFalse( $this->cache->getOptionCache( 'key1' ) );
		$this->assertFalse( $this->cache->getOptionCache( 'key2' ) );
	}

	/**
	 * @test
	 */
	public function itShouldClearTransientCache(): void {
		$this->cache->setTransientCache( 'key1', 'value1' );
		$this->cache->setTransientCache( 'key2', 'value2' );

		$result = $this->cache->clearTransientCache();

		$this->assertTrue( $result );
		$this->assertFalse( $this->cache->getTransientCache( 'key1' ) );
		$this->assertFalse( $this->cache->getTransientCache( 'key2' ) );
	}

	/**
	 * @test
	 */
	public function itShouldClearAllCacheTypes(): void {
		// Set cache in all types.
		$this->cache->setMetaCache( $this->post_id, 'meta_key', 'meta_value' );
		$this->cache->setOptionCache( 'option_key', 'option_value' );
		$this->cache->setTransientCache( 'transient_key', 'transient_value' );

		$result = $this->cache->clear();

		$this->assertTrue( $result );
		$this->assertEmpty( $this->cache->getMetaCache( $this->post_id, 'meta_key' ) );
		$this->assertFalse( $this->cache->getOptionCache( 'option_key' ) );
		$this->assertFalse( $this->cache->getTransientCache( 'transient_key' ) );
	}

	/**
	 * @test
	 */
	public function itShouldReturnFalseWhenNoCacheToCleared(): void {
		// Create a fresh cache instance with unique product_id.
		$empty_cache = new Cache( [ 'product_id' => 'empty_product_' . time() ] );

		$result = $empty_cache->clear();

		$this->assertFalse( $result );
	}

	/**
	 * @test
	 */
	public function itShouldClearStyleEngineCache(): void {
		global $wpdb;

		// Insert a test style engine option.
		$wpdb->insert(
			$wpdb->options,
			[
				'option_name'  => 'wp_block_test_style',
				'option_value' => 'test_value',
				'autoload'     => 'no',
			]
		);

		$result = $this->cache->clearStyleEngineCache();

		$this->assertTrue( $result );

		// Verify the option was deleted.
		$option = $wpdb->get_var(
			$wpdb->prepare(
				"SELECT option_value FROM $wpdb->options WHERE option_name = %s",
				'wp_block_test_style'
			)
		);

		$this->assertNull( $option );
	}

	// =========================================================================
	// ISOLATION TESTS
	// =========================================================================

	/**
	 * @test
	 */
	public function itShouldIsolateCacheByProductId(): void {
		$cache_a = new Cache( [ 'product_id' => 'product_a' ] );
		$cache_b = new Cache( [ 'product_id' => 'product_b' ] );

		$cache_a->setOptionCache( 'same_key', 'value_a' );
		$cache_b->setOptionCache( 'same_key', 'value_b' );

		$this->assertEquals( 'value_a', $cache_a->getOptionCache( 'same_key' ) );
		$this->assertEquals( 'value_b', $cache_b->getOptionCache( 'same_key' ) );

		// Cleanup.
		$cache_a->clear();
		$cache_b->clear();
	}

	/**
	 * @test
	 */
	public function itShouldNotAffectOtherProductCacheWhenClearing(): void {
		$cache_a = new Cache( [ 'product_id' => 'product_a' ] );
		$cache_b = new Cache( [ 'product_id' => 'product_b' ] );

		$cache_a->setOptionCache( 'test_key', 'value_a' );
		$cache_b->setOptionCache( 'test_key', 'value_b' );

		// Clear only cache_a.
		$cache_a->clearOptionCache();

		$this->assertFalse( $cache_a->getOptionCache( 'test_key' ) );
		$this->assertEquals( 'value_b', $cache_b->getOptionCache( 'test_key' ) );

		// Cleanup.
		$cache_b->clear();
	}

	// =========================================================================
	// DATA PROVIDER TESTS
	// =========================================================================

	/**
	 * @test
	 * @dataProvider cacheValueProvider
	 *
	 * @param mixed $value The value to cache.
	 */
	public function itShouldStoreVariousDataTypesInMetaCache( $value ): void {
		$this->cache->setMetaCache( $this->post_id, 'data_type_test', $value );

		$result = $this->cache->getMetaCache( $this->post_id, 'data_type_test' );

		$this->assertEquals( $value, $result );
	}

	/**
	 * @test
	 * @dataProvider cacheValueProvider
	 *
	 * @param mixed $value The value to cache.
	 */
	public function itShouldStoreVariousDataTypesInOptionCache( $value ): void {
		$this->cache->setOptionCache( 'data_type_test', $value );

		$result = $this->cache->getOptionCache( 'data_type_test' );

		$this->assertEquals( $value, $result );
	}

	/**
	 * @test
	 * @dataProvider cacheValueProvider
	 *
	 * @param mixed $value The value to cache.
	 */
	public function itShouldStoreVariousDataTypesInTransientCache( $value ): void {
		$this->cache->setTransientCache( 'data_type_test', $value );

		$result = $this->cache->getTransientCache( 'data_type_test' );

		$this->assertEquals( $value, $result );
	}

	/**
	 * Data provider for cache value tests.
	 *
	 * @return array
	 */
	public function cacheValueProvider(): array {
		return [
			'string'           => [ 'simple string value' ],
			'integer'          => [ 42 ],
			'float'            => [ 3.14159 ],
			'boolean true'     => [ true ],
			'simple array'     => [ [ 'a', 'b', 'c' ] ],
			'associative array'=> [
				[
					'key1' => 'value1',
					'key2' => 'value2',
				],
			],
			'nested array'     => [
				[
					'level1' => [
						'level2' => [
							'level3' => 'deep value',
						],
					],
				],
			],
			'object as array'  => [
				[
					'name'  => 'Test',
					'data'  => [ 1, 2, 3 ],
					'meta'  => [ 'created' => '2024-01-01' ],
				],
			],
		];
	}
}

