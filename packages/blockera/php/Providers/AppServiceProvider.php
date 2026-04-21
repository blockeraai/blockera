<?php

namespace Blockera\Setup\Providers;

use Blockera\Setup\Blockera;
use Blockera\Telemetry\Config;
use Blockera\WordPress\Sender;
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
use Blockera\Editor\PreviewButton;
use Blockera\Editor\TabLocking;
use Blockera\Editor\BulkActions;
use Blockera\Editor\EditorPersistenceStore;

/**
 * Class AppServiceProvider for providing all application services.
 *
 * @package Blockera\Setup\Providers\AppServiceProvider
 */
class AppServiceProvider extends ServiceProvider {

	/**
	 * Flag to check if the blockera css has been outputted.
	 *
	 * @var bool $has_output_blockera_css The flag to check if the blockera css has been outputted.
	 */
	protected $has_output_blockera_css = false;

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
                'CacheSystem',
                function() {
					return blockera_get_cache();
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

			$this->app->singleton(PreviewButton::class);

			$this->app->singleton(TabLocking::class);

			$this->app->singleton(BulkActions::class);

			$this->app->singleton(EditorPersistenceStore::class);

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

		$this->app->make(PreviewButton::class);

		$this->app->make(TabLocking::class);

		$this->app->make(BulkActions::class);

		$this->app->make(EditorPersistenceStore::class);

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
	private function initCache(): void {
		$is_cache_valid = blockera_init_cache();

		if ( $this->app instanceof Blockera ) {
			$this->app->setIsValidateCache( $is_cache_valid );
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

		// Clear the generated css at the start of content rendering.
		// Clear the classnames registry at the start of content rendering.
		// This ensures each page/post render starts with a clean state.
		Render::resetGeneratedCSS();
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
			9e2,
			2
		);

		// Output CSS in wp_head if possible, else fallback to wp_footer if head never runs.
		add_action(
			'wp_head',
			function() use ( $render_instance ): void {
				// Mark that we've outputted in head.
				$this->printBlockeraCssForBlocks($render_instance);
			}
		);

		// If wp_head didn't run our print, print in wp_footer as a fallback.
		add_action(
			'wp_footer',
			function() use ( $render_instance ): void {
				$this->printBlockeraCssForBlocks($render_instance);
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
	 * Print the generated css for the blocks.
	 *
	 * @param Render $render_instance The render instance.
	 *
	 * @return void
	 */
	protected function printBlockeraCssForBlocks( Render $render_instance): void {
		$current_action = current_action();

		if ('wp_footer' === $current_action && ! $this->has_output_blockera_css) {
			return;
		}

		$css = $render_instance->getGeneratedCSS();

		// For development purposes, sort the CSS by block number.
        if (defined('BLOCKERA_DEVELOPMENT') && BLOCKERA_DEVELOPMENT && ! empty($css)) {
            $css = blockera_sort_css_by_block_number($css);
        }

		if (empty($css) && 'wp_head' === $current_action) {
			// Turn on the flag to attempt to print the css in wp_footer.
			$this->has_output_blockera_css = true;

			return;
		}

		blockera_add_inline_css(implode(PHP_EOL, $css));

		$render_instance->resetGeneratedCSS();
		$render_instance->clearClassnamesRegistry();
	}

	/**
	 * Handle the_posts filter to process posts.
	 *
	 * @param array     $posts The posts.
	 * @param \WP_Query $query The query object.
	 *
	 * @return array The posts.
	 */
	public function handleThePosts( array $posts, \WP_Query $query ): array {
		if ( empty( $posts ) ) {
			return $posts;
		}

		$template_post_types = [ 'wp_template', 'wp_template_part' ];

		// Process main query or FSE template queries (wp_template, wp_template_part).
		// Template queries are not main query but must be processed for block styles.
		$post_type         = $query->get( 'post_type' );
		$is_template_query = in_array( $post_type, $template_post_types, true )
			|| ( is_array( $post_type ) && ! empty( array_intersect( $template_post_types, $post_type ) ) );

		// Fallback: check posts when query vars may not expose post_type (e.g. ID-based lookup).
		if ( ! $is_template_query ) {
			$first_post        = reset( $posts );
			$is_template_query = $first_post && in_array( $first_post->post_type, $template_post_types, true );
		}

		if ( ! $query->is_main_query() && ! $is_template_query ) {
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
				$parsed_blocks = parse_blocks($post->post_content);

				foreach ($parsed_blocks as $block) {
					$ref = $block['attrs']['ref'] ?? null;

					if (! $ref) {
						continue;
					}

					// Get post object by ref id.
					$post_ref = get_post($ref);

					if (blockera_contains_blockera_block($post_ref->post_content)) {
						$posts_to_process[ $index ] = $post_ref;
						$post_ids[]                 = $ref;
					}
				}
				continue;
			}
			$posts_to_process[ $index ] = $post;
			$post_ids[]                 = $post->ID;
		}

		if (empty($posts_to_process)) {
			return $posts;
		}

		// Use helper function for cache instance (no container overhead).
		$cache     = $this->app->make('CacheSystem');
		$save_post = $this->app->make( SavePost::class );
		$cache_key = $cache->getCacheKey( 'post_content' );

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
			$result = $save_post->processPostContentForStyles( $post->post_content );

			if ( ! empty( $result ) && isset( $result['content'] ) ) {
				// Calculate hash only when we need to cache.
				$current_hash = md5( $post->post_content );

				// Store processed content in cache using the new meta cache method.
				$cache->setMetaCache(
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
