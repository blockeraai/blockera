<?php

namespace Blockera\Setup\Providers;

use Blockera\Telemetry\Config;
use Blockera\Setup\Blockera;
use Blockera\WordPress\Sender;
use Blockera\Bootstrap\Application;
use Blockera\WordPress\RenderBlock\{
	Parser,
	Render,
	SavePost,
	Setup,
};
use Blockera\Editor\{
	StyleDefinitions\Background,
	StyleDefinitions\Border,
	StyleDefinitions\BoxShadow,
	StyleDefinitions\Effects,
	StyleDefinitions\Layout,
	StyleDefinitions\Mouse,
	StyleDefinitions\Outline,
	StyleDefinitions\Position,
	StyleDefinitions\Size,
	StyleDefinitions\Spacing,
	StyleDefinitions\TextShadow,
	StyleDefinitions\Typography,
	StyleEngine,
};
use Blockera\Bootstrap\EntityRegistry;
use Blockera\Utils\Adapters\DomParser;
use Blockera\Exceptions\BaseException;
use Blockera\Bootstrap\ServiceProvider;
use Blockera\Data\ValueAddon\ValueAddonRegistry;
use Blockera\Data\ValueAddon\Variable\VariableType;
use Blockera\Data\ValueAddon\DynamicValue\DynamicValueType;
use Illuminate\Contracts\Container\BindingResolutionException;

/**
 * Class AppServiceProvider for providing all application services.
 *
 * @package Blockera\Setup\Providers\AppServiceProvider
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

			if ( blockera_get_experimental( [ 'data', 'dynamicValue' ] ) ) {

				$this->app->singleton(
					DynamicValueType::class,
					static function ( Application $app ): DynamicValueType {

						return new DynamicValueType( $app );
					}
				);
			}

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

					return new StyleEngine( $params['block'], $params['fallbackSelector'], $styleDefinitions );
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

			$this->app->singleton( Sender::class );

		} catch ( BaseException $handler ) {

			throw new BaseException( esc_html( 'Binding ' . StyleEngine::class . " Failure! \n" . $handler->getMessage() ) );
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

		$dynamicValueRegistry = $this->app->make( ValueAddonRegistry::class, [ DynamicValueType::class ] );
		$variableRegistry     = $this->app->make( ValueAddonRegistry::class, [ VariableType::class ] );

		if ( $this->app instanceof Blockera ) {

			$this->app->setRegisteredValueAddons(
				array_merge(
					[
						'variable' => $variableRegistry->getRegistered(),
					],
					blockera_get_experimental( [ 'data', 'dynamicValue' ] ) ? [
						'dynamic-value' => $dynamicValueRegistry->getRegistered(),
					] : [],
				)
			);
		}

		$this->app->make( SavePost::class );
		$this->app->make( Setup::class )->apply();
		$this->app->make( EntityRegistry::class );

		$this->renderBlocks();

		if ( ! blockera_telemetry_opt_in_is_off( 'blockera' ) ) {

			Config::setConsumerConfig( blockera_core_config( 'app' ) );
			Config::setOptionKeys( blockera_core_config( 'telemetry.options' ) );
			Config::setServerURL( blockera_core_config( 'telemetry.server_url' ) );
			Config::setRestParams( blockera_core_config( 'telemetry.rest_params' ) );
			Config::setHookPrefix( blockera_core_config( 'telemetry.hook_prefix' ) );
		}

		add_action( 'after_setup_theme', [ $this, 'after_setup_theme' ] );
	}

	/**
	 * The after_setup_theme action hook
	 */
	public function after_setup_theme(): void {

		add_action( 'init', [ $this, 'loadTextDomain' ] );

	}

	/**
	 * Rendering block type.
	 *
	 * @throws BindingResolutionException Exception for not found bounded module.
	 * @return void
	 */
	protected function renderBlocks(): void {

		$render = $this->app->make( Render::class );

		$render->applyHooks();
	}

	/**
	 * Loading text domain.
	 *
	 * @hooked `init`
	 *
	 * @return void
	 */
	public function loadTextDomain(): void {

		load_plugin_textdomain( 'blockera', false, dirname( plugin_basename( BLOCKERA_CORE_FILE ) ) . '/languages' );
	}

}
