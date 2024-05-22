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
	 * Store loader identifier.
	 *
	 * @var string $id the loader identifier.
	 */
	protected string $id = 'blockera-assets-loader';

	/**
	 * Hold handler name.
	 *
	 * @var string $handler the handler name.
	 */
	protected string $handler = '@blockera/blockera';

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

		add_filter( 'blockera/wordpress/' . $this->id . '/inline-script', [ $this, 'createInlineScript' ] );
		add_filter( 'blockera/wordpress/' . $this->id . '/handle/inline-script', [ $this, 'getHandler' ] );

		$this->app->make(
			$this->id,
			[
				'assets'     => blockera_core_config( 'assets.editor.list' ),
				'extra-args' => [
					'enqueue-block-assets' => true,
					'packages-deps'        => blockera_core_config( 'assets.editor.with-deps' ),
				],
			]
		);

		add_action( 'admin_enqueue_scripts', [ $this, 'l10n' ] );
	}

	/**
	 * Create inline script for blockera editor handler.
	 *
	 * @param string $inline_script the previous inline script.
	 *
	 * @hooked 'blockera/wordpress/{$this->id}/inline-script'
	 *
	 * @return string the inline script for initialize blockera some package's configuration.
	 */
	public function createInlineScript( string $inline_script ): string {

		if ( ! $this->app instanceof Blockera ) {

			return $inline_script;
		}

		$script = 'window.onload = () => {
				blockera.coreData.unstableBootstrapServerSideEntities(' . wp_json_encode( $this->app->getEntities() ) . ');
				blockera.editor.unstableBootstrapServerSideBreakpointDefinitions(' . wp_json_encode( $this->app->getEntity( 'breakpoints' ) ) . ');
				blockera.coreData.unstableBootstrapServerSideVariableDefinitions(' . wp_json_encode( $this->app->getRegisteredValueAddons( 'variable', false ) ) . ');
			};';

		if ( false !== strpos( $inline_script, $script ) ) {

			return $inline_script;
		}

		return sprintf( '%s%s', $inline_script . PHP_EOL, $script );
	}

	/**
	 * Retrieve handler name.
	 *
	 * @return string
	 */
	public function getHandler(): string {

		return $this->handler;
	}

	public function l10n(): void {

		wp_add_inline_script(
			'wp-blocks',
			'var blockeraSettings = ' . wp_json_encode( blockera_get_admin_options() ) . ';
				if(window?.wp){
					wp.hooks.addFilter(
						"blockera.editor.extensions.hooks.withBlockSettings.disabledBlocks",
						"blockera.unstableBootstrapServerSideUnsupportedBlocks",
						() => {
							return blockeraSettings?.disabledBlocks || [];
						}
					); 
				}'
		);
	}

}
