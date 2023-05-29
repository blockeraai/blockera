<?php

namespace Publisher\Core\Providers;

class AssetsProvider {

	/**
	 * Holds assets or packages name.
	 *
	 * @var array
	 */
	protected static $assets = [
		'icons',
		'fields',
		'controls',
		'components',
		'classnames',
		'extensions',
	];

	/**
	 * Holds packages dependencies array.
	 *
	 * @var string[]
	 */
	protected static $packages_deps = [
		'extensions' => [
			'@publisher/fields',
			'@publisher/controls',
		]
	];

	public function __construct() {

		add_action( 'wp_enqueue_scripts', [ $this, 'register_assets' ], 10 );
		add_action( 'enqueue_block_editor_assets', [ $this, 'register_assets' ], 10 );
	}

	/**
	 * Register all assets in WordPress.
	 *
	 * @return void
	 */
	public function register_assets(): void {

		foreach ( self::$assets as $asset ) {

			if ( ! $assetInfo = $this->assetInfo( $asset ) ) {

				continue;
			}

			if ( $assetInfo['style'] ) {

				wp_register_style(
					'@publisher/' . $asset,
					str_replace( '\\', '/', $assetInfo['style'] ),
					self::$packages_deps[ $asset ] ?? [],
					$assetInfo['version']
				);
			}

			if ( ! $assetInfo['script'] ) {

				continue;
			}

			wp_register_script(
				'@publisher/' . $asset,
				str_replace( '\\', '/', $assetInfo['script'] ),
				$assetInfo['deps'],
				$assetInfo['version']
			);
		}
	}

	/**
	 * Retrieve assets information.
	 *
	 * @param string $name
	 *
	 * @return array
	 */
	protected function assetInfo( string $name ): array {

		$isDevelopment = pb_core_config( 'app.debug' );

		$assetInfoFile = sprintf(
			'%s/%s/index%s.asset.php',
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

		return compact( 'deps', 'script', 'style', 'version' );
	}

}
