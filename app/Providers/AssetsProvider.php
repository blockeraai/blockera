<?php

namespace Publisher\Core\Providers;

class AssetsProvider {

	/**
	 * Holds assets or packages name.
	 *
	 * @var array
	 */
	protected static array $assets = [
		'utils',
		'fields',
		'controls',
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
			'@publisher/fields',
			'@publisher/controls',
			'@publisher/components'
		]
	];

	public function __construct() {

		add_action( 'wp_enqueue_scripts', [ $this, 'register_assets' ], 10 );
		add_action( 'enqueue_block_editor_assets', [ $this, 'register_assets' ], 10 );
	}

	/**
	 * Preparing current assets with info!
	 *
	 * @return array
	 */
	protected function prepare_assets(): array {

		$provider = $this;

		return array_filter(
			array_map( static function ( string $asset ) use ( $provider ) {

				if ( ! $assetInfo = $provider->assetInfo( $asset ) ) {

					return null;
				}

				return $assetInfo;

			}, self::$assets )
		);
	}

	/**
	 * Register all assets in WordPress.
	 *
	 * @return void
	 */
	public function register_assets(): void {

		//Registering assets ...
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
				$asset['version']
			);
		}
	}

	/**
	 * Exclude deps before register script!
	 *
	 * @param array $dependencies
	 *
	 * @since 1.0.0
	 * @return array
	 */
	private function exclude_dependencies( array $dependencies ): array {

		$excludes = [ '@publisher/storybook' ];

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
	 * @param string $name
	 *
	 * @return array
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
