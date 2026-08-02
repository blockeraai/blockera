/**
 * Blockera dependencies - Playwright version
 */
const {
	editPost,
} = require('@blockera/dev-playwright/js/utils/site-navigation');
const { appendBlocks } = require('@blockera/dev-playwright/js/utils/helpers');
const { wpCli } = require('@blockera/dev-playwright/js/support/commands');
const fs = require('fs');
const path = require('path');

/**
 * Delete all posts/pages matching the given slugs (idempotent re-runs).
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string[]} slugs - Post name (slug) values to remove.
 * @return {Promise<void>}
 */
async function deletePostsBySlug(page, slugs) {
	for (let i = 0; i < slugs.length; i++) {
		const slug = slugs[i];
		if (!slug) {
			continue;
		}

		const listed = await wpCli(
			page,
			`wp post list --post_type=any --name=${slug} --field=ID --format=ids`,
			true,
			true
		);
		const ids = String(listed.stdout || '')
			.trim()
			.split(/\s+/)
			.filter(Boolean);

		for (let j = 0; j < ids.length; j++) {
			await wpCli(page, `wp post delete ${ids[j]} --force`, true, true);
		}
	}
}

/* eslint-disable jsdoc/valid-types */
/**
 * Setup function for block-query test.
 * Resets the post query surface, seeds static published posts so Query Loop
 * titles stay deterministic (orderBy title desc), then opens the host page.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string} sectionContent - The section content HTML.
 * @return {Promise<boolean>} Returns false to indicate custom setup is handled.
 */
/* eslint-enable jsdoc/valid-types */
async function setup(page, sectionContent) {
	const dataPath = path.join(__dirname, 'data.json');
	const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

	// Step 0: Make the Query Loop surface deterministic in persistent wp-env DBs.
	// Remove every post so leftover titles from other fixtures cannot appear.
	const existingPosts = await wpCli(
		page,
		'wp post list --post_type=post --format=ids',
		true,
		true
	);
	const existingPostIds = String(existingPosts.stdout || '')
		.trim()
		.split(/\s+/)
		.filter(Boolean);

	if (existingPostIds.length > 0) {
		await wpCli(
			page,
			`wp post delete ${existingPostIds.join(' ')} --force`,
			true,
			true
		);
	}

	// Also remove a previous host page from earlier runs of this fixture.
	await deletePostsBySlug(page, [data.host_post.post_name]);

	// Step 1: Seed static posts that the Query Loop will list.
	// Titles use a ZZZ prefix so they win title-desc ordering if anything else
	// is created concurrently.
	for (let i = 0; i < data.posts.length; i++) {
		const postData = data.posts[i];
		const {
			post_type: postType,
			post_title: postTitle,
			post_name: postName,
			post_status: postStatus,
			post_content: postContent,
			post_date: postDate,
		} = postData;

		const escapedTitle = postTitle.replace(/'/g, "'\\''");
		const escapedContent = postContent.replace(/'/g, "'\\''");

		const result = await wpCli(
			page,
			`wp post create --post_type=${postType} --post_title='${escapedTitle}' --post_name=${postName} --post_content='${escapedContent}' --post_status=${postStatus} --post_date='${postDate}'`,
			false,
			true
		);

		const match = result.stdout.match(/post (\d+)/);
		const createdPostId = match ? parseInt(match[1], 10) : null;

		if (!createdPostId) {
			throw new Error(
				`Failed to get post ID from output: ${result.stdout}`
			);
		}
	}

	// Step 2: Create the host page that contains the Query block markup.
	const {
		post_type: hostPostType,
		post_title: hostPostTitle,
		post_name: hostPostName,
		post_status: hostPostStatus,
	} = data.host_post;

	const escapedHostTitle = hostPostTitle.replace(/'/g, "'\\''");

	const hostResult = await wpCli(
		page,
		`wp post create --post_type=${hostPostType} --post_title='${escapedHostTitle}' --post_name=${hostPostName} --post_status=${hostPostStatus}`,
		false,
		true
	);

	const hostMatch = hostResult.stdout.match(/post (\d+)/);
	const hostPostId = hostMatch ? parseInt(hostMatch[1], 10) : null;

	if (!hostPostId) {
		throw new Error(
			`Failed to get host post ID from output: ${hostResult.stdout}`
		);
	}

	// Step 3: Edit the host page and insert the fixture blocks.
	await editPost(page, { postID: hostPostId });
	await appendBlocks(page, sectionContent);

	return false;
}

module.exports = { setup };
module.exports.default = setup;
