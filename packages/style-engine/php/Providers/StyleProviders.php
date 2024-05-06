<?php

namespace Blockera\StyleEngine\Providers;

use Blockera\StyleEngine\StyleDefinitions\{
	Size,
	Mouse,
	Border,
	Layout,
	Effects,
	Outline,
	Spacing,
	Position,
	BoxShadow,
	Background,
	TextShadow,
	Typography
};
use Blockera\Bootstrap\Application;
use Blockera\Bootstrap\ServiceProvider;

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

		$this->app->singleton( Size::class );
		$this->app->singleton( Mouse::class );
		$this->app->singleton( Layout::class );
		$this->app->singleton( Border::class );
		$this->app->singleton( Effects::class );
		$this->app->singleton( Outline::class );
		$this->app->singleton( Spacing::class );
		$this->app->singleton( Position::class );
		$this->app->singleton( BoxShadow::class );
		$this->app->singleton( TextShadow::class );
		$this->app->singleton( Background::class );
		$this->app->singleton( Typography::class );
	}

}
