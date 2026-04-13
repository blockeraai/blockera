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
		`wp post create --post_type=${postType} --post_title='${escapedTitle}' --post_status=${postStatus} --post_date='${escapedDate}'`,
		false,
		true
	);

	// Extract post ID from stdout message like "Success: Created post 22."
	const match = result.stdout.match(/post (\d+)/);
	const postId = match ? parseInt(match[1], 10) : null;

	if (!postId) {
		throw new Error(`Failed to get post ID from output: ${result.stdout}`);
	}

	// Store postId for frontendSetup to use
	storedPostId = postId;

	// Verify post was created successfully
	const verifyPostResult = await wpCli(
		page,
		`wp post get ${postId} --field=ID`,
		false,
		false
	);

	if (verifyPostResult.stdout.trim() !== String(postId)) {
		throw new Error(
			`Post ${postId} was not created successfully. Verification failed.`
		);
	}

	// Enable comments on the post (ensure comment_status is 'open')
	await wpCli(
		page,
		`wp post update ${postId} --comment_status=open --ping_status=open`,
		false,
		false
	);

	// Configure WordPress to paginate comments with 2 comments per page
	await wpCli(page, `wp option update page_comments 1`, false, false);
	await wpCli(page, `wp option update comments_per_page 2`, false, false);

	// Step 2: Create comments for the post
	const commentsToCreate = data.comments;
	const createdCommentIds = [];

	// Verify user exists before creating comments
	const userCheckResult = await wpCli(
		page,
		`wp user get ${data.comments[0].comment_author} --field=ID`,
		true,
		false
	);

	if (!userCheckResult.stdout || !userCheckResult.stdout.trim()) {
		throw new Error(
			`User ID ${data.comments[0].comment_author} does not exist. Cannot create comments.`
		);
	}

	for (let i = 0; i < commentsToCreate.length; i++) {
		const comment = commentsToCreate[i];
		const {
			comment_author: commentAuthor,
			comment_content: commentContent,
		} = comment;

		// Ensure postId is a number
		const numericPostId = parseInt(postId, 10);
		if (isNaN(numericPostId)) {
			throw new Error(`Invalid post ID: ${postId}`);
		}

		// Use WordPress PHP API directly via wp eval to bypass shell quoting issues
		// This is the same approach used in bin/plugin/commands/testImport.js for creating posts
		// It avoids all command-line parsing issues by executing PHP directly
		const escapedContent = commentContent
			.replace(/\\/g, '\\\\')
			.replace(/'/g, "\\'");
		const phpCode = `$comment_id = wp_insert_comment(array('comment_post_ID' => ${numericPostId}, 'user_id' => ${commentAuthor}, 'comment_content' => '${escapedContent}', 'comment_approved' => 1)); echo is_wp_error($comment_id) ? 'Error: ' . $comment_id->get_error_message() : 'Success: Created comment ' . $comment_id . '.';`;
		const escapedPhpCode = phpCode.replace(/'/g, "'\\''");
		const commentCommand = `wp eval '${escapedPhpCode}'`;

		try {
			const commentResult = await wpCli(
				page,
				commentCommand,
				false,
				true
			);

			// Check stdout for success message
			if (
				!commentResult.stdout ||
				!commentResult.stdout.includes('Success')
			) {
				const errorMsg =
					commentResult.stderr ||
					commentResult.stdout ||
					'Unknown error';
				throw new Error(
					`Comment creation did not succeed. stdout: "${
						commentResult.stdout || '(empty)'
					}", stderr: "${errorMsg}"`
				);
			}

			// Extract comment ID from output like "Success: Created comment 123."
			const commentMatch = commentResult.stdout.match(/comment (\d+)/);
			if (commentMatch) {
				const commentId = parseInt(commentMatch[1], 10);
				createdCommentIds.push(commentId);
			} else if (commentResult.stdout.includes('Success')) {
				// If we can't extract ID but command succeeded, count it as created
				createdCommentIds.push(null); // Placeholder to track count
			}
		} catch (error) {
			throw new Error(
				`Failed to create comment ${i + 1} (${commentContent}): ${
					error.message
				}`
			);
		}
	}

	// Verify comments were created
	if (createdCommentIds.length !== commentsToCreate.length) {
		throw new Error(
			`Expected to create ${commentsToCreate.length} comments, but only ${createdCommentIds.length} were created.`
		);
	}

	// Small delay to ensure comments are fully committed
	await new Promise((resolve) => setTimeout(resolve, 500));

	// Verify comments are associated with the correct post
	const verifyCommentsResult = await wpCli(
		page,
		`wp comment list --post_id=${postId} --format=ids --status=approve`,
		false,
		false
	);

	const commentIds = verifyCommentsResult.stdout
		.trim()
		.split(/\s+/)
		.filter((id) => id.trim() !== '')
		.map((id) => parseInt(id.trim(), 10))
		.filter((id) => !isNaN(id));

	const commentCount = commentIds.length;
	if (commentCount !== commentsToCreate.length) {
		throw new Error(
			`Expected ${commentsToCreate.length} comments on post ${postId}, but found ${commentCount}.`
		);
	}

	// Step 3: Edit the post
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
