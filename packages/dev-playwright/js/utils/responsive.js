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

	// Find the canvas editor container, then find the breakpoints element inside it
	const canvasEditor = page
		.locator('[data-test="blockera-canvas-editor"]')
		.first();

	// Wait for the canvas editor container to be visible
	await canvasEditor.waitFor({ state: 'visible', timeout: 10000 });

	// Find the breakpoints container inside the canvas editor
	const breakpointsContainer = canvasEditor
		.locator('[aria-label="Breakpoints"]')
		.first();

	// Wait for the breakpoints container to be visible
	await breakpointsContainer.waitFor({ state: 'visible', timeout: 10000 });

	// Find the device button inside the breakpoints container
	const deviceButton = breakpointsContainer
		.locator(`[aria-label="${deviceType}"]`)
		.first();

	// Wait for the device button to be visible
	await deviceButton.waitFor({ state: 'visible', timeout: 10000 });

	await deviceButton.click({
		force: true,
	});

	// Wait a bit after clicking to ensure the change is applied
	await wait(300);
}

module.exports = {
	setDeviceType,
};
