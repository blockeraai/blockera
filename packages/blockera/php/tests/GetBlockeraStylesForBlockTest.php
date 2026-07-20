<?php

namespace Blockera\Setup\Tests;

use Blockera\Setup\Compatibility\JSON;
use ReflectionProperty;
use WP_Theme_JSON;

/**
 * @covers \Blockera\Setup\Compatibility\JSON::get_blockera_styles_for_block
 */
class GetBlockeraStylesForBlockTest extends \Blockera\Dev\PHPUnit\AppTestCase {

	/**
	 * Inject theme.json payload after construct (sanitize strips unregistered variations).
	 *
	 * @param array $data Theme.json-like structure.
	 */
	private function make_json( array $data ): JSON {
		$json = new JSON( array( 'version' => 3 ) );
		$prop = new ReflectionProperty( WP_Theme_JSON::class, 'theme_json' );
		$prop->setAccessible( true );
		$prop->setValue( $json, $data );

		return $json;
	}

	private function paragraph_data( bool $with_variation = false ): array {
		$block = array(
			'blockeraBackgroundColor'     => array( 'value' => '#112233' ),
			'blockeraFontColor'           => array( 'value' => '#eeffaa' ),
			'blockeraSizeVariationsOrder' => array( 'a', 'b' ),
		);

		if ( $with_variation ) {
			$block['variations'] = array(
				'outline' => array(
					'blockeraBackgroundColor'    => array( 'value' => '#abcdef' ),
					'blockeraVariationType'      => 'style',
					'blockeraIsDefaultVariation' => false,
				),
			);
		}

		return array(
			'version' => 3,
			'styles'  => array(
				'blocks' => array(
					'core/paragraph' => $block,
				),
			),
		);
	}

	public function testEmptyNodeReturnsEmptyString(): void {
		$json = $this->make_json(
			array(
				'version' => 3,
				'styles'  => array(
					'blocks' => array(),
				),
			)
		);

		$this->assertSame(
			'',
			$json->get_blockera_styles_for_block(
				array(
					'path'     => array( 'styles', 'blocks', 'core/paragraph' ),
					'name'     => 'core/paragraph',
					'selector' => 'p',
				)
			)
		);
	}

	public function testMissingNameSkipsRootRules(): void {
		$json = $this->make_json( $this->paragraph_data() );

		$this->assertSame(
			'',
			$json->get_blockera_styles_for_block(
				array(
					'path'     => array( 'styles', 'blocks', 'core/paragraph' ),
					'selector' => 'p',
				)
			)
		);
	}

	public function testRootAttrsProduceCss(): void {
		$json = $this->make_json( $this->paragraph_data() );
		$css  = $json->get_blockera_styles_for_block(
			array(
				'path'     => array( 'styles', 'blocks', 'core/paragraph' ),
				'name'     => 'core/paragraph',
				'selector' => 'p',
			)
		);

		$this->assertStringContainsString( 'background-color: #112233', $css );
		$this->assertStringContainsString( 'color: #eeffaa', $css );
		$this->assertStringContainsString( ':where(p)', $css );
	}

	public function testMetadataKeysDoNotChangeCss(): void {
		$with_meta = $this->paragraph_data();
		$without   = $this->paragraph_data();
		unset( $without['styles']['blocks']['core/paragraph']['blockeraSizeVariationsOrder'] );

		$meta = array(
			'path'     => array( 'styles', 'blocks', 'core/paragraph' ),
			'name'     => 'core/paragraph',
			'selector' => 'p',
		);

		$this->assertSame(
			$this->make_json( $without )->get_blockera_styles_for_block( $meta ),
			$this->make_json( $with_meta )->get_blockera_styles_for_block( $meta )
		);
	}

	public function testVariationsAppendStyleRules(): void {
		$json = $this->make_json( $this->paragraph_data( true ) );
		$css  = $json->get_blockera_styles_for_block(
			array(
				'path'       => array( 'styles', 'blocks', 'core/paragraph' ),
				'name'       => 'core/paragraph',
				'selector'   => 'p',
				'variations' => array(
					array(
						'path'     => array( 'styles', 'blocks', 'core/paragraph', 'variations', 'outline' ),
						'selector' => 'p.is-style-outline',
					),
				),
			)
		);

		$this->assertStringContainsString( 'background-color: #112233', $css );
		$this->assertStringContainsString( 'background-color: #abcdef', $css );
		$this->assertStringContainsString( 'p.is-style-outline', $css );
	}

	public function testVariationMetadataKeysDoNotChangeCss(): void {
		$with = $this->paragraph_data( true );
		$without = $this->paragraph_data( true );
		unset(
			$without['styles']['blocks']['core/paragraph']['variations']['outline']['blockeraVariationType'],
			$without['styles']['blocks']['core/paragraph']['variations']['outline']['blockeraIsDefaultVariation']
		);

		$meta = array(
			'path'       => array( 'styles', 'blocks', 'core/paragraph' ),
			'name'       => 'core/paragraph',
			'selector'   => 'p',
			'variations' => array(
				array(
					'path'     => array( 'styles', 'blocks', 'core/paragraph', 'variations', 'outline' ),
					'selector' => 'p.is-style-outline',
				),
			),
		);

		$this->assertSame(
			$this->make_json( $without )->get_blockera_styles_for_block( $meta ),
			$this->make_json( $with )->get_blockera_styles_for_block( $meta )
		);
	}
}
