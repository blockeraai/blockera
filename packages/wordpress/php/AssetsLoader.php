<?php
// phpcs:disable
namespace Blockera\WordPress;

use Blockera\Bootstrap\Application;
use Symfony\Component\VarDumper\VarDumper;

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
	 * Store fallback arguments.
	 *
	 * @var array $fallback_args the fallback arguments.
	 */
	protected array $fallback_args = [];

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

		if ( ! empty( $args['fallback'] ) && ! empty( $args['fallback']['url'] ) && ! empty( $args['fallback']['path'] ) ) {

			$this->fallback_args = $args['fallback'];
		}

		if ( ! empty( $args['enqueue-block-assets'] ) ) {

			add_action( 'enqueue_block_editor_assets', [ $this, 'enqueue' ] );

		} elseif ( ! empty( $args['enqueue-admin-assets'] ) ) {

			add_action( 'admin_enqueue_scripts', [ $this, 'enqueue' ] );
		}else {
			$loader = $this;

			add_action('wp_enqueue_scripts', static function () use ($loader): void {
				$loader->enqueue(false);
			});
		}
	}

	/**
	 * Enqueue assets just load into gutenberg canvas editor iframe.
	 *
	 * @param bool $is_admin The flag to check if the assets are being loaded in the admin area. Default is true.
	 *
	 * @return void
	 */
	public function enqueue(bool $is_admin = true): void
	{
		// Return early if we're trying to load admin assets on the frontend.
		if ($is_admin && ! is_admin()) {

			return;
		}

		$assets = $this->prepareAssets();

		array_map(
			function ( array $asset ) use ($assets) : void {

				$package_version = $this->getPackageVersion(str_replace(['@blockera/', '-styles'], '', $asset['name']));
				$package_version = str_replace('.', '-', $package_version);

				if ( $asset['style'] ) {

					wp_enqueue_style(
						$asset['name'] . '-' . $package_version,
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

				foreach($this->packages_deps[ $asset['name'] ] ?? [] as $index => $dep){
					
					$version = $this->getPackageVersion(str_replace('@blockera/', '', $dep));
					$version = str_replace('.', '-', $version);

					$this->packages_deps[$asset['name']][$index] .= '-' . $version;
				}

				wp_enqueue_script(
					$asset['name'] . '-' . $package_version,
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

			},
			$assets
		);

		/**
		 * This filter for extendable before inline script from internal or third-party developers.
		 *
		 * @hook  'blockera/wordpress/{$this->id}/inline-script/before'
		 * @since 1.0.0
		 */
		$before_inline_script = apply_filters( 'blockera/wordpress/' . $this->id . '/inline-script/before', '' );

		/**
		 * This filter for extendable after inline script from internal or third-party developers.
		 *
		 * @hook  'blockera/wordpress/{$this->id}/inline-script/after'
		 * @since 1.0.0
		 */
		$after_inline_script = apply_filters( 'blockera/wordpress/' . $this->id . '/inline-script/after', '' );

		/**
		 * This filter for change handle name for inline script from internal or third-party developers.
		 *
		 * @hook  'blockera/wordpress/{$this->id}/handle/inline-script
		 * @since 1.0.0
		 */
		$handle_inline_script = apply_filters( 'blockera/wordpress/' . $this->id . '/handle/inline-script', '' );

		if ( !empty( $before_inline_script ) && !empty( $handle_inline_script ) ) {

			// blockera server side before scripts.
			wp_add_inline_script(
				$handle_inline_script,
				$before_inline_script,
				'before'
			);
		}

		if ( !empty( $after_inline_script ) && !empty( $handle_inline_script ) ) {

			// blockera server side before scripts.
			wp_add_inline_script(
				$handle_inline_script,
				$after_inline_script,
			);
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

		$from_out_side = false;
		$assetInfoFile = sprintf(
			'%1$sdist/%2$s/%2$s%3$s.asset.php',
			$this->root_info['path'],
			$name,
			$this->is_development ? '' : '.min'
		);

		if ( ! file_exists( $assetInfoFile ) ) {

			if (isset($this->fallback_args['debug-mode'])) {
				$this->is_development = $this->fallback_args['debug-mode'];
			}

			$assetInfoFile = sprintf(
				'%1$sdist/%2$s/%2$s%3$s.asset.php',
				$this->fallback_args['path'] ?? '',
				$name,
				$this->is_development ? '' : '.min'
			);

			if ( ! file_exists( $assetInfoFile ) ) {

				return [];
			}

			$from_out_side = true;
		}

		$assetInfo = include $assetInfoFile;

		$deps    = $assetInfo['dependencies'] ?? [];
		$version = $assetInfo['version'] ?? filemtime( $assetInfoFile );

		$js_file = sprintf(
			'%1$sdist/%2$s/%2$s%3$s.js',
			$from_out_side ? $this->fallback_args['path'] : $this->root_info['path'],
			$name,
			$this->is_development ? '' : '.min'
		);

		if ( file_exists( $js_file ) ) {

			$script = sprintf(
				'%1$sdist/%2$s/%2$s%3$s.js',
				$from_out_side ? $this->fallback_args['url'] : $this->root_info['url'],
				$name,
				$this->is_development ? '' : '.min'
			);
		} else {

			$script = '';
		}

		$css_file = sprintf(
			'%sdist/%s/style%s.css',
			$from_out_side ? $this->fallback_args['path'] : $this->root_info['path'],
			$name,
			$this->is_development ? '' : '.min'
		);

		if ( file_exists( $css_file ) ) {

			$style = sprintf(
				'%sdist/%s/style%s.css',
				$from_out_side ? $this->fallback_args['url'] : $this->root_info['url'],
				$name,
				$this->is_development ? '' : '.min'
			);
		} else {

			$style = '';
		}

		if (!$version) {

			if (!empty($script)) {

				$version = filemtime($js_file);
			}
			if (!empty($style)) {

				$version = filemtime($css_file);
			}
		}

		$name = '@blockera/' . $name;

		return compact( 'name', 'deps', 'script', 'style', 'version' );
	}

	/**
	 * Get package version.
	 *
	 * @param string $name the name of current asset.
	 *
	 * @return string the package version.
	 */
	private function getPackageVersion(string $name): string {

		if (str_contains($name, 'blocks-')) {
			$name = str_replace('blocks-', 'blocks/', $name);
		}

		$package_json = sprintf(
			'%1$svendor/blockera/%2$s/package.json',
			$this->root_info['path'],
			$name,
		);

		if ( ! file_exists( $package_json ) ) {
			
			$package_json = sprintf(
				'%1$svendor/blockera/%2$s/package.json',
				$this->fallback_args['path'] ?? '',
				$name,
			);

			if ( ! file_exists( $package_json ) ) {

				return '';
			}
		}

		global $wp_filesystem;

		if (! $wp_filesystem) {
			require_once(ABSPATH . '/wp-admin/includes/file.php');

			WP_Filesystem();
		}

		return json_decode( $wp_filesystem->get_contents( $package_json ), true )['version'];
	}
}
