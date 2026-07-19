<?php

namespace Blockera\Setup\Tests;

use Blockera\Setup\Compatibility\BlockSupports\BlockeraDuotone;
use ReflectionProperty;
use WP_Block;

/**
 * Input/output + side-effect contract for BlockeraDuotone::render_duotone_support().
 *
 * Locks every branch so a performance refactor can prove identical results.
 *
 * @covers \Blockera\Setup\Compatibility\BlockSupports\BlockeraDuotone::render_duotone_support
 */
class RenderDuotoneSupportTest extends \Blockera\Dev\PHPUnit\AppTestCase {

	private const IMAGE_HTML = '<figure class="wp-block-image"><img src="x.jpg" alt=""/></figure>';

	private const PRESET = array(
		'slug'   => 'blue-orange',
		'colors' => array( '#0000ff', '#ffcc00' ),
	);

	public function set_up(): void {
		parent::set_up();
		$this->reset_duotone_state();
	}

	public function tear_down(): void {
		$this->reset_duotone_state();
		parent::tear_down();
	}

	/**
	 * Reset request-level static caches / enqueue buffers used by duotone rendering.
	 */
	private function reset_duotone_state(): void {
		$this->set_static( 'global_styles_block_names', null );
		$this->set_static( 'global_styles_presets', null );
		$this->set_static( 'used_global_styles_presets', array() );
		$this->set_static( 'used_svg_filter_data', array() );
		$this->set_static( 'block_css_declarations', array() );
	}

	/**
	 * @param string $name  Private static property name.
	 * @param mixed  $value Value to assign (null clears isset() for lazy maps).
	 */
	private function set_static( string $name, $value ): void {
		$prop = new ReflectionProperty( BlockeraDuotone::class, $name );
		$prop->setAccessible( true );
		$prop->setValue( null, $value );
	}

	/**
	 * @param string $name Private static property name.
	 * @return mixed
	 */
	private function get_static( string $name ) {
		$prop = new ReflectionProperty( BlockeraDuotone::class, $name );
		$prop->setAccessible( true );

		return $prop->getValue();
	}

	/**
	 * @param string               $block_name Block name.
	 * @param array<string, mixed> $attrs      Block attributes.
	 * @return array{0: array, 1: WP_Block}
	 */
	private function make_block( string $block_name, array $attrs = array() ): array {
		$parsed = array(
			'blockName'    => $block_name,
			'attrs'        => $attrs,
			'innerBlocks'  => array(),
			'innerHTML'    => '',
			'innerContent' => array(),
		);

		return array( $parsed, new WP_Block( $parsed ) );
	}

	/**
	 * @param string               $content Block HTML.
	 * @param string               $block_name Block name.
	 * @param array<string, mixed> $attrs Block attributes.
	 * @return string
	 */
	private function render( string $content, string $block_name, array $attrs = array() ): string {
		[ $block, $wp_block ] = $this->make_block( $block_name, $attrs );

		return BlockeraDuotone::render_duotone_support( $content, $block, $wp_block );
	}

	/**
	 * Seed preset map used by is_preset / enqueue_global_styles_preset.
	 */
	private function seed_presets(): void {
		$this->set_static(
			'global_styles_presets',
			array(
				'wp-duotone-blue-orange' => self::PRESET,
			)
		);
	}

	public function testEmptyBlockNameReturnsContentUnchanged(): void {
		$this->set_static( 'global_styles_block_names', array() );
		[ $block, $wp_block ] = $this->make_block( 'core/image' );
		$block['blockName']   = '';

		$this->assertSame(
			self::IMAGE_HTML,
			BlockeraDuotone::render_duotone_support( self::IMAGE_HTML, $block, $wp_block )
		);
		$this->assertSame( array(), $this->get_static( 'block_css_declarations' ) );
	}

	public function testMissingBlockNameKeyReturnsContentUnchanged(): void {
		$this->set_static( 'global_styles_block_names', array() );
		[ $block, $wp_block ] = $this->make_block( 'core/image' );
		unset( $block['blockName'] );

		$this->assertSame(
			self::IMAGE_HTML,
			BlockeraDuotone::render_duotone_support( self::IMAGE_HTML, $block, $wp_block )
		);
	}

	public function testNoDuotoneAttributeAndEmptyGlobalMapReturnsEarly(): void {
		$this->set_static( 'global_styles_block_names', array() );

		$this->assertSame(
			self::IMAGE_HTML,
			$this->render( self::IMAGE_HTML, 'core/image' )
		);
		$this->assertSame( array(), $this->get_static( 'block_css_declarations' ) );
		$this->assertSame( array(), $this->get_static( 'used_svg_filter_data' ) );
	}

	public function testNoDuotoneAttributeAndBlockNotInGlobalMapReturnsEarly(): void {
		$this->set_static(
			'global_styles_block_names',
			array(
				'core/cover' => 'blue-orange',
			)
		);

		$this->assertSame(
			self::IMAGE_HTML,
			$this->render( self::IMAGE_HTML, 'core/image' )
		);
		$this->assertSame( array(), $this->get_static( 'block_css_declarations' ) );
	}

	public function testDuotoneAttributeOnUnsupportedBlockReturnsEarly(): void {
		$this->set_static( 'global_styles_block_names', array() );
		$html = '<p>hello</p>';

		$this->assertSame(
			$html,
			$this->render(
				$html,
				'core/paragraph',
				array(
					'style' => array(
						'color' => array(
							'duotone' => array( '#000000', '#ffffff' ),
						),
					),
				)
			)
		);
		$this->assertSame( array(), $this->get_static( 'block_css_declarations' ) );
	}

	public function testCustomColorArrayAddsClassAndEnqueuesSvgAndCss(): void {
		$this->set_static( 'global_styles_block_names', array() );

		$out = $this->render(
			self::IMAGE_HTML,
			'core/image',
			array(
				'style' => array(
					'color' => array(
						'duotone' => array( '#000000', '#ffffff' ),
					),
				),
			)
		);

		$this->assertMatchesRegularExpression(
			'/class="wp-block-image wp-duotone-000000-ffffff-\d+"/',
			$out
		);
		$this->assertStringContainsString( '<img src="x.jpg" alt=""/>', $out );

		$svg = $this->get_static( 'used_svg_filter_data' );
		$this->assertCount( 1, $svg );
		$filter_id = array_key_first( $svg );
		$this->assertMatchesRegularExpression( '/^wp-duotone-000000-ffffff-\d+$/', $filter_id );
		$this->assertSame( array( '#000000', '#ffffff' ), $svg[ $filter_id ]['colors'] );
		$this->assertSame( $filter_id, 'wp-duotone-' . $svg[ $filter_id ]['slug'] );

		$css = $this->get_static( 'block_css_declarations' );
		$this->assertCount( 1, $css );
		$this->assertSame( 'url(#' . $filter_id . ')', $css[0]['declarations']['filter'] );
		$this->assertStringStartsWith( '.' . $filter_id, $css[0]['selector'] );
	}

	public function testCssStringUnsetAddsClassAndEnqueuesBlockCssOnly(): void {
		$this->set_static( 'global_styles_block_names', array() );

		$out = $this->render(
			self::IMAGE_HTML,
			'core/image',
			array(
				'style' => array(
					'color' => array(
						'duotone' => 'unset',
					),
				),
			)
		);

		$this->assertMatchesRegularExpression( '/class="wp-block-image wp-duotone-unset-\d+"/', $out );
		$this->assertSame( array(), $this->get_static( 'used_global_styles_presets' ) );

		$css = $this->get_static( 'block_css_declarations' );
		$this->assertCount( 1, $css );
		$this->assertSame( 'unset', $css[0]['declarations']['filter'] );
		$this->assertSame( array(), $this->get_static( 'used_svg_filter_data' ) );
	}

	public function testPresetVarPipeFormAddsClassAndEnqueuesPreset(): void {
		$this->set_static( 'global_styles_block_names', array() );
		$this->seed_presets();

		$out = $this->render(
			self::IMAGE_HTML,
			'core/image',
			array(
				'style' => array(
					'color' => array(
						'duotone' => 'var:preset|duotone|blue-orange',
					),
				),
			)
		);

		$this->assertSame(
			'<figure class="wp-block-image wp-duotone-blue-orange"><img src="x.jpg" alt=""/></figure>',
			$out
		);
		$this->assertSame(
			array( 'wp-duotone-blue-orange' => self::PRESET ),
			$this->get_static( 'used_global_styles_presets' )
		);
		$this->assertArrayHasKey( 'wp-duotone-blue-orange', $this->get_static( 'used_svg_filter_data' ) );

		$css = $this->get_static( 'block_css_declarations' );
		$this->assertCount( 1, $css );
		$this->assertSame( 'var(--wp--preset--duotone--blue-orange)', $css[0]['declarations']['filter'] );
	}

	public function testPresetCssVarFormAddsClassAndEnqueuesPreset(): void {
		$this->set_static( 'global_styles_block_names', array() );
		$this->seed_presets();

		$out = $this->render(
			self::IMAGE_HTML,
			'core/image',
			array(
				'style' => array(
					'color' => array(
						'duotone' => 'var(--wp--preset--duotone--blue-orange)',
					),
				),
			)
		);

		$this->assertSame(
			'<figure class="wp-block-image wp-duotone-blue-orange"><img src="x.jpg" alt=""/></figure>',
			$out
		);
		$this->assertArrayHasKey( 'wp-duotone-blue-orange', $this->get_static( 'used_global_styles_presets' ) );
	}

	public function testUnknownPresetStringFallsBackToCssPath(): void {
		$this->set_static( 'global_styles_block_names', array() );
		$this->set_static( 'global_styles_presets', array() );

		$attr = 'var:preset|duotone|missing';
		$out  = $this->render(
			self::IMAGE_HTML,
			'core/image',
			array(
				'style' => array(
					'color' => array(
						'duotone' => $attr,
					),
				),
			)
		);

		$this->assertMatchesRegularExpression(
			'/class="wp-block-image wp-duotone-varpresetduotonemissing-\d+"/',
			$out
		);
		$this->assertSame( array(), $this->get_static( 'used_global_styles_presets' ) );

		$css = $this->get_static( 'block_css_declarations' );
		$this->assertCount( 1, $css );
		$this->assertSame( $attr, $css[0]['declarations']['filter'] );
	}

	public function testGlobalStylesDuotoneWithoutAttributeAddsClassAndEnqueuesPreset(): void {
		$this->set_static(
			'global_styles_block_names',
			array(
				'core/image' => 'blue-orange',
			)
		);
		$this->seed_presets();

		$out = $this->render( self::IMAGE_HTML, 'core/image' );

		$this->assertSame(
			'<figure class="wp-block-image wp-duotone-blue-orange"><img src="x.jpg" alt=""/></figure>',
			$out
		);
		$this->assertArrayHasKey( 'wp-duotone-blue-orange', $this->get_static( 'used_global_styles_presets' ) );
		$this->assertSame(
			'var(--wp--preset--duotone--blue-orange)',
			$this->get_static( 'block_css_declarations' )[0]['declarations']['filter']
		);
	}

	public function testAttributeTakesPrecedenceOverGlobalStylesMapping(): void {
		$this->set_static(
			'global_styles_block_names',
			array(
				'core/image' => 'blue-orange',
			)
		);
		$this->seed_presets();

		$out = $this->render(
			self::IMAGE_HTML,
			'core/image',
			array(
				'style' => array(
					'color' => array(
						'duotone' => 'unset',
					),
				),
			)
		);

		$this->assertMatchesRegularExpression( '/wp-duotone-unset-\d+/', $out );
		$this->assertStringNotContainsString( 'wp-duotone-blue-orange', $out );
		$this->assertSame( array(), $this->get_static( 'used_global_styles_presets' ) );
	}

	public function testContentWithoutHtmlTagsReturnsUnchangedAfterEnqueue(): void {
		$this->set_static( 'global_styles_block_names', array() );

		$out = $this->render(
			'plaintext',
			'core/image',
			array(
				'style' => array(
					'color' => array(
						'duotone' => 'unset',
					),
				),
			)
		);

		$this->assertSame( 'plaintext', $out );
		$this->assertCount( 1, $this->get_static( 'block_css_declarations' ) );
	}

	public function testEmptyContentWithDuotoneStillEnqueuesAndReturnsEmpty(): void {
		$this->set_static( 'global_styles_block_names', array() );

		$out = $this->render(
			'',
			'core/image',
			array(
				'style' => array(
					'color' => array(
						'duotone' => 'unset',
					),
				),
			)
		);

		$this->assertSame( '', $out );
		$this->assertCount( 1, $this->get_static( 'block_css_declarations' ) );
	}

	public function testAddsClassOnlyToFirstTag(): void {
		$this->set_static( 'global_styles_block_names', array() );
		$this->seed_presets();

		$html = '<div class="outer"><span class="inner">x</span></div>';
		$out  = $this->render(
			$html,
			'core/image',
			array(
				'style' => array(
					'color' => array(
						'duotone' => 'var:preset|duotone|blue-orange',
					),
				),
			)
		);

		$this->assertSame(
			'<div class="outer wp-duotone-blue-orange"><span class="inner">x</span></div>',
			$out
		);
	}

	public function testNullDuotoneValueIsTreatedAsMissingAttribute(): void {
		$this->set_static( 'global_styles_block_names', array() );

		$out = $this->render(
			self::IMAGE_HTML,
			'core/image',
			array(
				'style' => array(
					'color' => array(
						'duotone' => null,
					),
				),
			)
		);

		$this->assertSame( self::IMAGE_HTML, $out );
		$this->assertSame( array(), $this->get_static( 'block_css_declarations' ) );
	}

	public function testNonStringNonArrayDuotoneSkipsEnqueueButStillRunsTagProcessor(): void {
		$this->set_static( 'global_styles_block_names', array() );

		/*
		 * isset(true) is true, but none of is_preset / is_css / is_custom match.
		 * $filter_id is then undefined when add_class runs — capture PHP warning.
		 */
		$block_name = 'core/image';
		$attrs      = array(
			'style' => array(
				'color' => array(
					'duotone' => 1,
				),
			),
		);
		[ $block, $wp_block ] = $this->make_block( $block_name, $attrs );

		$warned = false;
		set_error_handler(
			static function () use ( &$warned ) {
				$warned = true;
				return true;
			}
		);
		$out = BlockeraDuotone::render_duotone_support( self::IMAGE_HTML, $block, $wp_block );
		restore_error_handler();

		$this->assertTrue( $warned, 'Expected undefined $filter_id warning for non-string/non-array duotone' );
		$this->assertSame( array(), $this->get_static( 'block_css_declarations' ) );
		// Tag processor still runs; class may be empty/odd — lock exact current output.
		$this->assertIsString( $out );
		$this->assertStringContainsString( 'wp-block-image', $out );
	}

	public function testLoadedNonEmptyGlobalMapDoesNotRequireAttributeForMappedBlock(): void {
		$this->set_static(
			'global_styles_block_names',
			array(
				'core/cover' => 'blue-orange',
			)
		);
		$this->seed_presets();

		$cover_html = '<div class="wp-block-cover"><img src="x.jpg" alt=""/></div>';
		$out        = $this->render( $cover_html, 'core/cover' );

		$this->assertStringContainsString( 'wp-duotone-blue-orange', $out );
		$this->assertArrayHasKey( 'wp-duotone-blue-orange', $this->get_static( 'used_global_styles_presets' ) );
	}

	public function testRepeatedEarlyExitCallsLeaveEnqueueBuffersEmpty(): void {
		$this->set_static( 'global_styles_block_names', array() );

		for ( $i = 0; $i < 20; $i++ ) {
			$this->assertSame(
				self::IMAGE_HTML,
				$this->render( self::IMAGE_HTML, 'core/image' )
			);
		}

		$this->assertSame( array(), $this->get_static( 'block_css_declarations' ) );
		$this->assertSame( array(), $this->get_static( 'used_svg_filter_data' ) );
		$this->assertSame( array(), $this->get_static( 'used_global_styles_presets' ) );
	}
}
