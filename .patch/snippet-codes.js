/**
 * Returns list of blocks that have customized selectors excluding the Blockera ones.
 *
 * This function is used in `/packages/blocks/core/test/customized-selector.blocks.e2e.cy.js`
 * for creating the cache of blocks with customized selectors.
 */
function blockTypesWithCustomizedSelectorsNoneBlockera() {
	let blocks = {};

	wp.data
		.select('core/blocks')
		.getBlockTypes()
		.filter((block) => {
			if (Array.isArray(block.selectors)) {
				return false;
			}

			const selectors = Object.fromEntries(
				Object.entries(block.selectors).filter(
					([key]) => !key.startsWith('blockera')
				)
			);

			if (Object.keys(selectors).length > 0) {
				blocks[block.name] = selectors;
			}

			return false;
		});

	return blocks;
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
