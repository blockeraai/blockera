/**
 * Blockera dependencies - Playwright version
 */
const { editPost } = require('@blockera/dev-playwright/js/utils/site-navigation');
const { appendBlocks } = require('@blockera/dev-playwright/js/utils/helpers');
const { wpCli, setScreenshotViewport } = require('@blockera/dev-playwright/js/support/commands');
const fs = require('fs');
const path = require('path');

/**
 * Setup function for block-footnotes test
 * Creates a post with footnotes meta and edits it
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string} sectionContent - The section content HTML.
 * @return {Promise<boolean>} Returns false to indicate custom setup is handled.
 */
async function setup(page, sectionContent) {
	const dataPath = path.join(__dirname, 'data.json');
	const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

	// Step 1: Create a post and get its ID
	const {
		post_type: postType,
		post_title: postTitle,
		post_status: postStatus,
		post_date: postDate,
	} = data.post;

	const result = await wpCli(
		page,
		`wp post create --post_type=${postType} --post_title='${postTitle}' --post_status=${postStatus} --post_date='${postDate}'`
	);

	// Extract post ID from stdout message like "Success: Created post 22."
	const match = result.stdout.match(/post (\d+)/);
	const postId = match ? parseInt(match[1], 10) : null;

	if (!postId) {
		throw new Error(
			`Failed to get post ID from output: ${result.stdout}`
		);
	}

	// Step 2: Add custom field (meta) to the post
	const footnotesValue = JSON.stringify(data.footnotes);

	// Escape single quotes for shell when using single quotes
	// Single quotes preserve everything literally except single quotes themselves
	const escapedValue = footnotesValue.replace(/'/g, "'\\''");

	// Use wpCli with skipEscaping=true and single quotes
	// This avoids wpCli escaping the double quotes in the JSON
	await wpCli(
		page,
		`wp post meta update ${postId} footnotes '${escapedValue}'`,
		false,
		true
	);

	// Step 3: Edit the post
	await setScreenshotViewport(page, 'desktop');
	await editPost(page, { postID: postId });
	await appendBlocks(page, sectionContent);

	return false;
}

module.exports = { setup };
module.exports.default = setup;
