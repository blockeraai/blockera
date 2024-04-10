<?php

namespace Blockera\Framework\Services;

use Blockera\Framework\Illuminate\Foundation\Application;

/**
 * Class AssetsLoader registering all blockera core assets into WordPress CMS.
 *
 * @package AssetsLoader
 */
class AssetsLoader {

	/**
	 * Holds assets or packages name.
	 *
	 * @var array
	 */
	protected static array $assets = [
		'utils',
		'hooks',
		'blocks',
		'editor',
		'controls',
		'core-data',
		'components',
		'classnames',
		'extensions',
		'style-engine',
		'editor-styles',
		'data-extractor',
	];

	/**
	 * Holds packages dependencies array.
	 *
	 * @var string[]
	 */
	protected static array $packages_deps = [
		'extensions' => [
			'@blockera/controls',
			'@blockera/components',
		],
	];

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
	 * @param Application $app the application container instance.
	 *
	 * @since 1.0.0
	 */
	public function __construct( Application $app ) {

		$this->application = $app;

		add_action( 'enqueue_block_assets', [ $this, 'enqueue_editor_assets' ] );

		add_action( 'wp_enqueue_scripts', array( $this, 'register_assets' ), 10 );
		add_action( 'enqueue_block_editor_assets', array( $this, 'register_assets' ), 10 );
	}

	/**
	 * Enqueueing assets.
	 *
	 * @return void
	 */
	public function enqueue() {

		add_action( 'enqueue_block_editor_assets', [ $this, 'enqueue_editor_inspector_assets' ], 9e2 );
		add_action( 'wp_enqueue_scripts', [ $this, 'enqueue_editor_inspector_assets' ], 9e2 );
	}

	/**
	 * Enqueue assets just load into gutenberg canvas editor iframe.
	 *
	 * @return void
	 */
	public function enqueue_editor_assets(): void {

		if ( ! is_admin() ) {

			return;
		}

		$asset = $this->assetInfo( 'editor-styles' );

		if ( empty( $asset['style'] ) ) {

			return;
		}

		wp_enqueue_style(
			'@blockera/editor-styles',
			$asset['style'],
			[],
			$asset['version'],
		);
	}

	/**
	 * Enqueueing block editor or site editor assets.
	 *
	 * @hook `enqueue_block_editor_assets`
	 *
	 * @return void
	 */
	public function enqueue_editor_inspector_assets(): void {

		if ( ! is_admin() ) {

			return;
		}

		foreach ( $this->prepare_assets() as $asset ) {

			if ( $asset['style'] ) {

				wp_enqueue_style(
					'@blockera/' . $asset['name'],
					str_replace( '\\', '/', $asset['style'] ),
					self::$packages_deps[ $asset['name'] ] ?? [],
					$asset['version']
				);
			}

			if ( ! $asset['script'] ) {

				continue;
			}

			$deps = $this->exclude_dependencies( $asset['deps'] );

			wp_enqueue_script(
				'@blockera/' . $asset['name'],
				str_replace( '\\', '/', $asset['script'] ),
				$deps,
				$asset['version'],
				true
			);
		}
	}

	/**
	 * Preparing current assets with info!
	 *
	 * @return array
	 */
	protected function prepare_assets(): array {

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
				self::$assets
			)
		);
	}

	/**
	 * Register all assets in WordPress.
	 *
	 * @return void
	 */
	public function register_assets() {

		// Register empty css file to load from consumer plugin of that,
		// use-case: when enqueue style-engine inline stylesheet for all blocks on the document.
		// Accessibility: on front-end.
		$file    = blockera_core_config( 'app.root_path' ) . 'assets/dynamic-styles.css';
		$fileURL = blockera_core_config( 'app.root_url' ) . 'assets/dynamic-styles.css';

		if ( file_exists( $file ) && ! is_admin() ) {

			$handle = 'blockera-core-inline-css';

			wp_enqueue_style(
				$handle,
				$fileURL,
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
					'blockera-core/services/register-block-editor-assets/add-inline-css-styles',
					''
				)
			);
			// phpcs:enable
		}

		// Registering assets ...
		foreach ( $this->prepare_assets() as $asset ) {

			if ( $asset['style'] ) {

				wp_register_style(
					'@blockera/' . $asset['name'],
					str_replace( '\\', '/', $asset['style'] ),
					self::$packages_deps[ $asset['name'] ] ?? [],
					$asset['version']
				);
			}

			if ( ! $asset['script'] ) {

				continue;
			}

			$deps = $this->exclude_dependencies( $asset['deps'] );

			wp_register_script(
				'@blockera/' . $asset['name'],
				str_replace( '\\', '/', $asset['script'] ),
				$deps,
				$asset['version'],
				true
			);
		}

		if ( ! is_admin() ) {

			return;
		}

		// blockera-core server side dynamic value definitions.
		wp_add_inline_script(
			'@blockera/extensions',
			'
			window.onload = () => {
				blockera.coreData.unstableBootstrapServerSideEntities(' . wp_json_encode( $this->application->getEntities() ) . ');
				blockera.editor.unstableBootstrapServerSideBreakpointDefinitions(' . wp_json_encode( $this->application->getEntity( 'breakpoints' ) ) . ');
				blockera.coreData.unstableBootstrapServerSideVariableDefinitions(' . wp_json_encode( $this->application->getRegisteredValueAddons( 'variable', false ) ) . ');
				blockera.coreData.unstableBootstrapServerSideDynamicValueDefinitions(' . wp_json_encode( $this->application->getRegisteredValueAddons( 'dynamic-value', false ) ) . ');
			};
			',
			'after'
		);
	}

	/**
	 * Exclude deps before register script!
	 *
	 * @param array $dependencies the dependencies of current asset.
	 *
	 * @since 1.0.0
	 * @return array the list of filtered dependencies
	 */
	private function exclude_dependencies( array $dependencies ): array {

		$excludes = array( '@blockera/storybook' );

		foreach ( $excludes as $item ) {

			if ( ! in_array( $item, $dependencies, true ) ) {

				continue;
			}

			unset( $dependencies[ array_search( $item, $dependencies, true ) ] );
		}

		return $dependencies;
	}

	/**
	 * Retrieve assets information.
	 *
	 * @param string $name the name of current asset.
	 *
	 * @return array the asset data
	 */
	public function assetInfo( string $name ): array {

		$isDevelopment = blockera_core_config( 'app.debug' );

		$assetInfoFile = sprintf(
			'%s%s/index%s.asset.php',
			blockera_core_config( 'app.dist_path' ),
			$name,
			$isDevelopment ? '' : '.min'
		);

		if ( ! file_exists( $assetInfoFile ) ) {

			return [];
		}

		$assetInfo = include $assetInfoFile;

		$deps    = $assetInfo['dependencies'] ?? [];
		$version = $assetInfo['version'] ?? filemtime( $assetInfoFile );

		$js_file = sprintf(
			'%s%s/index%s.js',
			blockera_core_config( 'app.dist_path' ),
			$name,
			$isDevelopment ? '' : '.min'
		);

		if ( file_exists( $js_file ) ) {

			$script = sprintf(
				'%s%s/index%s.js',
				blockera_core_config( 'app.dist_url' ),
				$name,
				$isDevelopment ? '' : '.min'
			);
		} else {

			$script = '';
		}

		$_name = str_contains( $name, '-styles' ) ? $name : "{$name}-styles";

		$css_file = sprintf(
			'%s%s/style%s.css',
			blockera_core_config( 'app.dist_path' ),
			$_name,
			$isDevelopment ? '' : '.min'
		);

		if ( file_exists( $css_file ) ) {

			$style = sprintf(
				'%s%s/style%s.css',
				blockera_core_config( 'app.dist_url' ),
				$_name,
				$isDevelopment ? '' : '.min'
			);
		} else {

			$style = '';
		}

		return compact( 'name', 'deps', 'script', 'style', 'version' );
	}

}