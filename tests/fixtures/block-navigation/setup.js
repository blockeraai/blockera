/**
 * Blockera dependencies
 */
import { editPost, appendBlocks } from '@blockera/dev-cypress/js/helpers';

export default function setup(sectionContent) {
	// Step 1: Read navigation.html content
	cy.readFile('tests/fixtures/block-navigation/navigation.html').then(
		(navigationContent) => {
			// Escape single quotes for shell when using single quotes
			const escapedContent = navigationContent.replace(/'/g, "'\\''");

			// Create navigation post with content from navigation.html
			cy.wpCli(
				`wp post create --post_type=wp_navigation --post_title='Navigation' --post_status=publish --post_author=1 --post_content='${escapedContent}'`,
				false,
				true
			).then((result) => {
				// Extract navigation post ID from stdout message like "Success: Created post 22."
				const match = result.stdout.match(/post (\d+)/);
				const navigationPostId = match ? parseInt(match[1], 10) : NaN;

				if (isNaN(navigationPostId)) {
					throw new Error(
						`Failed to get navigation post ID from output: ${result.stdout}`
					);
				}

				// Step 2: Create a regular post
				cy.wpCli(
					`wp post create --post_type=post --post_title='Test Design: block-navigation' --post_status=publish`
				).then((result) => {
					// Extract post ID from stdout message
					const postMatch = result.stdout.match(/post (\d+)/);
					const postId = postMatch ? parseInt(postMatch[1], 10) : NaN;

					if (isNaN(postId)) {
						throw new Error(
							`Failed to get post ID from output: ${result.stdout}`
						);
					}

					// Step 3: Update the post content to replace ref ID with actual navigation post ID
					const updatedContent = sectionContent.replace(
						/"ref":\s*\d+/,
						`"ref":${navigationPostId}`
					);

					// Step 4: Edit the post
					// Run default setup
					cy.setScreenshotViewport('desktop');

					editPost({ postID: postId });
					appendBlocks(updatedContent);

					// eslint-disable-next-line cypress/no-unnecessary-waiting
					cy.wait(5000);
				});
			});
		}
	);

	return false;
}
