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
		'controls',
		'components',
		'classnames',
		'extensions',
	];

	public function __construct() {

		add_action( 'wp_enqueue_scripts', [ $this, 'register_assets' ] );
	}

	/**
	 * Register all assets in WordPress.
	 *
	 * @return void
	 */
	public function register(): void {

		foreach ( self::$assets as $asset ) {

			if ( ! $assetInfo = $this->assetInfo( $asset ) ) {

				continue;
			}

			if ( $assetInfo['style'] ) {

				wp_register_style(
					'@publisher/' . $asset,
					str_replace( '\\', '/', $assetInfo['style'] ),
					[],
					$assetInfo['version']
				);
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
		$script  = sprintf(
			'%s%s/index%s.js',
			pb_core_config( 'app.dist_url' ),
			$name,
			$isDevelopment ? '' : '.min'
		);

		$css_file = sprintf(
			'%s%s/style%s.css',
			pb_core_config( 'app.dist_path' ),
			$name,
			$isDevelopment ? '' : '.min'
		);

		if ( file_exists( $css_file ) ) {

			$style = sprintf(
				'%s%s/style%s.css',
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
