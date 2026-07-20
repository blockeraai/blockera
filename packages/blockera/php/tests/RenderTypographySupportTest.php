<?php

namespace Blockera\Setup\Tests;

/**
 * Input/output contract for blockera_render_typography_support().
 *
 * Locks every branch so a performance refactor can prove identical results.
 *
 * Hot path: `render_block` filter ({@see bootstrap/hooks.php}).
 *
 * @covers ::blockera_render_typography_support
 */
class RenderTypographySupportTest extends \Blockera\Dev\PHPUnit\AppTestCase {

	/**
	 * @param mixed $block_content Block markup.
	 * @param array $block         Parsed block.
	 * @return mixed
	 */
	private function render( $block_content, array $block ) {
		return blockera_render_typography_support( $block_content, $block );
	}

	/**
	 * @param string|null $font_size Custom font-size attr.
	 * @param mixed       $fit_text  fitText attr (omit when null).
	 * @return array
	 */
	private function block( $font_size = null, $fit_text = null ): array {
		$block = array( 'attrs' => array() );

		if ( null !== $fit_text ) {
			$block['attrs']['fitText'] = $fit_text;
		}

		if ( null !== $font_size ) {
			$block['attrs']['style']['typography']['fontSize'] = $font_size;
		}

		return $block;
	}

	/**
	 * Expected markup after fluid replace (mirrors production preg + esc_attr).
	 *
	 * @param string $content HTML.
	 * @param string $custom  Custom font-size.
	 * @param string $fluid   Fluid font-size.
	 * @return string|null
	 */
	private function expect_fluid_replace( string $content, string $custom, string $fluid ) {
		return preg_replace(
			'/font-size\s*:\s*' . preg_quote( $custom, '/' ) . '\s*;?/',
			'font-size:' . esc_attr( $fluid ) . ';',
			$content,
			1
		);
	}

	public function testMissingAttrsReturnsContentUnchanged(): void {
		$html = '<p style="font-size:20px">Hi</p>';
		$this->assertSame( $html, $this->render( $html, array() ) );
	}

	public function testMissingFontSizeReturnsContentUnchanged(): void {
		$html = '<p style="font-size:20px">Hi</p>';
		$this->assertSame( $html, $this->render( $html, $this->block() ) );
		$this->assertSame( $html, $this->render( $html, array( 'attrs' => array() ) ) );
	}

	public function testEmptyContentWithoutFontSize(): void {
		$this->assertSame( '', $this->render( '', $this->block() ) );
	}

	public function testFontSizeBelowFluidLimitLeavesContentUnchanged(): void {
		$html = '<p style="font-size:12px">Hi</p>';
		$this->assertSame( $html, $this->render( $html, $this->block( '12px' ) ) );
	}

	public function testAlreadyClampFontSizeLeavesContentUnchanged(): void {
		$size = 'clamp(1rem, 2vw, 2rem)';
		$html = '<p style="font-size: ' . $size . '">x</p>';
		$this->assertSame( $html, $this->render( $html, $this->block( $size ) ) );
	}

	public function testFluidMutatedFontSizeReplacesFirstInlineDeclaration(): void {
		$custom = '20px';
		$fluid  = blockera_get_typography_font_size_value( array( 'size' => $custom ) );

		$this->assertNotEmpty( $fluid );
		$this->assertNotSame( $custom, $fluid );

		$html = '<p style="font-size:' . $custom . '">Hi</p>';
		$this->assertSame(
			$this->expect_fluid_replace( $html, $custom, $fluid ),
			$this->render( $html, $this->block( $custom ) )
		);
	}

	public function testFluidReplaceAllowsWhitespaceAroundColonAndOptionalSemicolon(): void {
		$custom = '20px';
		$fluid  = blockera_get_typography_font_size_value( array( 'size' => $custom ) );
		$this->assertNotSame( $custom, $fluid );

		$html = '<p style="font-size: ' . $custom . ' ;color:red">Hi</p>';
		$this->assertSame(
			$this->expect_fluid_replace( $html, $custom, $fluid ),
			$this->render( $html, $this->block( $custom ) )
		);
	}

	public function testFluidReplaceKeepsFollowingDeclarations(): void {
		$custom = '20px';
		$fluid  = blockera_get_typography_font_size_value( array( 'size' => $custom ) );
		$html   = '<p style="font-size:' . $custom . ';color:red">Hi</p>';

		$this->assertSame(
			$this->expect_fluid_replace( $html, $custom, $fluid ),
			$this->render( $html, $this->block( $custom ) )
		);
	}

	public function testFluidReplaceOnlyFirstOccurrence(): void {
		$custom = '20px';
		$fluid  = blockera_get_typography_font_size_value( array( 'size' => $custom ) );
		$html   = '<div><p style="font-size:' . $custom . '">a</p><p style="font-size:' . $custom . '">b</p></div>';

		$this->assertSame(
			$this->expect_fluid_replace( $html, $custom, $fluid ),
			$this->render( $html, $this->block( $custom ) )
		);
	}

	public function testUppercaseFontSizePropertyNotMatched(): void {
		$custom = '20px';
		$html   = '<p style="FONT-SIZE:' . $custom . '">Hi</p>';
		$this->assertSame( $html, $this->render( $html, $this->block( $custom ) ) );
	}

	public function testFluidFontSizeWithoutInlineFontSizeLeavesContentUnchanged(): void {
		$custom = '20px';
		$fluid  = blockera_get_typography_font_size_value( array( 'size' => $custom ) );
		$this->assertNotSame( $custom, $fluid );

		$html = '<p>no inline</p>';
		$this->assertSame( $html, $this->render( $html, $this->block( $custom ) ) );
	}

	public function testFalsyFitTextFallsThroughToFontSizePath(): void {
		$custom = '20px';
		$fluid  = blockera_get_typography_font_size_value( array( 'size' => $custom ) );
		$html   = '<p style="font-size:' . $custom . '">x</p>';
		$expect = $this->expect_fluid_replace( $html, $custom, $fluid );

		$this->assertSame( $expect, $this->render( $html, $this->block( $custom, false ) ) );
		$this->assertSame( $expect, $this->render( $html, $this->block( $custom, 0 ) ) );
	}

	public function testFitTextEmptyContentReturnsAsIs(): void {
		$this->assertSame( '', $this->render( '', $this->block( null, true ) ) );
	}

	public function testFitTextPlainTextWithoutTagsReturnsAsIs(): void {
		$this->assertSame( 'plain', $this->render( 'plain', $this->block( null, true ) ) );
	}

	public function testFitTextAddsInteractivityDirectives(): void {
		$result = $this->render( '<p>Hi</p>', $this->block( null, true ) );

		$this->assertNotFalse( $result );
		$processor = new \WP_HTML_Tag_Processor( $result );
		$this->assertTrue( $processor->next_tag() );
		$this->assertNotFalse( $processor->get_attribute( 'data-wp-interactive' ) );
		$this->assertSame(
			'core/fit-text::{"fontSize":""}',
			$processor->get_attribute( 'data-wp-context---core-fit-text' )
		);
		$this->assertSame(
			'core/fit-text::callbacks.init',
			$processor->get_attribute( 'data-wp-init---core-fit-text' )
		);
		$this->assertSame(
			'core/fit-text::context.fontSize',
			$processor->get_attribute( 'data-wp-style--font-size' )
		);
	}

	public function testFitTextKeepsExistingDataWpInteractive(): void {
		$result = $this->render(
			'<p data-wp-interactive="true">Hi</p>',
			$this->block( null, true )
		);

		$processor = new \WP_HTML_Tag_Processor( $result );
		$this->assertTrue( $processor->next_tag() );
		$this->assertSame( 'true', $processor->get_attribute( 'data-wp-interactive' ) );
		$this->assertSame(
			'core/fit-text::callbacks.init',
			$processor->get_attribute( 'data-wp-init---core-fit-text' )
		);
	}

	public function testFitTextSupersedesFluidFontSizeReplace(): void {
		$result = $this->render(
			'<p style="font-size:20px">Hi</p>',
			$this->block( '20px', true )
		);

		$processor = new \WP_HTML_Tag_Processor( $result );
		$this->assertTrue( $processor->next_tag() );
		$this->assertNotFalse( $processor->get_attribute( 'data-wp-interactive' ) );
		// Inline font-size must remain the custom value (no fluid replace).
		$this->assertStringContainsString( 'font-size:20px', $result );
		$this->assertStringNotContainsString( 'clamp(', $result );
	}

	public function testFitTextSkippedInAdmin(): void {
		set_current_screen( 'dashboard' );
		$this->assertTrue( is_admin() );

		$html = '<p style="font-size:20px">Hi</p>';
		// fitText ignored in admin → falls through to fluid font-size path.
		$custom = '20px';
		$fluid  = blockera_get_typography_font_size_value( array( 'size' => $custom ) );

		$this->assertSame(
			$this->expect_fluid_replace( $html, $custom, $fluid ),
			$this->render( $html, $this->block( $custom, true ) )
		);

		set_current_screen( 'front' );
	}

	public function testNumericZeroFontSizeLeavesContentUnchanged(): void {
		$html = '<p style="font-size:0">x</p>';
		$this->assertSame( $html, $this->render( $html, $this->block( 0 ) ) );
	}

	/**
	 * @return array<string, array{0: string, 1: array}>
	 */
	public function providerEarlyExitFixtures(): array {
		return array(
			'no attrs'            => array( '<p>Hi</p>', array() ),
			'empty attrs'         => array( '<p>Hi</p>', array( 'attrs' => array() ) ),
			'no fontSize'         => array( '<p style="font-size:20px">Hi</p>', array( 'attrs' => array( 'className' => 'x' ) ) ),
			'fitText false'       => array( '<p>Hi</p>', array( 'attrs' => array( 'fitText' => false ) ) ),
		);
	}

	/**
	 * @dataProvider providerEarlyExitFixtures
	 *
	 * @param string $html  Markup.
	 * @param array  $block Block.
	 */
	public function testEarlyExitFixtures( string $html, array $block ): void {
		$this->assertSame( $html, $this->render( $html, $block ) );
	}
}
