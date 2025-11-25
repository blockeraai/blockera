/**
 * Blockera dependencies
 */
import { editPost, appendBlocks } from '@blockera/dev-cypress/js/helpers';

/**
 * Internal dependencies
 */
import data from './data.json';

export default function setup(sectionContent) {
	// Step 1: Create all posts sequentially before running tests
	// eslint-disable-next-line cypress/no-assigning-return-values
	let postChain = (() => {
		const firstPost = data.posts[0];
		const {
			post_type: postType,
			post_title: postTitle,
			post_status: postStatus,
		} = firstPost;

		// Escape single quotes for shell when using single quotes
		const escapedTitle = postTitle.replace(/'/g, "'\\''");

		return cy.wpCli(
			`wp post create --post_type=${postType} --post_title='${escapedTitle}' --post_status=${postStatus}`
		);
	})();

	// Create remaining posts sequentially
	for (let i = 1; i < data.posts.length; i++) {
		postChain = postChain.then(() => {
			const postData = data.posts[i];
			const {
				post_type: postType,
				post_title: postTitle,
				post_status: postStatus,
			} = postData;

			// Escape single quotes for shell when using single quotes
			const escapedTitle = postTitle.replace(/'/g, "'\\''");

			return cy.wpCli(
				`wp post create --post_type=${postType} --post_title='${escapedTitle}' --post_status=${postStatus}`
			);
		});
	}

	// Step 2: After all posts are created, edit the last post
	postChain.then((result) => {
		// Extract post ID from stdout message like "Success: Created post 22."
		const match = result.stdout.match(/post (\d+)/);
		const postId = match ? parseInt(match[1], 10) : NaN;

		if (isNaN(postId)) {
			throw new Error(
				`Failed to get post ID from output: ${result.stdout}`
			);
		}

		// Step 3: Edit the last post
		// Run default setup
		cy.setScreenshotViewport('desktop');

		editPost({ postID: postId });
		appendBlocks(sectionContent);
	});

	return false;
}
