/**
 * Blockera dependencies
 */
import { editPost, appendBlocks } from '@blockera/dev-cypress/js/helpers';

/**
 * Internal dependencies
 */
import data from './data.json';

export default function setup(sectionContent) {
	// Step 1: Create a post and get its ID
	const {
		post_type: postType,
		post_title: postTitle,
		post_status: postStatus,
	} = data.post;

	cy.wpCli(
		`wp post create --post_type=${postType} --post_title='${postTitle}' --post_status=${postStatus}`
	).then((result) => {
		// Extract post ID from stdout message like "Success: Created post 22."
		const match = result.stdout.match(/post (\d+)/);
		const postId = match ? parseInt(match[1], 10) : NaN;

		if (isNaN(postId)) {
			throw new Error(
				`Failed to get post ID from output: ${result.stdout}`
			);
		}

		// Step 2: Create all comments sequentially
		// eslint-disable-next-line cypress/no-assigning-return-values
		let commentChain = (() => {
			const firstComment = data.comments[0];
			const {
				comment_author: commentAuthor,
				comment_content: commentContent,
			} = firstComment;

			// First comment (index 0) is the most recent (0 seconds ago)
			const secondsAgo = 0;
			const commentDate = new Date();
			commentDate.setSeconds(commentDate.getSeconds() - secondsAgo);
			const commentDateStr = commentDate
				.toISOString()
				.replace('T', ' ')
				.substring(0, 19);

			// Escape single quotes for shell when using single quotes
			const escapedComment = commentContent.replace(/'/g, "'\\''");

			return cy.wpCli(
				`wp comment create --post_id=${postId} --user_id=${commentAuthor} --comment_content='${escapedComment}' --comment_approved=1 --comment_date='${commentDateStr}'`,
				false,
				true
			);
		})();

		// Create remaining comments sequentially
		for (let i = 1; i < data.comments.length; i++) {
			commentChain = commentChain.then(() => {
				const commentData = data.comments[i];
				const {
					comment_author: commentAuthor,
					comment_content: commentContent,
				} = commentData;

				// Calculate seconds ago for this comment (5 seconds per index)
				const secondsAgo = i * 5;
				const commentDate = new Date();
				commentDate.setSeconds(commentDate.getSeconds() - secondsAgo);
				const commentDateStr = commentDate
					.toISOString()
					.replace('T', ' ')
					.substring(0, 19);

				// Escape single quotes for shell when using single quotes
				const escapedComment = commentContent.replace(/'/g, "'\\''");

				return cy.wpCli(
					`wp comment create --post_id=${postId} --user_id=${commentAuthor} --comment_content='${escapedComment}' --comment_approved=1 --comment_date='${commentDateStr}'`,
					false,
					true
				);
			});
		}

		// Step 3: After all comments are created, edit the post
		commentChain.then(() => {
			// Run default setup
			cy.setScreenshotViewport('desktop');

			editPost({ postID: postId });
			appendBlocks(sectionContent);
		});
	});

	return false;
}
