<?php
/**
 * Scan a patterns directory and register block patterns (core-like, with caching).
 *
 * @package Blockera\WordPress\Patterns
 */

namespace Blockera\WordPress\Patterns;

/**
 * Registers block patterns from an arbitrary directory.
 *
 * Mirrors WordPress core theme pattern registration:
 * - header parsing via get_file_data()
 * - site-transient metadata cache keyed by directory + version
 * - lazy content loading via filePath
 *
 * Callers gate conditions (e.g. WooCommerce active) before calling register().
 */
class DirectoryRegistrar {

	/**
	 * Default cache TTL in seconds (matches WP_Theme::$cache_expiration).
	 *
	 * @var int
	 */
	private const DEFAULT_CACHE_TTL = 1800;

	/**
	 * Directories / files excluded while scanning.
	 *
	 * @var string[]
	 */
	private const SCAN_EXCLUSIONS = array(
		'CVS',
		'node_modules',
		'vendor',
		'bower_components',
	);

	/**
	 * Pattern file header map (same keys as WP_Theme::get_block_patterns).
	 *
	 * @var array<string, string>
	 */
	private const DEFAULT_HEADERS = array(
		'title'         => 'Title',
		'slug'          => 'Slug',
		'description'   => 'Description',
		'viewportWidth' => 'Viewport Width',
		'inserter'      => 'Inserter',
		'categories'    => 'Categories',
		'keywords'      => 'Keywords',
		'blockTypes'    => 'Block Types',
		'postTypes'     => 'Post Types',
		'templateTypes' => 'Template Types',
	);

	/**
	 * Pattern properties parsed as comma-separated lists.
	 *
	 * @var string[]
	 */
	private const ARRAY_PROPERTIES = array(
		'categories',
		'keywords',
		'blockTypes',
		'postTypes',
		'templateTypes',
	);

	/**
	 * Scan a directory and register all valid patterns.
	 *
	 * @param string $directory Absolute path to a patterns directory.
	 * @param array  $args {
	 *     Optional. Registration arguments.
	 *
	 *     @type string $text_domain    Text domain for title/description translation. Default empty.
	 *     @type string $version        Version string used for cache invalidation. Default '0'.
	 *     @type bool   $can_use_cached Whether metadata cache may be used. Default: ! wp_is_development_mode( 'theme' ).
	 * }
	 *
	 * @return void
	 */
	public function register( string $directory, array $args = array() ): void {
		$directory   = $this->normalize_directory( $directory );
		$text_domain = isset( $args['text_domain'] ) ? (string) $args['text_domain'] : '';
		$patterns    = $this->get_patterns( $directory, $args );
		$registry    = \WP_Block_Patterns_Registry::get_instance();

		foreach ( $patterns as $relative_file => $pattern_data ) {
			if ( $registry->is_registered( $pattern_data['slug'] ) ) {
				continue;
			}

			$file_path = $directory . '/' . $relative_file;

			if ( ! file_exists( $file_path ) ) {
				_doing_it_wrong(
					__METHOD__,
					sprintf(
						/* translators: %s: file name. */
						__( 'Could not register file "%s" as a block pattern as the file does not exist.', 'blockera' ),
						$relative_file
					),
					'1.0.0'
				);
				$this->delete_pattern_cache( $directory );
				continue;
			}

			$pattern_data['filePath'] = $file_path;

			if ( '' !== $text_domain ) {
				// phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralText,WordPress.WP.I18n.NonSingularStringLiteralDomain,WordPress.WP.I18n.LowLevelTranslationFunction
				$pattern_data['title'] = translate_with_gettext_context( $pattern_data['title'], 'Pattern title', $text_domain );

				if ( ! empty( $pattern_data['description'] ) ) {
					// phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralText,WordPress.WP.I18n.NonSingularStringLiteralDomain,WordPress.WP.I18n.LowLevelTranslationFunction
					$pattern_data['description'] = translate_with_gettext_context( $pattern_data['description'], 'Pattern description', $text_domain );
				}
			}

			register_block_pattern( $pattern_data['slug'], $pattern_data );
		}
	}

	/**
	 * Scan (or load from cache) pattern metadata for a directory.
	 *
	 * @param string $directory Absolute path to a patterns directory.
	 * @param array  $args {
	 *     Optional. Scan arguments.
	 *
	 *     @type string $version        Version string used for cache invalidation. Default '0'.
	 *     @type bool   $can_use_cached Whether metadata cache may be used. Default: ! wp_is_development_mode( 'theme' ).
	 * }
	 *
	 * @return array<string, array> Map of relative file path => pattern properties.
	 */
	public function get_patterns( string $directory, array $args = array() ): array {
		$directory      = $this->normalize_directory( $directory );
		$version        = isset( $args['version'] ) ? (string) $args['version'] : '0';
		$can_use_cached = array_key_exists( 'can_use_cached', $args )
			? (bool) $args['can_use_cached']
			: ! wp_is_development_mode( 'theme' );

		$cached = $this->get_pattern_cache( $directory, $version );

		if ( is_array( $cached ) ) {
			if ( $can_use_cached ) {
				return $cached;
			}

			$this->delete_pattern_cache( $directory );
		}

		$pattern_data = array();

		if ( ! is_dir( $directory ) ) {
			if ( $can_use_cached ) {
				$this->set_pattern_cache( $directory, $version, $pattern_data );
			}

			return $pattern_data;
		}

		$files = $this->scandir( $directory, 'php', -1 );

		if ( ! $files ) {
			if ( $can_use_cached ) {
				$this->set_pattern_cache( $directory, $version, $pattern_data );
			}

			return $pattern_data;
		}

		$dirpath = trailingslashit( $directory );

		foreach ( $files as $relative => $absolute ) {
			$pattern = get_file_data( $absolute, self::DEFAULT_HEADERS );

			if ( empty( $pattern['slug'] ) ) {
				_doing_it_wrong(
					__METHOD__,
					sprintf(
						/* translators: %s: file name. */
						__( 'Could not register file "%s" as a block pattern ("Slug" field missing)', 'blockera' ),
						$absolute
					),
					'1.0.0'
				);
				continue;
			}

			if ( ! preg_match( '/^[A-z0-9\/_-]+$/', $pattern['slug'] ) ) {
				_doing_it_wrong(
					__METHOD__,
					sprintf(
						/* translators: 1: file name; 2: slug value found. */
						__( 'Could not register file "%1$s" as a block pattern (invalid slug "%2$s")', 'blockera' ),
						$absolute,
						$pattern['slug']
					),
					'1.0.0'
				);
			}

			if ( ! $pattern['title'] ) {
				_doing_it_wrong(
					__METHOD__,
					sprintf(
						/* translators: %s: file name. */
						__( 'Could not register file "%s" as a block pattern ("Title" field missing)', 'blockera' ),
						$absolute
					),
					'1.0.0'
				);
				continue;
			}

			foreach ( self::ARRAY_PROPERTIES as $property ) {
				if ( ! empty( $pattern[ $property ] ) ) {
					$pattern[ $property ] = array_filter(
						wp_parse_list( (string) $pattern[ $property ] )
					);
				} else {
					unset( $pattern[ $property ] );
				}
			}

			if ( ! empty( $pattern['viewportWidth'] ) ) {
				$pattern['viewportWidth'] = (int) $pattern['viewportWidth'];
			} else {
				unset( $pattern['viewportWidth'] );
			}

			if ( ! empty( $pattern['inserter'] ) ) {
				$pattern['inserter'] = in_array(
					strtolower( $pattern['inserter'] ),
					array( 'yes', 'true' ),
					true
				);
			} else {
				unset( $pattern['inserter'] );
			}

			// Prefer scandir relative key; fall back to path strip for safety.
			$key                  = is_string( $relative ) ? $relative : str_replace( $dirpath, '', $absolute );
			$pattern_data[ $key ] = $pattern;
		}

		if ( $can_use_cached ) {
			$this->set_pattern_cache( $directory, $version, $pattern_data );
		}

		return $pattern_data;
	}

	/**
	 * Delete the pattern metadata cache for a directory.
	 *
	 * @param string $directory Absolute path to a patterns directory.
	 *
	 * @return void
	 */
	public function delete_pattern_cache( string $directory ): void {
		delete_site_transient( $this->get_cache_key( $this->normalize_directory( $directory ) ) );
	}

	/**
	 * Build the site transient key for a directory.
	 *
	 * @param string $directory Normalized absolute directory path.
	 *
	 * @return string
	 */
	public function get_cache_key( string $directory ): string {
		return 'blockera_pattern_dir_' . md5( $this->normalize_directory( $directory ) );
	}

	/**
	 * Normalize a directory path (no trailing slash).
	 *
	 * @param string $directory Directory path.
	 *
	 * @return string
	 */
	private function normalize_directory( string $directory ): string {
		$directory = wp_normalize_path( $directory );

		return untrailingslashit( $directory );
	}

	/**
	 * Read cached pattern metadata when version matches.
	 *
	 * @param string $directory Normalized directory path.
	 * @param string $version   Expected version.
	 *
	 * @return array|false
	 */
	private function get_pattern_cache( string $directory, string $version ) {
		$pattern_data = get_site_transient( $this->get_cache_key( $directory ) );

		if ( is_array( $pattern_data ) && ( $pattern_data['version'] ?? null ) === $version ) {
			return $pattern_data['patterns'] ?? false;
		}

		return false;
	}

	/**
	 * Store pattern metadata in a site transient.
	 *
	 * @param string $directory Normalized directory path.
	 * @param string $version   Version string.
	 * @param array  $patterns  Pattern metadata map.
	 *
	 * @return void
	 */
	private function set_pattern_cache( string $directory, string $version, array $patterns ): void {
		$pattern_data = array(
			'version'  => $version,
			'patterns' => $patterns,
		);

		/**
		 * Filters the cache expiration time for Blockera pattern directories.
		 *
		 * Uses the same filter as core theme file caches for consistency.
		 *
		 * @param int    $cache_expiration Cache expiration time in seconds.
		 * @param string $cache_type       Type of cache being set.
		 */
		$cache_expiration = (int) apply_filters( 'wp_theme_files_cache_ttl', self::DEFAULT_CACHE_TTL, 'blockera_block_patterns' );

		if ( $cache_expiration <= 0 ) {
			$cache_expiration = self::DEFAULT_CACHE_TTL;
		}

		set_site_transient( $this->get_cache_key( $directory ), $pattern_data, $cache_expiration );
	}

	/**
	 * Recursively scan a directory for files with the given extension(s).
	 *
	 * Adapted from WP_Theme::scandir().
	 *
	 * @param string               $path          Absolute directory path.
	 * @param string|string[]|null $extensions    Extension(s) to include, or null for all.
	 * @param int                  $depth         Recursion depth; -1 for unlimited.
	 * @param string               $relative_path Relative path prefix for keys.
	 *
	 * @return array<string, string>|false Map of relative => absolute paths, or false if not a dir.
	 */
	private function scandir( $path, $extensions = null, int $depth = 0, string $relative_path = '' ) {
		if ( ! is_dir( $path ) ) {
			return false;
		}

		$_extensions = '';

		if ( $extensions ) {
			$extensions  = (array) $extensions;
			$_extensions = implode( '|', $extensions );
		}

		$relative_path = trailingslashit( $relative_path );

		if ( '/' === $relative_path ) {
			$relative_path = '';
		}

		$results = scandir( $path );
		$files   = array();

		if ( false === $results ) {
			return $files;
		}

		foreach ( $results as $result ) {
			if ( '.' === $result[0] || in_array( $result, self::SCAN_EXCLUSIONS, true ) ) {
				continue;
			}

			$full_path = $path . '/' . $result;

			if ( is_dir( $full_path ) ) {
				if ( ! $depth ) {
					continue;
				}

				$found = $this->scandir( $full_path, $extensions, $depth - 1, $relative_path . $result );

				if ( is_array( $found ) ) {
					foreach ( $found as $rel => $abs ) {
						$files[ $rel ] = $abs;
					}
				}
			} elseif ( ! $extensions || preg_match( '~\.(' . $_extensions . ')$~', $result ) ) {
				$files[ $relative_path . $result ] = $full_path;
			}
		}

		return $files;
	}
}
