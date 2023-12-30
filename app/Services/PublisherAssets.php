<?php

namespace Publisher\Framework\Services;

use Illuminate\Contracts\Container\BindingResolutionException;
use Publisher\Framework\Illuminate\Foundation\Application;
use Publisher\Framework\Illuminate\Foundation\ValueAddon\DynamicValue\DynamicValueType;
use Publisher\Framework\Illuminate\Foundation\ValueAddon\ValueAddonRegistry;
use Publisher\Framework\Illuminate\Foundation\ValueAddon\Variable\VariableType;

/**
 * PackagesService developed to register all publisher core assets into WordPress CMS.
 */
class PublisherAssets {

	/**
	 * Holds assets or packages name.
	 *
	 * @var array
	 */
	protected static array $assets = [
		'utils',
		'hooks',
		'controls',
		'core-data',
		'components',
		'classnames',
		'extensions',
		'style-engine',
		'data-extractor',
	];

	/**
	 * Holds packages dependencies array.
	 *
	 * @var string[]
	 */
	protected static array $packages_deps = [
		'extensions' => [
			'@publisher/controls',
			'@publisher/components',
		],
	];

	protected Application $application;

	/**
	 * AssetsProvider constructor method,
	 * when create new instance of current class,
	 * fire `wp_enqueue_scripts` and `enqueue_block_editor_assets`
	 *
	 * @since 1.0.0
	 */
	public function __construct( Application $app ) {

		$this->application = $app;

		add_action( 'wp_enqueue_scripts', array( $this, 'register_assets' ), 10 );
		add_action( 'enqueue_block_editor_assets', array( $this, 'register_assets' ), 10 );
	}

	public function enqueue() {

		add_action( 'enqueue_block_editor_assets', [ $this, 'enqueue_editor_assets' ], 9e2 );
		add_action( 'wp_enqueue_scripts', [ $this, 'enqueue_editor_assets' ], 9e2 );
	}

	/**
	 * Enqueueing block editor or site editor assets.
	 *
	 * @hook `enqueue_block_editor_assets`
	 *
	 * @return void
	 */
	public function enqueue_editor_assets(): void {

		if ( ! is_admin() ) {

			return;
		}

		foreach ( $this->prepare_assets() as $asset ) {

			if ( $asset['style'] ) {

				wp_enqueue_style(
					'@publisher/' . $asset['name'],
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
				'@publisher/' . $asset['name'],
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
	 * @throws BindingResolutionException
	 * @return void
	 */
	public function register_assets() {

		// FIXME: remove temp font-awesome icon library!
		wp_enqueue_style( 'fs', pb_core_config( 'app.rootURL' ) . '/assets/all.min.css' );
		wp_enqueue_script( 'fs', pb_core_config( 'app.rootURL' ) . '/assets/all.min.js' );

		// Registering assets ...
		foreach ( $this->prepare_assets() as $asset ) {

			if ( $asset['style'] ) {

				wp_register_style(
					'@publisher/' . $asset['name'],
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
				'@publisher/' . $asset['name'],
				str_replace( '\\', '/', $asset['script'] ),
				$deps,
				$asset['version'],
				true
			);
		}

		if ( ! is_admin() ) {

			return;
		}

		/**
		 * @var ValueAddonRegistry $dynamicValueRegistry
		 */
		$dynamicValueRegistry = $this->application->make( ValueAddonRegistry::class, [ DynamicValueType::class ] );

		/**
		 * @var ValueAddonRegistry $dynamicValueRegistry
		 */
		$variableRegistry = $this->application->make( ValueAddonRegistry::class, [ VariableType::class ] );

		// publisher-core server side dynamic value definitions.
		wp_add_inline_script(
			'@publisher/extensions',
			'
			window.onload = () => {
				publisher.coreData.unstableBootstrapServerSideDynamicValueDefinitions(' . wp_json_encode( $dynamicValueRegistry->getRegistered() ) . ');
				publisher.coreData.unstableBootstrapServerSideVariableDefinitions(' . wp_json_encode( $variableRegistry->getRegistered() ) . ');
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

		$excludes = array( '@publisher/storybook' );

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

		$isDevelopment = pb_core_config( 'app.debug' );

		$assetInfoFile = sprintf(
			'%s%s/index%s.asset.php',
			pb_core_config( 'app.dist_path' ),
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
			pb_core_config( 'app.dist_path' ),
			$name,
			$isDevelopment ? '' : '.min'
		);

		if ( file_exists( $js_file ) ) {

			$script = sprintf(
				'%s%s/index%s.js',
				pb_core_config( 'app.dist_url' ),
				$name,
				$isDevelopment ? '' : '.min'
			);
		} else {

			$script = '';
		}

		$css_file = sprintf(
			'%s%s-styles/style%s.css',
			pb_core_config( 'app.dist_path' ),
			$name,
			$isDevelopment ? '' : '.min'
		);

		if ( file_exists( $css_file ) ) {

			$style = sprintf(
				'%s%s-styles/style%s.css',
				pb_core_config( 'app.dist_url' ),
				$name,
				$isDevelopment ? '' : '.min'
			);
		} else {

			$style = '';
		}

		return compact( 'name', 'deps', 'script', 'style', 'version' );
	}

}