<?php

add_filter( 'block_categories_all', 'blockera_add_block_category', 10 );

if (! function_exists('blockera_add_block_category')) {
	/**
	 * Add a new category for Blockera blocks. at the top of the list.
	 *
	 * @param array $categories Array of block categories.
	 * 
	 * @return array Array of block categories.
	 */
	function blockera_add_block_category( array $categories) {

		array_unshift(
            $categories,
            array(
				'slug'	=> 'blockera',
				'title' => __('Blockera Blocks', 'blockera'),
            ) 
        );

		return $categories;
	}
}
