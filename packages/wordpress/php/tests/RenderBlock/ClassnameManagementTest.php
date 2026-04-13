<?php

namespace Blockera\WordPress\Tests\RenderBlock;

use Blockera\WordPress\RenderBlock\Traits\ClassnameManagement;
use ReflectionClass;
use ReflectionMethod;

/**
 * Test class that uses the ClassnameManagement trait.
 */
class TestClassForClassnameManagement {
	use ClassnameManagement;
}

/**
 * Test class for ClassnameManagement trait.
 * 
 * Since traits cannot be instantiated directly, we create a test class that uses the trait.
 */
class ClassnameManagementTest extends \WP_UnitTestCase {

	/**
	 * Instance of test class.
	 *
	 * @var TestClassForClassnameManagement
	 */
	private TestClassForClassnameManagement $test_instance;

	/**
	 * Set up test environment.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->test_instance = new TestClassForClassnameManagement();
		
		// Clear the registry before each test.
		TestClassForClassnameManagement::clearClassnamesRegistry();
	}

	/**
	 * Get the computeFinalCSS method using reflection.
	 *
	 * @return ReflectionMethod
	 */
	private function getComputeFinalCSSMethod(): ReflectionMethod {
		$reflection = new ReflectionClass( $this->test_instance );
		$method = $reflection->getMethod( 'computeFinalCSS' );
		$method->setAccessible( true );
		return $method;
	}

	/**
	 * Get the registry using reflection.
	 *
	 * @return array
	 */
	private function getRegistry(): array {
		$reflection = new ReflectionClass( $this->test_instance );
		$property = $reflection->getProperty( 'used_classnames_registry' );
		$property->setAccessible( true );
		return $property->getValue();
	}

	/**
	 * Create a block array with computed CSS.
	 *
	 * @param string|null $computed_css The CSS content.
	 * @param array       $additional_attrs Additional attributes.
	 *
	 * @return array
	 */
	private function createBlockWithCss( ?string $computed_css, array $additional_attrs = [] ): array {
		if ( $computed_css === null ) {
			return [
				'attrs' => $additional_attrs,
			];
		}

		return [
			'attrs' => array_merge(
				[
					'blockeraComputedCss' => base64_encode( $computed_css ),
				],
				$additional_attrs
			),
		];
	}

	/**
	 * Test computeFinalCSS with fixtures.
	 *
	 * @dataProvider computeFinalCSSFixturesDataProvider
	 *
	 * @param array $fixture Fixture data.
	 *
	 * @return void
	 */
	public function testComputeFinalCSSWithFixtures( array $fixture ): void {
		$method = $this->getComputeFinalCSSMethod();
		
		// Clear registry before each fixture test.
		TestClassForClassnameManagement::clearClassnamesRegistry();
		
		// Setup prerequisite if needed (for collision tests).
		if ( isset( $fixture['setup_base_classname'] ) && isset( $fixture['setup_computed_css'] ) ) {
			$setup_block = $this->createBlockWithCss( $fixture['setup_computed_css'] );
			$method->invoke( $this->test_instance, $fixture['setup_base_classname'], $setup_block );
		}
		
		// Create block with CSS.
		$block = $this->createBlockWithCss( $fixture['computed_css'] ?? null );
		
		$result = $method->invoke( $this->test_instance, $fixture['base_classname'], $block );
		
		// Verify output structure.
		$this->assertIsArray( $result, 'Result should be an array' );
		$this->assertArrayHasKey( 'classname', $result, 'Result should have classname key' );
		$this->assertArrayHasKey( 'updated', $result, 'Result should have updated key' );
		$this->assertArrayHasKey( 'computed_css', $result, 'Result should have computed_css key' );
		$this->assertIsString( $result['classname'], 'Classname should be a string' );
		$this->assertIsBool( $result['updated'], 'Updated should be a boolean' );
		$this->assertIsString( $result['computed_css'], 'Computed CSS should be a string' );
		
		// Verify expected classname.
		if ( isset( $fixture['expected_classname'] ) ) {
			$this->assertEquals( 
				$fixture['expected_classname'], 
				$result['classname'], 
				$fixture['description'] ?? 'Classname should match expected value'
			);
		} elseif ( isset( $fixture['expected_classname_pattern'] ) ) {
			$this->assertMatchesRegularExpression( 
				$fixture['expected_classname_pattern'], 
				$result['classname'], 
				$fixture['description'] ?? 'Classname should match expected pattern'
			);
		}
		
		// Verify expected updated flag.
		if ( isset( $fixture['expected_updated'] ) ) {
			$this->assertEquals( 
				$fixture['expected_updated'], 
				$result['updated'], 
				$fixture['description'] ?? 'Updated flag should match expected value'
			);
		}
		
		// Verify expected computed CSS.
		if ( isset( $fixture['expected_computed_css'] ) ) {
			$this->assertEquals( 
				$fixture['expected_computed_css'], 
				$result['computed_css'], 
				$fixture['description'] ?? 'Computed CSS should match expected value'
			);
		} elseif ( isset( $fixture['expected_computed_css_pattern'] ) ) {
			$this->assertMatchesRegularExpression( 
				$fixture['expected_computed_css_pattern'], 
				$result['computed_css'], 
				$fixture['description'] ?? 'Computed CSS should match expected pattern'
			);
		}
	}

	/**
	 * Test computeFinalCSS registry consistency for specific fixture.
	 *
	 * @return void
	 */
	public function testComputeFinalCSSRegistryConsistency(): void {
		$method = $this->getComputeFinalCSSMethod();
		
		$css = 'p.blockera-block.blockera-block-10 { background-color: #abcdef; }';
		
		$block1 = $this->createBlockWithCss( $css );
		$block2 = $this->createBlockWithCss( $css );
		
		$result1 = $method->invoke( $this->test_instance, 'blockera-block blockera-block-10', $block1 );
		$result2 = $method->invoke( $this->test_instance, 'blockera-block blockera-block-10', $block2 );
		
		$registry = $this->getRegistry();
		
		// Check that registry has correct mappings.
		$normalized_base = str_replace( ' ', '.', 'blockera-block blockera-block-10' );
		$normalized_css = preg_replace(
			'/' . preg_quote( '.' . $normalized_base, '/' ) . '/',
			'__BLOCKERA_CLASSNAME_PLACEHOLDER__',
			$css
		);
		$css_hash = md5( $normalized_css );
		
		$this->assertArrayHasKey( $css_hash, $registry, 'Registry should contain CSS hash' );
		$this->assertEquals( $result1['classname'], $registry[ $css_hash ], 'Registry should map hash to classname' );
		$this->assertArrayHasKey( $result1['classname'], $registry, 'Registry should contain classname' );
		$this->assertEquals( $css_hash, $registry[ $result1['classname'] ], 'Registry should map classname to hash' );
		
		// Both results should have the same classname.
		$this->assertEquals( $result1['classname'], $result2['classname'], 'Same CSS should produce same classname' );
	}

	/**
	 * Test computeFinalCSS handles multiple blocks with same CSS correctly.
	 *
	 * @return void
	 */
	public function testComputeFinalCSSMultipleBlocksSameCss(): void {
		$method = $this->getComputeFinalCSSMethod();
		
		$css = 'p.blockera-block.blockera-block-2 { background-color: #75a3ff; }';
		
		// Create 5 blocks with identical CSS.
		$results = [];
		for ( $i = 0; $i < 5; $i++ ) {
			$block = $this->createBlockWithCss( $css );
			$results[] = $method->invoke( $this->test_instance, 'blockera-block blockera-block-2', $block );
		}
		
		// All should have the same classname (first one registered).
		$first_classname = $results[0]['classname'];
		foreach ( $results as $index => $result ) {
			if ( $index === 0 ) {
				$this->assertFalse( $result['updated'], 'First block should not be updated' );
			} else {
				// Subsequent blocks should reuse the same classname.
				$this->assertEquals( 
					$first_classname, 
					$result['classname'], 
					"Block #{$index} should reuse the same classname"
				);
				$this->assertFalse( $result['updated'], "Block #{$index} should not be updated when reusing" );
			}
		}
	}

	/**
	 * Test computeFinalCSS updates CSS when reusing unique classname.
	 *
	 * @return void
	 */
	public function testComputeFinalCSSUpdatesCssWhenReusing(): void {
		$method = $this->getComputeFinalCSSMethod();
		
		// First block creates base classname.
		$css1 = 'p.blockera-block.blockera-block-2 { background-color: #75a3ff; }';
		// Second block has different CSS (collision).
		$css2 = 'p.blockera-block.blockera-block-2 { background-color: #ff0000; }';
		
		$block1 = $this->createBlockWithCss( $css1 );
		$block2 = $this->createBlockWithCss( $css2 );
		$block3 = $this->createBlockWithCss( $css1 ); // Same as block1.
		
		// First block.
		$result1 = $method->invoke( $this->test_instance, 'blockera-block blockera-block-2', $block1 );
		
		// Second block creates unique classname.
		$result2 = $method->invoke( $this->test_instance, 'blockera-block blockera-block-2', $block2 );
		
		// Third block should reuse first block's classname.
		$result3 = $method->invoke( $this->test_instance, 'blockera-block blockera-block-2', $block3 );
		
		$this->assertEquals( 
			$result1['classname'], 
			$result3['classname'], 
			'Third block should reuse first block classname for same CSS'
		);
		$this->assertNotEquals( 
			$result2['classname'], 
			$result3['classname'], 
			'Third block should not use second block classname (different CSS)'
		);
		$this->assertFalse( 
			$result3['updated'], 
			'Third block should not be updated when reusing existing classname'
		);
	}

	/**
	 * Test computeFinalCSS with different base classnames but same CSS content.
	 * Each block should keep its own classname, not reuse the other's.
	 *
	 * @return void
	 */
	public function testComputeFinalCSSDifferentClassnamesSameCss(): void {
		$method = $this->getComputeFinalCSSMethod();
		
		// Block 1: selector '.test', CSS '.test { color: red; }'
		$css1 = '.test { color: red; }';
		$block1 = $this->createBlockWithCss( $css1 );
		$result1 = $method->invoke( $this->test_instance, 'test', $block1 );
		
		// Block 2: selector '.another-test', CSS '.another-test { color: red; }'
		// After normalization, both CSS become '__BLOCKERA_CLASSNAME_PLACEHOLDER__ { color: red; }'
		// So they hash to the same value, but each should keep its own classname.
		$css2 = '.another-test { color: red; }';
		$block2 = $this->createBlockWithCss( $css2 );
		$result2 = $method->invoke( $this->test_instance, 'another-test', $block2 );
		
		// Block 1 should have its own classname.
		$this->assertEquals( 'test', $result1['classname'], 'Block 1 should keep its own classname' );
		$this->assertEquals( $css1, $result1['computed_css'], 'Block 1 should have its own CSS' );
		$this->assertFalse( $result1['updated'], 'Block 1 should not be updated' );
		
		// Block 2 should have its own classname (not reuse block 1's).
		$this->assertEquals( 'another-test', $result2['classname'], 'Block 2 should keep its own classname, not reuse block 1\'s' );
		$this->assertEquals( $css2, $result2['computed_css'], 'Block 2 should have its own CSS' );
		$this->assertFalse( $result2['updated'], 'Block 2 should not be updated' );
		
		// Classnames should be different.
		$this->assertNotEquals( 
			$result1['classname'], 
			$result2['classname'], 
			'Different base classnames should result in different classnames even with same CSS content'
		);
	}

	/**
	 * Test computeFinalCSS with different base classnames but same CSS content (with spaces).
	 * Similar to testComputeFinalCSSDifferentClassnamesSameCss but with multi-word classnames.
	 *
	 * @return void
	 */
	public function testComputeFinalCSSDifferentClassnamesSameCssWithSpaces(): void {
		$method = $this->getComputeFinalCSSMethod();
		
		// Block 1: selector 'blockera-block blockera-block-1', CSS 'p.blockera-block.blockera-block-1 { color: red; }'
		$css1 = 'p.blockera-block.blockera-block-1 { color: red; }';
		$block1 = $this->createBlockWithCss( $css1 );
		$result1 = $method->invoke( $this->test_instance, 'blockera-block blockera-block-1', $block1 );
		
		// Block 2: selector 'blockera-block blockera-block-2', CSS 'p.blockera-block.blockera-block-2 { color: red; }'
		// After normalization, both CSS become 'p.__BLOCKERA_CLASSNAME_PLACEHOLDER__ { color: red; }'
		// So they hash to the same value, but each should keep its own classname.
		$css2 = 'p.blockera-block.blockera-block-2 { color: red; }';
		$block2 = $this->createBlockWithCss( $css2 );
		$result2 = $method->invoke( $this->test_instance, 'blockera-block blockera-block-2', $block2 );
		
		// Block 1 should have its own classname.
		$this->assertEquals( 'blockera-block blockera-block-1', $result1['classname'], 'Block 1 should keep its own classname' );
		$this->assertEquals( $css1, $result1['computed_css'], 'Block 1 should have its own CSS' );
		$this->assertFalse( $result1['updated'], 'Block 1 should not be updated' );
		
		// Block 2 should have its own classname (not reuse block 1's).
		$this->assertEquals( 'blockera-block blockera-block-2', $result2['classname'], 'Block 2 should keep its own classname, not reuse block 1\'s' );
		$this->assertEquals( $css2, $result2['computed_css'], 'Block 2 should have its own CSS' );
		$this->assertFalse( $result2['updated'], 'Block 2 should not be updated' );
		
		// Classnames should be different.
		$this->assertNotEquals( 
			$result1['classname'], 
			$result2['classname'], 
			'Different base classnames should result in different classnames even with same CSS content'
		);
	}

	/**
	 * Test computeFinalCSS sequential counter for multiple collisions.
	 * When the same base classname collides multiple times, counters should be -1, -2, -3, etc.
	 *
	 * @return void
	 */
	public function testComputeFinalCSSSequentialCounter(): void {
		$method = $this->getComputeFinalCSSMethod();
		
		$base_classname = 'block-test';
		
		// First registration - no collision, uses base classname.
		$css1 = '.block-test { color: red; }';
		$block1 = $this->createBlockWithCss( $css1 );
		$result1 = $method->invoke( $this->test_instance, $base_classname, $block1 );
		$this->assertEquals( $base_classname, $result1['classname'], 'First block should use base classname' );
		$this->assertFalse( $result1['updated'], 'First block should not be updated' );
		
		// Second registration - collision, should get -1.
		$css2 = '.block-test { color: blue; }';
		$block2 = $this->createBlockWithCss( $css2 );
		$result2 = $method->invoke( $this->test_instance, $base_classname, $block2 );
		$this->assertEquals( $base_classname . '-1', $result2['classname'], 'Second block should get -1 suffix' );
		$this->assertTrue( $result2['updated'], 'Second block should be updated' );
		$this->assertEquals( '.block-test-1 { color: blue; }', $result2['computed_css'], 'CSS should use -1 suffix' );
		
		// Third registration - collision, should get -2.
		$css3 = '.block-test { color: green; }';
		$block3 = $this->createBlockWithCss( $css3 );
		$result3 = $method->invoke( $this->test_instance, $base_classname, $block3 );
		$this->assertEquals( $base_classname . '-2', $result3['classname'], 'Third block should get -2 suffix' );
		$this->assertTrue( $result3['updated'], 'Third block should be updated' );
		$this->assertEquals( '.block-test-2 { color: green; }', $result3['computed_css'], 'CSS should use -2 suffix' );
		
		// Fourth registration - collision, should get -3.
		$css4 = '.block-test { color: yellow; }';
		$block4 = $this->createBlockWithCss( $css4 );
		$result4 = $method->invoke( $this->test_instance, $base_classname, $block4 );
		$this->assertEquals( $base_classname . '-3', $result4['classname'], 'Fourth block should get -3 suffix' );
		$this->assertTrue( $result4['updated'], 'Fourth block should be updated' );
		$this->assertEquals( '.block-test-3 { color: yellow; }', $result4['computed_css'], 'CSS should use -3 suffix' );
	}

	/**
	 * Test computeFinalCSS sequential counter with multi-word classnames.
	 * Counters should work correctly with classnames containing spaces.
	 *
	 * @return void
	 */
	public function testComputeFinalCSSSequentialCounterWithSpaces(): void {
		$method = $this->getComputeFinalCSSMethod();
		
		$base_classname = 'blockera-block blockera-block-test';
		
		// First registration - no collision.
		$css1 = 'p.blockera-block.blockera-block-test { color: red; }';
		$block1 = $this->createBlockWithCss( $css1 );
		$result1 = $method->invoke( $this->test_instance, $base_classname, $block1 );
		$this->assertEquals( $base_classname, $result1['classname'], 'First block should use base classname' );
		
		// Second registration - collision, should get -1.
		$css2 = 'p.blockera-block.blockera-block-test { color: blue; }';
		$block2 = $this->createBlockWithCss( $css2 );
		$result2 = $method->invoke( $this->test_instance, $base_classname, $block2 );
		$this->assertEquals( $base_classname . '-1', $result2['classname'], 'Second block should get -1 suffix' );
		$this->assertStringContainsString( 'blockera-block.blockera-block-test-1', $result2['computed_css'], 'CSS should use -1 suffix' );
		
		// Third registration - collision, should get -2.
		$css3 = 'p.blockera-block.blockera-block-test { color: green; }';
		$block3 = $this->createBlockWithCss( $css3 );
		$result3 = $method->invoke( $this->test_instance, $base_classname, $block3 );
		$this->assertEquals( $base_classname . '-2', $result3['classname'], 'Third block should get -2 suffix' );
		$this->assertStringContainsString( 'blockera-block.blockera-block-test-2', $result3['computed_css'], 'CSS should use -2 suffix' );
	}

	/**
	 * Test computeFinalCSS independent counters for different base classnames.
	 * Each base classname should have its own independent counter starting from 1.
	 *
	 * @return void
	 */
	public function testComputeFinalCSSIndependentCounters(): void {
		$method = $this->getComputeFinalCSSMethod();
		
		// Base classname A: 3 collisions → should get -1, -2, -3
		$baseA = 'block-test-A';
		$cssA1 = '.block-test-A { color: red; }';
		$cssA2 = '.block-test-A { color: blue; }';
		$cssA3 = '.block-test-A { color: green; }';
		$cssA4 = '.block-test-A { color: yellow; }';
		
		$blockA1 = $this->createBlockWithCss( $cssA1 );
		$blockA2 = $this->createBlockWithCss( $cssA2 );
		$blockA3 = $this->createBlockWithCss( $cssA3 );
		$blockA4 = $this->createBlockWithCss( $cssA4 );
		
		$resultA1 = $method->invoke( $this->test_instance, $baseA, $blockA1 );
		$resultA2 = $method->invoke( $this->test_instance, $baseA, $blockA2 );
		$resultA3 = $method->invoke( $this->test_instance, $baseA, $blockA3 );
		$resultA4 = $method->invoke( $this->test_instance, $baseA, $blockA4 );
		
		$this->assertEquals( $baseA, $resultA1['classname'], 'Base A: first should use base classname' );
		$this->assertEquals( $baseA . '-1', $resultA2['classname'], 'Base A: first collision should get -1' );
		$this->assertEquals( $baseA . '-2', $resultA3['classname'], 'Base A: second collision should get -2' );
		$this->assertEquals( $baseA . '-3', $resultA4['classname'], 'Base A: third collision should get -3' );
		
		// Base classname B: 2 collisions → should get -1, -2 (independent from A)
		$baseB = 'block-test-B';
		$cssB1 = '.block-test-B { color: red; }';
		$cssB2 = '.block-test-B { color: blue; }';
		$cssB3 = '.block-test-B { color: green; }';
		
		$blockB1 = $this->createBlockWithCss( $cssB1 );
		$blockB2 = $this->createBlockWithCss( $cssB2 );
		$blockB3 = $this->createBlockWithCss( $cssB3 );
		
		$resultB1 = $method->invoke( $this->test_instance, $baseB, $blockB1 );
		$resultB2 = $method->invoke( $this->test_instance, $baseB, $blockB2 );
		$resultB3 = $method->invoke( $this->test_instance, $baseB, $blockB3 );
		
		$this->assertEquals( $baseB, $resultB1['classname'], 'Base B: first should use base classname' );
		$this->assertEquals( $baseB . '-1', $resultB2['classname'], 'Base B: first collision should get -1 (independent from A)' );
		$this->assertEquals( $baseB . '-2', $resultB3['classname'], 'Base B: second collision should get -2 (independent from A)' );
		
		// Base classname C: 1 collision → should get -1 (independent from A and B)
		$baseC = 'block-test-C';
		$cssC1 = '.block-test-C { color: red; }';
		$cssC2 = '.block-test-C { color: blue; }';
		
		$blockC1 = $this->createBlockWithCss( $cssC1 );
		$blockC2 = $this->createBlockWithCss( $cssC2 );
		
		$resultC1 = $method->invoke( $this->test_instance, $baseC, $blockC1 );
		$resultC2 = $method->invoke( $this->test_instance, $baseC, $blockC2 );
		
		$this->assertEquals( $baseC, $resultC1['classname'], 'Base C: first should use base classname' );
		$this->assertEquals( $baseC . '-1', $resultC2['classname'], 'Base C: first collision should get -1 (independent from A and B)' );
		
		// Verify all counters are independent - A should still be at -3, B at -2, C at -1
		// Add one more collision to A to verify it continues from -3
		$cssA5 = '.block-test-A { color: purple; }';
		$blockA5 = $this->createBlockWithCss( $cssA5 );
		$resultA5 = $method->invoke( $this->test_instance, $baseA, $blockA5 );
		$this->assertEquals( $baseA . '-4', $resultA5['classname'], 'Base A: fourth collision should get -4 (continues from -3)' );
	}

	/**
	 * Test computeFinalCSS counter resets when registry is cleared.
	 *
	 * @return void
	 */
	public function testComputeFinalCSSCounterResetsOnClear(): void {
		$method = $this->getComputeFinalCSSMethod();
		
		$base_classname = 'block-test';
		
		// First collision.
		$css1 = '.block-test { color: red; }';
		$css2 = '.block-test { color: blue; }';
		
		$block1 = $this->createBlockWithCss( $css1 );
		$block2 = $this->createBlockWithCss( $css2 );
		
		$result1 = $method->invoke( $this->test_instance, $base_classname, $block1 );
		$result2 = $method->invoke( $this->test_instance, $base_classname, $block2 );
		
		$this->assertEquals( $base_classname, $result1['classname'] );
		$this->assertEquals( $base_classname . '-1', $result2['classname'] );
		
		// Clear registry.
		TestClassForClassnameManagement::clearClassnamesRegistry();
		
		// After clear, counter should reset - next collision should be -1 again.
		$block3 = $this->createBlockWithCss( $css1 );
		$block4 = $this->createBlockWithCss( $css2 );
		
		$result3 = $method->invoke( $this->test_instance, $base_classname, $block3 );
		$result4 = $method->invoke( $this->test_instance, $base_classname, $block4 );
		
		$this->assertEquals( $base_classname, $result3['classname'], 'After clear, first block should use base classname' );
		$this->assertEquals( $base_classname . '-1', $result4['classname'], 'After clear, collision should start from -1 again' );
	}

	/**
	 * Data provider for computeFinalCSS fixtures.
	 *
	 * @return array
	 */
	public function computeFinalCSSFixturesDataProvider(): array {
		$fixtures = require __DIR__ . '/Fixtures/ClassnameManagement/ensure-unique-classname-fixtures.php';
		
		// PHPUnit data provider: each element is passed as arguments to the test method.
		// Since testEnsureUniqueClassnameWithFixtures expects a single array argument, wrap each fixture in an array.
		return array_map(
			function( $fixture ) {
				return [ $fixture ];
			},
			$fixtures
		);
	}
}
