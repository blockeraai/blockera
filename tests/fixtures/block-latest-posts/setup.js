/**
 * Blockera dependencies - Playwright version
 */
const {
	editPost,
} = require('@blockera/dev-playwright/js/utils/site-navigation');
const { appendBlocks } = require('@blockera/dev-playwright/js/utils/helpers');
const { wpCli } = require('@blockera/dev-playwright/js/support/commands');
const fs = require('fs');
const path = require('path');

/* eslint-disable jsdoc/valid-types */
/**
 * Setup function for block-latest-posts test
 * Creates posts and edits the last one
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string} sectionContent - The section content HTML.
 * @return {Promise<boolean>} Returns false to indicate custom setup is handled.
 */
/* eslint-enable jsdoc/valid-types */
async function setup(page, sectionContent) {
	const dataPath = path.join(__dirname, 'data.json');
	const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

	// Step 1: Create all posts sequentially before running tests
	let lastPostId = null;

	for (let i = 0; i < data.posts.length; i++) {
		const postData = data.posts[i];
		const {
			post_type: postType,
			post_title: postTitle,
			post_status: postStatus,
		} = postData;

		// Escape single quotes for shell when using single quotes
		const escapedTitle = postTitle.replace(/'/g, "'\\''");

		const result = await wpCli(
			page,
			`wp post create --post_type=${postType} --post_title='${escapedTitle}' --post_status=${postStatus}`
		);

		// Extract post ID from stdout message like "Success: Created post 22."
		const match = result.stdout.match(/post (\d+)/);
		lastPostId = match ? parseInt(match[1], 10) : null;

		if (!lastPostId) {
			throw new Error(
				`Failed to get post ID from output: ${result.stdout}`
			);
		}
	}

	// Step 2: Edit the last post
	await editPost(page, { postID: lastPostId });
	await appendBlocks(page, sectionContent);

	return false;
}

module.exports = { setup };
module.exports.default = setup;
