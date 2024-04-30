<?php

namespace Blockera\Framework\Providers;

use Blockera\Framework\Illuminate\{
	EntityRegistry,
	Foundation\Application,
	Foundation\ContainerInterface,
	Support\ServiceProvider,
	StyleEngine\StyleEngine,
	Support\Adapters\DomParser,
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
	Foundation\ValueAddon\Variable\VariableType
};
use Blockera\Framework\Exceptions\BaseException;
use Illuminate\Contracts\Container\BindingResolutionException;
use Blockera\Framework\Illuminate\Foundation\ValueAddon\ValueAddonRegistry;
use Blockera\Framework\Illuminate\Foundation\ValueAddon\DynamicValue\DynamicValueType;
use Blockera\Framework\Services\Block\{Render, Parser, SavePost, Setup};

/**
 * Class AppServiceProvider for providing all application services.
 */
class AppServiceProvider extends ServiceProvider {

	/**
	 * Registering services classes.
	 *
	 * @throws BaseException Exception for any occurred errors.
	 *
	 * @return void
	 */
	public function register(): void {

		parent::register();

		try {

			$this->app->singleton( Setup::class );

			$this->app->singleton(
				SavePost::class,
				function ( Application $app ) {

					return new SavePost( $app, new Render( $app ) );
				}
			);

			$this->app->singleton(
				VariableType::class,
				static function ( Application $app ): VariableType {

					return new VariableType( $app );
				}
			);

			$this->app->singleton(
				DynamicValueType::class,
				static function ( Application $app ): DynamicValueType {

					return new DynamicValueType( $app );
				}
			);

			$this->app->singleton(
				ValueAddonRegistry::class,
				static function ( Application $app, array $params = [] ): ValueAddonRegistry {

					return new ValueAddonRegistry( $app, ...$params );
				}
			);

			$this->app->singleton(
				EntityRegistry::class,
				static function ( Application $app ) {

					return new EntityRegistry( $app );
				}
			);

			$this->app->bind(
				StyleEngine::class,
				static function ( Application $app, array $params ) {

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
				}
			);

			$this->app->singleton(
				DomParser::class,
				static function () {

					return new DomParser();
				}
			);

			$this->app->singleton(
				Parser::class,
				static function ( Application $app ) {

					return new Parser( $app );
				}
			);

			$this->app->bind(
				Render::class,
				static function ( Application $app ): Render {

					return new Render( $app );
				}
			);

		} catch ( BaseException $handler ) {

			throw new BaseException( 'Binding ' . StyleEngine::class . " Failure! \n" . $handler->getMessage() );
		}
	}

	/**
	 * Bootstrap services.
	 *
	 * @throws BindingResolutionException Exception for missed bounded services.
	 * @return void
	 */
	public function boot(): void {

		parent::boot();

		add_action( 'init', [ $this, 'blockera_load_textdomain' ] );

		$dynamicValueRegistry = $this->app->make( ValueAddonRegistry::class, [ DynamicValueType::class ] );
		$variableRegistry     = $this->app->make( ValueAddonRegistry::class, [ VariableType::class ] );

		if ( $this->app instanceof ContainerInterface ) {

			$this->app->setRegisteredValueAddons(
				[
					'variable'      => $variableRegistry->getRegistered(),
					'dynamic-value' => $dynamicValueRegistry->getRegistered(),
				]
			);
		}

		$this->app->make( Setup::class );
		$this->app->make( SavePost::class );
		$this->app->make( EntityRegistry::class );

		foreach ( blockera_core_config( 'app.blocks' ) as $block ) {

			if ( empty( $block ) ) {

				continue;
			}

			$render = $this->app->make( Render::class );

			$render->setName( $block );
			$render->applyHooks();
		}
	}

	/**
	 * Loading text domain.
	 *
	 * @hooked `init`
	 *
	 * @return void
	 */
	public function blockera_load_textdomain(): void {

		load_plugin_textdomain( 'blockera', false, dirname( plugin_basename( BLOCKERA_CORE_FILE ) ) . '/languages' );
	}

}
