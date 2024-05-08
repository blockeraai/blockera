<?php

namespace Blockera\Setup\Providers;

use Blockera\Setup\Blockera;
use Blockera\Bootstrap\Application;
use Blockera\WordPress\AssetsLoader;
use Blockera\Bootstrap\ServiceProvider;
use Illuminate\Contracts\Container\BindingResolutionException;

/**
 * Class AssetsProvider providing all assets.
 *
 * @since 1.0.0
 */
class AssetsProvider extends ServiceProvider {

	/**
	 * Hold handler name.
	 *
	 * @var string $handler the handler name.
	 */
	protected string $handler = '@blockera/editor-extensions';

	/**
	 * Register any application services.
	 *
	 * @return void
	 */
	public function register(): void {

		$this->app->bind(
			AssetsLoader::class,
			function ( Application $app ) {

				return new AssetsLoader(
					$app,
					blockera_core_config( 'assets.list' ),
					[
						'root'          => [
							'url'  => blockera_core_config( 'app.root_url' ),
							'path' => blockera_core_config( 'app.root_path' ),
						],
						'debug-mode'    => blockera_core_config( 'app.debug' ),
						'packages-deps' => blockera_core_config( 'assets.with-deps' ),
					]
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

		$this->app->make( AssetsLoader::class );

		add_filter( 'blockera/wordpress/assets-loader/inline-script', [ $this, 'createInlineScript' ] );
		add_filter( 'blockera/wordpress/assets-loader/handle/inline-script', [ $this, 'getHandler' ] );
	}

	/**
	 * Create inline script.
	 *
	 * @param string $inline_script the previous inline script.
	 *
	 * @hooked 'blockera/wordpress/assets-loader/inline-script'
	 *
	 * @return string the inline script for initialize blockera some package's configuration.
	 */
	public function createInlineScript( string $inline_script ): string {

		if ( ! $this->app instanceof Blockera ) {

			return $inline_script;
		}

		return sprintf(
			'%s%s',
			$inline_script . PHP_EOL,
			'window.onload = () => {
				blockera.coreData.unstableBootstrapServerSideEntities(' . wp_json_encode( $this->app->getEntities() ) . ');
				blockera.editor.unstableBootstrapServerSideBreakpointDefinitions(' . wp_json_encode( $this->app->getEntity( 'breakpoints' ) ) . ');
				blockera.coreData.unstableBootstrapServerSideVariableDefinitions(' . wp_json_encode( $this->app->getRegisteredValueAddons( 'variable', false ) ) . ');
			};'
		);
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
