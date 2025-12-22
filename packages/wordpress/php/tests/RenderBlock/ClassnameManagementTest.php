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
