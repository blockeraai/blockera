<?php

namespace Blockera\Setup\Providers;

use Blockera\Telemetry\Config;
use Blockera\Setup\Blockera;
use Blockera\WordPress\Sender;
use Blockera\Data\Cache\Cache;
use Blockera\Data\Cache\Version;
use Blockera\Bootstrap\Application;
use Blockera\WordPress\RenderBlock\{
    Render,
    SavePost,
    ContentCleanup,
    QueryLoopContext,
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

			$this->app->singleton(
				Version::class,
				function ( Application $app, array $params = []) {
					return new Version($app, $params);
				}
			);

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
					$style_engine = new StyleEngine( $params['block'], $params['fallbackSelector'], $params['isGlobalStyle'] ?? false );

					$style_engine->setApp($app);
					$style_engine->setBreakpoint(blockera_core_config('breakpoints.base'));
					$style_engine->setBreakpoints($app->getEntity('breakpoints'));

					return $style_engine;
				}
			);

			$this->app->singleton(
				SavePost::class,
				function ( Application $app) {
			
					return new SavePost($app);
				}
			);

			$this->app->bind(
				Render::class,
				static function ( Application $app) use ( $plugin_args) : Render {
					$render_instance = new Render($app, $plugin_args);

					$vendor_path              = blockera_core_config('app.vendor_path');
					$global_css_props_classes = include($vendor_path . 'blockera/wordpress/php/RenderBlock/global-css-props-classes.php');

					$render_instance->setGlobalCssPropsClasses($global_css_props_classes);

					return $render_instance;
				}
			);

			$this->app->singleton(Sender::class);

			$this->app->singleton(ContentCleanup::class);

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
		/**
		 * Filter the block supports.
		 *
		 * @param array $supports The block supports.
		 * @param Application $app The application container object.
		 *
		 * @var Blockera $blockera
		 */
		$blockera = $this->app;

		// Clear the generated css and processed html at the start of content rendering.
		// Clear the classnames registry at the start of content rendering.
		// This ensures each page/post render starts with a clean state.
		Render::resetGeneratedCSS();
		Render::resetProcessedHTML();
		Render::clearClassnamesRegistry();

		// Register Query Loop context hooks.
		QueryLoopContext::register();

		// save_post hook - always needed.
		add_action('save_post', [ $this, 'handleSavePost' ], 9e8, 2);

		// Skip admin/editor/REST/AJAX contexts for frontend hooks.
		if (blockera_is_admin() || blockera_is_skip_request()) {
			return;
		}

		// Only instantiate Render for frontend requests.
		$render_instance = $this->app->make(Render::class);

		// render_block filter.
		add_filter(
			'render_block',
			static function( string $html, array $block) use ( $blockera, $render_instance): string {
				// Fast empty check without full trim.
				if ('' === ltrim($html) || 'core/null' === $block['blockName']) {
					return $html;
				}

                // Only cleanup the core/template-part blocks(headers, footers, etc.).
                if ( isset( $block['blockName'] ) && 'core/template-part' === $block['blockName'] ) {
                    // Clean html content. It includes all inner blocks.
                    // This achieves cleaning the html only once.
                    $html = $render_instance->processContentCleanup( $html );
                }

				return $render_instance->render($html, $block, $blockera->getBlockSupports());
			},
			10,
			2
		);

		// wp_head - CSS output (now inside context guard).
		add_action(
			'wp_head',
			function() use ( $render_instance): void {
				$css = $render_instance->getGeneratedCSS();

				// For development purposes, sort the CSS by block number.
                if (defined('BLOCKERA_DEVELOPMENT') && BLOCKERA_DEVELOPMENT) {
                    $css = blockera_sort_css_by_block_number($css);
                }

				blockera_add_inline_css(implode(PHP_EOL, $css));

				$render_instance->resetGeneratedCSS();
				$render_instance->resetProcessedHTML();
				$render_instance->clearClassnamesRegistry();
			}
		);

		// the_posts filter with main query check.
		// Hook into the_posts filter to process posts.
		// Cache the post content to avoid multiple processing.
		// Create blocks computed css to avoid multiple processing.
		add_filter(
			'the_posts',
			[ $this, 'handleThePosts' ],
			10e2,
			2
		);

		// Process the content to cleanup the inline styles and convert them to CSS rules.
		// Do the cleanup only once for the whole content.
		add_filter(
            'the_content',
            function( string $content) use ( $render_instance): string {
                return $render_instance->processContentCleanup( $content );
            },
            9999
		);
	}

	/**
	 * Handle the_posts filter to process posts.
	 *
	 * @param array     $posts The posts.
	 * @param \WP_Query $query The query object.
	 *
	 * @return array The posts.
	 */
	public function handleThePosts( array $posts, \WP_Query $query): array {
				// Skip non-main queries (widgets, sidebars, custom queries).
		if (! $query->is_main_query() || empty($posts)) {
			return $posts;
		}

        // Exception post types that we should not process their content.
        $exception_post_types = [
            'wp_global_styles' => true,
        ];

		$posts_to_process = [];
		$post_ids         = [];

        // Process only the posts that are not in the exception post types.
        // And contain Blockera blocks.
		foreach ($posts as $index => $post) {
			if (isset($exception_post_types[ $post->post_type ])) {
				continue;
			}
			if (! blockera_contains_blockera_block($post->post_content)) {
				continue;
			}
			$posts_to_process[ $index ] = $post;
			$post_ids[]                 = $post->ID;
		}

		if (empty($posts_to_process)) {
			return $posts;
		}

		// Instantiate services once for all posts.
        $cache     = $this->app->make(Cache::class, [ 'product_id' => 'blockera' ]);
        $save_post = $this->app->make(SavePost::class);
        $cache_key = $cache->getCacheKey('post_content');

        // Batch prime meta cache for all post IDs to avoid N+1 queries.
        // This loads all post meta in a single query instead of one per post.
        \update_meta_cache('post', $post_ids);

		foreach ($posts_to_process as $index => $post) {
			// Compute hash once per iteration.
			$current_hash = md5($post->post_content);
			// Get the cached data for the post.
			$cached_data = \get_post_meta($post->ID, $cache_key, true);

			if (! empty($cached_data) 
				&& isset($cached_data['hash'], $cached_data['content'])
				&& $cached_data['hash'] === $current_hash
			) {
				$posts[ $index ]->post_content = $cached_data['content'];
				continue;
			}

            // Cache missing or invalid - process post_content.
            $result = $save_post->processPostContentForStyles($post->post_content);

            if (! empty($result) && isset($result['content'])) {
                // Calculate hash only when we need to cache.
                $current_hash = md5($post->post_content);

                // Store processed content in cache.
                $cache->setCache(
                    $post->ID,
                    'post_content',
                    [
                        'hash'    => $current_hash,
                        'content' => $result['content'],
                    ]
                );

                // Replace post_content with processed content.
                $posts[ $index ]->post_content = $result['content'];
            }
        }

		return $posts;
	}

	/**
	 * Handle save_post action to process and cache block styles.
	 *
	 * @hooked save_post
	 *
	 * @param int      $post_id The post ID.
	 * @param \WP_Post $post    The post object.
	 *
	 * @return void
	 */
	public function handleSavePost( int $post_id, \WP_Post $post ): void {

		$this->app->make( SavePost::class )->save( $post_id, $post );
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
