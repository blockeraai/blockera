/**
 * Blockera dependencies - Playwright version
 */
const { appendBlocks } = require('@blockera/dev-playwright/js/utils/helpers');
const {
	editPost,
} = require('@blockera/dev-playwright/js/utils/site-navigation');
const { wpCli } = require('@blockera/dev-playwright/js/support/commands');
const fs = require('fs');
const path = require('path');

/* eslint-disable jsdoc/valid-types */
/**
 * Setup function for block-terms-query test
 * Creates categories and a post, then edits the post
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string} sectionContent - The section content HTML (not used).
 * @return {Promise<boolean>} Returns false to indicate custom setup is handled.
 */
/* eslint-enable jsdoc/valid-types */
async function setup(page, sectionContent) {
	const dataPath = path.join(__dirname, 'data.json');
	const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

	const categoryDescription =
		data.category_description || 'This is the description.';

	// Step 1: Create categories sequentially with descriptions
	for (let i = 0; i < data.categories.length; i++) {
		await wpCli(
			page,
			`wp term create category '${data.categories[i]}' --description='${categoryDescription}'`,
			true, // ignoreFailures - handles cases where term already exists
			false
		);
	}

	// Step 2: After all categories are created, create a post
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
		throw new Error(`Failed to get post ID from output: ${result.stdout}`);
	}

	// Step 3: Assign categories to the post
	const categoryNames = data.categories.join(' ');
	await wpCli(page, `wp post term set ${postId} category ${categoryNames}`);

	// Step 4: Edit the post
	await editPost(page, { postID: postId });
	await appendBlocks(page, sectionContent);

	return false;
}

module.exports = { setup };
module.exports.default = setup;
