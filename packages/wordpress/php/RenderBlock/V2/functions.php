<?php

if (! function_exists('blockera_block_is_query')) {
	
	/**
	 * Check if the block is a query block.
	 * 
	 * @param string $block_name The name of the block.
	 *
	 * @return bool true on success, false otherwise.
	 */
	function blockera_block_is_query( string $block_name): bool {

		if (empty($block_name)) {
			return false;
		}

		$blocks = [
			'core/term-template',
		];

		return in_array($block_name, $blocks, true);
	}
}
