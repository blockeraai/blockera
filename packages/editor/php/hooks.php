<?php
/**
 * Blockera editor apply hooks.
 *
 * @package blockera/editor
 */

add_filter(
    'admin_body_class',
    function ( string $classes): string {

		$screen = get_current_screen();

		if (! $screen) {
			return $classes;
		}

		if ($screen->is_block_editor() || 'site-editor' === $screen->base) {
			$classes .= ' blockera-editor';
		}

		return $classes;
	}
);
