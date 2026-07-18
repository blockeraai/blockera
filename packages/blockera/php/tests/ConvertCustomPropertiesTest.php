<?php

namespace Blockera\Setup\Tests;

use Blockera\Setup\Compatibility\JSON;
use ReflectionMethod;

/**
 * @covers \Blockera\Setup\Compatibility\JSON::convert_custom_properties
 */
class ConvertCustomPropertiesTest extends \Blockera\Dev\PHPUnit\AppTestCase {

	private ReflectionMethod $method;

	public function set_up(): void {
		parent::set_up();
		$this->method = new ReflectionMethod( JSON::class, 'convert_custom_properties' );
		$this->method->setAccessible( true );
	}

	private function convert( string $value ): string {
		return $this->method->invoke( null, $value );
	}

	public function testConvertsPresetVariable(): void {
		$this->assertSame(
			'var(--wp--preset--color--vivid-green-cyan)',
			$this->convert( 'var:preset|color|vivid-green-cyan' )
		);
	}

	public function testConvertsCustomPath(): void {
		$this->assertSame(
			'var(--wp--custom--spacing--gap)',
			$this->convert( 'var:custom|spacing|gap' )
		);
	}

	public function testLeavesNonPrefixedValuesUnchanged(): void {
		$this->assertSame( '#111', $this->convert( '#111' ) );
		$this->assertSame( '1.5rem', $this->convert( '1.5rem' ) );
		$this->assertSame( 'var(--wp--preset--color--base)', $this->convert( 'var(--wp--preset--color--base)' ) );
	}

	public function testVarPrefixOnly(): void {
		$this->assertSame( 'var(--wp--)', $this->convert( 'var:' ) );
	}

	public function testCaseSensitivePrefix(): void {
		$this->assertSame( 'Var:preset|color|base', $this->convert( 'Var:preset|color|base' ) );
	}

	public function testNoPipes(): void {
		$this->assertSame( 'var(--wp--preset)', $this->convert( 'var:preset' ) );
	}
}
