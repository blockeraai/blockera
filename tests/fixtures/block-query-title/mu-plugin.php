<?php
/**
 * Temporary mu-plugin for query-title block testing.
 * This file is automatically loaded by WordPress on every request.
 */

// Step 1: Add pre_render_block filter to mock is_search()
// This temporarily modifies the main query only during query-title block rendering
add_filter(
	'pre_render_block',
	function( $pre_render, $parsed_block, $parent_block ) {
		// Only process query-title blocks with search context.
		if ( ! isset( $parsed_block['blockName'] ) || 'core/query-title' !== $parsed_block['blockName'] ) {
			return $pre_render;
		}

		global $wp_query;
		
		// Temporarily set search query var to make is_search() return true.
		$wp_query->set( 's', 'search term' );
		$wp_query->is_search = true;

		return $pre_render;
	},
	10,
	3
);

// Step 2: Mock get_search_query() to return the static search query from context.
// This provides the search term for the original WordPress render function.
add_filter(
	'get_search_query',
	function() {
		return 'search term';
	},
	10,
	1
);

