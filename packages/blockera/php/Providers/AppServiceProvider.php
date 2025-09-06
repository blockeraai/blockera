<?php

namespace Blockera\Setup\Providers;

use Blockera\Telemetry\Config;
use Blockera\Setup\Blockera;
use Blockera\WordPress\Sender;
use Blockera\Data\Cache\Cache;
use Blockera\Data\Cache\Version;
use Blockera\Bootstrap\Application;
use Blockera\WordPress\RenderBlock\V1\{
    Parser,
    Render,
    SavePost,
};
use Blockera\WordPress\RenderBlock\V2\{
    Transpiler,
    RenderContent as V2RenderContent,
    SavePost as V2SavePost,
};
use Blockera\Icons\IconsManager;
use Blockera\Editor\StyleEngine;
use Blockera\Bootstrap\EntityRegistry;
use Blockera\Utils\Adapters\DomParser;
use Blockera\Exceptions\BaseException;
use Blockera\Bootstrap\ServiceProvider;
use Blockera\Block\Icon\Block as IconBlock;
use Blockera\Features\Core\FeaturesManager;
use Blockera\Setup\Compatibility\Compatibility;
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
			$this->app->singleton(
                DomParser::class,
                static function () {

                    return new DomParser();
                }
            );

			$plugin_args = [
				'plugin_base_path' => blockera_core_config('app.vendor_path') . 'blockera/',
				'plugin_base_url' => blockera_core_config('app.vendor_url') . 'blockera/',
				'plugin_version' => blockera_core_config('app.version'),
			];

			$this->app->singleton(
                IconBlock::class,
                function ( Application $app, array $args = []) use ( $plugin_args): IconBlock {

					return new IconBlock($app, array_merge($args, $plugin_args));
				}
            );
			
			$this->app->singleton(
                FeaturesManager::class,
                function ( Application $app) use ( $plugin_args) {
					$app->dom_parser = $app->make(DomParser::class);

					return new FeaturesManager($app, $plugin_args);
				}
            );

			$this->app->singleton(IconsManager::class);

			$this->app->singleton(
                Cache::class,
                function ( Application $app, array $params = []) {
					if (empty($params)) {
						return null;
					}
					return new Cache($app, $params);
				}
            );

			$cache_instance = $this->app->make(Cache::class, [ 'product_id' => 'blockera' ]);

			$this->app->singleton(
                Version::class,
                function ( Application $app, array $params = []) {
					return new Version($app, $params);
				}
            );

            if (blockera_get_admin_options([ 'earlyAccessLab', 'optimizeStyleGeneration' ])) {

				$this->app->singleton(
					V2SavePost::class,
					function ( Application $app) use ( $cache_instance) {

						return new V2SavePost($app, $cache_instance);
					}
				);
			} else {

				$this->app->singleton(
					SavePost::class,
					function ( Application $app) use ( $plugin_args) {

						return new SavePost($app, new Render($app, true, $plugin_args));
					}
				);
			}

            $this->app->singleton(
                VariableType::class,
                static function ( Application $app): VariableType {

                    return new VariableType($app);
                }
            );

            if (blockera_get_experimental([ 'data', 'dynamicValue' ])) {

                $this->app->singleton(
                    DynamicValueType::class,
                    static function ( Application $app): DynamicValueType {

                        return new DynamicValueType($app);
                    }
                );
            }

            $this->app->singleton(
                ValueAddonRegistry::class,
                static function ( Application $app, array $params = []): ValueAddonRegistry {

                    return new ValueAddonRegistry($app, ...$params);
                }
            );

            $this->app->singleton(
                EntityRegistry::class,
                static function ( Application $app) {

                    return new EntityRegistry($app);
                }
            );

            $this->app->bind(
                StyleEngine::class,
                static function ( Application $app, array $params) {
					$style_engine = new StyleEngine( $params['block'], $params['fallbackSelector'] );

					$style_engine->setApp($app);
					$style_engine->setBreakpoint(blockera_core_config('breakpoints.base'));
					$style_engine->setBreakpoints($app->getEntity('breakpoints'));

                    return $style_engine;
                }
            );

            if ( ( defined('BLOCKERA_PHPUNIT_RUN_TESTS') && BLOCKERA_PHPUNIT_RUN_TESTS ) || blockera_get_admin_options( [ 'earlyAccessLab', 'optimizeStyleGeneration' ] ) ) {

				$vendor_path = blockera_core_config('app.vendor_path');

				$this->app->singleton(
					Transpiler::class,
					static function ( Application $app) use ( $cache_instance, $vendor_path) {

						$transpiler_instance = new Transpiler($app, $cache_instance);
						$transpiler_instance->setGlobalCssPropsClasses(include($vendor_path . 'blockera/wordpress/php/RenderBlock/V2/global-css-props-classes.php'));

						return $transpiler_instance;
					}
				);

				$this->app->singleton(
					V2RenderContent::class,
					static function ( Application $app) use ( $cache_instance, $vendor_path, $plugin_args): V2RenderContent {

						$render_content_instance = new V2RenderContent(
							$app,
							$app->make(Transpiler::class),
							[
								'cache' => $cache_instance,
								'plugin_args' => $plugin_args,
								'render' => new Render($app, false, $plugin_args),
							]
						);

						$render_content_instance->setIsMinifyInlineCss(! blockera_core_config('app.debug'));
						$render_content_instance->setBlockStylesDirBasePath(blockera_core_config('app.dist_path'));

						$file = $vendor_path . 'blockera/wordpress/php/RenderBlock/V2/block-global-styles-map.php';
						$render_content_instance->setBlockGlobalStylesMap(include($file));

						return $render_content_instance;
					}
				);
			}
			
			$this->app->singleton(
				Parser::class,
				static function ( Application $app) {

					return new Parser($app);
				}
			);

			$this->app->bind(
				Render::class,
				static function ( Application $app) use ( $plugin_args) : Render {

					return new Render($app, true, $plugin_args);
				}
			);

            $this->app->singleton(Sender::class);

        } catch (BaseException $handler) {

            throw new BaseException(esc_html('Binding ' . StyleEngine::class . " Failure! \n" . $handler->getMessage()));
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

		$this->app->make(IconsManager::class);
		$this->app->make(FeaturesManager::class)
			->registerFeatures(
				blockera_features_list(
					blockera_core_config('app.root_path')
                )
            )
			->bootFeatures();

		$this->initCache();

        $this->app->make(EntityRegistry::class);

        $this->setupRenderBlocks();

		Config::setConsumerConfig( blockera_core_config( 'app' ) );
		Config::setOptionKeys( blockera_core_config( 'telemetry.options' ) );
		Config::setServerURL( blockera_core_config( 'telemetry.server_url' ) );
		Config::setRestParams( blockera_core_config( 'telemetry.rest_params' ) );
		Config::setHookPrefix( blockera_core_config( 'telemetry.hook_prefix' ) );

		$this->app->make(Compatibility::class);

		$dynamicValueRegistry = $this->app->make(ValueAddonRegistry::class, [ DynamicValueType::class ]);
        $variableRegistry     = $this->app->make(ValueAddonRegistry::class, [ VariableType::class ]);

		if ($this->app instanceof Blockera) {

			$this->app->setRegisteredValueAddons(
				array_merge(
                    [
						'variable' => $variableRegistry->getRegistered(),
                    ],
                    blockera_get_experimental([ 'data', 'dynamicValue' ]) ? [
						'dynamic-value' => $dynamicValueRegistry->getRegistered(),
                    ] : [],
				)
			);
		}

		$this->loadTextDomain();

		blockera_editor_hooks();
	}

	/**
	 * Initializing cache mechanism.
	 * 
	 * @return void
	 */
	private function initCache(): void{

		$cache = $this->app->make(Version::class, [ 'product_id' => 'blockera' ]);

		$validate_cache = $cache->validate(BLOCKERA_SB_VERSION);

		if (! $validate_cache) {
			$cache->clear();
			$validate_cache = $cache->store(BLOCKERA_SB_VERSION);
		}

		if ($this->app instanceof Blockera) {
			$this->app->setIsValidateCache($validate_cache);
		}
	}


    /**
     * Rendering block type.
     *
     * @throws BindingResolutionException Exception for not found bounded module.
     * @return void
     */
    protected function setupRenderBlocks(): void {

		$supports = blockera_get_available_block_supports();

		if (blockera_get_admin_options([ 'earlyAccessLab', 'optimizeStyleGeneration' ])) {

			add_action(
                'save_post',
                function( int $post_id, \WP_Post $post) use ( $supports): void {
					$this->app->make(V2SavePost::class)->save($post_id, $post, $supports);
				},
                9e8,
                2
            );

			// phpcs:disable
        	// add_filter(
            // 'rest_pre_insert_wp_template',
            // function( \stdClass $prepared_post) use ( $supports): \stdClass {
			// return $this->app->make(V2SavePost::class)->insertWPTemplate($prepared_post, $supports);
			// },
            // 10
            // );
			// phpcs:enable

			// Filtering get_posts query.
			add_action(
                'pre_get_posts',
                function( \WP_Query $query) use ( $supports): void {
					$this->app->make(V2RenderContent::class)->getPosts($query, $supports);
				}
            );

			// Filtering render block content if it name is exact "core/block" and has ref attribute.
			add_filter(
                'render_block',
                function( string $block_content, array $block) use ( $supports): string {
					return $this->app->make(V2RenderContent::class)->renderBlock($block_content, $block, $supports);
				},
                10,
                2
            );

        } else {

			add_action(
                'save_post',
                function( int $post_id, \WP_Post $post) use ( $supports): void {
					$this->app->make(SavePost::class)->save($post_id, $post, $supports);
				},
                9e8,
                2
            );

			add_filter(
                'render_block',
                function( string $html, array $block) use ( $supports): string {
					return $this->app->make( Render::class)->render( $html, $block, $supports );
				},
                10,
                3
            );
        }
    }

    /**
     * Loading text domain.
     *
     * @hooked `init`
     *
     * @return void
     */
    public function loadTextDomain(): void {

        $locale = get_locale();

        $mo_file = WP_LANG_DIR . '/plugins/blockera-' . $locale . '.mo';

        if (file_exists($mo_file)) {
            load_textdomain('blockera', $mo_file);
        }

        load_plugin_textdomain('blockera', false, dirname(plugin_basename(BLOCKERA_SB_FILE)) . '/languages');
    }
}
