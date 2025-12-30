/**
 * Other helper utilities for Playwright e2e tests.
 */

/**
 * Convert hex color to RGB.
 *
 * @param {string} hex - Hex color string (e.g., '#55e7ff').
 * @return {string} RGB string.
 */
function hexToRGB(hex) {
	let r = 0;
	let g = 0;
	let b = 0;

	// 3 digits
	if (hex.length === 4) {
		r = '0x' + hex[1] + hex[1];
		g = '0x' + hex[2] + hex[2];
		b = '0x' + hex[3] + hex[3];
		// 6 digits
	} else if (hex.length === 7) {
		r = '0x' + hex[1] + hex[2];
		g = '0x' + hex[3] + hex[4];
		b = '0x' + hex[5] + hex[6];
	}

	return 'rgb(' + +r + ', ' + +g + ', ' + +b + ')';
}

/**
 * Convert hex string to byte array.
 *
 * @param {string} str - Hex string.
 * @return {Uint8Array} Byte array.
 */
function hexStringToByte(str) {
	if (!str) {
		return new Uint8Array();
	}

	const a = [];
	for (let i = 0, len = str.length; i < len; i += 2) {
		a.push(parseInt(str.substr(i, 2), 16));
	}

	return new Uint8Array(a);
}

/**
 * Check if not WordPress local environment.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @return {Promise<boolean>} True if not local environment.
 */
async function isNotWPLocalEnv(page) {
	const baseURL = page.url();
	return baseURL !== 'http://localhost:8889';
}

/**
 * Check if WordPress version is 6.2 or higher.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @return {Promise<boolean>} True if WP 6.2+.
 */
async function isWP62AtLeast(page) {
	const branch62 = await page
		.locator("[class*='branch-6-2']")
		.count()
		.then((count) => count > 0);
	const branch63 = await page
		.locator("[class*='branch-6-3']")
		.count()
		.then((count) => count > 0);

	return branch62 || branch63;
}

module.exports = {
	hexToRGB,
	hexStringToByte,
	isNotWPLocalEnv,
	isWP62AtLeast,
};
