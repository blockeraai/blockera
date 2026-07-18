<?php

namespace Blockera\Setup\Tests;

use Blockera\Setup\Compatibility\BlockeraSettingsPaths;
use Blockera\Setup\Compatibility\JSON;
use ReflectionMethod;

/**
 * @covers \Blockera\Setup\Compatibility\JSON::get_valid_settings_schema
 */
class GetValidSettingsSchemaTest extends \Blockera\Dev\PHPUnit\AppTestCase {

	private ReflectionMethod $method;

	public function set_up(): void {
		parent::set_up();
		$this->method = new ReflectionMethod( JSON::class, 'get_valid_settings_schema' );
		$this->method->setAccessible( true );
	}

	private function schema(): array {
		return $this->method->invoke( null );
	}

	public function testReturnsStaticCachedInstance(): void {
		$a = $this->schema();
		$b = $this->schema();
		$this->assertSame( $a, $b );
	}

	public function testIncludesCoreColorSettings(): void {
		$schema = $this->schema();
		$this->assertArrayHasKey( 'color', $schema );
		$this->assertArrayHasKey( 'palette', $schema['color'] );
	}

	public function testIncludesBlockeraSettingsExtension(): void {
		$schema = $this->schema();
		$this->assertArrayHasKey( BlockeraSettingsPaths::WIDTH_SIZES, $schema );
		$this->assertArrayHasKey( BlockeraSettingsPaths::TRANSITION, $schema );
		$this->assertArrayHasKey( BlockeraSettingsPaths::LINE_HEIGHTS, $schema['typography'] );
		$this->assertArrayHasKey( BlockeraSettingsPaths::BORDER, $schema['border'] );
	}
}
