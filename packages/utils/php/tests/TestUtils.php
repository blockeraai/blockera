<?php

namespace Blockera\Utils\tests;

use Blockera\Utils\Utils;

class UtilsTest extends \WP_UnitTestCase {

	public function testKebabCaseWithSimpleString() {

		$result = Utils::kebabCase( 'helloWorld' );
		$this->assertEquals( 'hello-world', $result );
	}

	public function testKebabCaseWithSpecialCharacters() {

		$result = Utils::kebabCase( 'Hello!World?123' );
		$this->assertEquals( 'hello-world-123', $result );
	}

	public function testKebabCaseWithEmptyString() {

		$result = Utils::kebabCase( '' );
		$this->assertEquals( '', $result );
	}

	public function testKebabCaseWithSingleWord() {

		$result = Utils::kebabCase( 'hello' );
		$this->assertEquals( 'hello', $result );
	}

	public function testKebabCaseWithLeadingAndTrailingHyphens() {

		$result = Utils::kebabCase( '-hello-world-' );
		$this->assertEquals( 'hello-world', $result );
	}

	/**
	 * Test case where both prefix and suffix are provided.
	 */
	public function testModifySelectorWithPrefixAndSuffix() {

		$selector = '.wp-block-sample, .wp-block-sample .first-child, .wp-block-sample .second-child';
		$part     = '.wp-block-sample';
		$args     = [ 'prefix' => '.test-before', 'suffix' => '.test-after' ];

		$expected = '.test-before.wp-block-sample, .wp-block-sample.test-after, ' .
					'.test-before.wp-block-sample .first-child, .wp-block-sample.test-after .first-child, ' .
					'.test-before.wp-block-sample .second-child, .wp-block-sample.test-after .second-child';

		$this->assertEquals( $expected, Utils::modifySelectorPos( $selector, $part, $args ) );
	}

	/**
	 * Test case where only prefix is provided.
	 */
	public function testModifySelectorWithOnlyPrefix() {

		$selector = '.wp-block-sample, .wp-block-sample .first-child, .wp-block-sample .second-child';
		$part     = '.wp-block-sample';
		$args     = [ 'prefix' => '.test-before' ];

		$expected = '.test-before.wp-block-sample, ' .
					'.test-before.wp-block-sample .first-child, ' .
					'.test-before.wp-block-sample .second-child';

		$this->assertEquals( $expected, Utils::modifySelectorPos( $selector, $part, $args ) );
	}

	/**
	 * Test case where only suffix is provided.
	 */
	public function testModifySelectorWithOnlySuffix() {

		$selector = '.wp-block-sample, .wp-block-sample .first-child, .wp-block-sample .second-child';
		$part     = '.wp-block-sample';
		$args     = [ 'suffix' => '.test-after' ];

		$expected = '.wp-block-sample, .wp-block-sample.test-after, ' .
					'.wp-block-sample .first-child, .wp-block-sample.test-after .first-child, ' .
					'.wp-block-sample .second-child, .wp-block-sample.test-after .second-child';

		$this->assertEquals( $expected, Utils::modifySelectorPos( $selector, $part, $args ) );
	}

	/**
	 * Test case where neither prefix nor suffix is provided.
	 */
	public function testModifySelectorWithoutPrefixAndSuffix() {

		$selector = '.wp-block-sample, .wp-block-sample .first-child, .wp-block-sample .second-child';
		$part     = '.wp-block-sample';
		$args     = [];

		$expected = '.wp-block-sample, ' .
					'.wp-block-sample .first-child, ' .
					'.wp-block-sample .second-child';

		$this->assertEquals( $expected, Utils::modifySelectorPos( $selector, $part, $args ) );
	}

	/**
	 * Test case where the part is not found in the selector.
	 */
	public function testModifySelectorWithNonExistingPart() {

		$selector = '.another-class, .another-class .child';
		$part     = '.wp-block-sample';
		$args     = [ 'prefix' => '.test-before', 'suffix' => '.test-after' ];

		// Expect the original selector since the part is not found
		$expected = '.another-class, .another-class .child';

		$this->assertEquals( $expected, Utils::modifySelectorPos( $selector, $part, $args ) );
	}

	/**
	 * Test case where the selector is empty.
	 */
	public function testModifySelectorWithEmptySelector() {

		$selector = '';
		$part     = '.wp-block-sample';
		$args     = [ 'prefix' => '.test-before', 'suffix' => '.test-after' ];

		// Expect an empty string as the result since the selector is empty
		$expected = '';

		$this->assertEquals( $expected, Utils::modifySelectorPos( $selector, $part, $args ) );
	}

	/**
	 * Test case where the part is empty.
	 */
	public function testModifySelectorWithEmptyPart() {

		$selector = '.wp-block-sample, .wp-block-sample .first-child, .wp-block-sample .second-child';
		$part     = '';
		$args     = [ 'prefix' => '.test-before', 'suffix' => '.test-after' ];

		// Expect the original selector since no part is defined for modification
		$expected = '.wp-block-sample, ' .
					'.wp-block-sample .first-child, ' .
					'.wp-block-sample .second-child';

		$this->assertEquals( $expected, Utils::modifySelectorPos( $selector, $part, $args ) );
	}

	/**
	 * Test case where the part has multiple matches.
	 */
	public function testModifySelectorWithMultipleMatchesWithPart() {

		$selector = '.wp-block-sample, .wp-block-sample .first-child, .wp-block-sample .second-child, .wp-block-sample-link__a';
		$part     = '.wp-block-sample';
		$args     = [ 'prefix' => '.test-before', 'suffix' => '.test-after' ];

		// Expect the original selector since no part is defined for modification
		$expected = '.test-before.wp-block-sample, ' .
					'.wp-block-sample.test-after, ' .
					'.test-before.wp-block-sample .first-child, ' .
					'.wp-block-sample.test-after .first-child, ' .
					'.test-before.wp-block-sample .second-child, ' .
					'.wp-block-sample.test-after .second-child' .
					', .wp-block-sample-link__a';

		$this->assertEquals( $expected, Utils::modifySelectorPos( $selector, $part, $args ) );
	}

	/**
	 * Test snake case conversion with various input strings
	 *
	 * @dataProvider snakeCaseProvider
	 */
	public function testSnakeCase(string $input, string $expected): void
	{
		$result = Utils::snakeCase($input);
		$this->assertEquals($expected, $result);
	}

	/**
	 * Data provider for snake case test cases
	 */
	public function snakeCaseProvider(): array
	{
		return [
			'empty string' => [
				'input' => '',
				'expected' => '',
			],
			'simple camelCase' => [
				'input' => 'camelCase',
				'expected' => 'camel_case',
			],
			'PascalCase' => [
				'input' => 'PascalCase',
				'expected' => 'pascal_case',
			],
			'multiple uppercase letters' => [
				'input' => 'convertXMLToJSON',
				'expected' => 'convert_x_m_l_to_j_s_o_n',
			],
			'already snake_case' => [
				'input' => 'already_snake_case',
				'expected' => 'already_snake_case',
			],
			'with numbers' => [
				'input' => 'user123Name',
				'expected' => 'user123_name',
			],
			'with special characters' => [
				'input' => 'special@#$Case',
				'expected' => 'special_case',
			],
			'with spaces' => [
				'input' => 'Convert This String',
				'expected' => 'convert_this_string',
			],
			'with multiple special chars' => [
				'input' => 'multiple---special___chars',
				'expected' => 'multiple_special_chars',
			],
			'with leading/trailing special chars' => [
				'input' => '--testString--',
				'expected' => 'test_string',
			],
		];
	}
}
