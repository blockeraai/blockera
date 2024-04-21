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
use Publisher\Framework\Illuminate\{EntityRegistry,
	Foundation\Application,
	StyleEngine\StyleDefinitions\Size,
	StyleEngine\StyleDefinitions\Mouse,
	StyleEngine\StyleDefinitions\Layout,
	StyleEngine\StyleDefinitions\Border,
	StyleEngine\StyleDefinitions\Effects,
	StyleEngine\StyleDefinitions\Outline,
	StyleEngine\StyleDefinitions\Spacing,
	StyleEngine\StyleDefinitions\Position,
	StyleEngine\StyleDefinitions\BoxShadow,
	StyleEngine\StyleDefinitions\TextShadow,
	StyleEngine\StyleDefinitions\Background,
	StyleEngine\StyleDefinitions\Typography,
	Support\ServiceProvider,
	StyleEngine\StyleEngine,
	Support\Adapters\DomParser,
	Foundation\ValueAddon\Variable\VariableType
};
use Publisher\Framework\Illuminate\Foundation\ValueAddon\ValueAddonRegistry;
use Publisher\Framework\Illuminate\Foundation\ValueAddon\DynamicValue\DynamicValueType;
use Publisher\Framework\Services\Block\{Render, Parser, SavePost, Setup};

class AppServiceProvider extends ServiceProvider {

	/**
	 * @throws BaseException
	 */
	public function register(): void {

		parent::register();

		try {

			$this->app->singleton( Setup::class );

			$this->app->singleton( SavePost::class, function ( Application $app ) {

				return new SavePost( $app, new Render( $app ) );
			} );

			$this->app->singleton( VariableType::class, static function ( Application $app ): VariableType {

				return new VariableType( $app );
			} );

			$this->app->singleton( DynamicValueType::class, static function ( Application $app ): DynamicValueType {

				return new DynamicValueType( $app );
			} );

			$this->app->singleton( ValueAddonRegistry::class, static function ( Application $app, array $params = [] ): ValueAddonRegistry {

				return new ValueAddonRegistry( $app, ...$params );
			} );

			$this->app->singleton( EntityRegistry::class, static function ( Application $app ) {

				return new EntityRegistry( $app );
			} );

			$this->app->bind( StyleEngine::class, static function ( Application $app, array $params ) {

				$styleDefinitions = [
					$app->make( Size::class ),
					$app->make( Mouse::class ),
					$app->make( Layout::class ),
					$app->make( Border::class ),
					$app->make( Effects::class ),
					$app->make( Outline::class ),
					$app->make( Spacing::class ),
					$app->make( Position::class ),
					$app->make( BoxShadow::class ),
					$app->make( TextShadow::class ),
					$app->make( Background::class ),
					$app->make( Typography::class ),
				];

				$params = array_merge( $params, compact( 'styleDefinitions' ) );

				return new StyleEngine( ...$params );
			} );

			$this->app->singleton( DomParser::class, static function () {

				return new DomParser();
			} );

			$this->app->singleton( Parser::class, static function ( Application $app ) {

				return new Parser( $app );
			} );

			$this->app->bind( Render::class, static function ( Application $app ): Render {

				return new Render( $app );
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

		/**
		 * @var ValueAddonRegistry $dynamicValueRegistry
		 */
		$dynamicValueRegistry = $this->app->make( ValueAddonRegistry::class, [ DynamicValueType::class ] );

		/**
		 * @var ValueAddonRegistry $dynamicValueRegistry
		 */
		$variableRegistry = $this->app->make( ValueAddonRegistry::class, [ VariableType::class ] );

		$this->app->setRegisteredValueAddons( [
			'variable'      => $variableRegistry->getRegistered(),
			'dynamic-value' => $dynamicValueRegistry->getRegistered(),
		] );

		$this->app->make( Setup::class );
		$this->app->make( SavePost::class );
		$this->app->make( EntityRegistry::class );

		foreach ( pb_core_config( 'app.blocks' ) as $block ) {

			if ( empty( $block ) ) {

				continue;
			}

			$render = $this->app->make( Render::class );

			$render->setName( $block );
			$render->applyHooks();
		}
	}

}
