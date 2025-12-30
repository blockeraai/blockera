/**
 * Blockera dependencies - Playwright version
 */
const { createPost, appendBlocks } = require('@blockera/dev-playwright/js/utils/helpers');
const { wpCli, setEditorViewportForScreenshot } = require('@blockera/dev-playwright/js/support/commands');

/**
 * Setup function for block-site-logo test
 * Uploads logo image and sets it as custom logo
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string} sectionContent - The section content HTML (not used).
 * @return {Promise<boolean>} Returns false to indicate custom setup is handled.
 */
async function setup(page, sectionContent) {
	// Get the path to the logo image
	// wpCli runs from WordPress root inside Docker container
	// Try relative path first, fallback to absolute if needed
	const logoPath =
		'wp-content/plugins/blockera/tests/fixtures/block-site-logo/logo.png';

	// Step 1: Upload the image and get attachment ID
	// Use skipEscaping=true to preserve the path as-is
	const result = await wpCli(
		page,
		`wp media import "${logoPath}" --porcelain`,
		false,
		true
	);

	// Extract attachment ID from stdout (porcelain mode returns just the ID)
	const attachmentId = result.stdout.trim();

	if (!attachmentId || isNaN(parseInt(attachmentId, 10))) {
		throw new Error(
			`Failed to upload logo image. Output: ${attachmentId}`
		);
	}

	// Step 2: Set the attachment as custom logo
	// site-logo block uses get_custom_logo() which reads custom_logo theme mod
	// We can set site_logo option which will be used via theme_mod_custom_logo filter
	await wpCli(page, `wp option update site_logo ${attachmentId}`);

	// Step 3: Edit the post (site logo block doesn't require a specific post)
	await createPost(page);
	await appendBlocks(page, sectionContent);
	await setEditorViewportForScreenshot(page);

	return false;
}

module.exports = { setup };
module.exports.default = setup;
