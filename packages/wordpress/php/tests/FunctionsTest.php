<?php

namespace Blockera\WordPress\Tests;

class FunctionsTest extends \WP_UnitTestCase {

	/**
	 * Test if the function returns a string.
	 */
	public function testGetSmallRandomHashReturnsString() {

		$result = blockera_get_small_random_hash();

		$this->assertIsString( $result, 'The function should return a string.' );
	}

	/**
	 * Test if the result matches base-36 format (a-z0-9).
	 */
	public function testGetSmallRandomHashFormat() {

		$result = blockera_get_small_random_hash();

		// Check if the result matches the expected regex for a base-36 string
		$this->assertMatchesRegularExpression( '/^[a-z0-9]+$/', $result, 'The result should be a base-36 string (lowercase letters and numbers only).' );
	}

	/**
	 * Test if the result length is approximately 9-10 characters.
	 */
	public function testGetSmallRandomHashLength() {

		$result = blockera_get_small_random_hash();
		$length = strlen( $result );

		// The function generates approximately 9-10 character base-36 strings
		$this->assertGreaterThanOrEqual( 8, $length, 'The result should be at least 8 characters long.' );
		$this->assertLessThanOrEqual( 11, $length, 'The result should be at most 11 characters long.' );
	}

	/**
	 * Test if multiple calls return different (unique) hashes.
	 */
	public function testGetSmallRandomHashUniqueness() {

		// Get the hash multiple times - each call should be unique
		$hash1 = blockera_get_small_random_hash();
		$hash2 = blockera_get_small_random_hash();
		$hash3 = blockera_get_small_random_hash();

		$this->assertNotSame( $hash1, $hash2, 'Each call should return a different hash.' );
		$this->assertNotSame( $hash2, $hash3, 'Each call should return a different hash.' );
		$this->assertNotSame( $hash1, $hash3, 'Each call should return a different hash.' );
	}

	/**
	 * Test randomness by comparing a large number of hashes.
	 */
	public function testGetSmallRandomHashMultipleRandomHashes() {

		$hashes = [];

		// Generate 1000 hashes
		for ( $i = 0; $i < 1000; $i++ ) {
			$hashes[] = blockera_get_small_random_hash();
		}

		// Check if all hashes are unique by comparing the count of unique values
		$uniqueHashes = array_unique( $hashes );
		$this->assertCount( 1000, $uniqueHashes, 'All generated hashes should be unique.' );
	}

	/**
	 * Test that the function can be called multiple times without errors.
	 */
	public function testGetSmallRandomHashMultipleCalls() {

		$results = [];

		// Call the function multiple times
		for ( $i = 0; $i < 100; $i++ ) {
			$result = blockera_get_small_random_hash();
			$results[] = $result;

			// Each result should be a valid base-36 string
			$this->assertMatchesRegularExpression( '/^[a-z0-9]+$/', $result );
		}

		// All results should be unique (or at least mostly unique)
		$uniqueResults = array_unique( $results );
		$this->assertGreaterThan( 95, count( $uniqueResults ), 'At least 95% of results should be unique.' );
	}

	public function testCreateCssSelector() {
		$selector = '.wp-block-sample:is(.a, .b)';
		$result = blockera_create_css_selector($selector);
		$this->assertEquals('.wp-block-sample:is(.a, .b)', $result);

		$selector = 'wp-block-sample blockera-block';
		$result = blockera_create_css_selector($selector);
		$this->assertEquals('.wp-block-sample.blockera-block', $result);

		$selector = '.wp-block-sample:is(.a, .b) blockera-block';
		$result = blockera_create_css_selector($selector);
		$this->assertEquals('.wp-block-sample:is(.a, .b).blockera-block', $result);
	}
}
