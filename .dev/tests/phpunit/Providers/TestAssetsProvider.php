<?php

namespace Blockera\Framework\Tests\Providers;

use Blockera\Framework\Tests\AppTestCase;
use Blockera\Framework\Providers\AssetsProvider;
use Blockera\Framework\Illuminate\Foundation\Application;
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

		$this->assertTrue( wp_script_is( '@blockera/utils', 'registered' ) );
		$this->assertTrue( wp_script_is( '@blockera/controls', 'registered' ) );
		$this->assertTrue( wp_script_is( '@blockera/components', 'registered' ) );
		$this->assertTrue( wp_script_is( '@blockera/extensions', 'registered' ) );
		$this->assertTrue( wp_script_is( '@blockera/classnames', 'registered' ) );
		$this->assertTrue( wp_script_is( '@blockera/style-engine', 'registered' ) );
		$this->assertTrue( wp_script_is( '@blockera/data-extractor', 'registered' ) );
	}

	public function dataProvider(): array {

		$home = trailingslashit( home_url() );

		return [
			[
				[
					'name'   => 'controls',
					'style'  => $home . 'wp-content/plugins/blockera-core/dist/controls-styles/style',
					'script' => $home . 'wp-content/plugins/blockera-core/dist/controls/index',
				],
			],
			[
				[
					'name'   => 'hooks',
					'style'  => $home . 'wp-content/plugins/blockera-core/dist/hooks-styles/style',
					'script' => $home . 'wp-content/plugins/blockera-core/dist/hooks/index',
				],
			],
			[
				[
					'name'   => 'editor-styles',
					'style'  => $home . 'wp-content/plugins/blockera-core/dist/editor-styles/style',
					'script' => $home . 'wp-content/plugins/blockera-core/dist/editor-styles/index',
				],
			],
			[
				[
					'name'   => 'core-data',
					'style'  => '',
					'script' => $home . 'wp-content/plugins/blockera-core/dist/core-data/index',
				],
			],
			[
				[
					'name'   => 'components',
					'style'  => $home . 'wp-content/plugins/blockera-core/dist/components-styles/style',
					'script' => $home . 'wp-content/plugins/blockera-core/dist/components/index',
				],
			],
			[
				[
					'name'   => 'extensions',
					'style'  => $home . 'wp-content/plugins/blockera-core/dist/extensions-styles/style',
					'script' => $home . 'wp-content/plugins/blockera-core/dist/extensions/index',
				],
			],
			[
				[
					'name'   => 'classnames',
					'style'  => '',
					'script' => $home . 'wp-content/plugins/blockera-core/dist/classnames/index',
				],
			],
			[
				[
					'name'   => 'data-extractor',
					'style'  => '',
					'script' => $home . 'wp-content/plugins/blockera-core/dist/data-extractor/index',
				],
			],
			[
				[
					'name'   => 'style-engine',
					'style'  => '',
					'script' => $home . 'wp-content/plugins/blockera-core/dist/style-engine/index',
				],
			],
			[
				[
					'name'   => 'utils',
					'style'  => '',
					'script' => $home . 'wp-content/plugins/blockera-core/dist/utils/index',
				],
			],
		];
	}

}
