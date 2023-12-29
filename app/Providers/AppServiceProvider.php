<?php

namespace Publisher\Framework\Providers;

/**
 * External
 */

use Illuminate\Contracts\Container\BindingResolutionException;

/**
 * Internal
 */

use Publisher\Framework\Exceptions\BaseException;
use Publisher\Framework\Illuminate\{Foundation\Application,
	StyleEngine\StyleDefinitions\Border,
	StyleEngine\StyleDefinitions\Layout,
	StyleEngine\StyleDefinitions\Position,
	StyleEngine\StyleDefinitions\Size,
	StyleEngine\StyleDefinitions\Spacing,
	Support\ServiceProvider,
	StyleEngine\StyleEngine,
	Support\Adapters\DomParser,
	StyleEngine\StyleDefinitions\Effects,
	StyleEngine\StyleDefinitions\Outline,
	StyleEngine\StyleDefinitions\BoxShadow,
	StyleEngine\StyleDefinitions\Background,
	StyleEngine\StyleDefinitions\TextShadow,
	StyleEngine\StyleDefinitions\Typography,
	StyleEngine\StyleDefinitions\Mouse
};
use Publisher\Framework\Services\Render\{Render,
	Parser,
	Blocks\Icon,
	Styles\BorderStyle,
	Styles\EffectsStyle,
	Styles\LayoutStyle,
	Styles\OutlineStyle,
	Styles\BoxShadowStyle,
	Styles\BackgroundStyle,
	Styles\PositionStyle,
	Styles\SizeStyle,
	Styles\SpacingStyle,
	Styles\TextShadowStyle,
	Styles\TypographyStyle,
	Styles\MouseStyle
};

class AppServiceProvider extends ServiceProvider {

	/**
	 * @throws BaseException
	 */
	public function register(): void {

		parent::register();

		try {

			$this->app->singleton( Icon::class, static function ( Application $app ) {

				return new Icon( $app );
			} );

			$this->app->singleton( LayoutStyle::class, static function () {

				return new LayoutStyle( new Layout() );
			} );

			$this->app->singleton( PositionStyle::class, static function () {

				return new PositionStyle( new Position() );
			} );

			$this->app->singleton( MouseStyle::class, static function () {

				return new MouseStyle( new Mouse() );
			} );

			$this->app->singleton( BorderStyle::class, static function () {

				return new BorderStyle( new Border() );
			} );

			$this->app->singleton( SizeStyle::class, static function () {

				return new SizeStyle( new Size() );
			} );

			$this->app->singleton( SpacingStyle::class, static function () {

				return new SpacingStyle( new Spacing() );
			} );

			$this->app->singleton( TextShadowStyle::class, static function () {

				return new TextShadowStyle( new TextShadow() );
			} );

			$this->app->singleton( BackgroundStyle::class, static function () {

				return new BackgroundStyle( new Background() );
			} );

			$this->app->singleton( TypographyStyle::class, static function () {

				return new TypographyStyle( new Typography() );
			} );

			$this->app->singleton( BoxShadowStyle::class, static function () {

				return new BoxShadowStyle( new BoxShadow() );
			} );

			$this->app->singleton( OutlineStyle::class, static function () {

				return new OutlineStyle( new Outline() );
			} );

			$this->app->singleton( EffectsStyle::class, static function () {

				return new EffectsStyle( new Effects() );
			} );

			$this->app->bind( StyleEngine::class, static function () {

				return new StyleEngine();
			} );

			$this->app->singleton( DomParser::class, static function () {

				return new DomParser();
			} );

			$this->app->singleton( Parser::class, static function ( Application $app ) {

				return new Parser( $app );
			} );

			$this->app->bind( Render::class, static function ( Application $app, array $params ): Render {

				return new Render( $app, $params['blockName'] );
			} );

		} catch ( BaseException $handler ) {

			throw new BaseException( 'Binding ' . StyleEngine::class . " Failure! \n" . $handler->getMessage() );
		}
	}

	/**
	 * @throws BindingResolutionException
	 */
	public function boot(): void {

		parent::boot();

		$this->app->make( StyleEngine::class );

		foreach ( pb_core_config( 'app.blocks' ) as $block ) {

			if ( empty( $block ) ) {

				continue;
			}

			$this->app->make( Render::class, [ 'blockName' => $block ] );
		}
	}

}
