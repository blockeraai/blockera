<?php

namespace Blockera\Framework\Providers;

use Blockera\Framework\Services\Block\Blocks\Icon;
use Blockera\Framework\Illuminate\StyleEngine\StyleDefinitions\{
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
use Blockera\Framework\Illuminate\Foundation\Application;
use Blockera\Framework\Illuminate\Support\ServiceProvider;

/**
 * The StyleProviders class.
 *
 * @package Blockera\Framework\Providers\StyleProviders
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

		$this->app->singleton( Size::class );
		$this->app->singleton( Mouse::class );
		$this->app->singleton( Layout::class );
		$this->app->singleton( Border::class );
		$this->app->singleton( Effects::class );
		$this->app->singleton( Divider::class );
		$this->app->singleton( Outline::class );
		$this->app->singleton( Spacing::class );
		$this->app->singleton( Position::class );
		$this->app->singleton( BoxShadow::class );
		$this->app->singleton( TextShadow::class );
		$this->app->singleton( Background::class );
		$this->app->singleton( Typography::class );
	}

}
