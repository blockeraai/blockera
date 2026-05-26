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
