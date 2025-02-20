<?php

namespace Blockera\Editor\Providers;

use Blockera\Bootstrap\Application;
use Blockera\WordPress\RenderBlock\HTML\Icon;
use Blockera\Editor\StyleDefinitions\{
	Size,
	Mouse,
	Border,
	Layout,
	Effects,
	Outline,
	Divider,
	Spacing,
	Position,
	BoxShadow,
	Background,
	TextShadow,
	Typography
};
use Blockera\Bootstrap\ServiceProvider;

/**
 * The StyleProviders class.
 *
 * @package Blockera\Editor\StyleEngine\Providers\StyleProviders
 */
class StyleProviders extends ServiceProvider {

	/**
	 * Registration Styles with Definitions.
	 *
	 * @return void
	 */
	public function register(): void {

		$this->app->singleton(
			Icon::class,
			static function ( Application $app ) {

				return new Icon( $app );
			}
		);

		$this->app->singleton(
            Size::class,
            function ( Application $app, array $args ) {

				return new Size( $args['supports'] );
			} 
        );
		$this->app->singleton(
            Mouse::class,
            function ( Application $app, array $args ) {

				return new Mouse( $args['supports'] );
			} 
        );
		$this->app->singleton(
            Layout::class,
            function ( Application $app, array $args ) {

				return new Layout( $args['supports'] );
			} 
        );
		$this->app->singleton(
            Border::class,
            function ( Application $app, array $args ) {

				return new Border( $args['supports'] );
			} 
        );
		$this->app->singleton(
            Effects::class,
            function ( Application $app, array $args ) {

				return new Effects( $args['supports'] );
			} 
        );

		if ( blockera_get_experimental( [ 'editor.extensions.effectsExtension.divider' ] ) ) {
			$this->app->singleton(
                Divider::class,
                function ( Application $app, array $args ) {

					return new Divider( $args['supports'] );
				} 
            );
		}

		$this->app->singleton(
            Outline::class,
            function ( Application $app, array $args ) {

				return new Outline( $args['supports'] );
			} 
        );
		$this->app->singleton(
            Spacing::class,
            function ( Application $app, array $args ) {

				return new Spacing( $args['supports'] );
			} 
        );
		$this->app->singleton(
            Position::class,
            function ( Application $app, array $args ) {

				return new Position( $args['supports'] );
			} 
        );
		$this->app->singleton(
            BoxShadow::class,
            function ( Application $app, array $args ) {

				return new BoxShadow( $args['supports'] );
			} 
        );
		$this->app->singleton(
            TextShadow::class,
            function ( Application $app, array $args ) {

				return new TextShadow( $args['supports'] );
			} 
        );
		$this->app->singleton(
            Background::class,
            function ( Application $app, array $args ) {

				return new Background( $args['supports'] );
			} 
        );
		$this->app->singleton(
            Typography::class,
            function ( Application $app, array $args ) {

				return new Typography( $args['supports'] );
			} 
        );
	}

}
