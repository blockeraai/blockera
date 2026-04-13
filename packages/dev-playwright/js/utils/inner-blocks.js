/**
 * Inner blocks helper utilities for Playwright e2e tests.
 */

const { getSelectedBlock } = require('./editor');

/**
 * Set parent block.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @return {Promise<void>}
 */
async function setParentBlock(page) {
	await page.locator('.blockera-extension-block-card__close').click();
}

/**
 * Set inner block.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string} blockType - Block type to add.
 * @return {Promise<void>}
 */
async function setInnerBlock(page, blockType) {
	const repeaterBlock = page.locator(
		`.blockera-control-repeater div[data-id="${blockType}"]`
	);

	if ((await repeaterBlock.count()) > 0) {
		await page
			.locator(`[data-id="${blockType}"]`)
			.locator('span')
			.click({ force: true });
	} else {
		await openInserter(page);

		await page
			.locator('.blockera-component-popover')
			.last()
			.locator(`[aria-label="${blockType}"]`)
			.click({ force: true });
	}
}

/**
 * Get allowed blocks for selected block.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @return {Promise<Array>} Array of allowed block types.
 */
async function getAllowedBlocks(page) {
	const selectedBlock = await getSelectedBlock(page);
	return await page.evaluate(
		({ clientId }) => {
			return window.wp.data
				.select('core/block-editor')
				.getAllowedBlocks(clientId);
		},
		{ clientId: selectedBlock.clientId }
	);
}

/**
 * Get block type inner blocks store.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @return {Promise<any>} Inner blocks store data.
 */
async function getBlockTypeInnerBlocksStore(page) {
	const selectedBlock = await getSelectedBlock(page);
	return await page.evaluate(
		({ clientId }) => {
			return window.wp.data
				.select('blockera/extensions')
				.getBlockInners(clientId);
		},
		{ clientId: selectedBlock.clientId }
	);
}

/**
 * Search in inner blocks inserter.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string} term - Search term.
 * @return {Promise<void>}
 */
async function search(page, term) {
	await page.locator('[data-id="search bar"]').fill(term);
}

/**
 * Check selected inner block.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string} blockTitle - Block title to check.
 * @param {boolean} exist - Whether block should exist.
 * @return {Promise<void>}
 */
async function checkSelectedInnerBlock(page, blockTitle, exist = true) {
	const blockCard = page
		.locator('[data-testid="blockera-inner-block-card"]')
		.filter({ hasText: blockTitle });

	if (exist) {
		await blockCard.waitFor({ state: 'visible' });
	} else {
		await expect(
			page.locator('[data-testid="blockera-inner-block-card"]')
		).not.toBeVisible();
	}
}

/**
 * Open inserter for inner blocks.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @return {Promise<void>}
 */
async function openInserter(page) {
	const statesContainer = page
		.locator('[aria-label="Blockera Block State Container"]')
		.last();

	await statesContainer
		.locator('[data-test="add-new-block-state"]')
		.click({ force: true });

	const popover = page.locator('.blockera-component-popover');
	if ((await popover.count()) === 0) {
		await statesContainer
			.locator('[data-test="add-new-block-state"]')
			.click({ force: true });
	}
}

module.exports = {
	setParentBlock,
	setInnerBlock,
	getAllowedBlocks,
	getBlockTypeInnerBlocksStore,
	search,
	checkSelectedInnerBlock,
	openInserter,
};
