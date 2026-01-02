/**
 * Blockera dependencies - Playwright version
 */
const { editPost } = require('@blockera/dev-playwright/js/utils/site-navigation');
const { appendBlocks } = require('@blockera/dev-playwright/js/utils/helpers');
const { wpCli } = require('@blockera/dev-playwright/js/support/commands');
const path = require('path');

/**
 * Setup function for block-post-featured-image test
 * Creates a post, uploads featured image, sets it as thumbnail, and edits the post
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string} sectionContent - The section content HTML.
 * @return {Promise<boolean>} Returns false to indicate custom setup is handled.
 */
async function setup(page, sectionContent) {
	// Get the path to the featured image
	// wpCli runs from WordPress root inside Docker container
	const imagePath =
		'wp-content/plugins/blockera/tests/fixtures/block-post-featured-image/featured-image.png';

	// Step 1: Create a post
	const result = await wpCli(
		page,
		`wp post create --post_type=post --post_title='Test Design: Featured Image' --post_status=publish`
	);

	// Extract post ID from stdout message like "Success: Created post 22."
	const match = result.stdout.match(/post (\d+)/);
	const postId = match ? parseInt(match[1], 10) : null;

	if (!postId) {
		throw new Error(
			`Failed to get post ID from output: ${result.stdout}`
		);
	}

	// Step 2: Upload the image and get attachment ID
	// Use skipEscaping=true to preserve the path as-is
	const mediaResult = await wpCli(
		page,
		`wp media import "${imagePath}" --porcelain`,
		false,
		true
	);

	// Extract attachment ID from stdout (porcelain mode returns just the ID)
	const attachmentId = mediaResult.stdout.trim();

	if (!attachmentId || isNaN(parseInt(attachmentId, 10))) {
		throw new Error(
			`Failed to upload featured image. Output: ${attachmentId}`
		);
	}

	// Step 3: Set the attachment as featured image (post thumbnail)
	await wpCli(
		page,
		`wp post meta set ${postId} _thumbnail_id ${attachmentId}`
	);

	// Step 4: Edit the post
	await editPost(page, { postID: postId });
	await appendBlocks(page, sectionContent);

	return false;
}

module.exports = { setup };
module.exports.default = setup;
