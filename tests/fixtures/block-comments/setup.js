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

// Store postId for frontendSetup to use
let storedPostId = null;

/* eslint-disable jsdoc/valid-types */
/**
 * Setup function for block-comments test
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
		post_date: postDate,
	} = data.post;

	// Escape single quotes in post title and date for shell
	const escapedTitle = postTitle.replace(/'/g, "'\\''");
	const escapedDate = postDate.replace(/'/g, "'\\''");

	const result = await wpCli(
		page,
		`wp post create --post_type=${postType} --post_title='${escapedTitle}' --post_status=${postStatus} --post_date='${escapedDate}' --comment_status=open --ping_status=open --porcelain`,
		false,
		true
	);

	const postId = parseInt(String(result.stdout).trim(), 10);

	if (!postId) {
		throw new Error(`Failed to get post ID from output: ${result.stdout}`);
	}

	storedPostId = postId;

	await wpCli(page, `wp option update page_comments 1`, false, false);
	await wpCli(page, `wp option update comments_per_page 2`, false, false);

	const commentsToCreate = data.comments;

	for (let i = 0; i < commentsToCreate.length; i++) {
		const comment = commentsToCreate[i];
		const {
			comment_author: commentAuthor,
			comment_content: commentContent,
		} = comment;
		const escapedComment = commentContent.replace(/'/g, "'\\''");

		await wpCli(
			page,
			`wp comment create --comment_post_ID=${postId} --user_id=${commentAuthor} --comment_content='${escapedComment}' --comment_approved=1`,
			false,
			true
		);
	}

	await editPost(page, { postID: postId });
	await appendBlocks(page, sectionContent);

	return false;
}

/* eslint-disable jsdoc/valid-types */
/**
 * Frontend setup function for block-comments test
 * Navigates to page 3 of comments pagination (`cpage=3`)
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @return {Promise<void>}
 */
/* eslint-enable jsdoc/valid-types */
async function frontendSetup(page) {
	if (!storedPostId) {
		throw new Error(
			'Post ID not available. Make sure setup() was called before frontendSetup().'
		);
	}

	// Check if we're already on the post page (has post ID in path or query)
	// If not, we need to navigate to the post first
	// Try to get post permalink via wpCli
	const permalinkResult = await wpCli(
		page,
		`wp post get ${storedPostId} --field=url`,
		false,
		false
	);

	if (!permalinkResult.stdout || !permalinkResult.stdout.trim()) {
		throw new Error(`Failed to get permalink for post ${storedPostId}`);
	}

	const postUrl = permalinkResult.stdout.trim();
	const postUrlObj = new URL(postUrl);

	// Add cpage=3 query parameter for comments pagination
	postUrlObj.searchParams.set('cpage', '3');

	// Avoid `networkidle` (often never settles on WP) and `load` (can hang if a
	// subresource never finishes). `domcontentloaded` is enough for server-rendered HTML.
	await page.goto(postUrlObj.toString(), { waitUntil: 'domcontentloaded' });

	// Wait a bit for comments to load
	await page.waitForTimeout(500);
}

module.exports = { setup, frontendSetup };
module.exports.default = setup;
