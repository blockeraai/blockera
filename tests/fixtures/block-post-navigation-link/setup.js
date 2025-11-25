/**
 * Blockera dependencies
 */
import { editPost, appendBlocks } from '@blockera/dev-cypress/js/helpers';

/**
 * Internal dependencies
 */
import data from './data.json';

export default function setup(sectionContent) {
	// Step 1: Create all posts sequentially with 10 seconds difference in time
	// Post 1 (oldest) -> Post 2 (middle, test post) -> Post 3 (newest)
	const postIds = [];

	// eslint-disable-next-line cypress/no-assigning-return-values
	let postChain = (() => {
		const firstPost = data.posts[0];
		const {
			post_type: postType,
			post_title: postTitle,
			post_status: postStatus,
		} = firstPost;

		// Post 1 is 20 seconds ago (oldest)
		const secondsAgo = (data.posts.length - 1 - 0) * 10; // 20 seconds
		const postDate = new Date();
		postDate.setSeconds(postDate.getSeconds() - secondsAgo);
		const postDateStr = postDate
			.toISOString()
			.replace('T', ' ')
			.substring(0, 19);

		// Escape single quotes for shell when using single quotes
		const escapedTitle = postTitle.replace(/'/g, "'\\''");

		return cy
			.wpCli(
				`wp post create --post_type=${postType} --post_title='${escapedTitle}' --post_status=${postStatus} --post_date='${postDateStr}'`,
				false,
				true
			)
			.then((result) => {
				// Extract post ID from stdout message like "Success: Created post 22."
				const match = result.stdout.match(/post (\d+)/);
				const postId = match ? parseInt(match[1], 10) : NaN;

				if (isNaN(postId)) {
					throw new Error(
						`Failed to get post ID from output: ${result.stdout}`
					);
				}

				postIds.push(postId);
				return { postId, result };
			});
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

			// Calculate seconds ago for this post (10 seconds per index)
			// Post 2 is 10 seconds ago, Post 3 is now (0 seconds ago)
			const secondsAgo = (data.posts.length - 1 - i) * 10;
			const postDate = new Date();
			postDate.setSeconds(postDate.getSeconds() - secondsAgo);
			const postDateStr = postDate
				.toISOString()
				.replace('T', ' ')
				.substring(0, 19);

			// Escape single quotes for shell when using single quotes
			const escapedTitle = postTitle.replace(/'/g, "'\\''");

			return cy
				.wpCli(
					`wp post create --post_type=${postType} --post_title='${escapedTitle}' --post_status=${postStatus} --post_date='${postDateStr}'`,
					false,
					true
				)
				.then((result) => {
					// Extract post ID from stdout message
					const match = result.stdout.match(/post (\d+)/);
					const postId = match ? parseInt(match[1], 10) : NaN;

					if (isNaN(postId)) {
						throw new Error(
							`Failed to get post ID from output: ${result.stdout}`
						);
					}

					postIds.push(postId);
					return { postId, result };
				});
		});
	}

	// Step 2: After all posts are created, edit post number 2 (index 1)
	postChain.then(() => {
		// Use post number 2 (index 1) as the test post
		const postId = postIds[1];

		if (!postId || isNaN(postId)) {
			throw new Error(
				`Failed to get post ID 2 for test post. Post IDs: ${postIds.join(
					', '
				)}`
			);
		}

		// Step 3: Edit post number 2
		// Run default setup
		cy.setScreenshotViewport('desktop');

		editPost({ postID: postId });
		appendBlocks(sectionContent);

		// eslint-disable-next-line cypress/no-unnecessary-waiting
		cy.wait(5000);
	});

	return false;
}
