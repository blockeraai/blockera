<?php

namespace Blockera\Admin\Providers;

use Blockera\Bootstrap\AssetsProvider;
use Illuminate\Contracts\Container\BindingResolutionException;

/**
 * Class AdminAssetsProvider providing all assets for admin.
 *
 * @package Blockera\Admin\Providers\AdminAssetsProvider
 */
class AdminAssetsProvider extends AssetsProvider {

	/**
	 * Store loader identifier.
	 *
	 * @var string $id the loader identifier.
	 */
	public function getId(): string {

		return 'blockera-admin-assets-loader';
	}

	/**
	 * Hold handler name.
	 *
	 * @var string $handler the handler name.
	 */
	public function getHandler(): string {

		return '@blockera/blockera-admin';
	}

	/**
	 * Bootstrap any application services.
	 *
	 * @throws BindingResolutionException Binding resolution exception error handle.
	 * @return void
	 */
	public function boot(): void {

		$assets = $this->getAssets();

		// phpcs:ignore
		if ( ! empty( $_REQUEST['page'] ) && false !== strpos( $_REQUEST['page'], 'blockera-settings' ) ) {

			add_filter( 'blockera/wordpress/' . $this->getId() . '/inline-script', [ $this, 'createInlineScript' ] );
			add_filter( 'blockera/wordpress/' . $this->getId() . '/handle/inline-script', [ $this, 'getHandler' ] );

		} else {

			add_filter( 'blockera/wordpress/' . $this->getId() . '/inline-script', [ $this, 'telemetryInlineScripts' ] );

			add_filter(
				'blockera/wordpress/' . $this->getId() . '/handle/inline-script',
				function (): string {

					return '@blockera/telemetry';
				}
			);

			unset( $assets[ array_search( 'blockera-admin', $assets, true ) ] );
		}

		$this->app->make(
			$this->getId(),
			[
				'assets'     => $assets,
				'extra-args' => [
					'fallback'             => [
						'url'  => $this->getURL(),
						'path' => $this->getPATH(),
					],
					'enqueue-admin-assets' => true,
					'id'                   => $this->getId(),
					'packages-deps'        => blockera_core_config( 'assets.admin.with-deps' ),
				],
			]
		);
	}

	protected function getAssets(): array {

		return blockera_core_config( 'assets.admin.list' );
	}

	/**
	 * Create inline script for blockera settings handler.
	 *
	 * @param string $inline_script the previous inline script.
	 *
	 * @hooked 'blockera/wordpress/{$this->getId(}/inline-script'
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

		return $this->telemetryInlineScripts() . 'window.unstableBlockeraBootstrapServerSideEntities = ' . wp_json_encode( $this->app->getEntities() ) . ';
				wp.blocks.setCategories( ' . wp_json_encode( $block_categories ) . ' );
				window.unstableBootstrapServerSideBlockTypes = ' . wp_json_encode( blockera_get_available_blocks() ) . ';
				window.blockeraDefaultSettings = ' . wp_json_encode( blockera_core_config( 'panel.std' ) ) . ';
				window.blockeraSettings = ' . wp_json_encode( blockera_get_admin_options() ) . ';
				window.blockeraVersion = "' . blockera_core_config( 'app.version' ) . '";
				window.blockeraUserRoles = ' . wp_json_encode( blockera_normalized_user_roles() ) . '
		';
	}

	/**
	 * @return string the telemetry inline scripts as a string.
	 */
	public function telemetryInlineScripts(): string {

		return 'window.blockeraTermsOfServicesLink = "' . blockera_core_config( 'telemetry.terms_of_services_link' ) . '";
				window.blockeraTelemetryIsOff = "' . ! blockera_telemetry_is_off() . '";
				window.blockeraOptInStatus = "' . get_option( blockera_core_config( 'telemetry.options.opt_in_status' ), null ) . '";
				window.blockeraPrivacyAndPolicyLink = "' . blockera_core_config( 'telemetry.privacy_and_policy_link' ) . '";
				window.blockeraOptInDescription = "' . blockera_core_config( 'telemetry.opt_in_description' ) . '";';
	}

}
