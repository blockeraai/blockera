<?php

if (! function_exists('bdd')) {
	/**
	 * Debug function to display data in a browser.
	 *
	 * @param mixed $data The data to display.
	 *
	 * @return void
	 */
	function bdd( $data) {
		/* @debug-ignore */
		var_dump($data);
		/* @debug-ignore */
		die();
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

if (! function_exists('blockera_is_skip_request')) {

	/**
	 * Check if the request is a REST request or a POST request.
	 *
	 * @return bool
	 */
	function blockera_is_skip_request(): bool {

		return ( defined('REST_REQUEST') && REST_REQUEST ) || ( isset($_SERVER['REQUEST_METHOD']) && 'POST' === $_SERVER['REQUEST_METHOD'] );
	}
}

if (! function_exists('blockera_is_frontend_request')) {
	
	/**
	 * Check if the request is a frontend request.
	 *
	 * @return bool true on success, false otherwise.
	 */
	function blockera_is_frontend_request(): bool {

		return ! is_admin() && ! wp_is_json_request();
	}
}

if (! function_exists('blockera_is_editor_request')) {
	
	/**
	 * Check if the request is an editor request.
	 *
	 * @return bool true on success, false otherwise.
	 */
	function blockera_is_editor_request(): bool {
		$pattern           = '/\/wp-admin\/(post|site-editor|post-new)\.php/i';
		$is_editor_request = preg_match($pattern, $_SERVER['REQUEST_URI'] ?? '');

		return $is_editor_request || wp_is_json_request();
	}
}

if (! function_exists('blockera_is_admin_request')) {
	
	/**
	 * Check if the request is an admin request.
	 * 
	 * @param bool $include_admin_page flag to include the admin page. Default is true.
	 *
	 * @return bool true on success, false otherwise.
	 */
	function blockera_is_admin_request( bool $include_admin_page = true): bool {

		$admin_page = '/wp-admin/admin.php?page=blockera-settings';

		// If not include the admin page, return the is_admin() function result.
		if (! $include_admin_page) {
			return is_admin();
		}

		return is_admin() || str_starts_with($_SERVER['REQUEST_URI'] ?? '', $admin_page);
	}
}

if (! function_exists('blockera_regex_pseudo_class_functions_pattern')) {
	
	/**
	 * Get the regex pattern for pseudo-class functions.
	 * Like :is(), :where(), :not(), etc.
	 * These functions can contain multiple selectors separated by commas.
	 * 
	 * @param bool $close_parenthesis_flag flag to close the parenthesis.
	 * @example blockera_regex_pseudo_class_functions_pattern(true) => '/:(\w+(?:-\w+|))\s*\([^)]+\)/'
	 * @example blockera_regex_pseudo_class_functions_pattern(false) => '/:(\w+(?:-\w+|))\s*\(/'
	 *
	 * @return string the regex pattern.
	 */
	function blockera_regex_pseudo_class_functions_pattern( bool $close_parenthesis_flag = true): string {
			
		if ($close_parenthesis_flag) {
			return '/:(\w+(?:-\w+|))\s*\([^)]+\)/';
		}
		
		return '/:(\w+(?:-\w+|))\s*\(/';
	}
}
