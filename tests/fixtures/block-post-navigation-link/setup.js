/**
 * Blockera dependencies - Playwright version
 */
const { editPost } = require('@blockera/dev-playwright/js/utils/site-navigation');
const { appendBlocks } = require('@blockera/dev-playwright/js/utils/helpers');
const { wpCli } = require('@blockera/dev-playwright/js/support/commands');
const fs = require('fs');
const path = require('path');

/**
 * Setup function for block-post-navigation-link test
 * Creates multiple posts with different dates, then edits the middle post
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string} sectionContent - The section content HTML.
 * @return {Promise<boolean>} Returns false to indicate custom setup is handled.
 */
async function setup(page, sectionContent) {
	const dataPath = path.join(__dirname, 'data.json');
	const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

	// Step 1: Create all posts sequentially with 10 seconds difference in time
	// Post 1 (oldest) -> Post 2 (middle, test post) -> Post 3 (newest)
	const postIds = [];

	for (let i = 0; i < data.posts.length; i++) {
		const postData = data.posts[i];
		const {
			post_type: postType,
			post_title: postTitle,
			post_status: postStatus,
		} = postData;

		// Calculate seconds ago for this post (10 seconds per index)
		// Post 1 is 20 seconds ago (oldest), Post 2 is 10 seconds ago, Post 3 is now (0 seconds ago)
		const secondsAgo = (data.posts.length - 1 - i) * 10;
		const postDate = new Date();
		postDate.setSeconds(postDate.getSeconds() - secondsAgo);
		const postDateStr = postDate
			.toISOString()
			.replace('T', ' ')
			.substring(0, 19);

		// Escape single quotes for shell when using single quotes
		const escapedTitle = postTitle.replace(/'/g, "'\\''");

		const result = await wpCli(
			page,
			`wp post create --post_type=${postType} --post_title='${escapedTitle}' --post_status=${postStatus} --post_date='${postDateStr}'`,
			false,
			true
		);

		// Extract post ID from stdout message like "Success: Created post 22."
		const match = result.stdout.match(/post (\d+)/);
		const postId = match ? parseInt(match[1], 10) : null;

		if (!postId) {
			throw new Error(
				`Failed to get post ID from output: ${result.stdout}`
			);
		}

		postIds.push(postId);
	}

	// Step 2: After all posts are created, edit post number 2 (index 1)
	// Use post number 2 (index 1) as the test post
	const postId = postIds[1];

	if (!postId || isNaN(postId)) {
		throw new Error(
			`Failed to get post ID 2 for test post. Post IDs: ${postIds.join(
				', '
			)}`
		);
	}

	// Step 3: Edit post number 2
	await editPost(page, { postID: postId });
	await appendBlocks(page, sectionContent);

	// Wait for navigation to be ready
	await page.waitForTimeout(5000);

	return false;
}

module.exports = { setup };
module.exports.default = setup;
