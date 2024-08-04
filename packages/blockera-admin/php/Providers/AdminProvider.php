<?php

namespace Blockera\Admin\Providers;

use Blockera\Bootstrap\Application;
use Blockera\Bootstrap\ServiceProvider;
use Blockera\WordPress\Admin\Menu\Factory;
use Illuminate\Contracts\Container\BindingResolutionException;

/**
 * Class AdminProvider to providing services for WordPress admin pages.
 *
 * @package Blockera\Admin\Providers\AdminProvider
 */
class AdminProvider extends ServiceProvider {

	/**
	 * Registration admin services.
	 *
	 * @return void
	 */
	public function register(): void {

		$this->app->singleton(
			Factory::class,
			static function ( Application $app, array $args = [] ) {

				return new Factory( $args );
			}
		);
	}

	/**
	 * Bootstrapping admin services.
	 *
	 * @throws BindingResolutionException Exception for not bounded services.
	 * @return void
	 */
	public function boot(): void {

		add_action( 'admin_menu', [ $this->app->make( Factory::class, blockera_core_config( 'menu' ) ), 'add' ] );
	}

}
