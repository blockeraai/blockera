/**
 * Responsive helper utilities for Playwright e2e tests.
 */

/**
 * Wait for assertion value (helper).
 *
 * @param {number} time - Time to wait in milliseconds.
 * @return {Promise<void>}
 */
async function wait(time = 300) {
	return new Promise((resolve) => setTimeout(resolve, time));
}

/**
 * Set device type (breakpoint).
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string} deviceType - Device type (e.g., 'Desktop', 'Tablet', 'Mobile').
 * @return {Promise<void>}
 */
async function setDeviceType(page, deviceType) {
	await wait(300);

	const breakpoints = page.locator('[aria-label="Breakpoints"]').first();

	await breakpoints.locator(`[aria-label="${deviceType}"]`).click({
		force: true,
	});
}

module.exports = {
	setDeviceType,
};
