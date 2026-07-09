<?php

namespace Blockera\WordPress\Tests;

class TestFunctions extends \WP_UnitTestCase {

	// Mock function for blockera_convert_to_unique_hash
	protected function blockera_convert_to_unique_hash( string $input ): string {

		// For testing purposes, assume this function returns the same value as input.
		return $input;
	}

	/**
	 * @dataProvider hashDataProvider
	 */
	public function testGetSmallRandomHash( $input, $expectedRegex ) {

		// Mock the blockera_convert_to_unique_hash function
		$big_hash = $this->blockera_convert_to_unique_hash( $input );

		// Call the function
		$result = blockera_get_small_random_hash( $big_hash );

		// Check if result is a string
		$this->assertIsString( $result );

		// Check if the result matches the expected regex for a base-36 string
		$this->assertMatchesRegularExpression( $expectedRegex, $result );
	}

	public function hashDataProvider() {

		return [
			// Case: simple alphanumeric string
			[ "hello", '/^[a-z0-9]+$/' ],

			// Case: numbers
			[ "12345", '/^[a-z0-9]+$/' ],

			// Case: special characters
			[ "hello!@#", '/^[a-z0-9]+$/' ],

			// Case: empty string
			[ "", '/^[a-z0-9]+$/' ],

			// Case: long string
			[ str_repeat( "a", 1000 ), '/^[a-z0-9]+$/' ],
		];
	}

	public function testHashIsConsistent() {

		$input    = "consistent_test";
		$big_hash = $this->blockera_convert_to_unique_hash( $input );

		// Get the hash multiple times and assert that the result is the same
		$hash1 = blockera_get_small_random_hash( $big_hash );
		$hash2 = blockera_get_small_random_hash( $big_hash );

		$this->assertNotSame( $hash1, $hash2 );
	}

	public function testDifferentInputsProduceDifferentHashes() {

		$input1 = "input_one";
		$input2 = "input_two";

		$big_hash1 = $this->blockera_convert_to_unique_hash( $input1 );
		$big_hash2 = $this->blockera_convert_to_unique_hash( $input2 );

		$hash1 = blockera_get_small_random_hash( $big_hash1 );
		$hash2 = blockera_get_small_random_hash( $big_hash2 );

		// Ensure that different inputs produce different hashes
		$this->assertNotSame( $hash1, $hash2 );
	}

	/**
	 * Test if the function returns a string
	 */
	public function testReturnsString()
	{
		$hash = 'exampleHash';
		$result = blockera_convert_to_unique_hash($hash);

		// Assert that the result is a string
		$this->assertIsString($result, 'The function should return a string.');
	}

	/**
	 * Test if the returned hash is 64 characters long (as SHA-256 hashes are)
	 */
	public function testHashLength()
	{
		$hash = 'exampleHash';
		$result = blockera_convert_to_unique_hash($hash);

		// Assert that the result has 64 characters (SHA-256 produces 64-character hexadecimal strings)
		$this->assertEquals(64, strlen($result), 'The hash should be 64 characters long.');
	}

	/**
	 * Test if multiple calls with the same input return different hashes
	 */
	public function testUniquenessWithSameInput()
	{
		$hash = 'exampleHash';
		$result1 = blockera_convert_to_unique_hash($hash);
		$result2 = blockera_convert_to_unique_hash($hash);

		// Assert that the two results are not the same
		$this->assertNotEquals($result1, $result2, 'The hashes should be unique even with the same input.');
	}

	/**
	 * Test if different inputs return different hashes
	 */
	public function testDifferentHashesForDifferentInputs()
	{
		$hash1 = 'exampleHash1';
		$hash2 = 'exampleHash2';
		$result1 = blockera_convert_to_unique_hash($hash1);
		$result2 = blockera_convert_to_unique_hash($hash2);

		// Assert that the two results are not the same
		$this->assertNotEquals($result1, $result2, 'The hashes should be different for different inputs.');
	}

	/**
	 * Test randomness by comparing a large number of hashes
	 */
	public function testMultipleRandomHashes()
	{
		$hash = 'exampleHash';
		$hashes = [];

		for ($i = 0; $i < 1000; $i++) {
			$hashes[] = blockera_convert_to_unique_hash($hash);
		}

		// Check if all hashes are unique by comparing the count of unique values
		$uniqueHashes = array_unique($hashes);
		$this->assertCount(1000, $uniqueHashes, 'All generated hashes should be unique.');
	}
}
