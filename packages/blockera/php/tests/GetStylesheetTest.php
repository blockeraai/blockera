<?php

namespace Blockera\Setup\Tests;

use Blockera\Setup\Compatibility\JSON;
use ReflectionProperty;
use WP_Theme_JSON;

/**
 * @covers \Blockera\Setup\Compatibility\JSON::get_stylesheet
 */
class GetStylesheetTest extends \Blockera\Dev\PHPUnit\AppTestCase {

	private function make_json( array $data ): JSON {
		$json = new JSON( array( 'version' => 3 ) );
		$prop = new ReflectionProperty( WP_Theme_JSON::class, 'theme_json' );
		$prop->setAccessible( true );
		$prop->setValue( $json, $data );

		return $json;
	}

	private function sample_data(): array {
		return array(
			'version'  => 3,
			'settings' => array(
				'color' => array(
					'palette' => array(
						array(
							'slug'  => 'base',
							'color' => '#ffffff',
							'name'  => 'Base',
						),
					),
				),
			),
			'styles'   => array(
				'color'  => array(
					'text' => '#111111',
				),
				'blocks' => array(
					'core/paragraph' => array(
						'blockeraBackgroundColor' => array( 'value' => '#112233' ),
					),
				),
				'css'    => '/* custom-root-css */',
			),
		);
	}

	public function testDefaultTypesReturnString(): void {
		$css = $this->make_json( $this->sample_data() )->get_stylesheet();
		$this->assertIsString( $css );
		$this->assertNotSame( '', $css );
	}

	public function testCustomCssTypeAppendsRootCss(): void {
		$css = $this->make_json( $this->sample_data() )->get_stylesheet( array( 'custom-css' ) );
		$this->assertSame( '/* custom-root-css */', $css );
	}

	public function testVariablesTypeIsString(): void {
		$css = $this->make_json( $this->sample_data() )->get_stylesheet( array( 'variables' ) );
		$this->assertIsString( $css );
	}

	public function testPresetsTypeIsString(): void {
		$css = $this->make_json( $this->sample_data() )->get_stylesheet( array( 'presets' ) );
		$this->assertIsString( $css );
	}

	public function testStylesTypeIncludesBlockeraRules(): void {
		$css = $this->make_json( $this->sample_data() )->get_stylesheet( array( 'styles' ) );
		$this->assertStringContainsString( 'background-color: #112233', $css );
	}

	public function testBaseLayoutStylesTypeIsString(): void {
		$css = $this->make_json( $this->sample_data() )->get_stylesheet( array( 'base-layout-styles' ) );
		$this->assertIsString( $css );
	}

	public function testDeprecatedStringTypesMapWithoutFatal(): void {
		$json = $this->make_json( $this->sample_data() );

		// WP core marks string $types as deprecated since 5.9; declare expected notices.
		$this->setExpectedDeprecated( 'get_stylesheet' );

		$this->assertIsString( $json->get_stylesheet( 'block_styles' ) );
		$this->assertIsString( $json->get_stylesheet( 'css_variables' ) );
		$this->assertIsString( $json->get_stylesheet( 'unknown_legacy' ) );
	}

	public function testScopeOptionDoesNotFatal(): void {
		$css = $this->make_json( $this->sample_data() )->get_stylesheet(
			array( 'styles', 'variables' ),
			null,
			array( 'scope' => '.editor-styles-wrapper' )
		);
		$this->assertIsString( $css );
	}

	public function testRootSelectorAndSkipRootLayoutOptions(): void {
		$css = $this->make_json( $this->sample_data() )->get_stylesheet(
			array( 'styles' ),
			null,
			array(
				'root_selector'           => '.my-root',
				'skip_root_layout_styles' => true,
			)
		);
		$this->assertIsString( $css );
		$this->assertStringContainsString( 'background-color: #112233', $css );
	}

	public function testCombinedTypesKeepCustomCssLast(): void {
		$css = $this->make_json( $this->sample_data() )->get_stylesheet(
			array( 'variables', 'styles', 'presets', 'custom-css' )
		);
		$pos = strrpos( $css, '/* custom-root-css */' );
		$this->assertNotFalse( $pos );
		$this->assertSame( strlen( $css ) - strlen( '/* custom-root-css */' ), $pos );
	}
}
