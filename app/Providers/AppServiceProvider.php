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
use Publisher\Framework\Illuminate\{
	Foundation\Application,
	Support\ServiceProvider,
	StyleEngine\StyleEngine,
	Support\Adapters\DomParser,
	Foundation\ValueAddon\Variable\VariableType,
};
use Publisher\Framework\Illuminate\Foundation\ValueAddon\ValueAddonRegistry;
use Publisher\Framework\Illuminate\Foundation\ValueAddon\DynamicValue\DynamicValueType;
use Publisher\Framework\Services\Render\{
	Render,
	Parser,
};

class AppServiceProvider extends ServiceProvider {

	/**
	 * @throws BaseException
	 */
	public function register(): void {

		parent::register();

		try {

			$this->app->singleton( VariableType::class, static function ( Application $app ): VariableType {

				return new VariableType( $app );
			} );

			$this->app->singleton( DynamicValueType::class, static function ( Application $app ): DynamicValueType {

				return new DynamicValueType( $app );
			} );

			$this->app->singleton( ValueAddonRegistry::class, static function ( Application $app, array $params = [] ): ValueAddonRegistry {

				return new ValueAddonRegistry( $app, ...$params );
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

		$this->app->make( StyleEngine::class );

		foreach ( pb_core_config( 'app.blocks' ) as $block ) {

			if ( empty( $block ) ) {

				continue;
			}

			$this->app->make( Render::class, [ 'blockName' => $block ] );
		}
	}

}
