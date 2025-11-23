/**
 * Blockera dependencies
 */
import { createPost } from '@blockera/dev-cypress/js/helpers';

export default function setup() {
	// Get the path to the logo image
	// wpCli runs from WordPress root inside Docker container
	// Try relative path first, fallback to absolute if needed
	const logoPath =
		'wp-content/plugins/blockera/tests/fixtures/block-site-logo/logo.png';

	// Step 1: Upload the image and get attachment ID
	// Use skipEscaping=true to preserve the path as-is
	cy.wpCli(`wp media import "${logoPath}" --porcelain`, false, true).then(
		(result) => {
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
			cy.wpCli(`wp option update site_logo ${attachmentId}`).then(() => {
				// Step 3: Edit the post (site logo block doesn't require a specific post)
				cy.setScreenshotViewport('desktop');
				createPost();
			});
		}
	);

	return false;
}
