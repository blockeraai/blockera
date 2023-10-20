<?php

namespace Publisher\Framework\Tests\Providers;

use Publisher\Framework\Tests\AppTestCase;
use Publisher\Framework\Providers\AssetsProvider;
use Publisher\Framework\Illuminate\Foundation\Application;

class TestAssetsProvider extends AppTestCase {

	protected static ?AssetsProvider $provider = null;

	public function set_up(): void {

		parent::set_up();

		self::$provider = new AssetsProvider( new Application() );
	}

	/**
	 * @dataProvider dataProvider
	 *
	 * @param array $asset
	 *
	 * @return void
	 */
	public function testShouldReturnAssetInformationWithGivenAssetName( array $asset ): void {

		self::$provider->boot();

		$actual = self::$provider->getHandler()->assetInfo( $asset['name'] );

		if ( ! empty( $actual ) ) {

			unset( $actual['version'], $actual['deps'] );
		}

		$this->assertEquals(
			array_merge(
				$asset,
				[
					'style'  => ! empty( $asset['style'] ) ? $asset['style'] . ( self::$is_dev_mode ? '' : '.min' ) . '.css' : '',
					'script' => ! empty( $asset['script'] ) ? $asset['script'] . ( self::$is_dev_mode ? '' : '.min' ) . '.js' : '',
				],
			),
			$actual
		);
	}

	public function testShouldRegisteredAssetsAfterCreateNewInstanceOfAssetsProviderClass(): void {

		self::$provider->boot();

		do_action( 'wp_enqueue_scripts' );

		$this->assertTrue( wp_script_is( '@publisher/utils', 'registered' ) );
		$this->assertTrue( wp_script_is( '@publisher/controls', 'registered' ) );
		$this->assertTrue( wp_script_is( '@publisher/components', 'registered' ) );
		$this->assertTrue( wp_script_is( '@publisher/extensions', 'registered' ) );
		$this->assertTrue( wp_script_is( '@publisher/classnames', 'registered' ) );
		$this->assertTrue( wp_script_is( '@publisher/style-engine', 'registered' ) );
		$this->assertTrue( wp_script_is( '@publisher/data-extractor', 'registered' ) );
	}

	public function dataProvider(): array {

		return [
			[
				[
					'name'   => 'controls',
					'style'  => '/dist/controls-styles/style',
					'script' => '/dist/controls/index',
				],
			],
			[
				[
					'name'   => 'components',
					'style'  => '/dist/components-styles/style',
					'script' => '/dist/components/index',
				],
			],
			[
				[
					'name'   => 'extensions',
					'style'  => '/dist/extensions-styles/style',
					'script' => '/dist/extensions/index',
				],
			],
			[
				[
					'name'   => 'classnames',
					'style'  => '',
					'script' => '/dist/classnames/index',
				],
			],
			[
				[
					'name'   => 'data-extractor',
					'style'  => '',
					'script' => '/dist/data-extractor/index',
				],
			],
			[
				[
					'name'   => 'style-engine',
					'style'  => '',
					'script' => '/dist/style-engine/index',
				],
			],
			[
				[
					'name'   => 'utils',
					'style'  => '',
					'script' => '/dist/utils/index',
				],
			],
		];
	}

}
