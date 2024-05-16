<?php

namespace Blockera\Admin\Providers;

use Blockera\WordPress\AssetsLoader;
use Blockera\Setup\Providers\AssetsProvider;
use Illuminate\Contracts\Container\BindingResolutionException;

/**
 * Class AdminAssetsProvider providing all assets for admin.
 *
 * @package Blockera\Admin\Providers\AdminAssetsProvider
 */
class AdminAssetsProvider extends AssetsProvider {

	/**
	 * Hold handler name.
	 *
	 * @var string $handler the handler name.
	 */
	protected string $handler = '@blockera/blockera-admin';

	/**
	 * Bootstrap any application services.
	 *
	 * @throws BindingResolutionException Binding resolution exception error handle.
	 * @return void
	 */
	public function boot(): void {

		if ( ! empty( $_REQUEST['page'] ) && false !== strpos( $_REQUEST['page'], 'blockera-settings' ) ) {

			$this->app->make(
				AssetsLoader::class,
				[
					'assets'        => blockera_core_config( 'assets.admin.list' ),
					'extra-args'    => [
						'enqueue-admin-assets' => true,
					],
					'packages-deps' => blockera_core_config( 'assets.admin.with-deps' ),
				]
			);

			add_filter( 'blockera/wordpress/assets-loader/inline-script', [ $this, 'createInlineScript' ] );
			add_filter( 'blockera/wordpress/assets-loader/handle/inline-script', [ $this, 'getHandler' ] );
		}
	}

	/**
	 * Create inline script for blockera settings handler.
	 *
	 * @param string $inline_script the previous inline script.
	 *
	 * @hooked 'blockera/wordpress/assets-loader/inline-script'
	 *
	 * @return string the inline script for initialize blockera some package's configuration.
	 */
	public function createInlineScript( string $inline_script ): string {

		$block_categories = [];

		if ( function_exists( 'gutenberg_get_block_categories' ) ) {

			$block_categories = gutenberg_get_block_categories( get_post() );

		} elseif ( function_exists( 'get_block_categories' ) ) {

			$block_categories = get_block_categories( get_post() );
		}

		return 'wp.blocks.setCategories( ' . wp_json_encode( $block_categories ) . ' );
				window.unstableBootstrapServerSideBlockTypes = ' . wp_json_encode( blockera_get_available_blocks() ) . ';
				window.blockeraDefaultSettings = ' . wp_json_encode( blockera_core_config( 'panel.std' ) ) . ';
				window.blockeraSettings = ' . wp_json_encode( get_option( 'blockera_settings', blockera_core_config( 'panel.std' ) ) ) . ';
				window.blockeraVersion = "' . blockera_core_config( 'app.version' ) . '";
		';
	}

	/**
	 * Retrieve handler name.
	 *
	 * @return string
	 */
	public function getHandler(): string {

		return $this->handler;
	}

}
