<?php
/**
 * Temporary mu-plugin for post-excerpt block testing.
 * This file is automatically loaded by WordPress on every request.
 * Overrides the render callback to check if excerptLength is 55 and remove it.
 *
 * @phpstan-ignore-next-line
 */

/**
 * Custom render callback for post-excerpt block.
 * Checks if excerptLength is 55 and removes it if so.
 *
 * @param array    $attributes Block attributes.
 * @param string   $content    Block content.
 * @param WP_Block $block      Block instance.
 * @return string Rendered block output.
 */
function blockera_render_block_core_post_excerpt( $attributes, $content, $block ) {
	// Check if excerptLength is 55 and remove it.
	if ( isset( $attributes['excerptLength'] ) && 55 === $attributes['excerptLength'] ) {
		$attributes['excerptLength'] = null;
	}

	// Get the original render callback.
	$original_render_callback = 'render_block_core_post_excerpt';

	// Call the original render function with modified attributes.
	if ( function_exists( $original_render_callback ) ) {
		return $original_render_callback( $attributes, $content, $block );
	}

	// Fallback if original function doesn't exist.
	return '';
}

/**
 * Manually override the render callback for core/post-excerpt block.
 * This function directly modifies the registered block type object,
 * which works even when called after blocks are registered.
 */
function blockera_override_post_excerpt_render_callback() {
	if ( ! class_exists( 'WP_Block_Type_Registry' ) ) {
		return;
	}

	/** @phpstan-ignore-next-line */
	$block_registry = WP_Block_Type_Registry::get_instance();
	
	// Check if block is registered
	if ( ! $block_registry->is_registered( 'core/post-excerpt' ) ) {
		return;
	}

	// Get the registered block type object
	/** @phpstan-ignore-next-line */
	$block_type = $block_registry->get_registered( 'core/post-excerpt' );
	
	// Directly modify the render_callback property
	if ( $block_type && is_object( $block_type ) ) {
		$block_type->render_callback = 'blockera_render_block_core_post_excerpt';
	}
}

// Try to override immediately if blocks are already registered
/** @phpstan-ignore-next-line */
if ( function_exists( 'did_action' ) && did_action( 'init' ) ) {
	blockera_override_post_excerpt_render_callback();
} else {
	// Hook into init with late priority to ensure blocks are registered
	add_action( 'init', 'blockera_override_post_excerpt_render_callback', 9999 );
	
	// Also try the filter as a fallback (though it may run too late)
	add_filter(
		'register_block_type_args',
		function( $args, $block_type ) {
			if ( 'core/post-excerpt' === $block_type ) {
				$args['render_callback'] = 'blockera_render_block_core_post_excerpt';
			}
			return $args;
		},
		100,
		2
	);
}
