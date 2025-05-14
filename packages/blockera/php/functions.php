<?php
/**
 * The functions blockera app.
 *
 * @package functions.php
 */

use Blockera\Utils\Env;
use Blockera\Utils\Utils;

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
        if (! $key) {
            return false;
        }

        // Create cache key based on input parameters.
        $cache_key           = md5($key . serialize($args));
        static $config_cache = [];

        // Return cached result if available.
        if (isset($config_cache[ $cache_key ])) {
            return $config_cache[ $cache_key ];
        }

        $keyNodes = explode('.', $key);

        // Cache config directory and files mapping.
        static $mapped_configs = [];
        $config_dir            = ! empty($args['root']) && file_exists($args['root']) ? $args['root'] : BLOCKERA_SB_PATH;
        
        if (! isset($mapped_configs[ $config_dir ])) {
            $config_files                  = glob($config_dir . '/config/*.php');
            $config_keys                   = array_map(
                function ( string $file): string {
                    return Utils::camelCase(str_replace('.php', '', basename($file)));
                },
                $config_files
            );
            $mapped_configs[ $config_dir ] = array_combine($config_keys, $config_files);
        }

        $firstNode = array_shift($keyNodes);

        if (! isset($mapped_configs[ $config_dir ][ $firstNode ])) {
            $config_cache[ $cache_key ] = false;
            return false;
        }

        $config = require $mapped_configs[ $config_dir ][ $firstNode ];

        foreach ($keyNodes as $node) {
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
        $file = str_replace('.', DIRECTORY_SEPARATOR, $path) . '.php';

        $filename = ( empty($baseDir) ? __DIR__ : $baseDir ) . '/' . $file;

        if (! file_exists($filename)) {

            return false;
        }

        // phpcs:ignore
        extract($params);

        return include $filename;
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
        global $blockeraApp;

        if (is_numeric($value)) {
            return $value;
        }

        if (is_string($value)) {
            return substr($value, -4) === 'func' ? substr($value, 0, -4) : $value;
        }

        if (is_array($value) && ! empty($value['isValueAddon']) && ! empty($value['valueType'])) {

            if ('dynamic-value' === $value['valueType'] && blockera_get_experimental([ 'data', 'dynamicValue' ])) {

                $valueAddons = $blockeraApp->getRegisteredValueAddons($value['valueType']);

                if (empty($valueAddons)) {

                    return '';
                }

                $groupName = $value['settings']['group'];

                $groupItems = $valueAddons[ $groupName ]['items'];

                foreach ($groupItems as $name => $item) {

                    if ($name !== $value['name']) {

                        continue;
                    }

                    $callback = $item['properties']['callback'];

                    if (is_callable($callback)) {

                        return $callback($item['instance']);
                    }
                }
            }

            // todo validate that variable is currently available or not.
            if ('variable' === $value['valueType'] && isset($value['settings']['var'])) {
                return 'var(' . $value['settings']['var'] . ')';
            }
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

        $result = array_merge(...array_values($nestedArray));
        
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

if (! function_exists('blockera_get_array_deep_merge')) {

    /**
     * Get resulting of array deeply merge.
     *
     * @param array $array1 the source array.
     * @param array $array2 the array to merge with source array.
     *
     * @return array the merged array.
     */
    function blockera_get_array_deep_merge( array $array1, array $array2): array {

        $merged = $array1;

        foreach ($array2 as $key => $value) {

            if (is_array($value) && isset($merged[ $key ]) && is_array($merged[ $key ])) {

                $merged[ $key ] = blockera_get_array_deep_merge($merged[ $key ], $value);

            } else {

                $merged[ $key ] = $value;
            }
        }

        return $merged;
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

		add_filter(
			'blockera/front-page/print-inline-css-styles',
			function ( string $older_css ) use ( $css ): string {

				if (false !== strpos($older_css, $css)) {
					return $older_css;
				}

				return $older_css . $css;
			}
		);
	}
}

if (! function_exists('blockera_is_skip_request')) {

	/**
	 * Check if the request is a REST request.
	 *
	 * @return bool
	 */
	function blockera_is_skip_request(): bool {

		return ( defined('REST_REQUEST') && REST_REQUEST ) || ( isset($_SERVER['REQUEST_METHOD']) && 'POST' === $_SERVER['REQUEST_METHOD'] );
	}
}
