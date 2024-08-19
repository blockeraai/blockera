/**
 * Returns list of blocks that have customized selectors excluding the Blockera ones.
 */
function blockTypesWithCustomizedSelectorsNoneBlockera() {
	return wp.data
		.select('core/blocks')
		.getBlockTypes()
		.filter((block) => {
			if (Array.isArray(block.selectors)) {
				return false;
			}

			const selectors = Object.fromEntries(
				Object.entries(block.selectors).filter(
					([key]) => !key.startsWith('blockera/')
				)
			);

			return Object.keys(selectors).length > 0;
		});
}

/**
 * Returns list of blocks that have customized selectors.
 */
function blockTypesWithCustomizedSelectors() {
	return wp.data
		.select('core/blocks')
		.getBlockTypes()
		.filter((block) => !Array.isArray(block.selectors));
}
