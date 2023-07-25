<?php

namespace Publisher\Core\Tests;

use Publisher\Core\Providers\AssetsProvider;

class TestAssetsProvider extends \WP_UnitTestCase {

	protected static ?AssetsProvider $provider = null;

	public function set_up() {

		parent::set_up();

		self::$provider = new AssetsProvider();
	}

	/**
	 * @test
	 * @return void
	 */
	public function testShouldReturnAssetInformationWithGivenAssetName() {

		$actual = self::$provider->assetInfo( 'controls-styles' );

		if ( is_array( $actual ) ) {
			unset( $actual['version'] );
		}

		$this->assertEquals( [
			'deps'   => [
				'wp-polyfill',
			],
			'style'  => '',
			'script' => '/dist/controls-styles/index.js',
		], $actual );
	}

}
