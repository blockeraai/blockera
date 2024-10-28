<?php

namespace Blockera\Setup\Providers;

use Blockera\Setup\Blockera;
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

		$this->initializeFreemius();

		add_action( 'after_setup_theme', [ $this, 'after_setup_theme' ] );
	}

	/**
	 * The after_setup_theme action hook
	 */
	public function after_setup_theme(): void {

		add_action( 'init', [ $this, 'loadTextDomain' ] );

	}

	/**
	 * Initialize Freemius
	 */
	public function initializeFreemius(): void {

		global $blockera_fs;

		if ( ! isset( $blockera_fs ) ) {

			// Include Freemius SDK.
			require_once blockera_core_config( 'app.vendor_path' ) . 'blockera/freemius-sdk/php/start.php';

			$blockera_fs = fs_dynamic_init(
				array(
					'id'             => '16292',
					'slug'           => 'blockera',
					'type'           => 'plugin',
					'public_key'     => 'pk_206b63a4865444875ff845aa3e8e9',
					'is_premium'     => false,
					'has_addons'     => false,
					'has_paid_plans' => false,
					'menu'           => array(
						'slug'    => 'blockera-settings-dashboard',
						'account' => false,
						'contact' => false,
						'support' => false,
					),
				)
			);
		}
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
