/**
 * Block states helper utilities for Playwright e2e tests.
 */

/**
 * Add block state.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string} state - State name to add.
 * @return {Promise<void>}
 */
async function addBlockState(page, state) {
	await openInserter(page);

	await page
		.locator('.blockera-component-popover')
		.last()
		.locator(`[aria-label="${state}"]`)
		.click({ force: true });
}

/**
 * Open inserter for block states.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @return {Promise<void>}
 */
async function openInserter(page) {
	const statesContainer = page
		.locator('[aria-label="Blockera Block State Container"]')
		.last();

	await statesContainer
		.locator('[data-testid="add-new-block-state"]')
		.click({ force: true });

	const popover = page.locator('.blockera-component-popover');
	if ((await popover.count()) === 0) {
		await statesContainer
			.locator('[data-testid="add-new-block-state"]')
			.click({ force: true });
	}
}

/**
 * Set block state.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string} state - State name.
 * @param {string} blockType - Block type ('master-block' or other).
 * @return {Promise<void>}
 */
async function setBlockState(page, state, blockType) {
	const containerSelector =
		blockType === 'master-block'
			? '[aria-label="Blockera Block State Container"]'
			: '[aria-label="Blockera Block State Container"]';

	const container = page.locator(containerSelector).first();

	await container
		.locator('[data-cy="group-control-header"]')
		.filter({ hasText: state })
		.click({ force: true });
}

/**
 * Reset block state.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string} state - State name.
 * @param {string} blockType - Block type ('master-block' or other).
 * @return {Promise<void>}
 */
async function resetBlockState(page, state, blockType) {
	const containerSelector =
		blockType === 'master-block'
			? '[aria-label="Blockera Block State Container"]'
			: '[aria-label="Blockera Block State Container"]';

	const container = page.locator(containerSelector).first();

	const stateHeader = container
		.locator('[data-cy="group-control-header"]')
		.filter({ hasText: state });

	await stateHeader
		.locator('..')
		.locator('..')
		.locator('[aria-label="More Options"]')
		.click({
			force: true,
		});

	await page
		.locator('.components-popover__content')
		.last()
		.locator('[data-testid="reset-button"]')
		.click({ force: true });
}

/**
 * Check current state.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string} id - State ID.
 * @return {Promise<void>}
 */
async function checkCurrentState(page, id) {
	const container = page
		.locator('[data-testid="blockera-block-state-container"]')
		.last();

	await container.locator(`[data-id="${id}"]`).waitFor();

	const controlGroup = container
		.locator(`[data-id="${id}"]`)
		.locator('[data-cy="control-group"]');

	await expect(controlGroup).toHaveClass(/is-selected-item/);
}

/**
 * Check block card labels.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {Array<Object>} labels - Array of label objects with label and text.
 * @param {string} blockCard - Block card type ('inner-block' or 'master-block').
 * @return {Promise<void>}
 */
async function checkBlockCard(page, labels, blockCard = 'master-block') {
	const cardIndex = blockCard === 'master-block' ? 0 : 1;
	const card = page.locator('.blockera-extension-block-card').nth(cardIndex);

	for (const label of labels) {
		const labelElement = card.locator(`[aria-label="${label.label}"]`);
		await expect(labelElement).toHaveText(label.text);
	}
}

module.exports = {
	addBlockState,
	openInserter,
	setBlockState,
	resetBlockState,
	checkCurrentState,
	checkBlockCard,
};
