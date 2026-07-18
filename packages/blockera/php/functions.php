<?php
/**
 * The functions blockera app.
 *
 * @package functions.php
 */

use Blockera\Utils\Env;

if (! function_exists('blockera_core_config')) {

    /**
     * Retrieve the config with key param or return all config as array.
     *
     * @param string $key  the key of config.
     * @param array  $args the extra arguments.
     *
     * @return mixed config value.
     */
    function blockera_core_config( string $key, array $args = []) {
        // Early return for empty key (fast path).
        if (! $key) {
            return false;
        }

		/**
		 * Optimize cache key generation.
		 * - For empty args (most common case), use key directly (fastest path)
		 * - For non-empty args, build string manually (faster than md5+serialize)
		 * This avoids expensive serialize() calls while maintaining uniqueness.
		 */
        static $config_cache = [];
        
        if (empty($args)) {
            $cache_key = $key;
        } else {
            // Build cache key manually: faster than serialize for simple arrays.
            // Most common case is ['root' => ...], so optimize for that.
            if (count($args) === 1 && isset($args['root'])) {
                $cache_key = $key . '|root:' . $args['root'];
            } else {
                // For multiple args, build string (still faster than serialize).
                ksort($args);
                $parts = [];
                foreach ($args as $k => $v) {
                    $parts[] = $k . ':' . ( is_string($v) ? $v : serialize($v) );
                }
                $cache_key = $key . '|' . implode('&', $parts);
            }
        }

        // Return cached result if available (hot path - most common scenario).
        if (isset($config_cache[ $cache_key ])) {
            return $config_cache[ $cache_key ];
        }

        // Split key once and reuse.
        $keyNodes = explode('.', $key);
        $keyCount = count($keyNodes);
        
        if (0 === $keyCount) {
            return false;
        }

        // Cache config directory and files mapping.
        static $mapped_configs = [];
        $config_dir            = ! empty($args['root']) && file_exists($args['root']) ? $args['root'] : BLOCKERA_SB_PATH;
        
        if (! isset($mapped_configs[ $config_dir ])) {
            $config_files = glob($config_dir . '/config/*.php');
            if (false === $config_files) {
                $config_files = [];
            }
            
            // Optimize camelCase conversion: inline the logic to avoid function call overhead.
            // Utils::camelCase does: lcfirst(pascalCase(str_replace('.php', '', basename($file)))).
            // We inline this for better performance (avoids multiple function calls).
            $mapped = [];
            foreach ($config_files as $file) {
                $basename = basename($file, '.php');
                // Inline camelCase: split by '-', capitalize each part, join, lowercase first char.
                $parts = explode('-', $basename);
                $camel = '';
                $first = true;
                foreach ($parts as $part) {
                    if ('' !== $part) {
                        $camel .= $first ? strtolower($part) : ucfirst($part);
                        $first  = false;
                    }
                }
                $mapped[ $camel ] = $file;
            }
            $mapped_configs[ $config_dir ] = $mapped;
        }

        // Use direct array access instead of array_shift (avoids array modification overhead).
        $firstNode = $keyNodes[0];

        if (! isset($mapped_configs[ $config_dir ][ $firstNode ])) {
            $config_cache[ $cache_key ] = false;
            return false;
        }

        $config = require $mapped_configs[ $config_dir ][ $firstNode ];

        // Iterate from index 1 (skip first node already processed).
        // Use for loop instead of foreach for slightly better performance.
        for ($i = 1; $i < $keyCount; $i++) {
            $node = $keyNodes[ $i ];
            if (! isset($config[ $node ])) {
                break;
            }
            $config = $config[ $node ];
        }

        /**
         * Filterable blockera core configuration with key string.
         *
         * @since 1.0.0
         */
        $result = apply_filters(__FUNCTION__ . '.' . $key, $config, $args);
        
        // Cache the result.
        $config_cache[ $cache_key ] = $result;

        return $result;
    }
}

if (! function_exists('blockera_core_env')) {

    /**
     * Gets the value of an environment variable.
     *
     * @param string $key     the key of config.
     * @param mixed  $default the default value.
     *
     * @return mixed
     */
    function blockera_core_env( string $key, $default = null) { 
        return Env::get($key, $default);
    }
}

if (! function_exists('blockera_load')) {

    /**
     * Loading file by path and params.
     *
     * @param string $path    the path of file to load.
     * @param string $baseDir the path current base directory.
     * @param array  $params  the required params to load file data.
     *
     * @return mixed file data on success, false on otherwise!
     */
    function blockera_load( string $path, string $baseDir = '', array $params = []) { 
		static $cache = [];

        $file = str_replace('.', DIRECTORY_SEPARATOR, $path) . '.php';

        $filename = ( empty($baseDir) ? __DIR__ : $baseDir ) . '/' . $file;

		// Param-less loads (shared inners, attributes, etc.) are pure — memoize per request.
		$can_cache = [] === $params;

		if ( $can_cache && array_key_exists( $filename, $cache ) ) {
			return $cache[ $filename ];
		}

        if (! is_file($filename)) {
			if ( $can_cache ) {
				$cache[ $filename ] = false;
			}

            return false;
        }

		if ( $params ) {
			// phpcs:ignore
			extract($params);
		}

		$result = include $filename;

		if ( $can_cache ) {
			$cache[ $filename ] = $result;
		}

		return $result;
    }
}

if (! function_exists('blockera_get_value_addon_real_value')) {
    /**
     * Gets the real value that can be used (Final Value)
     *
     * @param mixed $value The addon value.
     *
     * @return mixed
     */
    function blockera_get_value_addon_real_value( $value) { 
        if (is_numeric($value)) {
            return $value;
        }

        if (is_string($value)) {
			$len = strlen($value);
			if (4 <= $len && 'func' === substr($value, -4)) {
				return substr($value, 0, -4);
			}

			if ('0px' === $value) {
				return '0';
			}

            return $value;
        }

        if (! is_array($value)) {
            return $value;
        }

        if (! isset($value['isValueAddon']) || ! $value['isValueAddon'] || ! isset($value['valueType']) || '' === $value['valueType']) {
            return $value;
        }

        $valueType = $value['valueType'];

        if ('variable' === $valueType) {

            $settings = $value['settings'];

            if (! isset($settings['var'])) {
                return $value;
            }

            $var    = $settings['var'];
            $varStr = 'var(' . $var . ')';

            if (isset($settings['value'])) {

                $settingsValue = $settings['value'];

                // Structured payloads (arrays) are not valid var() fallbacks; emit token only.
                if (is_array($settingsValue)) {
                    return $varStr;
                }

                if ('' !== $settingsValue && $varStr !== $settingsValue) {

                    $prefix = "var({$var}";

                    if (is_string($settingsValue) && str_starts_with($settingsValue, $prefix)) {
                        return $settingsValue;
                    }

                    return $prefix . ', ' . $settingsValue . ')';
                }
            }

            return $varStr;
        }

        static $dynamicValueEnabled = null;
        if (null === $dynamicValueEnabled) {
            $dynamicValueEnabled = blockera_get_experimental([ 'data', 'dynamicValue' ]);
        }

        if ('dynamic-value' === $valueType && $dynamicValueEnabled) {
            global $blockeraApp;
            $valueAddons = $blockeraApp->getRegisteredValueAddons($valueType);

            if (empty($valueAddons)) {
                return '';
            }

            $settings = $value['settings'];

            if (! isset($settings['group'])) {
                return '';
            }

            $groupName = $settings['group'];

            if (! isset($valueAddons[ $groupName ]['items'])) {
                return '';
            }

            $groupItems = $valueAddons[ $groupName ]['items'];
            $targetName = $value['name'];

            foreach ($groupItems as $name => $item) {
                if ($name !== $targetName) {
                    continue;
                }

                if (! isset($item['properties']['callback'])) {
                    break;
                }

                $callback = $item['properties']['callback'];

                if (is_callable($callback)) {
                    return $callback($item['instance']);
                }
                break;
            }
            return '';
        }

        return $value;
    }
}

if (! function_exists('blockera_get_filter_empty_array_item')) {

    /**
     * Get filter empty array item.
     *
     * @param mixed $item The any array item.
     *
     * @return bool true on success, false otherwise.
     */
    function blockera_get_filter_empty_array_item( $item): bool {

        if (is_string($item)) {

            return ! empty(trim($item));
        }

        return ! empty($item);
    }
}

if (! function_exists('blockera_array_flat')) {

    /**
     * Convert nested array (in two-level dimensions) to flat array.
     *
     * @param array $nestedArray The recieved nested array.
     *
     * @return array
     */
    function blockera_array_flat( array $nestedArray): array {

        if (empty($nestedArray)) {
            return [];
        }

        // Filter out non-array values before merging.
        $arrayValues = array_filter($nestedArray, 'is_array');
        
        if (empty($arrayValues)) {
            return [];
        }

        $result = array_merge(...array_values($arrayValues));
        
        // Handle nested arrays with same keys.
        foreach ($result as $key => $value) {
            if (is_array($value)) {
                foreach ($nestedArray as $array) {
                    if (isset($array[ $key ]) && is_array($array[ $key ])) {
                        $result[ $key ] = blockera_get_array_deep_merge($result[ $key ], $array[ $key ]);
                    }
                }
            }
        }
        
        return $result;
    }
}

if (! function_exists('blockera_get_sorted_repeater')) {

    /**
     * Sorting repeater items.
     *
     * @param array $items the repeater items.
     *
     * @return array
     */
    function blockera_get_sorted_repeater( array $items): array {

        $dataArray = [];

        foreach ($items as $key => $value) {
            $dataArray[] = $value;
        }

        usort(
            $dataArray,
            function ( $a, $b) {

                return ( $a['order'] ?? 0 ) - ( $b['order'] ?? 0 );
            }
        );

        return $dataArray;
    }
}

if (! function_exists('blockera_get_dist_assets')) {

    /**
     * Get dist directory assets array.
     *
     * @return array the dist directory assets list.
     */
    function blockera_get_dist_assets(): array {

        return array_map(
            function ( string $asset_dir): string {

                return basename($asset_dir);

            },
            glob(blockera_core_config('app.dist_path') . '*')
        );
    }
}

if (! function_exists('blockera_load_script_translations')) {
    /**
     * Load script translations.
     *
     * @param string $script The script name.
     * @return void
     */
    function blockera_load_script_translations( string $script): void {
        if (str_ends_with($script, '-styles')) {
            return;
        }

        if (! wp_script_is("@blockera/{$script}", 'registered')) {
            return;
        }

        wp_set_script_translations( "@blockera/{$script}", 'blockera', BLOCKERA_SB_PATH . '/languages' );
    }
}

if (! function_exists('blockera_get_filesystem')) {
	/**
	 * Get the WordPress file system. 
	 *
	 * @return WP_Filesystem_Base|null
	 */
	function blockera_get_filesystem(): ?WP_Filesystem_Base{
		global $wp_filesystem;

		if (! $wp_filesystem) {
			require_once(ABSPATH . '/wp-admin/includes/file.php');

			WP_Filesystem();
		}

		return $wp_filesystem;
	}
}

if ( ! function_exists( 'blockera_add_inline_css' ) ) {

	/**
	 * Adding computed css rules into inline css handle.
	 *
	 * @param string $css the provided css from outside.
	 *
	 * @return void
	 */
	function blockera_add_inline_css( string $css ): void {

		if ( empty( $css ) ) {

			return;
		}

		// Normalize CSS: remove extra whitespace and format for readability.
		$css = preg_replace('/\s+/', ' ', $css); // Replace multiple spaces with single space.
		$css = preg_replace('/\s*{\s*/', ' {' . "\n\t", $css); // Format opening braces.
		$css = preg_replace('/\s*}\s*/', "\n" . '}' . "\n\n", $css); // Format closing braces.
		$css = preg_replace('/\s*;\s*/', ';' . "\n\t", $css); // Format semicolons.
		$css = preg_replace('/\s*,\s*/', ', ', $css); // Format commas in selectors.
		$css = preg_replace('/\t}/', '}', $css); // Remove tab before closing brace.
		$css = trim($css); // Remove leading/trailing whitespace.

		add_filter(
			'blockera/front-page/print-inline-css-styles',
			function ( string $older_css ) use ( $css ): string {

				// Prevent duplicate CSS rules.
				if ( false !== strpos( $older_css, $css ) ) {
					return $older_css;
				}

				// Append new CSS with proper formatting.
				return trim($older_css) . "\n" . trim($css);
			}
		);
	}
}

if (! function_exists('blockera_enqueue_global_styles')) {
	/**
	 * Enqueues the global styles defined via theme.json.
	 * Enqueueing the blockera global styles.
	 * 
	 * @see wp-includes/script-loader.php.
	 *
	 * @return void
	 */
	function blockera_enqueue_global_styles(): void {

		$assets_on_demand = wp_should_load_block_assets_on_demand();
		$is_block_theme   = wp_is_block_theme();
		$is_classic_theme = ! $is_block_theme;

		/*
		* Global styles should be printed in the head for block themes, or for classic themes when loading assets on
		* demand is disabled, which is the default.
		* The footer should only be used for classic themes when loading assets on demand is enabled.
		*
		* See https://core.trac.wordpress.org/ticket/53494 and https://core.trac.wordpress.org/ticket/61965.
		*/
		if (
			( $is_block_theme && doing_action( 'wp_footer' ) ) ||
			( $is_classic_theme && doing_action( 'wp_footer' ) && ! $assets_on_demand ) ||
			( $is_classic_theme && doing_action( 'wp_enqueue_scripts' ) && $assets_on_demand )
		) {
			return;
		}

		/*
		* If loading the CSS for each block separately, then load the theme.json CSS conditionally.
		* This removes the CSS from the global-styles stylesheet and adds it to the inline CSS for each block.
		* This filter must be registered before calling wp_get_global_stylesheet();
		*/
		add_filter( 'wp_theme_json_get_style_nodes', 'wp_filter_out_block_nodes' );

		$stylesheet = blockera_get_global_stylesheet();

		if ( $is_block_theme ) {
			/*
			* Dequeue the Customizer's custom CSS
			* and add it before the global styles custom CSS.
			*/
			remove_action( 'wp_head', 'wp_custom_css_cb', 101 );

			/*
			* Get the custom CSS from the Customizer and add it to the global stylesheet.
			* Always do this in Customizer preview for the sake of live preview since it be empty.
			*/
			$custom_css = trim( wp_get_custom_css() );
			if ( $custom_css || is_customize_preview() ) {
				if ( is_customize_preview() ) {
					/*
					* When in the Customizer preview, wrap the Custom CSS in milestone comments to allow customize-preview.js
					* to locate the CSS to replace for live previewing. Make sure that the milestone comments are omitted from
					* the stored Custom CSS if by chance someone tried to add them, which would be highly unlikely, but it
					* would break live previewing.
					*/
					$before_milestone = '/*BEGIN_CUSTOMIZER_CUSTOM_CSS*/';
					$after_milestone  = '/*END_CUSTOMIZER_CUSTOM_CSS*/';
					$custom_css       = str_replace( array( $before_milestone, $after_milestone ), '', $custom_css );
					$custom_css       = $before_milestone . "\n" . $custom_css . "\n" . $after_milestone;
				}
				$custom_css = "\n" . $custom_css;
			}
			$stylesheet .= $custom_css;

			// Add the global styles custom CSS at the end.
			$stylesheet .= blockera_get_global_stylesheet( array( 'custom-css' ) );
		}

		if ( empty( $stylesheet ) ) {
			return;
		}

		wp_register_style( 'global-styles', false );
		wp_add_inline_style( 'global-styles', $stylesheet );
		wp_enqueue_style( 'global-styles' );
		
		blockera_add_global_styles_for_blocks();
	}
}

if (! function_exists('blockera_sort_css_by_block_number')) {
	/**
	 * Sort CSS array based on blockera-block-{number} in CSS strings.
	 * It's used for development purposes to ensure the CSS is sorted by block number.
	 *
	 * @param array $css_array Array of CSS strings containing blockera-block-{number}.
	 * @return array Sorted CSS array.
	 */
	function blockera_sort_css_by_block_number( array $css_array): array {
		usort(
            $css_array,
            function( $a, $b) {
				// Extract block number from first CSS string.
				preg_match('/blockera-block-(\d+)/', $a, $matches_a);
				$number_a = isset($matches_a[1]) ? (int) $matches_a[1] : PHP_INT_MAX;
			
				// Extract block number from second CSS string.
				preg_match('/blockera-block-(\d+)/', $b, $matches_b);
				$number_b = isset($matches_b[1]) ? (int) $matches_b[1] : PHP_INT_MAX;
			
				// Compare the numbers.
				return $number_a <=> $number_b;
			}
        );
		
		return $css_array;
	}
}
