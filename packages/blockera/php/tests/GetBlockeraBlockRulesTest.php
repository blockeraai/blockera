<?php

namespace Blockera\Setup\Tests;

use Blockera\Setup\Compatibility\JSON;
use ReflectionMethod;
use ReflectionProperty;
use WP_Theme_JSON;

/**
 * @covers \Blockera\Setup\Compatibility\JSON::get_blockera_block_rules
 */
class GetBlockeraBlockRulesTest extends \Blockera\Dev\PHPUnit\AppTestCase {

	private ReflectionMethod $method;

	public function set_up(): void {
		parent::set_up();
		$this->method = new ReflectionMethod( JSON::class, 'get_blockera_block_rules' );
		$this->method->setAccessible( true );
	}

	private function make_json( array $data ): JSON {
		$json = new JSON( array( 'version' => 3 ) );
		$prop = new ReflectionProperty( WP_Theme_JSON::class, 'theme_json' );
		$prop->setAccessible( true );
		$prop->setValue( $json, $data );

		return $json;
	}

	private function rules( JSON $json, array $nodes ): string {
		return $this->method->invoke( $json, $nodes );
	}

	public function testEmptyNodesReturnEmptyString(): void {
		$json = $this->make_json( array( 'version' => 3 ) );
		$this->assertSame( '', $this->rules( $json, array() ) );
	}

	public function testSkipsNullSelector(): void {
		$json = $this->make_json(
			array(
				'version' => 3,
				'styles'  => array(
					'blocks' => array(
						'core/paragraph' => array(
							'blockeraBackgroundColor' => array( 'value' => '#112233' ),
						),
					),
				),
			)
		);

		$css = $this->rules(
			$json,
			array(
				array(
					'selector' => null,
					'path'     => array( 'styles', 'blocks', 'core/paragraph' ),
					'name'     => 'core/paragraph',
				),
			)
		);

		$this->assertSame( '', $css );
	}

	public function testConcatenatesRulesForMultipleNodes(): void {
		$json = $this->make_json(
			array(
				'version' => 3,
				'styles'  => array(
					'blocks' => array(
						'core/paragraph' => array(
							'blockeraBackgroundColor' => array( 'value' => '#112233' ),
						),
						'core/group'     => array(
							'blockeraFontColor' => array( 'value' => '#00ff00' ),
						),
					),
				),
			)
		);

		$css = $this->rules(
			$json,
			array(
				array(
					'selector' => null,
					'path'     => array( 'styles', 'blocks', 'core/paragraph' ),
					'name'     => 'core/paragraph',
				),
				array(
					'selector' => 'p',
					'path'     => array( 'styles', 'blocks', 'core/paragraph' ),
					'name'     => 'core/paragraph',
				),
				array(
					'selector' => '.wp-block-group',
					'path'     => array( 'styles', 'blocks', 'core/group' ),
					'name'     => 'core/group',
				),
			)
		);

		$this->assertStringContainsString( 'background-color: #112233', $css );
		$this->assertStringContainsString( 'color: #00ff00', $css );

		$only_paragraph = $this->rules(
			$json,
			array(
				array(
					'selector' => 'p',
					'path'     => array( 'styles', 'blocks', 'core/paragraph' ),
					'name'     => 'core/paragraph',
				),
			)
		);
		$only_group     = $this->rules(
			$json,
			array(
				array(
					'selector' => '.wp-block-group',
					'path'     => array( 'styles', 'blocks', 'core/group' ),
					'name'     => 'core/group',
				),
			)
		);

		$this->assertSame( $only_paragraph . $only_group, $css );
	}
}
