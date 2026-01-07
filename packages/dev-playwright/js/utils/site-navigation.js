/**
 * Site navigation helper utilities for Playwright e2e tests.
 */

const {
	getWPDataObject,
	disableGutenbergFeatures,
	closeWelcomeGuide,
} = require('./editor');

/**
 * Login to WordPress site.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string} user - Username (optional, uses env if not provided).
 * @param {string} pass - Password (optional, uses env if not provided).
 * @return {Promise<void>}
 */
async function loginToSite(page, user = '', pass = '') {
	const username = user || process.env.WP_USERNAME || 'admin';
	const password = pass || process.env.WP_PASSWORD || 'password';
	const testURL = process.env.WP_BASE_URL || 'http://localhost:8888';

	await page.goto(`${testURL}/wp-login.php`);
	await page.waitForTimeout(250);

	await page.locator('#user_login').fill(username);
	await page.locator('#user_pass').fill(password);
	await page.locator('#wp-submit').click();
}

/**
 * Navigate to a specific URI.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string} path - URI path.
 * @param {boolean} login - Whether this is a login page.
 * @return {Promise<void>}
 */
async function goTo(page, path = '/wp-admin', login = false) {
	const testURL = process.env.WP_BASE_URL || 'http://localhost:8888';

	let fullPath = testURL;
	if (
		(testURL.endsWith('/') && !path.startsWith('/')) ||
		(!testURL.endsWith('/') && path.startsWith('/'))
	) {
		fullPath = `${testURL}${path}`;
	} else if (!testURL.endsWith('/') && !path.startsWith('/')) {
		fullPath = `${testURL}/${path}`;
	} else if (testURL.endsWith('/') && path.startsWith('/')) {
		fullPath = `${testURL.slice(0, -1)}${path}`;
	}

	await page.goto(fullPath);

	if (!login) {
		await getWPDataObject(page);
	}
}

/**
 * Create a new post.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {Object} options - Options.
 * @param {string} options.postType - Post type slug (default: 'post').
 * @param {string} options.postTitle - Post title.
 * @return {Promise<void>}
 */
async function createPost(page, { postType = 'post', postTitle = '' } = {}) {
	await goTo(page, `/wp-admin/post-new.php?post_type=${postType}`);
	await page.waitForTimeout(2000);

	await closeWelcomeGuide(page);

	if (['post', 'page'].includes(postType)) {
		await disableGutenbergFeatures(page);
		await setAbsoluteBlockToolbar(page);
	}

	if (postTitle) {
		const iframeBody = page
			.frameLocator('iframe[name="editor-canvas"]')
			.locator('body');
		const titleSelector =
			'h1.wp-block.wp-block-post-title, textarea[placeholder="Add title"]';

		await iframeBody.locator(titleSelector).click();
		await iframeBody.locator(titleSelector).fill(postTitle);
	}
}

/**
 * Open site editor.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @return {Promise<void>}
 */
async function openSiteEditor(page) {
	await goTo(page, '/wp-admin/site-editor.php?p=%2F&canvas=edit');
	await page.waitForTimeout(2000);

	await closeWelcomeGuide(page);
}

/**
 * Set absolute block toolbar.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @return {Promise<void>}
 */
async function setAbsoluteBlockToolbar(page) {
	const optionsButton = page.locator('[aria-label="Options"]').first();
	await optionsButton.waitFor({ state: 'visible', timeout: 10000 });
	await optionsButton.click();

	const selector =
		'div[aria-labelledby="components-menu-group-label-0"] button:first-child';
	const element = page.locator(selector);

	if ((await element.count()) > 0) {
		const svg = element.locator('svg');
		if ((await svg.count()) > 0) {
			await page.locator('span:has-text("Top toolbar")').click();
		}
	}

	// Wait for the Options button to be visible again before clicking to close
	const optionsButtonClose = page.locator('[aria-label="Options"]').first();
	await optionsButtonClose.waitFor({ state: 'visible', timeout: 10000 });
	await optionsButtonClose.click();
}

/**
 * Go to edit page of post.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {Object} options - Options.
 * @param {string} options.postID - Post ID.
 * @return {Promise<void>}
 */
async function editPost(page, { postID = '' } = {}) {
	await goTo(page, `/wp-admin/post.php?post=${postID}&action=edit`);
	await page.waitForTimeout(2000);
	await disableGutenbergFeatures(page);
}

module.exports = {
	loginToSite,
	goTo,
	createPost,
	openSiteEditor,
	setAbsoluteBlockToolbar,
	editPost,
};
