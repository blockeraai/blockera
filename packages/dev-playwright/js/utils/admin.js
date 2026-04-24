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
	await page.locator('[data-test="reset-settings"]').click({ force: true });

	await page.waitForSelector('.blockera-component-modal', {
		state: 'visible',
	});

	if (all) {
		await page.locator('[data-test="reset-modal-open-all"]').click({
			force: true,
		});
		const confirmInput = page.locator(
			'[data-test="reset-all-confirm-input"] input'
		);
		await confirmInput.waitFor({ state: 'visible' });
		await confirmInput.fill('reset');
		await page.locator('[data-test="reset-all-settings"]').click({
			force: true,
		});
	} else {
		await page.locator('[data-test="reset-current-tab-settings"]').click({
			force: true,
		});
	}

	await expect(page.locator('.blockera-component-modal')).not.toBeVisible({
		timeout: 15000,
	});
}

module.exports = {
	resetPanelSettings,
};
