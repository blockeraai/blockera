<?php

namespace Blockera\Setup\Tests;

use Blockera\Setup\Compatibility\JSON;
use ReflectionMethod;
use ReflectionProperty;

/**
 * Light behavior tests for JSON construct / setters.
 *
 * @covers \Blockera\Setup\Compatibility\JSON::__construct
 * @covers \Blockera\Setup\Compatibility\JSON::set_supports
 * @covers \Blockera\Setup\Compatibility\JSON::set_style_variation_prefix
 */
class JsonTrivialApiTest extends \Blockera\Dev\PHPUnit\AppTestCase {

	public function tear_down(): void {
		JSON::set_style_variation_prefix( 'is-style-' );
		parent::tear_down();
	}

	public function testConstructSetsStyleVariationPrefix(): void {
		new JSON( array( 'version' => 3 ), 'theme', 'custom-prefix-' );

		$prop = new ReflectionProperty( JSON::class, 'style_variation_prefix' );
		$prop->setAccessible( true );
		$this->assertSame( 'custom-prefix-', $prop->getValue() );

		$selector = new ReflectionMethod( JSON::class, 'get_block_style_variation_selector' );
		$selector->setAccessible( true );
		$this->assertSame(
			'.wp-block-button.custom-prefix-outline',
			$selector->invoke( null, 'outline', '.wp-block-button' )
		);
	}

	public function testSetStyleVariationPrefixAffectsSelector(): void {
		JSON::set_style_variation_prefix( 'is-style-' );
		$selector = new ReflectionMethod( JSON::class, 'get_block_style_variation_selector' );
		$selector->setAccessible( true );

		$this->assertSame(
			'.wp-block-button.is-style-fill',
			$selector->invoke( null, 'fill', '.wp-block-button' )
		);

		JSON::set_style_variation_prefix( 'my-' );
		$this->assertSame(
			'.wp-block-button.my-fill',
			$selector->invoke( null, 'fill', '.wp-block-button' )
		);
	}

	public function testSetSupportsUpdatesStaticSupports(): void {
		$json     = new JSON( array( 'version' => 3 ) );
		$supports = array(
			array(
				'type'     => 'single',
				'supports' => array(
					'blockeraBackgroundColor' => array(
						'id' => 'blockeraBackgroundColor',
					),
				),
			),
		);
		$json->set_supports( $supports );

		$prop = new ReflectionProperty( JSON::class, 'supports' );
		$prop->setAccessible( true );
		$this->assertSame( $supports, $prop->getValue() );
	}
}
