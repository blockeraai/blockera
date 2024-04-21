<?php

namespace Publisher\Framework\Tests\Providers;

use Publisher\Framework\Tests\AppTestCase;
use Publisher\Framework\Providers\AssetsProvider;
use Publisher\Framework\Illuminate\Foundation\Application;
use Illuminate\Contracts\Container\BindingResolutionException;

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
	 * @throws BindingResolutionException
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
					'style'  => 'http://example.org/wp-content/plugins/publisher-core/dist/controls-styles/style',
					'script' => 'http://example.org/wp-content/plugins/publisher-core/dist/controls/index',
				],
			],
			[
				[
					'name'   => 'hooks',
					'style'  => 'http://example.org/wp-content/plugins/publisher-core/dist/hooks-styles/style',
					'script' => 'http://example.org/wp-content/plugins/publisher-core/dist/hooks/index',
				],
			],
			[
				[
					'name'   => 'editor-styles',
					'style'  => 'http://example.org/wp-content/plugins/publisher-core/dist/editor-styles/style',
					'script' => 'http://example.org/wp-content/plugins/publisher-core/dist/editor-styles/index',
				],
			],
			[
				[
					'name'   => 'core-data',
					'style'  => '',
					'script' => 'http://example.org/wp-content/plugins/publisher-core/dist/core-data/index',
				],
			],
			[
				[
					'name'   => 'components',
					'style'  => 'http://example.org/wp-content/plugins/publisher-core/dist/components-styles/style',
					'script' => 'http://example.org/wp-content/plugins/publisher-core/dist/components/index',
				],
			],
			[
				[
					'name'   => 'extensions',
					'style'  => 'http://example.org/wp-content/plugins/publisher-core/dist/extensions-styles/style',
					'script' => 'http://example.org/wp-content/plugins/publisher-core/dist/extensions/index',
				],
			],
			[
				[
					'name'   => 'classnames',
					'style'  => '',
					'script' => 'http://example.org/wp-content/plugins/publisher-core/dist/classnames/index',
				],
			],
			[
				[
					'name'   => 'data-extractor',
					'style'  => '',
					'script' => 'http://example.org/wp-content/plugins/publisher-core/dist/data-extractor/index',
				],
			],
			[
				[
					'name'   => 'style-engine',
					'style'  => '',
					'script' => 'http://example.org/wp-content/plugins/publisher-core/dist/style-engine/index',
				],
			],
			[
				[
					'name'   => 'utils',
					'style'  => '',
					'script' => 'http://example.org/wp-content/plugins/publisher-core/dist/utils/index',
				],
			],
		];
	}

}
