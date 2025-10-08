<?php

namespace Blockera\Editor\Http\Controllers\Theme;

use Blockera\Utils\Utils;

class JSONResolver extends \WP_Theme_JSON_Resolver {

	/**
	 * Store the default WordPress provided data for users.
	 *
	 * @var \WP_Theme_JSON_Data $default_user_data the provided default user data by WordPress.
	 */
	public static \WP_Theme_JSON_Data $default_user_data;

	/**
	 * Store the default WordPress provided data from theme.
	 *
	 * @var \WP_Theme_JSON_Data $default_theme_data the provided from theme data by WordPress.
	 */
	public static \WP_Theme_JSON_Data $default_theme_data;

	/**
	 * Store the default WordPress provided data from blocks.
	 *
	 * @var \WP_Theme_JSON_Data $default_blocks_data the provided from blocks data by WordPress.
	 */
	public static \WP_Theme_JSON_Data $default_blocks_data;

	/**
	 * Export the combined (and flattened) THEME and CUSTOM data.
	 *
	 * @param string $content ['all', 'current', 'user'] Determines which settings content to include in the export.
	 * @param array  $extra_theme_data Any theme json extra data to be included in the export.
	 *  All options include user settings.
	 *  'current' will include settings from the currently installed theme but NOT from the parent theme.
	 *  'all' will include settings from the current theme as well as the parent theme (if it has one)
	 *  'variation' will include just the user custom styles and settings.
	 */
	public static function export_theme_data( $content, $extra_theme_data = null ) {
		$current_theme = wp_get_theme();
		if ( class_exists( 'WP_Theme_JSON_Gutenberg' ) ) {
			$theme = new \WP_Theme_JSON_Gutenberg();
		} else {
			$theme = new \WP_Theme_JSON();
		}

		if ( 'all' === $content && $current_theme->parent() ) {
			// Get parent theme.json.
			$parent_theme_json_data = static::read_json_file( static::get_file_path_from_theme( 'theme.json', true ) );
			$parent_theme_json_data = static::translate( $parent_theme_json_data, $current_theme->parent()->get( 'TextDomain' ) );

			// Get the schema from the parent JSON.
			$schema = $parent_theme_json_data['$schema'];
			if ( array_key_exists( 'schema', $parent_theme_json_data ) ) {
				$schema = $parent_theme_json_data['$schema'];
			}

			if ( class_exists( 'WP_Theme_JSON_Gutenberg' ) ) {
				$parent_theme = new \WP_Theme_JSON_Gutenberg( $parent_theme_json_data );
			} else {
				$parent_theme = new \WP_Theme_JSON( $parent_theme_json_data );
			}
			$theme->merge( $parent_theme );
		}

		if ( 'all' === $content || 'current' === $content ) {
			$theme_json_data = static::read_json_file( static::get_file_path_from_theme( 'theme.json' ) );
			$theme_json_data = static::translate( $theme_json_data, wp_get_theme()->get( 'TextDomain' ) );

			// Get the schema from the parent JSON.
			if ( array_key_exists( 'schema', $theme_json_data ) ) {
				$schema = $theme_json_data['$schema'];
			}

			if ( class_exists( 'WP_Theme_JSON_Gutenberg' ) ) {
				$theme_theme = new \WP_Theme_JSON_Gutenberg( $theme_json_data );
			} else {
				$theme_theme = new \WP_Theme_JSON( $theme_json_data );
			}
			$theme->merge( $theme_theme );
		}

		// Merge the User Data.
		$theme->merge( static::get_user_data() );

		// Merge the extra theme data received as a parameter.
		if ( ! empty( $extra_theme_data ) ) {
			if ( class_exists( 'WP_Theme_JSON_Gutenberg' ) ) {
				$extra_data = new \WP_Theme_JSON_Gutenberg( $extra_theme_data );
			} else {
				$extra_data = new \WP_Theme_JSON( $extra_theme_data );
			}
			$theme->merge( $extra_data );
		}

		$data = $theme->get_data();

		// Add the schema.
		if ( empty( $schema ) ) {
			global $wp_version;
			$theme_json_version = 'wp/' . substr( $wp_version, 0, 3 );
			if ( defined( 'IS_GUTENBERG_PLUGIN' ) ) {
				$theme_json_version = 'trunk';
			}
			$schema = 'https://schemas.wp.org/' . $theme_json_version . '/theme.json';
		}
		$data['$schema'] = $schema;
		return static::stringify( $data );
	}

	/**
	 * Register the block style variations from the user data.
	 *
	 * @param array $decoded_data The decoded data.
	 * @return void
	 */
	private static function register_block_style_variations_from_user_data( $decoded_data ): void {

		$post_id            = \WP_Theme_JSON_Resolver::get_user_global_styles_post_id();
		$blockera_meta_data = get_post_meta($post_id, 'blockeraGlobalStylesMetaData', true);

		// Register the block style from the user data.
		static::register_block_style($decoded_data['styles']['blocks'] ?? []);

		// Register the block style from the blockera user meta data.
		static::register_block_style($blockera_meta_data['blocks'] ?? []);
	}

	/**
	 * Register the block style.
	 *
	 * @param array $blocks The blocks.
	 * @return void
	 */
	private static function register_block_style( array $blocks ): void {
		
		foreach ( $blocks as $block_name => $block_data ) {
			if ( isset( $block_data['variations'] ) ) {
				foreach ( $block_data['variations'] as $variation_name => $variation_data ) {
					if ( \WP_Block_Styles_Registry::get_instance()->get_registered($block_name, $variation_name)) {
						continue;
					}

					$variation = [
						'name' => $variation_name,
						'label' => Utils::pascalCaseWithSpace($variation_name),
					];

					register_block_style($block_name, $variation);
				}
			}
		}
	}

	/**
	 * Get the user data.
	 *
	 * This is a copy of the parent function with the addition of the Gutenberg resolver.
	 *
	 * @return array
	 */
	public static function get_user_data() {
		if ( null !== static::$user && static::has_same_registered_blocks( 'user' ) ) {
			return static::$default_user_data ?? static::$user;
		}

		$config   = array();
		$user_cpt = static::get_user_data_from_wp_global_styles( wp_get_theme() );

		if ( array_key_exists( 'post_content', $user_cpt ) ) {
			$decoded_data = json_decode( $user_cpt['post_content'], true );

			static::register_block_style_variations_from_user_data( $decoded_data );
			
			$json_decoding_error = json_last_error();
			if ( JSON_ERROR_NONE !== $json_decoding_error ) {
				wp_trigger_error( __METHOD__, 'Error when decoding a theme.json schema for user data. ' . json_last_error_msg() );

				$theme_json = new JSONData( $config, 'custom' );

				/*
				 * Backward compatibility for extenders returning a JSONData
				 * compatible class that is not a JSONData object.
				 */
				if ( $theme_json instanceof JSONData ) {
					return $theme_json->get_theme_json();
				} else {
					$config = $theme_json->get_data();
					return new JSON( $config, 'custom' );
				}
			}

			/*
			 * Very important to verify that the flag isGlobalStylesUserThemeJSON is true.
			 * If it's not true then the content was not escaped and is not safe.
			 */
			if (
				is_array( $decoded_data ) &&
				isset( $decoded_data['isGlobalStylesUserThemeJSON'] ) &&
				$decoded_data['isGlobalStylesUserThemeJSON']
			) {
				unset( $decoded_data['isGlobalStylesUserThemeJSON'] );
				$config = $decoded_data;
			}
		}

		$theme_json = new JSONData( $config, 'custom' );

		/*
		 * Backward compatibility for extenders returning a WP_Theme_JSON_Data
		 * compatible class that is not a WP_Theme_JSON_Data object.
		 */
		if ( $theme_json instanceof JSONData ) {
			static::$user = $theme_json->get_theme_json();
		} else {
			$config       = $theme_json->get_data();
			static::$user = new JSON( $config, 'custom' );
		}

		return static::$user;
	}

	/**
     * Returns the theme's data.
     *
     * Data from theme.json will be backfilled from existing
     * theme supports, if any. Note that if the same data
     * is present in theme.json and in theme supports,
     * the theme.json takes precedence.
     *
     * @since 5.8.0
     * @since 5.9.0 Theme supports have been inlined and the `$theme_support_data` argument removed.
     * @since 6.0.0 Added an `$options` parameter to allow the theme data to be returned without theme supports.
     * @since 6.6.0 Add support for 'default-font-sizes' and 'default-spacing-sizes' theme supports.
     *              Added registration and merging of block style variations from partial theme.json files and the block styles registry.
     *
     * @param array $deprecated Deprecated. Not used.
     * @param array $options {
     *     Options arguments.
     *
     *     @type bool $with_supports Whether to include theme supports in the data. Default true.
     * }
     * @return JSON Entity that holds theme data.
     */
	public static function get_theme_data( $deprecated = array(), $options = array() ) {
		if ( ! empty( $deprecated ) ) {
			_deprecated_argument( __METHOD__, '5.9.0' );
		}

		$options = wp_parse_args( $options, array( 'with_supports' => true ) );

		if ( null === static::$theme || ! static::has_same_registered_blocks( 'theme' ) ) {
			$wp_theme        = wp_get_theme();
			$theme_json_file = $wp_theme->get_file_path( 'theme.json' );
			if ( is_readable( $theme_json_file ) ) {
				$theme_json_data = static::read_json_file( $theme_json_file );
				$theme_json_data = static::translate( $theme_json_data, $wp_theme->get( 'TextDomain' ) );
			} else {
				$theme_json_data = array( 'version' => JSON::LATEST_SCHEMA );
			}

			/*
			 * Register variations defined by theme partials (theme.json files in the styles directory).
			 * This is required so the variations pass sanitization of theme.json data.
			 */
			$variations = static::get_style_variations( 'block' );
			wp_register_block_style_variations_from_theme_json_partials( $variations );

			/*
			 * Source variations from the block registry and block style variation files. Then, merge them into the existing theme.json data.
			 *
			 * In case the same style properties are defined in several sources, this is how we should resolve the values,
			 * from higher to lower priority:
			 *
			 * - styles.blocks.blockType.variations from theme.json
			 * - styles.variations from theme.json
			 * - variations from block style variation files
			 * - variations from block styles registry
			 *
			 * See test_add_registered_block_styles_to_theme_data and test_unwraps_block_style_variations.
			 *
			 */
			$theme_json_data = static::inject_variations_from_block_style_variation_files( $theme_json_data, $variations );
			$theme_json_data = static::inject_variations_from_block_styles_registry( $theme_json_data );

			$theme_json = new JSONData( $theme_json_data, 'theme' );

			/*
			 * Backward compatibility for extenders returning a JSONData
			 * compatible class that is not a JSONData object.
			 */
			if ( $theme_json instanceof JSONData ) {
				static::$theme = $theme_json->get_theme_json();
			} else {
				$config        = $theme_json->get_data();
				static::$theme = new JSON( $config );
			}

			if ( $wp_theme->parent() ) {
				// Get parent theme.json.
				$parent_theme_json_file = $wp_theme->parent()->get_file_path( 'theme.json' );
				if ( $theme_json_file !== $parent_theme_json_file && is_readable( $parent_theme_json_file ) ) {
					$parent_theme_json_data = static::read_json_file( $parent_theme_json_file );
					$parent_theme_json_data = static::translate( $parent_theme_json_data, $wp_theme->parent()->get( 'TextDomain' ) );
					$parent_theme           = new JSON( $parent_theme_json_data );

					/*
					 * Merge the child theme.json into the parent theme.json.
					 * The child theme takes precedence over the parent.
					 */
					$parent_theme->merge( static::$theme );
					static::$theme = $parent_theme;
				}
			}
		}

		if ( ! $options['with_supports'] ) {
			return static::$theme;
		}

		/*
		 * We want the presets and settings declared in theme.json
		 * to override the ones declared via theme supports.
		 * So we take theme supports, transform it to theme.json shape
		 * and merge the static::$theme upon that.
		 */
		$theme_support_data = JSON::get_from_editor_settings( get_classic_theme_supports_block_editor_settings() );
		if ( ! wp_theme_has_theme_json() ) {
			/*
			 * Unlike block themes, classic themes without a theme.json disable
			 * default presets when custom preset theme support is added. This
			 * behavior can be overridden by using the corresponding default
			 * preset theme support.
			 */
			$theme_support_data['settings']['color']['defaultPalette']        =
				! isset( $theme_support_data['settings']['color']['palette'] ) ||
				current_theme_supports( 'default-color-palette' );
			$theme_support_data['settings']['color']['defaultGradients']      =
				! isset( $theme_support_data['settings']['color']['gradients'] ) ||
				current_theme_supports( 'default-gradient-presets' );
			$theme_support_data['settings']['typography']['defaultFontSizes'] =
				! isset( $theme_support_data['settings']['typography']['fontSizes'] ) ||
				current_theme_supports( 'default-font-sizes' );
			$theme_support_data['settings']['spacing']['defaultSpacingSizes'] =
				! isset( $theme_support_data['settings']['spacing']['spacingSizes'] ) ||
				current_theme_supports( 'default-spacing-sizes' );

			/*
			 * Shadow presets are explicitly disabled for classic themes until a
			 * decision is made for whether the default presets should match the
			 * other presets or if they should be disabled by default in classic
			 * themes. See https://github.com/WordPress/gutenberg/issues/59989.
			 */
			$theme_support_data['settings']['shadow']['defaultPresets'] = false;

			// Allow themes to enable link color setting via theme_support.
			if ( current_theme_supports( 'link-color' ) ) {
				$theme_support_data['settings']['color']['link'] = true;
			}

			// Allow themes to enable all border settings via theme_support.
			if ( current_theme_supports( 'border' ) ) {
				$theme_support_data['settings']['border']['color']  = true;
				$theme_support_data['settings']['border']['radius'] = true;
				$theme_support_data['settings']['border']['style']  = true;
				$theme_support_data['settings']['border']['width']  = true;
			}

			// Allow themes to enable appearance tools via theme_support.
			if ( current_theme_supports( 'appearance-tools' ) ) {
				$theme_support_data['settings']['appearanceTools'] = true;
			}
		}
		$with_theme_supports = new JSON( $theme_support_data );
		$with_theme_supports->merge( static::$theme );
		return $with_theme_supports;
	}

	/**
	 * Gets the styles for blocks from the block.json file.
	 *
	 * @since 6.1.0
	 *
	 * @return WP_Theme_JSON
	 */
	public static function get_block_data() {
		$registry = \WP_Block_Type_Registry::get_instance();
		$blocks   = $registry->get_all_registered();

		if ( null !== static::$blocks && static::has_same_registered_blocks( 'blocks' ) ) {
			return static::$blocks;
		}

		$config = array( 'version' => JSON::LATEST_SCHEMA );
		foreach ( $blocks as $block_name => $block_type ) {
			if ( isset( $block_type->supports['__experimentalStyle'] ) ) {
				$config['styles']['blocks'][ $block_name ] = static::remove_json_comments( $block_type->supports['__experimentalStyle'] );
			}

			if (
				isset( $block_type->supports['spacing']['blockGap']['__experimentalDefault'] ) &&
				! isset( $config['styles']['blocks'][ $block_name ]['spacing']['blockGap'] )
			) {
				/*
				 * Ensure an empty placeholder value exists for the block, if it provides a default blockGap value.
				 * The real blockGap value to be used will be determined when the styles are rendered for output.
				 */
				$config['styles']['blocks'][ $block_name ]['spacing']['blockGap'] = null;
			}
		}

		$theme_json = new JSONData( $config, 'blocks' );

		/*
		 * Backward compatibility for extenders returning a WP_Theme_JSON_Data
		 * compatible class that is not a WP_Theme_JSON_Data object.
		 */
		if ( $theme_json instanceof JSONData ) {
			static::$blocks = $theme_json->get_theme_json();
		} else {
			$config         = $theme_json->get_data();
			static::$blocks = new JSON( $config, 'blocks' );
		}

		return static::$blocks;
	}

	/**
	 * Returns the style variations defined by the theme.
	 *
	 * @since 6.0.0
	 * @since 6.2.0 Returns parent theme variations if theme is a child.
	 * @since 6.6.0 Added configurable scope parameter to allow filtering
	 *              theme.json partial files by the scope to which they
	 *              can be applied e.g. theme vs block etc.
	 *              Added basic caching for read theme.json partial files.
	 *
	 * @param string $scope The scope or type of style variation to retrieve e.g. theme, block etc.
	 * @return array
	 */
	public static function get_style_variations( $scope = 'theme' ) {
		$variation_files    = array();
		$variations         = array();
		$base_directory     = get_stylesheet_directory() . '/styles';
		$template_directory = get_template_directory() . '/styles';
		if ( is_dir( $base_directory ) ) {
			$variation_files = static::recursively_iterate_json( $base_directory );
		}
		if ( is_dir( $template_directory ) && $template_directory !== $base_directory ) {
			$variation_files_parent = static::recursively_iterate_json( $template_directory );
			// If the child and parent variation file basename are the same, only include the child theme's.
			foreach ( $variation_files_parent as $parent_path => $parent ) {
				foreach ( $variation_files as $child_path => $child ) {
					if ( basename( $parent_path ) === basename( $child_path ) ) {
						unset( $variation_files_parent[ $parent_path ] );
					}
				}
			}
			$variation_files = array_merge( $variation_files, $variation_files_parent );
		}
		ksort( $variation_files );
		foreach ( $variation_files as $path => $file ) {
			$decoded_file = self::read_json_file( $path );
			if ( is_array( $decoded_file ) && static::style_variation_has_scope( $decoded_file, $scope ) ) {
				$translated = static::translate( $decoded_file, wp_get_theme()->get( 'TextDomain' ) );
				$variation  = ( new JSON( $translated ) )->get_raw_data();
				if ( empty( $variation['title'] ) ) {
					$variation['title'] = basename( $path, '.json' );
				}
				$variations[] = $variation;
			}
		}
		return $variations;
	}

	/**
	 * Determines if a supplied style variation matches the provided scope.
	 *
	 * For backwards compatibility, if a variation does not define any scope
	 * related property, e.g. `blockTypes`, it is assumed to be a theme style
	 * variation.
	 *
	 * @since 6.6.0
	 *
	 * @param array  $variation Theme.json shaped style variation object.
	 * @param string $scope     Scope to check e.g. theme, block etc.
	 * @return boolean
	 */
	private static function style_variation_has_scope( $variation, $scope ) {
		if ( 'block' === $scope ) {
			return isset( $variation['blockTypes'] );
		}

		if ( 'theme' === $scope ) {
			return ! isset( $variation['blockTypes'] );
		}

		return false;
	}

	/**
	 * Returns an array of all nested JSON files within a given directory.
	 *
	 * @since 6.2.0
	 *
	 * @param string $dir The directory to recursively iterate and list files of.
	 * @return array The merged array.
	 */
	private static function recursively_iterate_json( $dir ) {
		$nested_files      = new \RecursiveIteratorIterator( new \RecursiveDirectoryIterator( $dir ) );
		$nested_json_files = iterator_to_array( new \RegexIterator( $nested_files, '/^.+\.json$/i', \RecursiveRegexIterator::GET_MATCH ) );
		return $nested_json_files;
	}

	/**
	 * When given an array, this will remove any keys with the name `//`.
	 *
	 * @since 6.1.0
	 *
	 * @param array $input_array The array to filter.
	 * @return array The filtered array.
	 */
	private static function remove_json_comments( $input_array ) {
		unset( $input_array['//'] );
		foreach ( $input_array as $k => $v ) {
			if ( is_array( $v ) ) {
				$input_array[ $k ] = static::remove_json_comments( $v );
			}
		}

		return $input_array;
	}
	
	/**
     * Adds variations sourced from block style variations files to the supplied theme.json data.
     *
     * @since 6.6.0
     *
     * @param array $data       Array following the theme.json specification.
     * @param array $variations Shared block style variations.
     * @return array Theme json data including shared block style variation definitions.
     */
	private static function inject_variations_from_block_style_variation_files( $data, $variations ) {
		if ( empty( $variations ) ) {
			return $data;
		}

		foreach ( $variations as $variation ) {
			if ( empty( $variation['styles'] ) || empty( $variation['blockTypes'] ) ) {
				continue;
			}

			$variation_name = $variation['slug'] ?? _wp_to_kebab_case( $variation['title'] );

			foreach ( $variation['blockTypes'] as $block_type ) {
				// First, override partial styles with any top-level styles.
				$top_level_data = $data['styles']['variations'][ $variation_name ] ?? array();
				if ( ! empty( $top_level_data ) ) {
					$variation['styles'] = array_replace_recursive( $variation['styles'], $top_level_data );
				}

				// Then, override styles so far with any block-level styles.
				$block_level_data = $data['styles']['blocks'][ $block_type ]['variations'][ $variation_name ] ?? array();
				if ( ! empty( $block_level_data ) ) {
					$variation['styles'] = array_replace_recursive( $variation['styles'], $block_level_data );
				}

				$path = array( 'styles', 'blocks', $block_type, 'variations', $variation_name );
				_wp_array_set( $data, $path, $variation['styles'] );
			}
		}

		return $data;
	}

	/**
	 * Adds variations sourced from the block styles registry to the supplied theme.json data.
	 *
	 * @since 6.6.0
	 *
	 * @param array $data Array following the theme.json specification.
	 * @return array Theme json data including shared block style variation definitions.
	 */
	private static function inject_variations_from_block_styles_registry( $data ) {
		$registry = \WP_Block_Styles_Registry::get_instance();
		$styles   = $registry->get_all_registered();

		foreach ( $styles as $block_type => $variations ) {
			foreach ( $variations as $variation_name => $variation ) {
				if ( empty( $variation['style_data'] ) ) {
					continue;
				}

				// First, override registry styles with any top-level styles.
				$top_level_data = $data['styles']['variations'][ $variation_name ] ?? array();
				if ( ! empty( $top_level_data ) ) {
					$variation['style_data'] = array_replace_recursive( $variation['style_data'], $top_level_data );
				}

				// Then, override styles so far with any block-level styles.
				$block_level_data = $data['styles']['blocks'][ $block_type ]['variations'][ $variation_name ] ?? array();
				if ( ! empty( $block_level_data ) ) {
					$variation['style_data'] = array_replace_recursive( $variation['style_data'], $block_level_data );
				}

				$path = array( 'styles', 'blocks', $block_type, 'variations', $variation_name );
				_wp_array_set( $data, $path, $variation['style_data'] );
			}
		}

		return $data;
	}

	/**
	 * Stringify the array data.
	 *
	 * $data is an array of data to be converted to a JSON string.
     *
	 * @return string JSON string.
	 */
	public static function stringify( $data ) {
		$data = wp_json_encode( $data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE );
		// Convert spaces to tabs.
		return preg_replace( '~(?:^|\G)\h{4}~m', "\t", $data );
	}

	/**
	 * Get the theme file contents.
	 *
	 * @return array
	 */
	public static function get_theme_file_contents(): array {
		$theme_json_data = static::read_json_file( static::get_file_path_from_theme( 'theme.json' ) );
		return $theme_json_data;
	}

	/**
	 * Write the theme file contents.
	 *
	 * @param [type] $theme_json_data The theme json data to write.
	 * @return void
	 */
	public static function write_theme_file_contents( $theme_json_data ): void {
		$theme_json = wp_json_encode( $theme_json_data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE );
		file_put_contents( static::get_file_path_from_theme( 'theme.json' ), $theme_json );
		static::clean_cached_data();
	}

	/**
	 * Write the user settings.
	 *
	 * @param [type] $user_settings The user settings to write.
	 * @return void
	 */
	public static function write_user_settings( $user_settings ): void {
		$global_styles_id = static::get_user_global_styles_post_id();
		$request          = new \WP_REST_Request( 'POST', '/wp/v2/global-styles/' . $global_styles_id );
		$request->set_param( 'settings', $user_settings );
		rest_do_request( $request );
		static::clean_cached_data();
	}

	/**
	 * Clean the cached data.
	 *
	 * @return void
	 */
	public static function clean_cached_data(): void {
		parent::clean_cached_data();

		if ( class_exists( 'WP_Theme_JSON_Resolver_Gutenberg' ) ) {
			\WP_Theme_JSON_Resolver_Gutenberg::clean_cached_data();
		}

		// TODO: Clearing the cache should clear this too.
		// Does this clear the Gutenberg equivalent?
		static::$theme_json_file_cache = array();
	}

	/**
	 * Resolves relative paths in theme.json styles to theme absolute paths
	 * and merges them with incoming theme JSON.
	 *
	 * @since 6.6.0
	 *
	 * @param JSON $theme_json A theme json instance.
	 * @return JSON Theme merged with resolved paths, if any found.
	 */
	public static function resolve_theme_file_uris( $theme_json ) {
		$resolved_urls = static::get_resolved_theme_uris( $theme_json );
		if ( empty( $resolved_urls ) ) {
			return $theme_json;
		}

		$resolved_theme_json_data = $theme_json->get_raw_data();

		foreach ( $resolved_urls as $resolved_url ) {
			$path = explode( '.', $resolved_url['target'] );
			_wp_array_set( $resolved_theme_json_data, $path, $resolved_url['href'] );
		}

		return new JSON( $resolved_theme_json_data );
	}
}
