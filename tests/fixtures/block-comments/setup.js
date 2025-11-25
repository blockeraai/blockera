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

		// Step 2: Create a comment for the post
		const {
			comment_author: commentAuthor,
			comment_content: commentContent,
		} = data.comment;

		// Escape single quotes for shell when using single quotes
		const escapedComment = commentContent.replace(/'/g, "'\\''");

		cy.wpCli(
			`wp comment create --post_id=${postId} --user_id=${commentAuthor} --comment_content='${escapedComment}' --comment_approved=1`,
			false,
			true
		).then(() => {
			// Step 3: Edit the post
			// Run default setup
			cy.setScreenshotViewport('desktop');

			editPost({ postID: postId });
			appendBlocks(sectionContent);
		});
	});

	return false;
}
