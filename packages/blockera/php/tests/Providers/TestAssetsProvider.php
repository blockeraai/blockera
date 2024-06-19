<?php

namespace Blockera\Setup\Tests\Providers;

use Blockera\Setup\Blockera;
use Blockera\Setup\Providers\AssetsProvider;
use Illuminate\Contracts\Container\BindingResolutionException;

class TestAssetsProvider extends \Blockera\Dev\PHPUnit\AppTestCase {

	protected static ?AssetsProvider $provider = null;

	public function set_up(): void {

		parent::set_up();

		self::$provider = new AssetsProvider( new Blockera() );
	}

	/**
	 * @dataProvider dataProvider
	 *
	 * @param array $asset
	 *
	 * @throws BindingResolutionException
	 * @return void
	 */
	public function testShouldReturnAssetInformationWithGivenAssetName( string $asset ): void {

		self::$provider->boot();

		set_current_screen( 'post.php' );

		do_action( 'admin_enqueue_scripts' );
		do_action( 'enqueue_block_assets' );

		if ( false !== strpos( $asset, '-styles' ) ) {

			$this->assertTrue( wp_style_is( '@blockera/' . $asset ) );

		} else {

			$this->assertTrue( wp_script_is( '@blockera/' . $asset ) );
		}
	}

	public function testShouldRegisteredAssetsAfterCreateNewInstanceOfAssetsProviderClass(): void {

		self::$provider->boot();

		do_action( 'wp_enqueue_scripts' );

		$this->assertTrue( wp_script_is( '@blockera/utils', 'enqueued' ) );
		$this->assertTrue( wp_script_is( '@blockera/controls', 'enqueued' ) );
		$this->assertTrue( wp_script_is( '@blockera/classnames', 'enqueued' ) );
		$this->assertTrue( wp_script_is( '@blockera/data-editor', 'enqueued' ) );
		$this->assertTrue( wp_script_is( '@blockera/editor', 'enqueued' ) );
		$this->assertTrue( wp_script_is( '@blockera/blockera', 'enqueued' ) );
		$this->assertTrue( wp_script_is( '@blockera/bootstrap', 'enqueued' ) );
		$this->assertTrue( wp_script_is( '@blockera/data', 'enqueued' ) );
		$this->assertTrue( wp_script_is( '@blockera/blocks-core', 'enqueued' ) );
	}

	public function dataProvider(): array {

		return [
			array_merge( [], blockera_core_config( 'assets.editor.list' ) )
		];
	}

}
