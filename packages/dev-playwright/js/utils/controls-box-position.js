/**
 * Box position controls helper utilities for Playwright e2e tests.
 */

/**
 * Set box position side value.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string} side - Side name (e.g., 'top', 'right', 'bottom', 'left').
 * @param {string} value - Value to set.
 * @return {Promise<void>}
 */
async function setBoxPositionSide(page, side, value) {
	await openBoxPositionSide(page, side);

	const popover = page.locator('[data-wp-component="Popover"]').last();

	await popover.locator('input[type=text]').clear({ force: true });
	await popover.locator('input[type=text]').fill(value, { force: true });
}

/**
 * Clear box position side value.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string} side - Side name.
 * @return {Promise<void>}
 */
async function clearBoxPositionSide(page, side) {
	await openBoxPositionSide(page, side);

	const popover = page.locator('[data-wp-component="Popover"]').last();

	await popover.locator('input[type=text]').clear({ force: true });
}

/**
 * Open box position side popover.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string} side - Side name.
 * @return {Promise<void>}
 */
async function openBoxPositionSide(page, side) {
	// Try to close all popovers
	await page.keyboard.press('Escape');

	await page
		.locator(
			`[data-cy="box-position-label-${side}"] [data-cy="label-control"]`
		)
		.click({ force: true });
}

module.exports = {
	setBoxPositionSide,
	clearBoxPositionSide,
	openBoxPositionSide,
};
