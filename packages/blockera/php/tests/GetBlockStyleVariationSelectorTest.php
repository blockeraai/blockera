<?php

namespace Blockera\Setup\Tests;

use Blockera\Setup\Compatibility\JSON;
use ReflectionMethod;

/**
 * @covers \Blockera\Setup\Compatibility\JSON::get_block_style_variation_selector
 */
class GetBlockStyleVariationSelectorTest extends \Blockera\Dev\PHPUnit\AppTestCase {

	private ReflectionMethod $method;

	public function set_up(): void {
		parent::set_up();
		$this->method = new ReflectionMethod( JSON::class, 'get_block_style_variation_selector' );
		$this->method->setAccessible( true );
		JSON::set_style_variation_prefix( 'is-style-' );
	}

	private function select( string $variation, string $block_selector ): string {
		return $this->method->invoke( null, $variation, $block_selector );
	}

	public function testEmptyBlockSelectorReturnsVariationClassOnly(): void {
		$this->assertSame( '.is-style-outline', $this->select( 'outline', '' ) );
	}

	public function testSingleSelector(): void {
		$this->assertSame(
			'.wp-block-button.is-style-outline',
			$this->select( 'outline', '.wp-block-button' )
		);
	}

	public function testCommaSeparatedSelectors(): void {
		$this->assertSame(
			'.wp-block-button.is-style-outline, .wp-block-button__link.is-style-outline',
			$this->select( 'outline', '.wp-block-button, .wp-block-button__link' )
		);
	}

	public function testHoverPseudoPreserved(): void {
		$this->assertSame(
			'.wp-block-button.is-style-outline:hover',
			$this->select( 'outline', '.wp-block-button:hover' )
		);
	}

	public function testBeforePseudoPreserved(): void {
		$this->assertSame(
			'.wp-block-button.is-style-outline::before',
			$this->select( 'outline', '.wp-block-button::before' )
		);
	}

	public function testIsFunctionalPseudo(): void {
		$this->assertSame(
			'div.is-style-outline:is(.foo) span',
			$this->select( 'outline', 'div:is(.foo) span' )
		);
	}

	public function testCustomPrefix(): void {
		JSON::set_style_variation_prefix( 'custom-' );
		$this->assertSame(
			'.wp-block-button.custom-outline',
			$this->select( 'outline', '.wp-block-button' )
		);
	}
}
