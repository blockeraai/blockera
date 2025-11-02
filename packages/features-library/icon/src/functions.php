<?php

if ( ! function_exists('blockera_block_has_icon')) {
	/**
	 * Check if the block has an icon.
	 * 
	 * @param array $block The block.
	 * 
	 * @return bool true if the block has an icon, false otherwise.
	 */
	function blockera_block_has_icon( array $block): bool {
		$has_class = str_contains($block['attrs']['className'] ?? '', 'blockera-has-icon');
		$has_icon  = isset($block['attrs']['blockeraIcon']['value']) && ! empty($block['attrs']['blockeraIcon']['value']);

		return $has_class && $has_icon;
	}
}
