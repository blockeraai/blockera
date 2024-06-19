<?php

namespace Blockera\WordPress;

use Blockera\Bootstrap\Application;

/**
 * Class AssetsLoader registering all blockera core assets into WordPress CMS.
 *
 * @package AssetsLoader
 */
class AssetsLoader {

	/**
	 * Store loader identifier.
	 *
	 * @var string $id the loader identifier.
	 */
	protected string $id;

	/**
	 * Holds assets or packages name.
	 *
	 * @var array
	 */
	protected array $assets = [];

	/**
	 * Holds packages dependencies array.
	 *
	 * @var string[]
	 */
	protected array $packages_deps = [];

	/**
	 * Store assets list to dequeue
	 *
	 * @var array $dequeue_stack the dequeue assets stack.
	 */
	protected array $dequeue_stack = [];

	/**
	 * Store root directory info.
	 *
	 * @var array $root_info the root directory info.
	 */
	protected array $root_info = [
		'path' => '',
		'url'  => '',
	];

	/**
	 * Store is development flag.
	 *
	 * @var bool $is_development the flag to specific debug mode is on?
	 */
	protected bool $is_development = false;

	/**
	 * Store instance of Application container.
	 *
	 * @var Application the application instance.
	 */
	protected Application $application;

	/**
	 * AssetsProvider constructor method,
	 * when create new instance of current class,
	 * fire `wp_enqueue_scripts` and `enqueue_block_editor_assets`
	 *
	 * @param Application $app    the application container instance.
	 * @param array       $assets the assets stack.
	 * @param array       $args   the extra arguments.
	 *
	 * @since 1.0.0
	 */
	public function __construct( Application $app, array $assets = [], array $args = [] ) {

		$this->application    = $app;
		$this->assets         = $assets;
		$this->is_development = $args['debug-mode'] ?? false;
		$this->packages_deps  = $args['packages-deps'] ?? [];
		$this->root_info      = $args['root'] ?? [
			'path' => '',
			'url'  => '',
		];
		$this->id             = $args['id'] ?? 'blockera-wordpress-assets-loader';

		add_action( 'wp_enqueue_scripts', [ $this, 'enqueueBlockeraWPStyles' ] );
		add_action( 'admin_enqueue_scripts', [ $this, 'enqueueBlockeraWPStyles' ] );

		if ( ! empty( $args['enqueue-block-assets'] ) ) {

			add_action( 'enqueue_block_assets', [ $this, 'enqueue' ] );

		} elseif ( ! empty( $args['enqueue-admin-assets'] ) ) {

			add_action( 'admin_enqueue_scripts', [ $this, 'enqueue' ] );
		}
	}

	/**
	 * Enqueue assets just load into gutenberg canvas editor iframe.
	 *
	 * @return void
	 */
	public function enqueue(): void {

		if ( ! is_admin() ) {

			return;
		}

		array_map( function ( array $asset ): void {

			if ( $asset['style'] ) {

				wp_enqueue_style(
					$asset['name'],
					str_replace( '\\', DIRECTORY_SEPARATOR, $asset['style'] ),
					[],
					$asset['version']
				);

				return;
			}

			if ( ! $asset['script'] ) {

				return;
			}

			$deps = $this->excludeDependencies( $asset['deps'] );

			array_map( 'wp_enqueue_script', $this->packages_deps[ $asset['name'] ] ?? [] );

			wp_enqueue_script(
				$asset['name'],
				str_replace( '\\', DIRECTORY_SEPARATOR, $asset['script'] ),
				array_merge(
					$deps,
					$this->packages_deps[ $asset['name'] ] ?? []
				),
				$asset['version'],
				[
					'in_footer' => true,
				]
			);

		}, $this->prepareAssets() );

		/**
		 * This filter for extendable inline script from internal or third-party developers.
		 *
		 * @hook  'blockera/wordpress/{$this->id}/inline-script'
		 * @since 1.0.0
		 */
		$inline_script = apply_filters( 'blockera/wordpress/' . $this->id . '/inline-script', '' );

		/**
		 * This filter for change handle name for inline script from internal or third-party developers.
		 *
		 * @hook  'blockera/wordpress/{$this->id}/handle/inline-script
		 * @since 1.0.0
		 */
		$handle_inline_script = apply_filters( 'blockera/wordpress/' . $this->id . '/handle/inline-script', '' );

		if ( empty( $inline_script ) || empty( $handle_inline_script ) ) {

			return;
		}

		// blockera server side definitions.
		wp_add_inline_script(
			$handle_inline_script,
			$inline_script,
			'after'
		);
	}

	/**
	 * Enqueuing blockera requirement css styles on WordPress admin or front environments.
	 *
	 * @return void
	 */
	public function enqueueBlockeraWPStyles(): void {

		// Register empty css file to load from consumer plugin of that,
		// use-case: when enqueue style-engine inline stylesheet for all blocks on the document.
		// Accessibility: on front-end.
		$file    = $this->root_info['path'] . 'packages/wordpress/php/Assets/css/dynamic-styles.css';
		$file_url = $this->root_info['url'] . 'packages/wordpress/php/Assets/css/dynamic-styles.css';

		if ( file_exists( $file ) && ! is_admin() ) {

			$handle = 'blockera-inline-css';

			wp_enqueue_style(
				$handle,
				$file_url,
				[],
				filemtime( $file )
			);

			wp_add_inline_style(
				$handle,
				/**
				 * Apply filter for add inline css into empty file.
				 *
				 * @since 1.0.0
				 */
				// phpcs:disable
				apply_filters(
					'blockera/wordpress/register-block-editor-assets/add-inline-css-styles',
					''
				)
			);
			// phpcs:enable
		}
	}

	/**
	 * Preparing current assets with info!
	 *
	 * @param bool $isRegistering the registering flag.
	 *
	 * @return array
	 */
	protected function prepareAssets( bool $isRegistering = false ): array {

		$provider = $this;

		return array_filter(
			array_map(
				static function ( string $asset ) use ( $provider ) {

					$assetInfo = $provider->assetInfo( $asset );

					if ( ! $assetInfo ) {

						return null;
					}

					return $assetInfo;

				},
				$isRegistering ? blockera_get_dist_assets() : $this->assets
			)
		);
	}

	/**
	 * Exclude deps before register script!
	 *
	 * @param array $dependencies the dependencies of current asset.
	 *
	 * @since 1.0.0
	 * @return array the list of filtered dependencies.
	 */
	private function excludeDependencies( array $dependencies ): array {

		return array_filter(
			$dependencies,
			static function ( string $item ): bool {

				return false === strpos( $item, 'dev-' );
			}
		);
	}

	/**
	 * Retrieve assets information.
	 *
	 * @param string $name the name of current asset.
	 *
	 * @return array the asset data.
	 */
	public function assetInfo( string $name ): array {

		$assetInfoFile = sprintf(
			'%1$sdist/%2$s/%2$s%3$s.asset.php',
			$this->root_info['path'],
			$name,
			$this->is_development ? '' : '.min'
		);

		if ( ! file_exists( $assetInfoFile ) ) {

			return [];
		}

		$assetInfo = include $assetInfoFile;

		$deps    = $assetInfo['dependencies'] ?? [];
		$version = $assetInfo['version'] ?? filemtime( $assetInfoFile );

		$js_file = sprintf(
			'%1$sdist/%2$s/%2$s%3$s.js',
			$this->root_info['path'],
			$name,
			$this->is_development ? '' : '.min'
		);

		if ( file_exists( $js_file ) ) {

			$script = sprintf(
				'%1$sdist/%2$s/%2$s%3$s.js',
				$this->root_info['url'],
				$name,
				$this->is_development ? '' : '.min'
			);
		} else {

			$script = '';
		}

		$css_file = sprintf(
			'%sdist/%s/style%s.css',
			$this->root_info['path'],
			$name,
			$this->is_development ? '' : '.min'
		);

		if ( file_exists( $css_file ) ) {

			$style = sprintf(
				'%sdist/%s/style%s.css',
				$this->root_info['url'],
				$name,
				$this->is_development ? '' : '.min'
			);
		} else {

			$style = '';
		}

		$name = '@blockera/' . $name;

		return compact( 'name', 'deps', 'script', 'style', 'version' );
	}

}
