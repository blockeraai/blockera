<?php

namespace Blockera\Setup\Providers;

use Blockera\Setup\Blockera;
use Blockera\WordPress\RenderBlock\Setup;
use Illuminate\Contracts\Container\BindingResolutionException;

/**
 * Class AssetsProvider providing all assets.
 *
 * @since 1.0.0
 */
class EditorAssetsProvider extends \Blockera\Bootstrap\AssetsProvider {

	/**
	 * Store the loader identifier.
	 *
	 * @return string the loader identifier.
	 */
	public function getId(): string {

		return 'blockera-assets-loader';
	}

	/**
	 * Store the handler name.
	 *
	 * @return string the handler name.
	 */
	public function getHandler():string {

		return '@blockera/blockera';
	}

	/**
	 * Bootstrap any application services.
	 *
	 * @throws BindingResolutionException Binding resolution exception error handle.
	 * @return void
	 */
	public function boot(): void {

		add_filter( 'blockera/wordpress/' . $this->getId() . '/inline-script', [ $this, 'createInlineScript' ] );
		add_filter( 'blockera/wordpress/' . $this->getId() . '/handle/inline-script', [ $this, 'getHandler' ] );

		$this->app->make(
			$this->getId(),
			[
				'assets'     => $this->getAssets(),
				'extra-args' => [
					'fallback'             => [
						'url'  => $this->getURL(),
						'path' => $this->getPATH(),
					],
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
	 * @hooked 'blockera/wordpress/{$this->getId()}/inline-script'
	 *
	 * @throws BindingResolutionException BindingResolutionException to handle errors.
	 * @return string the inline script for initialize blockera some package's configuration.
	 */
	public function createInlineScript( string $inline_script ): string {

		if ( ! $this->app instanceof Blockera ) {

			return $inline_script;
		}

		$editor_package_file = blockera_core_config( 'app.root_path' ) . 'vendor/blockera/editor/package.json';

		if ( ! file_exists( $editor_package_file ) ) {

			return $inline_script;
		}

		ob_start();
		require $editor_package_file;
		$editor_package = json_decode( ob_get_clean(), true );
		$editor_version = str_replace( '.', '_', $editor_package['version'] );
		$editor_object  = 'blockeraEditor_' . $editor_version;

		$dynamic_value_bootstrapper = $editor_object . '.coreData.unstableBootstrapServerSideDynamicValueDefinitions(' . wp_json_encode( $this->app->getRegisteredValueAddons( 'dynamic-value', false ) ) . ');';

		/**
		 * Filterable shared block attributes,
		 * For external developers to extending blockera shared block attributes.
		 *
		 * @since 1.0.0
		 */
		$shared_block_attributes = apply_filters( 'blockera/assets/provider/inline-script/shared-block-attributes', blockera_get_shared_block_attributes() );

		$app = $this->app;

		$blocks_attributes_scripts = array_map(
			function ( string $block_type ) use ( $editor_object, $app ): string {

				return sprintf(
					'%$1s.editor.unstableRegistrationBlockTypeAttributes(%2$s, %3$s)',
					$editor_object,
					wp_json_encode( $app->make( Setup::class )->getCustomizedBlock( $block_type, blockera_get_shared_block_attributes() ) ),
					$block_type
				);
			},
			/**
			 * Filterable 3rd party plugin block types list,
			 * For external developers to customized blockera shared block attributes for provided block type names.
			 *
			 * @since 1.0.0
			 */
			apply_filters( 'blockera/assets/provider/inline-script/register/3rd-party-blocks/attributes', [] )
		);

		$script = implode( ";\n", $blocks_attributes_scripts ) . '
				' . $editor_object . '.editor.unstableRegistrationSharedBlockAttributes(' . wp_json_encode( $shared_block_attributes ) . ');
		window.onload = () => {
				' . $editor_object . '.coreData.unstableBootstrapServerSideEntities(' . wp_json_encode( $this->app->getEntities() ) . ');  
				' . $editor_object . '.editor.unstableBootstrapServerSideBreakpointDefinitions(' . wp_json_encode( $this->app->getEntity( 'breakpoints' ) ) . ');
				' . $editor_object . '.coreData.unstableBootstrapServerSideVariableDefinitions(' . wp_json_encode( $this->app->getRegisteredValueAddons( 'variable', false ) ) . ');
				' . $editor_object . '.editor.init();
				' . ( blockera_get_experimental( [ 'data', 'dynamicValue' ] ) ? $dynamic_value_bootstrapper : '' ) . '
			};';

		if ( false !== strpos( $inline_script, $script ) ) {

			return $inline_script;
		}

		return sprintf( '%s%s', $inline_script . PHP_EOL, $script );
	}

	/**
	 * Localization data for exposed after wp-blocks script.
	 *
	 * @return void
	 */
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

	/**
	 * Get all assets of blockera plugin.
	 *
	 * @return array the assets list to load on page.
	 */
	protected function getAssets(): array {

		return blockera_core_config( 'assets.editor.list' );
	}

}
