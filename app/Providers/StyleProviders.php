<?php

namespace Publisher\Framework\Providers;

use Publisher\Framework\Services\Render\Blocks\Icon;
use Publisher\Framework\Services\Render\Styles\{
	SizeStyle,
	MouseStyle,
	BorderStyle,
	LayoutStyle,
	EffectsStyle,
	OutlineStyle,
	SpacingStyle,
	PositionStyle,
	BoxShadowStyle,
	BackgroundStyle,
	TextShadowStyle,
	TypographyStyle
};
use Publisher\Framework\Illuminate\StyleEngine\StyleDefinitions\{
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
use Publisher\Framework\Illuminate\Foundation\Application;
use Publisher\Framework\Illuminate\Support\ServiceProvider;

/**
 * The StyleProviders class.
 *
 * @package Publisher\Framework\Providers\StyleProviders
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
			EffectsStyle::class,
			static function () {

				return new EffectsStyle( new Effects() );
			}
		);

		$this->app->singleton(
			LayoutStyle::class,
			static function () {

				return new LayoutStyle( new Layout() );
			}
		);

		$this->app->singleton(
			PositionStyle::class,
			static function () {

				return new PositionStyle( new Position() );
			}
		);

		$this->app->singleton(
			BorderStyle::class,
			static function () {

				return new BorderStyle( new Border() );
			}
		);

		$this->app->singleton(
			SizeStyle::class,
			static function () {

				return new SizeStyle( new Size() );
			}
		);

		$this->app->singleton(
			SpacingStyle::class,
			static function () {

				return new SpacingStyle( new Spacing() );
			}
		);

		$this->app->singleton(
			TextShadowStyle::class,
			static function () {

				return new TextShadowStyle( new TextShadow() );
			}
		);

		$this->app->singleton(
			BackgroundStyle::class,
			static function () {

				return new BackgroundStyle( new Background() );
			}
		);

		$this->app->singleton(
			TypographyStyle::class,
			static function () {

				return new TypographyStyle( new Typography() );
			}
		);

		$this->app->singleton(
			BoxShadowStyle::class,
			static function () {

				return new BoxShadowStyle( new BoxShadow() );
			}
		);

		$this->app->singleton(
			OutlineStyle::class,
			static function () {

				return new OutlineStyle( new Outline() );
			}
		);

		$this->app->singleton(
			MouseStyle::class,
			static function () {

				return new MouseStyle( new Mouse() );
			}
		);
	}

}
