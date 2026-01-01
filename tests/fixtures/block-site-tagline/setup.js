/**
 * Blockera dependencies - Playwright version
 */
const { createPost, appendBlocks} = require('@blockera/dev-playwright/js/utils/helpers');
const { wpCli } = require('@blockera/dev-playwright/js/support/commands');

/**
 * Setup function for block-site-tagline test
 * Sets site tagline option and creates a post
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string} sectionContent - The section content HTML (not used).
 * @return {Promise<boolean>} Returns false to indicate custom setup is handled.
 */
async function setup(page, sectionContent) {
	const taglineText = 'This is site tagline text';

	// Set the blogdescription option (site tagline)
	// Use wpCli with skipEscaping=true and single quotes
	await wpCli(
		page,
		`wp option update blogdescription '${taglineText}'`,
		false,
		true
	);

	// Edit the post (site tagline block doesn't require a specific post)
	await createPost(page);
	await appendBlocks(page, sectionContent);

	return false;
}

module.exports = { setup };
module.exports.default = setup;
