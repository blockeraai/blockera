/**
 * Blockera dependencies - Playwright version
 */
const { createPost, appendBlocks } = require('@blockera/dev-playwright/js/utils/helpers');
const { wpCli, setScreenshotViewport } = require('@blockera/dev-playwright/js/support/commands');
const fs = require('fs');
const path = require('path');

/**
 * Setup function for block-categories test
 * Creates categories, then creates a post
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string} sectionContent - The section content HTML.
 * @return {Promise<boolean>} Returns false to indicate custom setup is handled.
 */
async function setup(page, sectionContent) {
	const dataPath = path.join(__dirname, 'data.json');
	const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

	// Create categories sequentially
	const categories = data.categories;

	for (let i = 0; i < categories.length; i++) {
		await wpCli(
			page,
			`term create category '${categories[i]}' || true`,
			true, // ignoreFailures
			false
		);
	}

	// Run default setup
	await setScreenshotViewport(page, 'desktop');
	await createPost(page);
	await appendBlocks(page, sectionContent);

	return false;
}

module.exports = { setup };
module.exports.default = setup;
