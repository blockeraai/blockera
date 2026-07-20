<?php

namespace Blockera\Setup\Tests;

/**
 * Input/output contract for blockera_get_typography_font_size_value().
 *
 * Locks every branch so a performance refactor can prove identical results.
 *
 * Hot paths: theme.json stylesheet generation ({@see Blockera\Setup\Compatibility\JSON}),
 * block support apply/render typography.
 *
 * @covers ::blockera_get_typography_font_size_value
 */
class GetTypographyFontSizeValueTest extends \Blockera\Dev\PHPUnit\AppTestCase {

	/**
	 * Deterministic settings: fluid on + known wideSize (skips global merge).
	 *
	 * @return array
	 */
	private function settings_fluid_on(): array {
		return array(
			'typography' => array(
				'fluid' => true,
			),
			'layout'     => array(
				'wideSize' => '1200px',
			),
		);
	}

	/**
	 * Deterministic settings: fluid off + layout present (skips global merge).
	 *
	 * @return array
	 */
	private function settings_fluid_off(): array {
		return array(
			'typography' => array(
				'fluid' => false,
			),
			'layout'     => array(
				'wideSize' => '1200px',
			),
		);
	}

	/**
	 * @param array      $preset   Font-size preset.
	 * @param array|bool $settings Theme JSON settings or deprecated bool.
	 * @return string|null
	 */
	private function call( array $preset, $settings = array() ) {
		return blockera_get_typography_font_size_value( $preset, $settings );
	}

	public function testMissingSizeReturnsNull(): void {
		$this->assertNull( $this->call( array() ) );
		$this->assertNull( $this->call( array( 'slug' => 'medium' ), $this->settings_fluid_on() ) );
	}

	public function testEmptySizeReturnsSizeAsIs(): void {
		$this->assertSame( '', $this->call( array( 'size' => '' ), $this->settings_fluid_on() ) );
		$this->assertSame( 0, $this->call( array( 'size' => 0 ), $this->settings_fluid_on() ) );
		$this->assertSame( '0', $this->call( array( 'size' => '0' ), $this->settings_fluid_on() ) );
	}

	public function testFluidFalseReturnsSizeEvenWhenGlobalFluidOn(): void {
		$this->assertSame(
			'20px',
			$this->call(
				array(
					'size'  => '20px',
					'fluid' => false,
				),
				$this->settings_fluid_on()
			)
		);
	}

	public function testFluidDisabledGloballyAndNoPresetFluidReturnsSize(): void {
		$this->assertSame( '20px', $this->call( array( 'size' => '20px' ), $this->settings_fluid_off() ) );
		$this->assertSame(
			'28px',
			$this->call(
				array(
					'size'  => '28px',
					'fluid' => array(),
				),
				$this->settings_fluid_off()
			)
		);
	}

	public function testFluidEnabledReturnsClampForPx(): void {
		$this->assertSame(
			'clamp(14px, 0.875rem + ((1vw - 3.2px) * 0.682), 20px)',
			$this->call( array( 'size' => '20px' ), $this->settings_fluid_on() )
		);
	}

	public function testFluidEnabledReturnsClampForRem(): void {
		$this->assertSame(
			'clamp(1.25rem, 1.25rem + ((1vw - 0.2rem) * 1.364), 2rem)',
			$this->call( array( 'size' => '2rem' ), $this->settings_fluid_on() )
		);
	}

	public function testFluidEnabledReturnsClampForEm(): void {
		$this->assertSame(
			'clamp(7.517em, 7.517rem + ((1vw - 0.2em) * 22.696), 20em)',
			$this->call( array( 'size' => '20em' ), $this->settings_fluid_on() )
		);
	}

	public function testNumericSizeCoercedToPxFluid(): void {
		$this->assertSame(
			'clamp(14px, 0.875rem + ((1vw - 3.2px) * 0.682), 20px)',
			$this->call( array( 'size' => 20 ), $this->settings_fluid_on() )
		);
	}

	public function testUnsupportedUnitReturnsSize(): void {
		$this->assertSame( '20vh', $this->call( array( 'size' => '20vh' ), $this->settings_fluid_on() ) );
		$this->assertSame(
			'clamp(1rem, 2vw, 2rem)',
			$this->call( array( 'size' => 'clamp(1rem, 2vw, 2rem)' ), $this->settings_fluid_on() )
		);
	}

	public function testSizeAtOrBelowMinFontSizeLimitReturnsSize(): void {
		$this->assertSame( '14px', $this->call( array( 'size' => '14px' ), $this->settings_fluid_on() ) );
		$this->assertSame( '12px', $this->call( array( 'size' => '12px' ), $this->settings_fluid_on() ) );
		$this->assertSame(
			'12px',
			$this->call(
				array(
					'size'  => '12px',
					'fluid' => true,
				),
				$this->settings_fluid_on()
			)
		);
	}

	public function testSizeJustAboveMinFontSizeLimitReturnsClamp(): void {
		$this->assertSame(
			'clamp(14px, 0.875rem + ((1vw - 3.2px) * 0.011), 14.1px)',
			$this->call( array( 'size' => '14.1px' ), $this->settings_fluid_on() )
		);
	}

	public function testLargeSizeUsesCalculatedMinAboveLimit(): void {
		$this->assertSame(
			'clamp(27.894px, 1.743rem + ((1vw - 3.2px) * 2.285), 48px)',
			$this->call( array( 'size' => '48px' ), $this->settings_fluid_on() )
		);
	}

	public function testPresetFluidTrueEnablesWhenGlobalOff(): void {
		$this->assertSame(
			'clamp(17.905px, 1.119rem + ((1vw - 3.2px) * 1.147), 28px)',
			$this->call(
				array(
					'size'  => '28px',
					'fluid' => true,
				),
				$this->settings_fluid_off()
			)
		);
	}

	public function testPresetFluidMinAndMaxSkipsLimitAndComputes(): void {
		$this->assertSame(
			'clamp(10px, 0.625rem + ((1vw - 3.2px) * 0.455), 14px)',
			$this->call(
				array(
					'size'  => '12px',
					'fluid' => array(
						'min' => '10px',
						'max' => '14px',
					),
				),
				$this->settings_fluid_on()
			)
		);
	}

	public function testPresetFluidMinOnly(): void {
		$this->assertSame(
			'clamp(10px, 0.625rem + ((1vw - 3.2px) * 0.227), 12px)',
			$this->call(
				array(
					'size'  => '12px',
					'fluid' => array(
						'min' => '10px',
					),
				),
				$this->settings_fluid_on()
			)
		);
	}

	public function testPresetFluidMaxOnlySkipsEarlyLimitReturn(): void {
		$this->assertSame(
			'clamp(14px, 0.875rem + ((1vw - 3.2px) * 0.227), 16px)',
			$this->call(
				array(
					'size'  => '12px',
					'fluid' => array(
						'max' => '16px',
					),
				),
				$this->settings_fluid_on()
			)
		);
	}

	public function testFluidArraySettingsOverridesViewportsAndMinFontSize(): void {
		$settings = array(
			'typography' => array(
				'fluid' => array(
					'minFontSize'       => '16px',
					'minViewportWidth'  => '400px',
					'maxViewportWidth'  => '1400px',
				),
			),
			'layout'     => array(
				'wideSize' => '1100px',
			),
		);

		$this->assertSame(
			'clamp(16px, 1rem + ((1vw - 4px) * 0.4), 20px)',
			$this->call( array( 'size' => '20px' ), $settings )
		);
	}

	public function testMaxViewportWidthOverridesWideSize(): void {
		$settings = array(
			'typography' => array(
				'fluid' => array(
					'maxViewportWidth' => '1000px',
				),
			),
			'layout'     => array(
				'wideSize' => '1600px',
			),
		);

		$this->assertSame(
			'clamp(14px, 0.875rem + ((1vw - 3.2px) * 0.882), 20px)',
			$this->call( array( 'size' => '20px' ), $settings )
		);
	}

	public function testInvalidWideSizeFallsBackToDefaultMaxViewport(): void {
		$with_invalid = array(
			'typography' => array(
				'fluid' => true,
			),
			'layout'     => array(
				'wideSize' => '100%',
			),
		);
		$with_empty   = array(
			'typography' => array(
				'fluid' => true,
			),
			'layout'     => array(),
		);

		$a = $this->call( array( 'size' => '20px' ), $with_invalid );
		$b = $this->call( array( 'size' => '20px' ), $with_empty );

		$this->assertSame( $b, $a );
		$this->assertSame(
			'clamp(14px, 0.875rem + ((1vw - 3.2px) * 0.469), 20px)',
			$a
		);
	}

	public function testInvalidMaxViewportWidthReturnsOriginalSize(): void {
		$settings = array(
			'typography' => array(
				'fluid' => array(
					'maxViewportWidth' => '100%',
				),
			),
			'layout'     => array(),
		);

		$this->assertSame( '20px', $this->call( array( 'size' => '20px' ), $settings ) );
	}

	public function testEmptyTypographyFluidWithLayoutPresentReturnsSize(): void {
		$this->assertSame(
			'20px',
			$this->call(
				array( 'size' => '20px' ),
				array(
					'typography' => array(),
					'layout'     => array(
						'wideSize' => '1200px',
					),
				)
			)
		);
	}

	public function testPartialSettingsMergeMatchesExplicitMerge(): void {
		$global  = blockera_get_global_settings();
		$partial = array(
			'typography' => array(
				'fluid' => true,
			),
		);
		$merged  = wp_parse_args( $partial, $global );

		$this->assertSame(
			$this->call( array( 'size' => '20px' ), $merged ),
			$this->call( array( 'size' => '20px' ), $partial )
		);
	}

	public function testEmptySettingsMatchesGlobalSettingsCall(): void {
		$global = blockera_get_global_settings();

		$this->assertSame(
			$this->call( array( 'size' => '20px' ), $global ),
			$this->call( array( 'size' => '20px' ), array() )
		);
	}

	public function testDeprecatedBoolSettingsTrueEnablesFluid(): void {
		$this->setExpectedDeprecated( 'blockera_get_typography_font_size_value' );

		$from_bool = $this->call( array( 'size' => '20px' ), true );
		$from_arr  = $this->call(
			array( 'size' => '20px' ),
			array(
				'typography' => array(
					'fluid' => true,
				),
			)
		);

		$this->assertSame( $from_arr, $from_bool );
		$this->assertStringStartsWith( 'clamp(', $from_bool );
	}

	public function testDeprecatedBoolSettingsFalseDisablesFluid(): void {
		$this->setExpectedDeprecated( 'blockera_get_typography_font_size_value' );

		$this->assertSame( '20px', $this->call( array( 'size' => '20px' ), false ) );
	}

	public function testPresetFluidMinMaxWithGlobalOffStillWorks(): void {
		$this->assertSame(
			'clamp(18px, 1.125rem + ((1vw - 3.2px) * 2.045), 36px)',
			$this->call(
				array(
					'size'  => '28px',
					'fluid' => array(
						'min' => '18px',
						'max' => '36px',
					),
				),
				$this->settings_fluid_off()
			)
		);
	}

	public function testCustomMinFontSizeRejectsSmallPreferred(): void {
		$settings = array(
			'typography' => array(
				'fluid' => array(
					'minFontSize' => '18px',
				),
			),
			'layout'     => array(
				'wideSize' => '1200px',
			),
		);

		$this->assertSame( '16px', $this->call( array( 'size' => '16px' ), $settings ) );
		$this->assertSame(
			'clamp(18px, 1.125rem + ((1vw - 3.2px) * 0.227), 20px)',
			$this->call( array( 'size' => '20px' ), $settings )
		);
	}

	/**
	 * Data provider: hot-path shapes from JSON stylesheet + block render.
	 *
	 * @return array<string, array{0: array, 1: array, 2: string|null}>
	 */
	public function providerHotPathFixtures(): array {
		$on  = array(
			'typography' => array( 'fluid' => true ),
			'layout'     => array( 'wideSize' => '1200px' ),
		);
		$off = array(
			'typography' => array( 'fluid' => false ),
			'layout'     => array( 'wideSize' => '1200px' ),
		);

		return array(
			'json custom size fluid on'   => array(
				array( 'size' => '20px' ),
				$on,
				'clamp(14px, 0.875rem + ((1vw - 3.2px) * 0.682), 20px)',
			),
			'json custom size fluid off'  => array(
				array( 'size' => '20px' ),
				$off,
				'20px',
			),
			'preset with fluid min/max'   => array(
				array(
					'size'  => '28px',
					'fluid' => array(
						'min' => '18px',
						'max' => '36px',
					),
				),
				$on,
				'clamp(18px, 1.125rem + ((1vw - 3.2px) * 2.045), 36px)',
			),
			'render unsupported clamp'    => array(
				array( 'size' => 'clamp(1rem, 2vw, 2rem)' ),
				$on,
				'clamp(1rem, 2vw, 2rem)',
			),
			'empty fluid array global on' => array(
				array(
					'size'  => '28px',
					'fluid' => array(),
				),
				$on,
				'clamp(17.905px, 1.119rem + ((1vw - 3.2px) * 1.147), 28px)',
			),
		);
	}

	/**
	 * @dataProvider providerHotPathFixtures
	 *
	 * @param array       $preset   Preset.
	 * @param array       $settings Settings.
	 * @param string|null $expected Expected CSS value.
	 */
	public function testHotPathFixtures( array $preset, array $settings, $expected ): void {
		$this->assertSame( $expected, $this->call( $preset, $settings ) );
	}
}
