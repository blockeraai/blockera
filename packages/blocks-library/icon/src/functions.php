<?php

if (! function_exists('blockera_is_icon_block')) {
	/**
	 * Check if the block is an icon block.
	 * 
	 * @param array $block The block.
	 * 
	 * @return bool true if the block is an icon block, false otherwise.
	 */
	function blockera_is_icon_block( array $block): bool {
		$is_image  = 'core/image' === $block['blockName'];
		$has_class = str_contains($block['attrs']['className'] ?? '', 'blockera-is-icon-block');

		return $is_image && $has_class;
	}
}
