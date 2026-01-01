/**
 * Blockera dependencies - Playwright version
 */
const { editPost } = require('@blockera/dev-playwright/js/utils/site-navigation');
const { appendBlocks } = require('@blockera/dev-playwright/js/utils/helpers');
const { wpCli } = require('@blockera/dev-playwright/js/support/commands');
const fs = require('fs');
const path = require('path');

/**
 * Setup function for block-comments test
 * Creates a post with comments and edits it
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

	// Step 2: Create comments for the post
	for (const comment of data.comments) {
		const {
			comment_author: commentAuthor,
			comment_content: commentContent,
		} = comment;

		// Escape single quotes for shell when using single quotes
		const escapedComment = commentContent.replace(/'/g, "'\\''");

		await wpCli(
			page,
			`wp comment create --post_id=${postId} --user_id=${commentAuthor} --comment_content='${escapedComment}' --comment_approved=1`,
			false,
			true
		);
	}

	// Step 3: Edit the post
	await editPost(page, { postID: postId });
	await appendBlocks(page, sectionContent);

	return false;
}

module.exports = { setup };
module.exports.default = setup;
