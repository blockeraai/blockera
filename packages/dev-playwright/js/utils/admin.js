/**
 * Admin helper utilities for Playwright e2e tests.
 */

const { expect } = require('@playwright/test');

/**
 * Reset panel settings.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {boolean} all - Whether to reset all settings or just current tab.
 * @return {Promise<void>}
 */
async function resetPanelSettings(page, all = true) {
	await page.locator('[data-testid="reset-settings"]').click({ force: true });

	await page.waitForSelector('.blockera-component-modal', {
		state: 'visible',
	});

	if (all) {
		await page.locator('[data-testid="reset-all-settings"]').click({
			force: true,
		});
	} else {
		await page
			.locator('[data-testid="reset-current-tab-settings"]')
			.click({ force: true });
	}

	await page.waitForTimeout(2000);

	// Reset should not return error
	await expect(
		page.locator('.blockera-component-modal .message.update-failed')
	).not.toBeVisible();
}

module.exports = {
	resetPanelSettings,
};
