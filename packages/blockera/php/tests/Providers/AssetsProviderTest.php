<?php

namespace Blockera\Setup\Tests\Providers;

use Blockera\Setup\Blockera;
use Blockera\Setup\Providers\AppServiceProvider;
use Blockera\Setup\Providers\EditorAssetsProvider;
use Illuminate\Contracts\Container\BindingResolutionException;

class AssetsProviderTest extends \Blockera\Dev\PHPUnit\AppTestCase {

	protected static ?EditorAssetsProvider $provider = null;

	public function set_up(): void {

		parent::set_up();

		$app = new Blockera();
		$appProvider = new AppServiceProvider($app);
		$appProvider->boot();
		self::$provider = new EditorAssetsProvider( $app );
	}

	/**
	 * @dataProvider dataProvider
	 *
	 * @param string $asset
	 *
	 * @throws BindingResolutionException
	 * @return void
	 */
	public function testShouldReturnAssetInformationWithGivenAssetName( string $asset ): void {

		self::$provider->boot();

		set_current_screen( 'post.php' );

		do_action( 'admin_enqueue_scripts' );
		do_action( 'enqueue_block_editor_assets' );

		if ( false !== strpos( $asset, '-styles' ) ) {

			$this->assertTrue( wp_style_is( '@blockera/' . $asset ), "'$asset' Style is not enqueued" );

		} else {

			$this->assertTrue( wp_script_is( '@blockera/' . $asset ), "'$asset' Script is not enqueued" );
		}
	}

	public function testShouldRegisteredAssetsAfterCreateNewInstanceOfAssetsProviderClass(): void {

		self::$provider->boot();

		do_action( 'enqueue_block_editor_assets' );

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
