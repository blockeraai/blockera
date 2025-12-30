/**
 * Blockera dependencies - Playwright version
 */
const { editPost } = require('@blockera/dev-playwright/js/utils/site-navigation');
const { wpCli, setScreenshotViewport } = require('@blockera/dev-playwright/js/support/commands');
const fs = require('fs');
const path = require('path');

/**
 * Setup function for block-post-title test
 * Creates a post, updates its title, and edits it
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string} sectionContent - The section content HTML (not used).
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

	// Step 2: Update post title
	const titleText = data.title;

	// Escape single quotes for shell when using single quotes
	// Single quotes preserve everything literally except single quotes themselves
	const escapedTitle = titleText.replace(/'/g, "'\\''");

	// Use wpCli with skipEscaping=true and single quotes
	// This avoids wpCli escaping the double quotes in the HTML
	await wpCli(
		page,
		`wp post update ${postId} --post_title='${escapedTitle}'`,
		false,
		true
	);

	// Step 3: Edit the post
	await setScreenshotViewport(page, 'desktop');
	await editPost(page, { postID: postId });

	return false;
}

module.exports = { setup };
module.exports.default = setup;
