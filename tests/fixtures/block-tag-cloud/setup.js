/**
 * Blockera dependencies
 */
import { editPost } from '@blockera/dev-cypress/js/helpers';

/**
 * Internal dependencies
 */
import data from './data.json';

export default function setup() {
	// Step 1: Create categories sequentially
	// eslint-disable-next-line cypress/no-assigning-return-values
	let categoryChain = cy.wpCli(
		`term create category '${data.categories[0]}' || true`
	);

	for (let i = 1; i < data.categories.length; i++) {
		categoryChain = categoryChain.then(() => {
			return cy.wpCli(
				`term create category '${data.categories[i]}' || true`
			);
		});
	}

	categoryChain.then(() => {
		// Step 2: After all categories are created, create a post
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

			// Step 3: Assign categories to the post
			const categoryNames = data.categories.join(' ');
			cy.wpCli(
				`wp post term set ${postId} category ${categoryNames}`
			).then(() => {
				// Step 4: Edit the post
				// Run default setup
				cy.setScreenshotViewport('desktop');

				editPost({ postID: postId });
			});
		});
	});

	return false;
}
