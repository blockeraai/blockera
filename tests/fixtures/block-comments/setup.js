/**
 * Blockera dependencies - Playwright version
 */
const {
	editPost,
} = require('@blockera/dev-playwright/js/utils/site-navigation');
const {
	appendBlocks,
	closeWelcomeGuide,
	stopPendingFrameLoads,
} = require('@blockera/dev-playwright/js/utils/helpers');
const {
	wpCli,
	createPostViaPhp,
} = require('@blockera/dev-playwright/js/support/commands');
const fs = require('fs');
const path = require('path');

let storedPostId = null;

const AVATAR_PNG = Buffer.from(
	'iVGORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
	'base64'
);

/**
 * Serve a 1×1 PNG for Gravatar so image requests complete.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @return {Promise<void>}
 */
async function stubGravatar(page) {
	await page.route(/gravatar\.com/i, async (route) => {
		await route.fulfill({
			status: 200,
			contentType: 'image/png',
			body: AVATAR_PNG,
		});
	});
}

/**
 * Load fixture data.json.
 *
 * @return {{post: Object, comments: Array<Object>}} Fixture seed data.
 */
function loadFixtureData() {
	const dataPath = path.join(__dirname, 'data.json');
	const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

	if (!data?.post || !Array.isArray(data.comments)) {
		throw new Error('Invalid data.json for block-comments fixture');
	}

	return data;
}

/**
 * Create comments on the given post from data.json.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {number} postId - WordPress post ID.
 * @param {Array<Object>} commentsToCreate - Comment rows from data.json.
 * @return {Promise<void>}
 */
async function createFixtureComments(page, postId, commentsToCreate) {
	for (let i = 0; i < commentsToCreate.length; i++) {
		const comment = commentsToCreate[i];
		const {
			comment_author: commentAuthor,
			comment_content: commentContent,
		} = comment;
		const escapedComment = commentContent.replace(/'/g, "'\\''");

		await wpCli(
			page,
			`wp comment create --comment_post_ID=${postId} --user_id=${commentAuthor} --comment_content='${escapedComment}' --comment_approved=1`,
			false,
			true
		);
	}
}

/**
 * Setup function for block-comments test
 * Creates a post with comments. When skipEditor is true, inserts block markup
 * via PHP and never opens the editor.
 *
 * Do not put the comments markup on the post before the editor boots: comment
 * template SSR can prevent the canvas iframe from ever appearing.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string} sectionContent - The section content HTML.
 * @return {Promise<boolean>} Returns false to indicate custom setup is handled.
 */
async function setup(page, sectionContent) {
	if (!sectionContent) {
		throw new Error('block-comments setup requires input.html content');
	}

	const configPath = path.join(__dirname, 'config.json');
	const fixtureConfig = fs.existsSync(configPath)
		? JSON.parse(fs.readFileSync(configPath, 'utf8'))
		: {};
	const skipEditor = fixtureConfig.skipEditor === true;

	const data = loadFixtureData();

	const {
		post_type: postType,
		post_title: postTitle,
		post_status: postStatus,
		post_date: postDate,
	} = data.post;

	await wpCli(page, `wp option update page_comments 1`, false, false);
	await wpCli(page, `wp option update comments_per_page 2`, false, false);

	let postId;

	if (skipEditor) {
		postId = await createPostViaPhp(page, {
			contentFileHostPath: path.join(__dirname, 'input.html'),
			postTitle,
			postStatus,
			postType,
			postDate,
			commentStatus: 'open',
			pingStatus: 'open',
		});
	} else {
		const escapedTitle = postTitle.replace(/'/g, "'\\''");
		const escapedDate = postDate.replace(/'/g, "'\\''");

		const result = await wpCli(
			page,
			`wp post create --post_type=${postType} --post_title='${escapedTitle}' --post_status=${postStatus} --post_date='${escapedDate}' --comment_status=open --ping_status=open --porcelain`,
			false,
			true
		);

		postId = parseInt(String(result.stdout).trim(), 10);

		if (!postId) {
			throw new Error(
				`Failed to get post ID from output: ${result.stdout}`
			);
		}
	}

	storedPostId = postId;

	await createFixtureComments(page, postId, data.comments);

	if (skipEditor) {
		return false;
	}

	await editPost(page, { postID: postId });
	await closeWelcomeGuide(page);
	await stubGravatar(page);
	await appendBlocks(page, sectionContent);
	await stopPendingFrameLoads(page);

	return false;
}

/**
 * Frontend setup function for block-comments test
 * Navigates to page 3 of comments pagination (`cpage=3`)
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @return {Promise<void>}
 */
async function frontendSetup(page) {
	if (!storedPostId) {
		throw new Error(
			'Post ID not available. Make sure setup() was called before frontendSetup().'
		);
	}

	await stubGravatar(page);

	const permalinkResult = await wpCli(
		page,
		`wp post get ${storedPostId} --field=url`,
		false,
		false
	);

	if (!permalinkResult.stdout || !permalinkResult.stdout.trim()) {
		throw new Error(`Failed to get permalink for post ${storedPostId}`);
	}

	const postUrl = String(permalinkResult.stdout || '')
		.trim()
		.split(/\r?\n/)
		.map((line) => line.trim())
		.filter(Boolean)
		.pop();
	const postUrlObj = new URL(postUrl);

	postUrlObj.searchParams.set('cpage', '3');

	await page.goto(postUrlObj.toString(), { waitUntil: 'domcontentloaded' });
	await stopPendingFrameLoads(page);
	await page.waitForTimeout(500);
}

module.exports = { setup, frontendSetup };
module.exports.default = setup;
