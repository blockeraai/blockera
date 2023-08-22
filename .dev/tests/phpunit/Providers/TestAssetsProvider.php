<?php

namespace Publisher\Core\Tests\Providers;

/**
 * Internal dependencies
 */

use Publisher\Core\Tests\AppTestCase;

/**
 * Publisher Core dependencies
 */

use Publisher\Core\Providers\AssetsProvider;

class TestAssetsProvider extends AppTestCase {

	protected static ?AssetsProvider $provider = null;

	public function set_up(): void {

		parent::set_up();

		self::$provider = new AssetsProvider();
	}

	/**
	 * @dataProvider dataProvider
	 *
	 * @param array $asset
	 *
	 * @return void
	 */
	public function testShouldReturnAssetInformationWithGivenAssetName( array $asset ): void {

		$actual = self::$provider->assetInfo( $asset['name'] );

		if ( ! empty( $actual ) ) {

			unset( $actual['version'] );
		}

		$this->assertEquals(
			array_merge(
				$asset,
				[
					'style'  => ! empty( $asset['style'] ) ? $asset['style'] . ( self::$is_dev_mode ? '' : '.min' ) . '.css' : '',
					'script' => ! empty( $asset['script'] ) ? $asset['script'] . ( self::$is_dev_mode ? '' : '.min' ) . '.js' : '',
				]
			),
			$actual
		);
	}

	public function testShouldRegisteredAssetsAfterCreateNewInstanceOfAssetsProviderClass(): void {

		new AssetsProvider();

		do_action( 'wp_enqueue_scripts' );

		$this->assertTrue( wp_script_is( '@publisher/utils', 'registered' ) );
		$this->assertTrue( wp_script_is( '@publisher/fields', 'registered' ) );
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
					'deps'   => [
						'react',
						'wp-block-editor',
						'wp-components',
						'wp-data',
						'wp-element',
						'wp-i18n',
						'wp-polyfill',
						'wp-primitives',
					],
					'style'  => '/dist/controls-styles/style',
					'script' => '/dist/controls/index',
				],
			],
			[
				[
					'name'   => 'components',
					'deps'   => [
						'react',
						'wp-block-editor',
						'wp-components',
						'wp-element',
						'wp-i18n',
						'wp-polyfill',
						'wp-primitives',
					],
					'style'  => '/dist/components-styles/style',
					'script' => '/dist/components/index',
				],
			],
			[
				[
					'name'   => 'extensions',
					'deps'   => [
						'react',
						'wp-block-editor',
						'wp-components',
						'wp-compose',
						'wp-data',
						'wp-element',
						'wp-hooks',
						'wp-i18n',
						'wp-polyfill',
						'wp-primitives',
					],
					'style'  => '/dist/extensions-styles/style',
					'script' => '/dist/extensions/index',
				],
			],
			[
				[
					'name'   => 'classnames',
					'deps'   => [
						'wp-element',
						'wp-polyfill',
					],
					'style'  => '',
					'script' => '/dist/classnames/index',
				],
			],
			[
				[
					'name'   => 'data-extractor',
					'deps'   => [
						'wp-element',
						'wp-polyfill',
					],
					'style'  => '',
					'script' => '/dist/data-extractor/index',
				],
			],
			[
				[
					'name'   => 'style-engine',
					'deps'   => [
						'wp-element',
						'wp-polyfill',
					],
					'style'  => '',
					'script' => '/dist/style-engine/index',
				],
			],
			[
				[
					'name'   => 'utils',
					'deps'   => [
						'wp-element',
						'wp-polyfill',
					],
					'style'  => '',
					'script' => '/dist/utils/index',
				],
			],
		];
	}

}
