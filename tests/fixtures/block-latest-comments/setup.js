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
 * Setup function for block-latest-comments test
 * Creates a post with comments and edits it
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string} sectionContent - The section content HTML.
 * @return {Promise<boolean>} Returns false to indicate custom setup is handled.
 */
/* eslint-enable jsdoc/valid-types */
async function setup(page, sectionContent) {
	const dataPath = path.join(__dirname, 'data.json');
	const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

	// Step 1: Create a post and get its ID
	const {
		post_type: postType,
		post_title: postTitle,
		post_status: postStatus,
	} = data.post;

	const escapedTitle = postTitle.replace(/'/g, "'\\''");

	const result = await wpCli(
		page,
		`wp post create --post_type=${postType} --post_title='${escapedTitle}' --post_status=${postStatus} --comment_status=open --porcelain`,
		false,
		true
	);

	// --porcelain prints only the post ID
	const postId = parseInt(String(result.stdout).trim(), 10);

	if (!postId) {
		throw new Error(`Failed to get post ID from output: ${result.stdout}`);
	}

	// Step 2: Create all comments sequentially with dates
	// WP-CLI expects --comment_post_ID (not --post_id, which is ignored).
	for (let i = 0; i < data.comments.length; i++) {
		const commentData = data.comments[i];
		const {
			comment_author: commentAuthor,
			comment_content: commentContent,
		} = commentData;

		// Calculate seconds ago for this comment (5 seconds per index)
		// First comment (index 0) is the most recent (0 seconds ago)
		const secondsAgo = i * 5;
		const commentDate = new Date();
		commentDate.setSeconds(commentDate.getSeconds() - secondsAgo);
		const commentDateStr = commentDate
			.toISOString()
			.replace('T', ' ')
			.substring(0, 19);

		// Escape single quotes for shell when using single quotes
		const escapedComment = commentContent.replace(/'/g, "'\\''");

		await wpCli(
			page,
			`wp comment create --comment_post_ID=${postId} --user_id=${commentAuthor} --comment_content='${escapedComment}' --comment_approved=1 --comment_date='${commentDateStr}'`,
			false,
			true
		);
	}

	// Step 3: After all comments are created, edit the post
	await editPost(page, { postID: postId });
	await appendBlocks(page, sectionContent);

	return false;
}

module.exports = { setup };
module.exports.default = setup;
