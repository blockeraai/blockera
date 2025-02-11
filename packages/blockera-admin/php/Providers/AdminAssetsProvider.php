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
		
		global $pagenow;

		$assets = $this->getAssets();

		// phpcs:ignore
		if ( ! empty( $_GET['page'] ) && false !== strpos( $_GET['page'], 'blockera-settings' ) ) {

			add_filter( 'blockera/wordpress/' . $this->getId() . '/inline-script/after', [ $this, 'createInlineScript' ] );
			add_filter( 'blockera/wordpress/' . $this->getId() . '/handle/inline-script', [ $this, 'getHandler' ] );

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

		} elseif ( ! in_array($pagenow, [ 'post.php', 'post-new.php', 'site-editor.php' ], true) ) {

			add_filter( 'blockera/wordpress/' . $this->getId() . '/inline-script/after', [ $this, 'telemetryInlineScripts' ] );

			add_filter(
				'blockera/wordpress/' . $this->getId() . '/handle/inline-script',
				function (): string {

					return '@blockera/telemetry';
				}
			);

			unset( $assets[ array_search( 'blockera-admin', $assets, true ) ] );

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

		add_action(
            'admin_head',
            function(){
				echo '<style>
				.wp-not-current-submenu li.blockera-pro-submenu {
					margin-top: 8px !important;
					padding: 3px 8px 3px 3px !important;
				}
				.wp-has-current-submenu li.blockera-pro-submenu {
					margin-top: 8px !important;
					padding: 3px 8px !important;
				}
				a.blockera-pro-submenu {
					background-color: #0048eb !important;
					border-radius: 4px !important;
					color: #fff !important;
					padding: 3px 10px !important;
					line-height: 1.9 !important;
					font-size: 12px !important;
					text-align: center !important;
				}
				a.blockera-pro-submenu:hover {
					background-color: #003bc1 !important;
					box-shadow: none !important;
				}
			</style>';
			}
        );

		add_action(
            'admin_enqueue_scripts',
            function(){
				$js = "
					jQuery(document).ready(function($) {
						$('li.blockera-pro-submenu a.blockera-pro-submenu[href^=\"https://blockera.ai/products/site-builder/upgrade/\"]').attr('target', '_blank');
					});
				";

				wp_add_inline_script( 'jquery', $js );
			}
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

		array_map('blockera_load_script_translations', blockera_core_config('assets.admin.list'));

		return $this->telemetryInlineScripts() . 'window.unstableBlockeraBootstrapServerSideEntities = ' . wp_json_encode( $this->app->getEntities() ) . ';
				wp.blocks.setCategories( ' . wp_json_encode( $block_categories ) . ' );
				window.unstableBootstrapServerSideBlockTypes = ' . wp_json_encode( blockera_get_available_blocks() ) . ';
				window.blockeraDefaultSettings = ' . wp_json_encode( blockera_core_config( 'panel.std' ) ) . ';
				window.blockeraSettings = ' . wp_json_encode( blockera_get_admin_options() ) . ';
				window.blockeraVersion = "' . blockera_core_config( 'app.version' ) . '";
				window.blockeraUserRoles = ' . wp_json_encode( blockera_normalized_user_roles() ) . '
				window.blockeraUpgradeUrl = "' . blockera_core_config( 'app.upgrade_url' ) . '";
		';
	}

	/**
	 * Enqueue telemetry styles and scripts.
	 *
	 * @return void
	 */
	public function enqueueTelemetry(): void {

		$is_dev = blockera_core_config('app.debug');
		$min    = $is_dev ? '' : '.min';

		$telemetry_styles_file = blockera_core_config('app.dist_path') . 'telemetry-styles/style' . $min . '.css';

		if (file_exists($telemetry_styles_file)) {
		
			wp_enqueue_style('@blockera/telemetry', blockera_core_config('app.dist_url') . 'telemetry-styles/style' . $min . '.css', [], filemtime($telemetry_styles_file));
		}

		$telemetry_script_file = blockera_core_config('app.dist_path') . 'telemetry/telemetry' . $min . '.js';

		if (file_exists($telemetry_script_file)) {
			
			wp_enqueue_script('@blockera/telemetry', blockera_core_config('app.dist_url') . 'telemetry/telemetry' . $min . '.js', [], filemtime($telemetry_script_file), true);

			wp_add_inline_script('@blockera/telemetry', $this->telemetryInlineScripts());
		}
	}

	/**
	 * @return string the telemetry inline scripts as a string.
	 */
	public function telemetryInlineScripts(): string {

		$package_file = blockera_core_config('app.vendor_path') . '/blockera/telemetry/package.json';
		$filesystem   = blockera_get_filesystem();
		$version      = str_replace('.', '_', json_decode($filesystem->get_contents($package_file))->version);

		return 'window.blockeraTermsOfServicesLink = "' . blockera_core_config( 'telemetry.terms_of_services_link' ) . '";
				window.blockeraTelemetryIsOff = "' . ! blockera_telemetry_opt_in_is_off( 'blockera' ) . '";
				window.blockeraOptInStatus = "' . get_option( blockera_core_config( 'telemetry.options.opt_in_status' ), null ) . '";
				window.blockeraPrivacyAndPolicyLink = "' . blockera_core_config( 'telemetry.privacy_and_policy_link' ) . '";
				window.blockeraPermissionsLink = "' . blockera_core_config( 'telemetry.permissions_link' ) . '";
				window.blockeraOptInDescription = "' . blockera_core_config( 'telemetry.opt_in_description' ) . '";
				blockeraTelemetry_' . $version . '?.initializeTelemetryOptInSystem();';
	}
}
