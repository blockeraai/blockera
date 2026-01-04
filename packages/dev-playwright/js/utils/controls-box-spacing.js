/**
 * Box spacing controls helper utilities for Playwright e2e tests.
 */

/**
 * Set box spacing side value.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string} side - Side name (e.g., 'top', 'right', 'bottom', 'left').
 * @param {string|number} value - Value to set (will be converted to string).
 * @return {Promise<void>}
 */
async function setBoxSpacingSide(page, side, value) {
	await openBoxSpacingSide(page, side);

	const popover = page.locator('[data-wp-component="Popover"]').last();

	await popover.locator('input[type=text]').clear({ force: true });
	await popover.locator('input[type=text]').clear({ force: true });
	// Convert value to string for fill() method
	await popover
		.locator('input[type=text]')
		.fill(String(value), { force: true });
}

/**
 * Clear box spacing side value.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string} side - Side name.
 * @return {Promise<void>}
 */
async function clearBoxSpacingSide(page, side) {
	await openBoxSpacingSide(page, side);

	const popover = page.locator('[data-wp-component="Popover"]').last();

	await popover.locator('input[type=text]').clear({ force: true });
	await popover.locator('input[type=text]').clear({ force: true });
}

/**
 * Open box spacing side popover.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string} side - Side name.
 * @param {string} element - Element type ('label' or 'shape').
 * @return {Promise<void>}
 */
async function openBoxSpacingSide(page, side, element = 'label') {
	// Try to close all popovers
	await page.keyboard.press('Escape');

	if (element === 'label') {
		await page
			.locator(
				`[data-cy="box-spacing-${side}"] [data-cy="label-control"]`
			)
			.click({ force: true });
	} else if (element === 'shape') {
		const spacingControl = page.locator('[data-cy="box-spacing-control"]');
		const shapeSide = spacingControl.locator(
			`path.blockera-control-spacing-shape-side.side-${side}`
		);

		await shapeSide.hover({ force: true });
		await page.waitForTimeout(1000);
		await shapeSide.click({ force: true });
	}
}

module.exports = {
	setBoxSpacingSide,
	clearBoxSpacingSide,
	openBoxSpacingSide,
};
