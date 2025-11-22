/**
 * Blockera dependencies
 */
import { editPost } from '@blockera/dev-cypress/js/helpers';

/**
 * Internal dependencies
 */
import data from './data.json';

export default function setup() {
	// Step 1: Create a post and get its ID
	const {
		post_type: postType,
		post_title: postTitle,
		post_status: postStatus,
		post_date: postDate,
	} = data.post;

	cy.wpCli(
		`wp post create --post_type=${postType} --post_title='${postTitle}' --post_status=${postStatus} --post_date='${postDate}'`
	).then((result) => {
		// Extract post ID from stdout message like "Success: Created post 22."
		const match = result.stdout.match(/post (\d+)/);
		const postId = match ? parseInt(match[1], 10) : NaN;

		if (isNaN(postId)) {
			throw new Error(
				`Failed to get post ID from output: ${result.stdout}`
			);
		}

		// Step 2: Update post excerpt
		const excerptText = data.excerpt;

		// Escape single quotes for shell when using single quotes
		// Single quotes preserve everything literally except single quotes themselves
		const escapedExcerpt = excerptText.replace(/'/g, "'\\''");

		// Use wpCli with skipEscaping=true and single quotes
		// This avoids wpCli escaping the double quotes in the HTML
		cy.wpCli(
			`wp post update ${postId} --post_excerpt='${escapedExcerpt}'`,
			false,
			true
		).then(() => {
			// Step 3: Edit the post
			// Run default setup
			cy.setScreenshotViewport('desktop');

			editPost({ postID: postId });
		});
	});

	return false;
}
