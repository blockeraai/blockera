<?php

namespace Blockera\Admin\Providers;

use Blockera\Bootstrap\Application;
use Blockera\WordPress\AssetsLoader;
use Blockera\Bootstrap\ServiceProvider;
use Illuminate\Contracts\Container\BindingResolutionException;

/**
 * Class AdminAssetsProvider providing all assets for admin.
 *
 * @package Blockera\Admin\Providers\AdminAssetsProvider
 */
class AdminAssetsProvider extends ServiceProvider {

	/**
	 * Store loader identifier.
	 *
	 * @var string $id the loader identifier.
	 */
	protected string $id = 'blockera-admin-assets-loader';

	/**
	 * Hold handler name.
	 *
	 * @var string $handler the handler name.
	 */
	protected string $handler = '@blockera/blockera-admin';

	/**
	 * Register any application services.
	 *
	 * @return void
	 */
	public function register(): void {

		$this->app->bind(
			$this->id,
			function ( Application $app, array $args = [] ) {

				return new AssetsLoader(
					$app,
					$args['assets'],
					array_merge(
						[
							'id'         => $this->id,
							'root'       => [
								'url'  => blockera_core_config( 'app.root_url' ),
								'path' => blockera_core_config( 'app.root_path' ),
							],
							'debug-mode' => blockera_core_config( 'app.debug' ),
						],
						$args['extra-args']
					)
				);
			}
		);
	}

	/**
	 * Bootstrap any application services.
	 *
	 * @throws BindingResolutionException Binding resolution exception error handle.
	 * @return void
	 */
	public function boot(): void {

		if ( ! empty( $_REQUEST['page'] ) && false !== strpos( $_REQUEST['page'], 'blockera-settings' ) ) {

			add_filter( 'blockera/wordpress/' . $this->id . '/inline-script', [ $this, 'createInlineScript' ] );
			add_filter( 'blockera/wordpress/' . $this->id . '/handle/inline-script', [ $this, 'getHandler' ] );

			$this->app->make(
				$this->id,
				[
					'assets'     => blockera_core_config( 'assets.admin.list' ),
					'extra-args' => [
						'enqueue-admin-assets' => true,
						'id'                   => 'blockera-admin-assets-loader',
						'packages-deps'        => blockera_core_config( 'assets.admin.with-deps' ),
					],
				]
			);
		}
	}

	/**
	 * Create inline script for blockera settings handler.
	 *
	 * @param string $inline_script the previous inline script.
	 *
	 * @hooked 'blockera/wordpress/{$this->id}/inline-script'
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

		return 'window.unstableBlockeraBootstrapServerSideEntities = ' . wp_json_encode( $this->app->getEntities() ) . ';
				wp.blocks.setCategories( ' . wp_json_encode( $block_categories ) . ' );
				window.unstableBootstrapServerSideBlockTypes = ' . wp_json_encode( blockera_get_available_blocks() ) . ';
				window.blockeraDefaultSettings = ' . wp_json_encode( blockera_core_config( 'panel.std' ) ) . ';
				window.blockeraSettings = ' . wp_json_encode( blockera_get_admin_options() ) . ';
				window.blockeraVersion = "' . blockera_core_config( 'app.version' ) . '";
				window.blockeraUserRoles = ' . wp_json_encode( blockera_normalized_user_roles() ) . '
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
