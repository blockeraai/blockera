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
 * Setup function for block-navigation test
 * Creates navigation post and regular post, then edits the regular post
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string} sectionContent - The section content HTML.
 * @return {Promise<boolean>} Returns false to indicate custom setup is handled.
 */
/* eslint-enable jsdoc/valid-types */
async function setup(page, sectionContent) {
	// Step 1: Read navigation.html content
	const navigationPath = path.join(__dirname, 'navigation.html');
	const navigationContent = fs.readFileSync(navigationPath, 'utf8');

	// Escape single quotes for shell when using single quotes
	const escapedContent = navigationContent.replace(/'/g, "'\\''");

	// Create navigation post with content from navigation.html
	const navResult = await wpCli(
		page,
		`wp post create --post_type=wp_navigation --post_title='Navigation' --post_status=publish --post_author=1 --post_content='${escapedContent}'`,
		false,
		true
	);

	// Extract navigation post ID from stdout message like "Success: Created post 22."
	const navMatch = navResult.stdout.match(/post (\d+)/);
	const navigationPostId = navMatch ? parseInt(navMatch[1], 10) : null;

	if (!navigationPostId) {
		throw new Error(
			`Failed to get navigation post ID from output: ${navResult.stdout}`
		);
	}

	// Step 2: Create a regular post
	const postResult = await wpCli(
		page,
		`wp post create --post_type=post --post_title='Test Design: block-navigation' --post_status=publish`
	);

	// Extract post ID from stdout message
	const postMatch = postResult.stdout.match(/post (\d+)/);
	const postId = postMatch ? parseInt(postMatch[1], 10) : null;

	if (!postId) {
		throw new Error(
			`Failed to get post ID from output: ${postResult.stdout}`
		);
	}

	// Step 3: Update the post content to replace ref ID with actual navigation post ID
	const updatedContent = sectionContent.replace(
		/"ref":\s*\d+/,
		`"ref":${navigationPostId}`
	);

	// Step 4: Edit the post
	await editPost(page, { postID: postId });
	await appendBlocks(page, updatedContent);

	// Wait for navigation to be ready
	await page.waitForTimeout(5000);

	return false;
}

module.exports = { setup };
module.exports.default = setup;
